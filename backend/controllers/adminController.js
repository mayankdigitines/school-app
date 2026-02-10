import School from '../models/School.js';
import Admin from '../models/Admin.js';
import Class from '../models/Class.js';
import Teacher from '../models/Teacher.js';
import Subject from '../models/Subject.js';
import Notice from '../models/Notice.js';
import Homework from '../models/Homework.js';
import AppError from '../utils/appError.js';
import Student from '../models/Student.js';
import crypto from 'crypto';

// --- HELPER FUNCTIONS ---

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

const generateTeacherUsername = async (name) => {
    // 1. Sanitize name: "Amit Kumar" -> "amit"
    // Remove non-alphabetic chars, lowercase, take first 4 chars
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toLowerCase().substring(0, 4);
    
    // 2. Generate random suffix: "2391"
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    
    // 3. Combine: "amit2391"
    let username = `${cleanName}${randomSuffix}`;

    // 4. Ensure Uniqueness (Simple recursive check)
    const existing = await Teacher.findOne({ username });
    if (existing) {
        return generateTeacherUsername(name); // Retry recursively
    }
    return username;
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

export const getSchoolDetails = async (req, res, next) => {
  try {
    const schoolId = req.user.school;
    
    if (!schoolId) {
      return next(new AppError('Admin does not belong to a school', 400));
    }

    const school = await School.findById(schoolId);
    
    if (!school) {
        return next(new AppError('School not found', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: { school }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSchoolDetails = async (req, res, next) => {
    try {
        const schoolId = req.user.school;

        if (!schoolId) {
          return next(new AppError('Admin does not belong to a school', 400));
        }
        
        // 1. Filter out restricted fields (schoolCode) explicitly
        const { schoolCode, ...updateData } = req.body; 

        // 2. Update School
        const updatedSchool = await School.findByIdAndUpdate(schoolId, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedSchool) {
            return next(new AppError('School not found', 404));
        }

       res.status(200).json({
            status: 'success',
            data: { school: updatedSchool }
        });

    } catch (error) {
        next(error);
    }
};

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

// --- TEACHER MANAGEMENT ---

export const createTeacher = async (req, res, next) => {
  try {
    const { name, email, password, subjects, phone } = req.body;
    const schoolId = req.user.school;

    // 1. Generate automatic username
    const username = await generateTeacherUsername(name);

    // 2. Sanitize Email: Convert "" to undefined to satisfy Mongoose sparse index
    const sanitizedEmail = (email && email.trim() !== "") ? email.trim() : undefined;

    // 3. Create Teacher
    const newTeacher = await Teacher.create({
      name,
      username,         // Auto-generated
      email: sanitizedEmail, // Cleaned
      password,
      subjects, 
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
        // Distinguish between Username collision and Email collision
        if (error.keyPattern && error.keyPattern.username) {
            return next(new AppError('Username generation collision. Please try again.', 400));
        }
        if (error.keyPattern && error.keyPattern.email) {
            return next(new AppError('Email already exists.', 400));
        }
        return next(new AppError('Duplicate field value entered.', 400));
    }
    next(error);
  }
};

export const getTeachers = async (req, res, next) => {
    try {
        const teachers = await Teacher.find({ school: req.user.school })
            .populate('assignedClass', 'grade section');
        
        res.status(200).json({
            status: 'success',
            results: teachers.length,
            data: { teachers }
        });
    } catch (error) {
        next(error);
    }
};

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
        
        // Handle Email Update: allow clearing it or setting it
        if (email !== undefined) {
             teacher.email = (email && email.trim() !== "") ? email.trim() : undefined;
        }

        if (password) teacher.password = password;
        if (subjects) teacher.subjects = subjects;
        if (phone) teacher.phone = phone;
        if (classId) teacher.assignedClass = classId;

        await teacher.save();

        teacher.password = undefined;

        res.status(200).json({
            status: 'success',
            data: {
                teacher
            }
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return next(new AppError('Email already exists.', 400));
        }
        next(error);
    }
};

// --- CLASS & SCHEDULE MANAGEMENT ---

export const getClasses = async (req, res, next) => {
    try {
        const classes = await Class.find({ school: req.user.school })
            .populate('classTeacher', 'name email')
            .populate('subjectTeachers.teacher', 'name')
            .populate('subjectTeachers.subject', 'name');
        
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

    const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
    if (!teacher) return next(new AppError('Teacher not found', 404));

    const classObj = await Class.findOne({ _id: classId, school: schoolId });
    if (!classObj) return next(new AppError('Class not found', 404));

    // STRICT CHECK: Cannot replace existing Class Teacher
    if (classObj.classTeacher && classObj.classTeacher.toString() !== teacherId) {
        return next(new AppError(`Class ${classObj.grade}-${classObj.section} already has a Class Teacher assigned. You cannot replace them directly.`, 409));
    }

    // CHECK: Teacher already assigned to another class?
    if (teacher.assignedClass && teacher.assignedClass.toString() !== classId) {
         return next(new AppError(`Teacher ${teacher.name} is already a Class Teacher for another class. Unassign them first.`, 409));
    }

    // Assign
    classObj.classTeacher = teacher._id;
    await classObj.save();

    teacher.assignedClass = classObj._id;
    teacher.isClassTeacher = true;
    await teacher.save();

    res.status(200).json({
      status: 'success',
      message: 'Class Teacher assigned successfully',
      data: { class: classObj }
    });

  } catch (error) {
    next(error);
  }
};

// Assign Teaching Load (Multiple Classes Support)
export const assignSubjectLoad = async (req, res, next) => {
    try {
        const { teacherId, subjectId, classIds } = req.body; // classIds is an Array
        const schoolId = req.user.school;

        if (!Array.isArray(classIds) || classIds.length === 0) {
            return next(new AppError('Please provide a list of classes.', 400));
        }

        const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
        if (!teacher) return next(new AppError('Teacher not found', 404));

        // Iterate over classes and update them
        const updatePromises = classIds.map(async (classId) => {
            const classObj = await Class.findOne({ _id: classId, school: schoolId });
            if (classObj) {
                // Remove existing teacher for this specific subject to avoid duplicates
                classObj.subjectTeachers = classObj.subjectTeachers.filter(
                    entry => entry.subject.toString() !== subjectId
                );

                // Add new assignment
                classObj.subjectTeachers.push({
                    subject: subjectId,
                    teacher: teacherId
                });

                return classObj.save();
            }
        });

        await Promise.all(updatePromises);

        res.status(200).json({
            status: 'success',
            message: `Assigned ${teacher.name} to teach the subject in ${classIds.length} classes.`,
        });

    } catch (error) {
        next(error);
    }
};

// Assign Teacher to a Subject in a Specific Class
export const assignSubjectTeacher = async (req, res, next) => {
    try {
        const { classId, subjectId, teacherId } = req.body;
        const schoolId = req.user.school;

        // Verify entities exist and belong to school
        const classObj = await Class.findOne({ _id: classId, school: schoolId });
        if (!classObj) return next(new AppError('Class not found', 404));

        const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
        if (!teacher) return next(new AppError('Teacher not found', 404));
        
        // Remove existing teacher for this specific subject in this class (if any)
        classObj.subjectTeachers = classObj.subjectTeachers.filter(
            entry => entry.subject.toString() !== subjectId
        );

        // Add new assignment
        classObj.subjectTeachers.push({
            subject: subjectId,
            teacher: teacherId
        });

        await classObj.save();

        res.status(200).json({
            status: 'success',
            message: 'Subject teacher assigned successfully',
            data: { class: classObj }
        });

    } catch (error) {
        next(error);
    }
};

// --- SUBJECT MANAGEMENT ---

export const addSubject = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    // 1. Input Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Subject name is required and must be a valid string.' 
      });
    }

    const schoolId = req.user.school;
    if (!schoolId) {
      return res.status(400).json({ status: 'fail', message: 'School context missing for admin.' });
    }

    // 2. Normalize Data (Capitalize first letter, trim)
    const normalizedName = name.trim();

    // 3. Create Subject
    const subject = await Subject.create({ 
      name: normalizedName, 
      school: schoolId 
    });

    res.status(201).json({ 
      status: 'success', 
      data: { subject } 
    });

  } catch (error) {
    // 4. Handle Duplicate Error Specific to Subjects
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.name) {
         return res.status(409).json({ 
           status: 'fail', 
           message: `The subject "${req.body.name}" already exists in this school.` 
         });
      }
    }
    next(error);
  }
};

export const getSubjects = async (req, res, next) => {
  try {
    const schoolId = req.user.school;
    const subjects = await Subject.find({ school: schoolId }).sort({ createdAt: -1 });
    res.json({ status: 'success', results: subjects.length, data: { subjects } });
  } catch (err) {
    next(err);
  }
};

// --- MISC & BROADCASTS ---

export const broadcastMessage = async (req, res, next) => {
    try {
        const { title, content, audience } = req.body;
        
        const newNotice = await Notice.create({
            title,
            content,
            school: req.user.school,
            audience: audience || 'All',
            postedBy: {
                userId: req.user._id,
                role: 'SchoolAdmin',
                name: req.user.name
            }
        });

        res.status(201).json({
            status: 'success',
            data: { notice: newNotice }
        });
    } catch (error) {
        next(error);
    }
};

export const getHomeworkActivityLogs = async (req, res, next) => {
    try {
        const { classId } = req.query;
        let filter = { school: req.user.school };

        if (classId) {
            filter.class = classId;
        }

        const homeworks = await Homework.find(filter)
            .populate('teacher', 'name email')
            .populate('subject', 'name')
            .populate('class', 'grade section')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: homeworks.length,
            data: { homeworks }
        });
    } catch (error) {
        next(error);
    }
};

export const getNotices = async (req, res, next) => {
    try {
        const notices = await Notice.find({ school: req.user.school }).sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            results: notices.length,
            data: { notices }
        });
    } catch (error) {
        next(error);
    }
};


// ... existing imports

// ... existing code ...

// --- NEW STUDENT CONTROLLER ---

// Get all students for the admin's school with full details
export const getStudents = async (req, res, next) => {
  try {
    const schoolId = req.user.school;
    const { classId } = req.query; // Optional: Filter by specific class

    // 1. Build Query
    const queryObj = { school: schoolId };
    if (classId) {
      queryObj.studentClass = classId;
    }

    // 2. Fetch Students with optimized population
    const students = await Student.find(queryObj)
      .populate({
        path: 'studentClass',
        select: 'grade section' // Only get grade and section
      })
      .populate({
        path: 'parent',
        select: 'name phone' // Only get relevant parent details (hide password, etc.)
      })
      .sort({ 'studentClass': 1, 'rollNumber': 1 }); // Sort by Class, then Roll No

    // 3. Send Response
    res.status(200).json({
      status: 'success',
      results: students.length,
      data: { students }
    });

  } catch (error) {
    next(error);
  }
};


