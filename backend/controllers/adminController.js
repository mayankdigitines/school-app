import School from '../models/School.js';
import Admin from '../models/Admin.js';
import Class from '../models/Class.js';
import Teacher from '../models/Teacher.js';
import Subject from '../models/Subject.js';
import Notice from '../models/Notice.js';
import Homework from '../models/Homework.js';
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
        // Although the schema might handle it, explicitly removing it is safer
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

export const createTeacher = async (req, res, next)=> {
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

// export const getClasses = async (req, res, next) => {
//     try {
//         const classes = await Class.find({ school: req.user.school }).populate('classTeacher', 'name email');
        
//         res.status(200).json({
//             status: 'success',
//             results: classes.length,
//             data: { classes }
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// add getClasses to include population of subjectTeachers if you want to display it

// export const getClasses = async (req, res, next) => {
//     try {
//         const classes = await Class.find({ school: req.user.school })
//             .populate('classTeacher', 'name email')
//             .populate('subjectTeachers.teacher', 'name') // Populate teacher details
//             .populate('subjectTeachers.subject', 'name'); // Populate subject details
        
//         res.status(200).json({
//             status: 'success',
//             results: classes.length,
//             data: { classes }
//         });
//     } catch (error) {
//         next(error);
//     }
// };



// 1. GET CLASSES (Updated to populate schedule)
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
// export const assignClassTeacher = async (req, res, next) => {
  
// 1. STRICT UNIQUE CLASS TEACHER ASSIGNMENT
// export const assignClassTeacher = async (req, res, next) => {
//   try {
//     const { teacherId, classId } = req.body;
//     const schoolId = req.user.school;

//     const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
//     if (!teacher) return next(new AppError('Teacher not found', 404));

//     const classObj = await Class.findOne({ _id: classId, school: schoolId });
//     if (!classObj) return next(new AppError('Class not found', 404));

//     // A. Clean up the Class: If this class already has a teacher, remove that teacher's assignment
//     if (classObj.classTeacher && classObj.classTeacher.toString() !== teacherId) {
//         const oldTeacher = await Teacher.findById(classObj.classTeacher);
//         if (oldTeacher) {
//             oldTeacher.assignedClass = null;
//             oldTeacher.isClassTeacher = false;
//             await oldTeacher.save();
//         }
//     }

//     // B. Clean up the Teacher: If this teacher is already a Class Teacher elsewhere, remove that link
//     if (teacher.assignedClass && teacher.assignedClass.toString() !== classId) {
//         const oldClass = await Class.findById(teacher.assignedClass);
//         if (oldClass) {
//             oldClass.classTeacher = null;
//             await oldClass.save();
//         }
//     }

//     // C. Create the new Link
//     classObj.classTeacher = teacher._id;
//     await classObj.save();

//     teacher.assignedClass = classObj._id;
//     teacher.isClassTeacher = true;
//     await teacher.save();

//     res.status(200).json({
//       status: 'success',
//       message: 'Class teacher assigned successfully (Previous assignments updated)',
//       data: { class: classObj, teacher }
//     });

//   } catch (error) {
//     next(error);
//   }
// };




// 2. ASSIGN CLASS TEACHER (Strict Logic)
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


// 3. ASSIGN TEACHING LOAD (Multiple Classes Support)
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
                // (We replace the teacher for this subject in this class)
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




// 2. NEW: ASSIGN TEACHER TO A SUBJECT IN A CLASS (Teaching Load)
export const assignSubjectTeacher = async (req, res, next) => {
    try {
        const { classId, subjectId, teacherId } = req.body;
        const schoolId = req.user.school;

        // Verify entities exist and belong to school
        const classObj = await Class.findOne({ _id: classId, school: schoolId });
        if (!classObj) return next(new AppError('Class not found', 404));

        const teacher = await Teacher.findOne({ _id: teacherId, school: schoolId });
        if (!teacher) return next(new AppError('Teacher not found', 404));

        // Check if subject exists (Optional: verify teacher is "qualified" for this subject if you strictly enforce it)
        // For flexibility, we allow admin to override.
        
        // Remove existing teacher for this specific subject in this class (if any)
        // Filter out the subject if it already exists to avoid duplicates
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

//     try {
//         const { subName, subCode, sessions } = req.body;
//         const schoolId = req.user.school;

//         // Optional: Check if subject code already exists for this school (handled by index but good to have clear error)
        
//         const newSubject = await Subject.create({
//             subName,
//             subCode,
//             sessions,
//             school: schoolId,
//         });

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 subject: newSubject,
//             },
//         });
//     } catch (error) {
//         if (error.code === 11000) {
//             return next(new AppError('Subject with this code already exists', 400));
//         }
//         next(error);
//     }
// };


// Add a new subject
// export const addSubject = async (req, res, next) => {
//   try {
//     const { name } = req.body;
//     if (!name || !name.trim()) {
//       return res.status(400).json({ status: 'fail', message: 'Subject name is required.' });
//     }
//     // Ensure admin is linked to a school
//     const schoolId = req.user.school;
//     if (!schoolId) {
//       return res.status(400).json({ status: 'fail', message: 'School not found for admin.' });
//     }
//     // Check for duplicate subject name in the same school
//     const exists = await Subject.findOne({ name: name.trim(), school: schoolId });
//     if (exists) {
//       return res.status(409).json({ status: 'fail', message: 'Subject already exists.' });
//     }
//     const subject = await Subject.create({ name: name.trim(), school: schoolId });
//     res.status(201).json({ status: 'success', data: { subject } });
//   } catch (err) {
//     next(err);
//   }
// };



// Optimized addSubject Controller
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
    // We rely on the model's unique index { name: 1, school: 1 } to prevent duplicates.
    // This is more efficient than doing a .findOne() first.
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
      // Check if the error is about the Name field (which is our new constraint)
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
// Get all subjects for the admin's school
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
// get all broadcast notices for the admin's school
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