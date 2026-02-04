import School from '../models/School.js';
import Admin from '../models/Admin.js';
import Class from '../models/Class.js';
import Teacher from '../models/Teacher.js';
import AppError from '../utils/appError.js';
import crypto from 'crypto';

const generateSchoolCode = (schoolName) => {
    // 1. Remove "School" and non-alphabetic characters (keeping spaces)
    let cleanName = schoolName
        .replace(/school/gi, '')
        .replace(/[^a-zA-Z\s]/g, '')
        .trim();

    const words = cleanName.split(/\s+/).filter(w => w.length > 0);
    let code = "";

    // 2. Get first letter of each word
    code = words.map(word => word[0]).join('');

    // 3. If we have less than 4 letters, fill from the first word's remaining letters
    if (code.length < 4 && words.length > 0) {
        const firstWord = words[0];
        for (let i = 1; i < firstWord.length && code.length < 4; i++) {
            code += firstWord[i];
        }
    }

    // 4. Ensure exactly 4 letters (slice if too long) and uppercase
    code = code.substring(0, 4).toUpperCase();

    // 5. Generate 3 random digits
    const randomDigits = Math.floor(100 + Math.random() * 900);

    return `${code}${randomDigits}`;
};

// --- SUPER ADMIN CONTROLLERS ---

export const createSchool = async (req, res, next) => {
  try {
    const { name, email, phone, address, adminName, adminEmail, adminPassword } = req.body;

    // 1. Generate Unique School Code
    const schoolCode = generateSchoolCode(name);

    // 2. Create School
    const newSchool = await School.create({
      schoolCode,
      name,
      contactInfo: { email, phone, address },
    });

    // 3. Create School Admin
    const newAdmin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'SchoolAdmin',
      school: newSchool._id,
    });

    // Remove password from output
    newAdmin.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        school: newSchool,
        admin: newAdmin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSchools = async (req, res, next) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: schools.length,
      data: {
        schools
      }
    });

  } catch (error) {
    next(error);
  }
};

// --- SCHOOL ADMIN CONTROLLERS ---

export const addClass = async (req, res, next) => {
  try {
    const { grade, section } = req.body;
    
    // School ID comes from the logged-in admin
    const schoolId = req.user.school;

    if (!schoolId) {
        return next(new AppError('Admin does not belong to a school', 400));
    }

    const newClass = await Class.create({
      grade,
      section,
      school: schoolId,
    });

    res.status(201).json({
      status: 'success',
      data: {
        class: newClass,
      },
    });
  } catch (error) {
    // Handle uniqueness error (composite key)
    if (error.code === 11000) {
        return next(new AppError('Class with this Grade and Section already exists', 400));
    }
    next(error);
  }
};

export const createTeacher = async (req, res, next) => {
  try {
    const { name, email, password, subjects, phone } = req.body;
    const schoolId = req.user.school;

    const newTeacher = await Teacher.create({
      name,
      email,
      password,
      subjects, // Array of strings e.g. ["Math", "English"]
      phone,
      school: schoolId,
    });

    newTeacher.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        teacher: newTeacher,
      },
    });
  } catch (error) {
     if (error.code === 11000) {
        return next(new AppError('Email already exists', 400));
    }
    next(error);
  }
};

export const getTeachers = async (req, res, next) => {
    try {
        const teachers = await Teacher.find({ school: req.user.school }).populate('assignedClass', 'grade section');
        
        res.status(200).json({
            status: 'success',
            results: teachers.length,
            data: { teachers }
        });
    } catch (error) {
        next(error);
    }
};

export const getClasses = async (req, res, next) => {
    try {
        const classes = await Class.find({ school: req.user.school }).populate('classTeacher', 'name email');
        
        res.status(200).json({
            status: 'success',
            results: classes.length,
            data: { classes }
        });
    } catch (error) {
        next(error);
    }
};

// Assign a teacher to a class (Class Teacher)
export const assignClassTeacher = async (req, res, next) => {
  try {
    const { teacherId, classId } = req.body;
    const schoolId = req.user.school;

    // 1. Verify Teacher belongs to this school
    const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
    if (!teacher) return next(new AppError('Teacher not found in this school', 404));

    // 2. Verify Class belongs to this school
    const classObj = await Class.findOne({ _id: classId, school: schoolId });
    if (!classObj) return next(new AppError('Class not found in this school', 404));

    // 3. Update Class
    classObj.classTeacher = teacher._id;
    await classObj.save();

    // 4. Update Teacher
    // First, unassign if they were assigned elsewhere? Requirements don't specify strict 1-1, but usually yes.
    // Let's assume a teacher can be class teacher for only one class at a time for simplicity.
    // If they were class teacher of another class, we should unset that? 
    // Implementation: simple update for now.
    
    // If teacher was already assigned a class, we might need to clear that previous class's teacher field?
    // This part can get complex. Let's keep it simple: Just set the reference.
    if (teacher.assignedClass && teacher.assignedClass.toString() !== classId) {
        // Optional: clear previous class link
        await Class.findByIdAndUpdate(teacher.assignedClass, { classTeacher: null });
    }
    
    teacher.assignedClass = classObj._id;
    teacher.isClassTeacher = true;
    await teacher.save();

    res.status(200).json({
      status: 'success',
      message: 'Class teacher assigned successfully',
      data: {
        class: classObj,
        teacher: teacher
      }
    });

  } catch (error) {
    next(error);
  }
};
// School Admin can edit teacher detail and update password subjects and classes

export const updateTeacher = async (req, res, next) => {
    try {
        const { teacherId } = req.params;
        const { name, email, password, subjects, phone, classId } = req.body;
        const schoolId = req.user.school;

        // Verify Teacher belongs to this school
        const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
        if (!teacher) return next(new AppError('Teacher not found in this school', 404));

        // Update fields if provided
        if (name) teacher.name = name;
        if (email) teacher.email = email;
        if (password) teacher.password = password;
        if (subjects) teacher.subjects = subjects;
        if (phone) teacher.phone = phone;
        if(classId) teacher.assignedClass = classId;

        await teacher.save();

        teacher.password = undefined;

        res.status(200).json({
            status: 'success',
            data: {
                teacher
            }
        });
    } catch (error) {
        next(error);
    }
};