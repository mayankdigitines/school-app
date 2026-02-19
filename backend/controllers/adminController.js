import mongoose from 'mongoose'; // Added for Transactions
import School from '../models/School.js';
import Admin from '../models/Admin.js';
import Class from '../models/Class.js';
import Teacher from '../models/Teacher.js';
import Subject from '../models/Subject.js';
import Notice from '../models/Notice.js';
import Homework from '../models/Homework.js';
import AppError from '../utils/appError.js';
import Student from '../models/Student.js';
import { generateAndSaveSubjectIcon } from '../utils/generatesvg.js';
// --- HELPER FUNCTIONS ---

const generateSchoolCode = (schoolName) => {
    let cleanName = schoolName
        .replace(/school/gi, '')
        .replace(/[^a-zA-Z\s]/g, '')
        .trim();

    const words = cleanName.split(/\s+/).filter(w => w.length > 0);
    let code = "";

    code = words.map(word => word[0]).join('');

    if (code.length < 4 && words.length > 0) {
        const firstWord = words[0];
        for (let i = 1; i < firstWord.length && code.length < 4; i++) {
            code += firstWord[i];
        }
    }

    code = code.substring(0, 4).toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900);

    return `${code}${randomDigits}`;
};

const generateTeacherUsername = async (name) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toLowerCase().substring(0, 4);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    let username = `${cleanName}${randomSuffix}`;

    const existing = await Teacher.findOne({ username });
    if (existing) {
        return generateTeacherUsername(name);
    }
    return username;
};

// --- SUPER ADMIN CONTROLLERS ---
// ... (createSchool and getAllSchools remain unchanged) ...

export const createSchool = async (req, res, next) => {
  try {
    const { name, email, phone, address, adminName, adminEmail, adminPassword } = req.body;
    const schoolCode = generateSchoolCode(name);

    const newSchool = await School.create({
      schoolCode,
      name,
      contactInfo: { email, phone, address },
    });

    const newAdmin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'SchoolAdmin',
      school: newSchool._id,
    });

    newAdmin.password = undefined;
     const schoolObj = { schoolId: newSchool._id, ...newSchool.toObject() };
    const adminObj = { adminId: newAdmin._id, ...newAdmin.toObject() };
    res.status(201).json({
      status: 'success',
      data: { school:  schoolObj, admin: adminObj },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSchools = async (req, res, next) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    const formattedSchools = schools.map(school => ({
      schoolId: school._id,
      ...school.toObject()
    }));
    res.status(200).json({ status: 'success', results: schools.length, data: { schools: formattedSchools } });
  } catch (error) {
    next(error);
  }
};


// --- SCHOOL ADMIN CONTROLLERS ---
// ... (getSchoolDetails, updateSchoolDetails, addClass remain unchanged) ...

export const getSchoolDetails = async (req, res, next) => {
  try {
    const schoolId = req.user.school;
    if (!schoolId) return next(new AppError('Admin does not belong to a school', 400));
    const school = await School.findById(schoolId);
    if (!school) return next(new AppError('School not found', 404));
    const schoolObj = { schoolId: school._id, ...school.toObject() };
    res.status(200).json({ status: 'success', data: { school: schoolObj } });
  } catch (error) {
    next(error);
  }
};

export const updateSchoolDetails = async (req, res, next) => {
    try {
        const schoolId = req.user.school;
        if (!schoolId) return next(new AppError('Admin does not belong to a school', 400));
        const { schoolCode, ...updateData } = req.body; 
        const updatedSchool = await School.findByIdAndUpdate(schoolId, updateData, { new: true, runValidators: true });
        if (!updatedSchool) return next(new AppError('School not found', 404));
       const schoolObj = { schoolId: updatedSchool._id, ...updatedSchool.toObject() };
       res.status(200).json({ status: 'success', data: { school: schoolObj } });
    } catch (error) {
        next(error);
    }
};

export const addClass = async (req, res, next) => {
  try {
    const { className } = req.body;
    const schoolId = req.user.school;
    if (!schoolId) return next(new AppError('Admin does not belong to a school', 400));

    const newClass = await Class.create({ className, school: schoolId });
    const formattedClass = { classId: newClass._id, ...newClass.toObject() };
    res.status(201).json({ status: 'success', data: { class: formattedClass } });
  } catch (error) {
    if (error.code === 11000) return next(new AppError('Class with this className already exists', 400));
    next(error);
  }
};


// --- TEACHER MANAGEMENT (UPDATED) ---

export const createTeacher = async (req, res, next) => {
  // Start a transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Get Inputs (No email/phone required)
    // subjects: Array of Subject IDs
    // teachingClasses: Array of Class IDs where this teacher teaches the subjects
    // assignedClassId: Class ID if they are a Class Teacher
    const { name, password, subjects, assignedClassId, teachingClasses } = req.body;
    const schoolId = req.user.school;

    // 2. Validation
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        throw new AppError('Please select at least one subject.', 400);
    }
    
    // 3. Generate Username & Create Teacher Object
    const username = await generateTeacherUsername(name);
    
    const newTeacher = new Teacher({
      name,
      username,
      password,
      subjects, // Stores ObjectIds now
      school: schoolId,
    });

    // 4. Handle Class Teacher Logic
    if (assignedClassId) {
        if (!assignedClassId) {
            throw new AppError('Please select a class to assign as Class Teacher.', 400);
        }

        // Check availability strictly within transaction
        const classDoc = await Class.findOne({ _id: assignedClassId, school: schoolId }).session(session);
        
        if (!classDoc) throw new AppError('Invalid Class selected for Class Teacher.', 404);
        
        if (classDoc.classTeacher) {
            throw new AppError(`Class ${classDoc.grade}-${classDoc.section} already has a Class Teacher.`, 409);
        }

        // Link them
        classDoc.classTeacher = newTeacher._id;
        await classDoc.save({ session });

        newTeacher.assignedClass = classDoc._id;
    }

    // Save teacher first to generate _id
    await newTeacher.save({ session });

    // 5. Handle Subject Teacher Logic (Teaching Classes)
    if (teachingClasses && Array.isArray(teachingClasses) && teachingClasses.length > 0) {
        // We need to update each class to say: "This teacher teaches these subjects here"
        
        for (const classId of teachingClasses) {
            const classDoc = await Class.findOne({ _id: classId, school: schoolId }).session(session);
            
            if (classDoc) {
                // Prepare new assignments
                const newAssignments = subjects.map(subjectId => ({
                    subject: subjectId,
                    teacher: newTeacher._id
                }));

                // Remove OLD teachers for these specific subjects to avoid duplicates/conflicts
                // We filter OUT any existing entry where the subject matches one of the new teacher's subjects
                classDoc.subjectTeachers = classDoc.subjectTeachers.filter(
                    st => !subjects.includes(st.subject.toString())
                );

                // Add NEW assignments
                classDoc.subjectTeachers.push(...newAssignments);

                await classDoc.save({ session });
            }
        }
    }

    // 6. Commit Transaction
    await session.commitTransaction();

    // Hide password before response
    newTeacher.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        teacher: newTeacher,
      },
    });

  } catch (error) {
    // Abort transaction on any error
    await session.abortTransaction();
    
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
        return next(new AppError('System error generating username. Please try again.', 400));
    }
    next(error);
  } finally {
    session.endSession();
  }
};

export const getTeachers = async (req, res, next) => {
    try {
        const teachers = await Teacher.find({ school: req.user.school })
            .populate('assignedClass', 'className') // Populate class name for Class Teachers
            .populate('subjects', 'name'); // Populate subject names
        
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

        const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
        if (!teacher) return next(new AppError('Teacher not found in this school', 404));

        if (name) teacher.name = name;
        if (email !== undefined) teacher.email = (email && email.trim() !== "") ? email.trim() : undefined;
        if (password) teacher.password = password;
        if (subjects) teacher.subjects = subjects;
        if (phone) teacher.phone = phone;
        if (classId) teacher.assignedClass = classId;

        await teacher.save();
        teacher.password = undefined;

        res.status(200).json({ status: 'success', data: { teacher } });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return next(new AppError('Email already exists.', 400));
        }
        next(error);
    }
};

export const getClasses = async (req, res, next) => {
    try {
        const classes = await Class.find({ school: req.user.school })
            .populate('classTeacher', 'name email')
            .populate('subjectTeachers.teacher', 'name')
            .populate('subjectTeachers.subject', 'name');
        
        res.status(200).json({ status: 'success', results: classes.length, data: { classes } });
    } catch (error) {
        next(error);
    }
};

export const assignClassTeacher = async (req, res, next) => {
  try {
    const { teacherId, classId } = req.body;
    const schoolId = req.user.school;

    const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
    if (!teacher) return next(new AppError('Teacher not found', 404));

    const classObj = await Class.findOne({ _id: classId, school: schoolId });
    if (!classObj) return next(new AppError('Class not found', 404));

    if (classObj.classTeacher && classObj.classTeacher.toString() !== teacherId) {
        return next(new AppError(`Class ${classObj.className} already has a Class Teacher assigned.`, 409));
    }

    if (teacher.assignedClass && teacher.assignedClass.toString() !== classId) {
         return next(new AppError(`Teacher ${teacher.name} is already a Class Teacher for another class.`, 409));
    }

    classObj.classTeacher = teacher._id;
    await classObj.save();

    teacher.assignedClass = classObj._id;
    await teacher.save();

    res.status(200).json({ status: 'success', message: 'Class Teacher assigned successfully', data: { class: classObj } });
  } catch (error) {
    next(error);
  }
};

export const assignSubjectLoad = async (req, res, next) => {
    try {
        const { teacherId, subjectId, classIds } = req.body; 
        const schoolId = req.user.school;

        if (!Array.isArray(classIds) || classIds.length === 0) return next(new AppError('Please provide a list of classes.', 400));
        const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
        if (!teacher) return next(new AppError('Teacher not found', 404));

        const updatePromises = classIds.map(async (classId) => {
            const classObj = await Class.findOne({ _id: classId, school: schoolId });
            if (classObj) {
                classObj.subjectTeachers = classObj.subjectTeachers.filter(entry => entry.subject.toString() !== subjectId);
                classObj.subjectTeachers.push({ subject: subjectId, teacher: teacherId });
                return classObj.save();
            }
        });
        await Promise.all(updatePromises);
        res.status(200).json({ status: 'success', message: `Assigned ${teacher.name} to teach the subject in ${classIds.length} classes.` });
    } catch (error) {
        next(error);
    }
};

export const assignSubjectTeacher = async (req, res, next) => {
    try {
        const { classId, subjectId, teacherId } = req.body;
        const schoolId = req.user.school;

        const classObj = await Class.findOne({ _id: classId, school: schoolId });
        if (!classObj) return next(new AppError('Class not found', 404));

        const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
        if (!teacher) return next(new AppError('Teacher not found', 404));
        
        classObj.subjectTeachers = classObj.subjectTeachers.filter(entry => entry.subject.toString() !== subjectId);
        classObj.subjectTeachers.push({ subject: subjectId, teacher: teacherId });
        await classObj.save();

        res.status(200).json({ status: 'success', message: 'Subject teacher assigned successfully', data: { class: classObj } });
    } catch (error) {
        next(error);
    }
};

// export const addSubject = async (req, res, next) => {
//   try {
//     const { name } = req.body;
//     if (!name || typeof name !== 'string' || !name.trim()) return res.status(400).json({ status: 'fail', message: 'Subject name is required.' });
  

//     const schoolId = req.user.school;
//     const normalizedName = name.trim();

//       const subjectIcon = generateSubjectIcon(normalizedName);
//     const subject = await Subject.create({ name: normalizedName,
//        school: schoolId,
//       subjectIcon: subjectIcon
//       });


//     res.status(201).json({ status: 'success', data: { subject } });
//   } catch (error) {
//     if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
//          return res.status(409).json({ status: 'fail', message: `The subject "${req.body.name}" already exists.` });
//     }
//     next(error);
//   }
// };


export const addSubject = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    // 1. Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ status: 'fail', message: 'Subject name is required.' });
    }

    const schoolId = req.user.school;
    const normalizedName = name.trim();

    // 2. Generate and Save Icon (Now returns "uploads/subject-xyz.svg")
    const subjectIconPath = generateAndSaveSubjectIcon(normalizedName);

    // 3. Create Subject
    const subject = await Subject.create({ 
        name: normalizedName, 
        school: schoolId,
        subjectIcon: subjectIconPath // Stores short path: "uploads/..."
    });

    res.status(201).json({
        status: 'success', 
        data: { subject } 
    });

  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
         return res.status(409).json({ status: 'fail', message: `The subject "${req.body.name}" already exists.` });
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

export const broadcastMessage = async (req, res, next) => {
    try {
        const { title, content, audience } = req.body;
        const newNotice = await Notice.create({
            title, content, school: req.user.school, audience: audience || 'All',
            postedBy: { userId: req.user._id, role: 'SchoolAdmin', name: req.user.name }
        });
        res.status(201).json({ status: 'success', data: { notice: newNotice } });
    } catch (error) {
        next(error);
    }
};

export const getHomeworkActivityLogs = async (req, res, next) => {
    try {
        const { classId } = req.query;
        let filter = { school: req.user.school };
        if (classId) filter.class = classId;

        const homeworks = await Homework.find(filter)
            .populate('teacher', 'name email')
            .populate('subject', 'name')
            .populate('class', 'className')
            .sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', results: homeworks.length, data: { homeworks } });
    } catch (error) {
        next(error);
    }
};

export const getNotices = async (req, res, next) => {
    try {
        const notices = await Notice.find({ school: req.user.school }).sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', results: notices.length, data: { notices } });
    } catch (error) {
        next(error);
    }
};

export const getStudents = async (req, res, next) => {
  try {
    const schoolId = req.user.school;
    const { classId } = req.query; 
    const queryObj = { school: schoolId };
    if (classId) queryObj.studentClass = classId;

    const students = await Student.find(queryObj)
      .populate({ path: 'studentClass', select: 'className' })
      .populate({ path: 'parent', select: 'name phone' })
      .sort({ 'studentClass': 1, 'rollNumber': 1 });

    res.status(200).json({ status: 'success', results: students.length, data: { students } });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN ATTENDANCE LOGS ---

export const getSchoolAttendance = async (req, res, next) => {
  try {
    const { classId, date } = req.query;
    const query = { school: req.user.school };

    if (classId) query.class = classId;
    if (date) {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);
        query.date = queryDate;
    }

    const attendanceRecords = await Attendance.find(query)
        .populate('class', 'className')
        .populate('teacher', 'name')
        .sort({ date: -1, 'class': 1 }); // Sort by Date (newest), then Class

    res.status(200).json({
        status: 'success',
        results: attendanceRecords.length,
        data: { attendance: attendanceRecords }
    });
  } catch (error) {
    next(error);
  }
};