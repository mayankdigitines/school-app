import Notice from '../models/Notice.js';
import Homework from '../models/Homework.js';
import StudentRequest from '../models/StudentRequest.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import AppError from '../utils/appError.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';
// --- DASHBOARD / HOME ---

// export const getTeacherHome = async (req, res, next) => {
//   try {
//     // 1) Fetch Teacher Data with populated fields
//     const teacher = await Teacher.findById(req.user._id)
//       .populate('school', 'name schoolCode contactInfo')
//       .populate('assignedClass', 'className')
//       .populate('subjects', 'name')
//       .select('-password -__v')
//       .lean();

//     if (!teacher) {
//         return next(new AppError('Teacher profile not found.', 404));
//     }

//     // 2) Fetch Classes this teacher teaches as a Subject Teacher
//     const teachingClasses = await Class.find({ 'subjectTeachers.teacher': teacher._id })
//       .select('className')
//       .lean();
    
//     const formattedData = {
//       teacherId: teacher._id,
//       name: teacher.name,
//       username: teacher.username,
//       school: {
//         schoolId: teacher.school._id,
//         schoolName: teacher.school.name,
//         schoolCode: teacher.school.schoolCode,
//         contactInfo: teacher.school.contactInfo
//       },
//       // Classes where they are a Subject Teacher
//       teachingClasses: teachingClasses.map(cls => ({
//         classId: cls._id,
//         className: cls.className
//       })),
//       // Class where they are the Class Teacher (if any)
//       assignedClass: teacher.assignedClass ? {
//         classId: teacher.assignedClass._id,
//         className: teacher.assignedClass.className
//       } : null,
//       subjects: teacher.subjects.map(sub => ({ subjectName: sub.name, subjectId: sub._id })),
//       createdAt: teacher.createdAt,
//       updatedAt: teacher.updatedAt
//     }

//     res.status(200).json({
//       status: 'success',
//       data: { teacher: formattedData }
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// export const getTeacherHome = async (req, res, next) => {
//   try {
//     // 1) Fetch Teacher Data with populated fields
//     const teacher = await Teacher.findById(req.user._id)
//       .populate('school', 'name schoolCode contactInfo')
//       .populate('assignedClass', 'className')
//       .populate('subjects', 'name')
//       .select('-password -__v')
//       .lean();

//     if (!teacher) {
//         return next(new AppError('Teacher profile not found.', 404));
//     }

//     // 2) Fetch Classes this teacher teaches as a Subject Teacher
//     const teachingClasses = await Class.find({ 'subjectTeachers.teacher': teacher._id })
//       .select('className')
//       .lean();

//     // 3) Calculate Today's Attendance Percentage (New Feature)
//     let todaysAttendance = null;

//     if (teacher.assignedClass) {
//       const startOfDay = new Date();
//       startOfDay.setHours(0, 0, 0, 0);

//       const attendanceRecord = await Attendance.findOne({
//         class: teacher.assignedClass._id,
//         date: startOfDay
//       }).select('records').lean();

//       if (attendanceRecord && attendanceRecord.records.length > 0) {
//         const totalStudents = attendanceRecord.records.length;
//         const presentCount = attendanceRecord.records.filter(r => r.status === 'Present').length;
        
//         todaysAttendance = {
//           percentage: parseFloat(((presentCount / totalStudents) * 100).toFixed(2)),
//           presentCount,
//           totalStudents,
//           isTaken: true
//         };
//       } else {
//         todaysAttendance = {
//           percentage: 0,
//           isTaken: false
//         };
//       }
//     }
    
//     const formattedData = {
//       teacherId: teacher._id,
//       name: teacher.name,
//       username: teacher.username,
//       school: {
//         schoolId: teacher.school._id,
//         schoolName: teacher.school.name,
//         schoolCode: teacher.school.schoolCode,
//         contactInfo: teacher.school.contactInfo
//       },
//       teachingClasses: teachingClasses.map(cls => ({
//         classId: cls._id,
//         className: cls.className
//       })),
//       assignedClass: teacher.assignedClass ? {
//         classId: teacher.assignedClass._id,
//         className: teacher.assignedClass.className,
//         // Include the new attendance data here
//         todaysAttendance: todaysAttendance 
//       } : null,
//       subjects: teacher.subjects.map(sub => ({ subjectName: sub.name, subjectId: sub._id })),
//       createdAt: teacher.createdAt,
//       updatedAt: teacher.updatedAt
//     }

//     res.status(200).json({
//       status: 'success',
//       data: { teacher: formattedData }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getTeacherHome = async (req, res, next) => {
//   try {
//     // 1) Fetch Teacher Data with populated fields
//     const teacher = await Teacher.findById(req.user._id)
//       .populate('school', 'name schoolCode contactInfo')
//       .populate('assignedClass', 'className')
//       .populate('subjects', 'name')
//       .select('-password -__v')
//       .lean();

//     if (!teacher) {
//       return next(new AppError('Teacher profile not found.', 404));
//     }

//     // 2) Fetch Classes this teacher teaches as a Subject Teacher
//     const teachingClasses = await Class.find({ 'subjectTeachers.teacher': teacher._id })
//       .select('className')
//       .lean();

//     // 3) Calculate Today's Completion Percentage
//     let todaysAttendance = null;

//     if (teacher.assignedClass) {
//       const startOfDay = new Date();
//       startOfDay.setHours(0, 0, 0, 0);

//       // Fetch the attendance record for the assigned class today
//       const attendanceRecord = await Attendance.findOne({
//         class: teacher.assignedClass._id,
//         date: startOfDay
//       }).select('records').lean();

//       if (attendanceRecord && attendanceRecord.records.length > 0) {
//         const totalStudents = attendanceRecord.records.length;
//         const presentCount = attendanceRecord.records.filter(r => r.status === 'Present').length;
        
//         // Correct Calculation: (Present / Total) * 100
//         // Example: 1 Present, 1 Absent => (1 / 2) * 100 = 50%
//         const percentage = (presentCount / totalStudents) * 100;

//         todaysAttendance = {
//           percentage: parseFloat(percentage.toFixed(2)), // Keeps it clean (e.g., 50.00)
//           presentCount,
//           absentCount: totalStudents - presentCount,
//           totalStudents,
//           isTaken: true
//         };
//       } else {
//         // If attendance hasn't been marked yet today
//         todaysAttendance = {
//           percentage: 0,
//           isTaken: false
//         };
//       }
//     }
    
//     const formattedData = {
//       teacherId: teacher._id,
//       name: teacher.name,
//       username: teacher.username,
//       school: {
//         schoolId: teacher.school._id,
//         schoolName: teacher.school.name,
//         schoolCode: teacher.school.schoolCode,
//         contactInfo: teacher.school.contactInfo
//       },
//       teachingClasses: teachingClasses.map(cls => ({
//         classId: cls._id,
//         className: cls.className
//       })),
//       assignedClass: teacher.assignedClass ? {
//         classId: teacher.assignedClass._id,
//         className: teacher.assignedClass.className,
//         todaysAttendance // Attaching the calculated attendance object
//       } : null,
//       subjects: teacher.subjects.map(sub => ({ subjectName: sub.name, subjectId: sub._id })),
//       createdAt: teacher.createdAt,
//       updatedAt: teacher.updatedAt
//     };

//     res.status(200).json({
//       status: 'success',
//       data: { teacher: formattedData }
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// export const getTeacherHome = async (req, res, next) => {
//   try {
//     // 1) Fetch Teacher Data with populated fields
//     const teacher = await Teacher.findById(req.user._id)
//       .populate('school', 'name schoolCode contactInfo')
//       .populate('assignedClass', 'className')
//       .populate('subjects', 'name')
//       .select('-password -__v')
//       .lean();

//     if (!teacher) {
//       return next(new AppError('Teacher profile not found.', 404));
//     }

//     // 2) Fetch Classes this teacher teaches as a Subject Teacher
//     const teachingClasses = await Class.find({ 'subjectTeachers.teacher': teacher._id })
//       .select('className')
//       .lean();

//     // 3) Calculate Today's Completion Percentage
//     let todaysAttendance = null;
//     if (teacher.assignedClass) {
//       const startOfDay = new Date();
//       startOfDay.setHours(0, 0, 0, 0);

//       const attendanceRecord = await Attendance.findOne({
//         class: teacher.assignedClass._id,
//         date: startOfDay
//       }).select('records').lean();

//       if (attendanceRecord && attendanceRecord.records.length > 0) {
//         const totalStudents = attendanceRecord.records.length;
//         const presentCount = attendanceRecord.records.filter(r => r.status === 'Present').length;
//         const percentage = (presentCount / totalStudents) * 100;

//         todaysAttendance = {
//           percentage: parseFloat(percentage.toFixed(2)),
//           presentCount,
//           absentCount: totalStudents - presentCount,
//           totalStudents,
//           isTaken: true
//         };
//       } else {
//         todaysAttendance = { percentage: 0, isTaken: false };
//       }
//     }

//     // 4) Fetch Latest 5 Homeworks (New Feature)
//     const latestHomeworks = await Homework.find({ school: req.user.school })
//       .sort({ createdAt: -1 }) // Sort by newest first
//       .limit(5) // Optimization: Only retrieve 5 records
//       .populate('teacher', 'name') // Show who posted it
//       .populate('class', 'className') // Show target class
//       .populate('subject', 'name') // Show subject name
//       .lean();

//     const formattedHomeworks = latestHomeworks.map(hw => ({
//       homeworkId: hw._id,
//       description: hw.description,
//       subject: hw.subject?.name || 'N/A',
//       className: hw.class?.className || 'N/A',
//       teacherName: hw.teacher?.name || 'Unknown',
//       dueDate: hw.dueDate,
//       attachments: hw.attachments,
//       createdAt: hw.createdAt
//     }));

//     const formattedData = {
//       teacherId: teacher._id,
//       name: teacher.name,
//       username: teacher.username,
//       school: {
//         schoolId: teacher.school._id,
//         schoolName: teacher.school.name,
//         schoolCode: teacher.school.schoolCode,
//         contactInfo: teacher.school.contactInfo
//       },
//       teachingClasses: teachingClasses.map(cls => ({
//         classId: cls._id,
//         className: cls.className
//       })),
//       assignedClass: teacher.assignedClass ? {
//         classId: teacher.assignedClass._id,
//         className: teacher.assignedClass.className,
//         todaysAttendance 
//       } : null,
//       subjects: teacher.subjects.map(sub => ({ subjectName: sub.name, subjectId: sub._id })),
//       recentHomeworks: formattedHomeworks, // New field for the frontend
//       createdAt: teacher.createdAt,
//       updatedAt: teacher.updatedAt
//     };

//     res.status(200).json({
//       status: 'success',
//       data: { teacher: formattedData }
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// export const getTeacherHome = async (req, res, next) => {
//   try {
//     // 1) Fetch Teacher Data with populated fields
//     const teacher = await Teacher.findById(req.user._id)
//       .populate('school', 'name schoolCode contactInfo')
//       .populate('assignedClass', 'className')
//       .populate('subjects', 'name')
//       .select('-password -__v')
//       .lean();

//     if (!teacher) {
//       return next(new AppError('Teacher profile not found.', 404));
//     }

//     // 2) Fetch Classes this teacher teaches as a Subject Teacher
//     const teachingClasses = await Class.find({ 'subjectTeachers.teacher': teacher._id })
//       .select('className')
//       .lean();

//     // 3) Conditional Data for Class Teachers (Attendance & Requests)
//     let classTeacherData = null;

//     if (teacher.assignedClass) {
//       const startOfDay = new Date();
//       startOfDay.setHours(0, 0, 0, 0);

//       // A) Calculate Today's Attendance Percentage
//       const attendanceRecord = await Attendance.findOne({
//         class: teacher.assignedClass._id,
//         date: startOfDay
//       }).select('records').lean();

//       let attendanceStats = { percentage: 0, isTaken: false };
      
//       if (attendanceRecord && attendanceRecord.records.length > 0) {
//         const totalStudents = attendanceRecord.records.length;
//         const presentCount = attendanceRecord.records.filter(r => r.status === 'Present').length;
//         attendanceStats = {
//           percentage: parseFloat(((presentCount / totalStudents) * 100).toFixed(2)),
//           presentCount,
//           totalStudents,
//           isTaken: true
//         };
//       }

//       // B) Count Pending Requests from Parents (New Feature)
//       const pendingRequestsCount = await StudentRequest.countDocuments({
//         requestedClass: teacher.assignedClass._id,
//         status: 'Pending'
//       });

//       classTeacherData = {
//         classId: teacher.assignedClass._id,
//         className: teacher.assignedClass.className,
//         todaysAttendance: attendanceStats,
//         parentRequests: pendingRequestsCount // Simple number for UI badges
//       };
//     }

//     // 4) Fetch Latest 5 Homeworks
//     const latestHomeworks = await Homework.find({ school: req.user.school })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('teacher', 'name')
//       .populate('class', 'className')
//       .populate('subject', 'name')
//       .lean();

//     const formattedData = {
//       teacherId: teacher._id,
//       name: teacher.name,
//       username: teacher.username,
//       school: {
//         schoolId: teacher.school._id,
//         schoolName: teacher.school.name,
//         schoolCode: teacher.school.schoolCode
//       },
//       teachingClasses: teachingClasses.map(cls => ({
//         classId: cls._id,
//         className: cls.className
//       })),
//       // Grouped Class Teacher responsibilities
//       assignedClass: classTeacherData, 
//       subjects: teacher.subjects.map(sub => ({ subjectName: sub.name, subjectId: sub._id })),
//       recentHomeworks: latestHomeworks.map(hw => ({
//         homeworkId: hw._id,
//         description: hw.description,
//         subject: hw.subject?.name || 'N/A',
//         className: hw.class?.className || 'N/A',
//         teacherName: hw.teacher?.name || 'Unknown',
//         dueDate: hw.dueDate
//       })),
//       createdAt: teacher.createdAt
//     };

//     res.status(200).json({
//       status: 'success',
//       data: { teacher: formattedData }
//     });
//   } catch (error) {
//     next(error);
//   }
// };


export const getTeacherHome = async (req, res, next) => {
  try {
    // 1) Fetch Teacher Data with populated fields
    const teacher = await Teacher.findById(req.user._id)
      .populate('school', 'name schoolCode contactInfo')
      .populate('assignedClass', 'className')
      .populate('subjects', 'name')
      .select('-password -__v')
      .lean();

    if (!teacher) {
      return next(new AppError('Teacher profile not found.', 404));
    }

    // 2) Fetch Classes this teacher teaches as a Subject Teacher
    const teachingClasses = await Class.find({ 'subjectTeachers.teacher': teacher._id })
      .select('className')
      .lean();

    // 3) Conditional Data for Class Teachers (Attendance & Requests)
    let classTeacherData = null;

    if (teacher.assignedClass) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const attendanceRecord = await Attendance.findOne({
        class: teacher.assignedClass._id,
        date: startOfDay
      }).select('records').lean();

      let attendanceStats = { percentage: 0, isTaken: false };
      
      if (attendanceRecord && attendanceRecord.records.length > 0) {
        const totalStudents = attendanceRecord.records.length;
        const presentCount = attendanceRecord.records.filter(r => r.status === 'Present').length;
        attendanceStats = {
          percentage: parseFloat(((presentCount / totalStudents) * 100).toFixed(2)),
          presentCount,
          totalStudents,
          isTaken: true
        };
      }

      const pendingRequestsCount = await StudentRequest.countDocuments({
        requestedClass: teacher.assignedClass._id,
        status: 'Pending'
      });

      classTeacherData = {
        classId: teacher.assignedClass._id,
        className: teacher.assignedClass.className,
        todaysAttendance: attendanceStats,
        pendingRequests: pendingRequestsCount
      };
    }

    // 4) Fetch Latest 5 Homeworks POSTED BY THIS TEACHER
    // Optimization: Filter by teacher: req.user._id
    const myLatestHomeworks = await Homework.find({ 
        teacher: req.user._id,
        school: req.user.school 
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('class', 'className')
      .populate('subject', 'name')
      .lean();

     const mylatestNotices = await Notice.find({ 
        school: req.user.school,
        audience: { $in: ['All', 'Teachers'] } 
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title content audience postedBy createdAt')
      .lean()
      
    const formattedData = {
      teacherId: teacher._id,
      name: teacher.name,
      username: teacher.username,
      school: {
        schoolId: teacher.school._id,
        schoolName: teacher.school.name,
        schoolCode: teacher.school.schoolCode
      },
      teachingClasses: teachingClasses.map(cls => ({
        classId: cls._id,
        className: cls.className
      })),
      assignedClass: classTeacherData, 
      subjects: teacher.subjects.map(sub => ({ subjectName: sub.name, subjectId: sub._id })),
      // Now returns only homeworks posted by the logged-in teacher
      myRecentHomeworks: myLatestHomeworks.map(hw => ({
        homeworkId: hw._id,
        description: hw.description,
        subject: hw.subject?.name || 'N/A',
        className: hw.class?.className || 'N/A',
        dueDate: hw.dueDate,
        createdAt: hw.createdAt
      })),
      recentNotices: mylatestNotices.map(notice => ({
        id: notice._id,
        title: notice.title,
        content: notice.content.substring(0, 100) + '...', // Preview only
        audience: notice.audience,
        postedBy: notice.postedBy?.role === 'SchoolAdmin' ? 'Admin' : notice.postedBy?.name,
        createdAt: notice.createdAt,
      })),
      createdAt: teacher.createdAt
    };

    res.status(200).json({
      status: 'success',
      data: { teacher: formattedData }
    });
  } catch (error) {
    next(error);
  }
};

// --- NOTICE & HOMEWORK ---

export const getTeacherNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({
      school: req.user.school,
      $or: [
        { audience: 'All' },
        { audience: 'Teachers' }
      ]
    })
    .sort('-createdAt')
    .lean();

    const formattedNotices = notices.map(notice => ({
        noticeId: notice._id,
        title: notice.title,
        content: notice.content,
        audience: notice.audience,
        attachments: notice.attachments,
        postedBy: {
          userId: notice.postedBy?.userId,
          name: notice.postedBy?.name,
          role: notice.postedBy?.role
        },
        school: {
          schoolId: notice.school,
        },
        createdAt: notice.createdAt
    }));

    res.status(200).json({
      status: 'success',
      results: notices.length,
      data: { notices: formattedNotices }
    });
  } catch (error) {
    next(error);
  }
};

export const postNotice = async (req, res, next) => {
  try {
    const { title, content, audience, targetClassId, targetStudentId } = req.body;
    let attachments = [];
    
    if (req.files) {
        attachments = req.files.map(file => file.path);
    }
    
    // Security: Validate if teacher has access to the target class
    if (audience === 'Class' && targetClassId) {
        // Check if Class Teacher
        const isClassTeacher = req.user.assignedClass && req.user.assignedClass.toString() === targetClassId;
        
        // Check if Subject Teacher
        const isSubjectTeacher = await Class.exists({ 
            _id: targetClassId, 
            'subjectTeachers.teacher': req.user._id 
        });

        if (!isClassTeacher && !isSubjectTeacher) {
            return next(new AppError('You are not authorized to post notices to this class.', 403));
        }
    }

    const newNotice = await Notice.create({
      title,
      content,
      school: req.user.school,
      postedBy: {
        userId: req.user._id,
        role: 'Teacher',
        name: req.user.name
      },
      audience,
      targetClass: targetClassId,
      targetStudent: targetStudentId,
      attachments
    });

    res.status(201).json({
      status: 'success',
      data: { notice: newNotice }
    });

  } catch (error) {
    next(error);
  }
};

// --- STUDENT MANAGEMENT ---

export const getPendingRequests = async (req, res, next) => {
  try {
    // Only Class Teachers can manage requests for their class
    if (!req.user.assignedClass) {
        return next(new AppError('You are not assigned as a Class Teacher to any class.', 403));
    }

    const requests = await StudentRequest.find({
      school: req.user.school,
      requestedClass: req.user.assignedClass,
      status: 'Pending'
    })
    .populate('parent', 'name phone')
    .populate('requestedClass', 'className') 
    .lean();

    const formattedData = requests.map(req => ({
      requestId: req._id,
      studentName: req.studentName,
      rollNumber: req.rollNumber,
      requestedClass: {
        classId: req.requestedClass?._id,
        className: req.requestedClass?.className
      },
      parent: {
        parentId: req.parent?._id,
        name: req.parent?.name,
        phone: req.parent?.phone
      },
      status: req.status,
      rejectionReason: req.rejectionReason,
      createdAt: req.createdAt,
      updatedAt: req.updatedAt
    }));

    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: { requests: formattedData }
    });
  } catch (error) {
    next(error);
  }
};

export const handleStudentRequest = async (req, res, next) => {
  try {
    const { requestId, status, rejectionReason } = req.body; 
    
    if (!['Approved', 'Rejected'].includes(status)) {
        return next(new AppError('Invalid status. Must be Approved or Rejected', 400));
    }

    // 1. Fetch Request
    const request = await StudentRequest.findById(requestId)
        .populate('parent', 'name phone')
        .populate('requestedClass', 'className'); // Needed for response data

    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    // 2. Security Check: Only the Class Teacher can approve
    if (!req.user.assignedClass || request.requestedClass._id.toString() !== req.user.assignedClass.toString()) {
         return next(new AppError('You are not authorized to manage requests for this class', 403));
    }

    // 3. Handle Rejection
    if (status === 'Rejected') {
        request.status = 'Rejected';
        request.rejectionReason = rejectionReason || 'No reason provided';
        await request.save();
        
        return res.status(200).json({
            status: 'success',
            message: 'Request rejected'
        });
    }

    // 4. Handle Approval (Create Student)
    if (status === 'Approved') {
        // [FIX] Ensure the student is actually created!
        const newStudent = await Student.create({
            name: request.studentName,
            rollNumber: request.rollNumber,
            school: request.school,
            studentClass: request.requestedClass._id, // Ensure ID is passed
            parent: request.parent._id // Ensure ID is passed
        });

        request.status = 'Approved';
        await request.save();

        const formattedStudent = {
            studentId: newStudent._id,
            name: newStudent.name,
            rollNumber: newStudent.rollNumber,
            className: request.requestedClass.className,
            parentId: request.parent._id,
            parentName: request.parent.name,
            parentPhone: request.parent.phone,
            school: request.school,
            schoolName: req.user.school.schoolName
        };

        return res.status(200).json({
            status: 'success',
            message: 'Student approved and enrolled successfully',
            data: { student: formattedStudent }
        });
    }

  } catch (error) {
    if (error.code === 11000) {
         return next(new AppError('Roll Number already exists in this class', 400));
    }
    next(error);
  }
};



// export const getClassStudents = async (req, res, next) => {
//   try {
//     const { classId } = req.query;
//     const teacherId = req.user._id;

//     let targetClassIds = [];

//     // CASE 1: Specific Class Requested
//     if (classId) {
//       // Check if the teacher has ANY authority (Class Teacher OR Subject Teacher) over this specific class
//       const isAuthorized = await Class.exists({
//         _id: classId,
//         $or: [
//           { classTeacher: teacherId },              // Role 1: Class Teacher
//           { 'subjectTeachers.teacher': teacherId }  // Role 2: Subject Teacher
//         ]
//       });

//       if (!isAuthorized) {
//         return next(new AppError('You are not authorized to view students for this class.', 403));
//       }

//       targetClassIds = [classId];
//     } 
    
//     // CASE 2: No Specific Class (Fetch All Authorized Classes)
//     else {
//       const authorizedClasses = await Class.find({
//         $or: [
//           { classTeacher: teacherId },
//           { 'subjectTeachers.teacher': teacherId }
//         ]
//       }).select('_id').lean();

//       if (!authorizedClasses.length) {
//         // Return empty list instead of error for better UI handling
//         return res.status(200).json({
//           status: 'success',
//           results: 0,
//           data: { students: [] }
//         });
//       }

//       targetClassIds = authorizedClasses.map(c => c._id);
//     }

//     // Fetch Students belonging to the target class(es)
//     const students = await Student.find({ studentClass: { $in: targetClassIds } })
//       .populate('parent', 'name phone')
//       .populate('studentClass', 'className')
//       .sort({ 'studentClass': 1, 'rollNumber': 1 }) // Group by class, then order by roll number
//       .lean();

//     // Format data for the frontend
//     const formattedStudents = students.map(student => ({
//       studentId: student._id,
//       name: student.name,
//       rollNumber: student.rollNumber,
//       className: student.studentClass?.className || 'Unassigned',
//       classId: student.studentClass?._id,
//       parent: {
//         name: student.parent?.name || 'N/A',
//         phone: student.parent?.phone || 'N/A'
//       }
//     }));

//     res.status(200).json({
//       status: 'success',
//       results: students.length,
//       data: { students: formattedStudents }
//     });

//   } catch (error) {
//     next(error);
//   }
// };



export const getClassStudents = async (req, res, next) => {
    try {
        const { classId } = req.query;

        // 1. Base Query: Fetch students belonging to the teacher's school
        // This grants access to ALL students in the school, fulfilling your new requirement.
        const query = { school: req.user.school };

        // 2. Optional Filter: If classId is provided, filter by that class.
        // We do NOT restrict this to only "assigned" classes anymore.
        if (classId) {
            query.studentClass = classId;
        }

        // 3. Fetch Data
        const students = await Student.find(query)
            .populate('parent', 'name phone')
            .populate('studentClass', 'className') 
            .sort({ 'studentClass': 1, 'rollNumber': 1 }) // Sort by Class name, then Roll Number
            .lean();

        // 4. Format Data
        const formattedStudents = students.map(student => ({
            studentId: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            parent: {
                parentId: student.parent?._id,
                name: student.parent?.name || 'N/A',
                phone: student.parent?.phone || 'N/A'
            },
            school: {
                schoolId: student.school,
            },
            class: {
                classId: student.studentClass?._id,
                className: student.studentClass?.className || 'Unassigned',
            },
            createdAt: student.createdAt,
            updatedAt: student.updatedAt
        }));

        res.status(200).json({
            status: 'success',
            results: students.length,
            data: { students: formattedStudents }
        });
    } catch (error) {
        next(error);
    }
};



// export const createHomework = async (req, res, next) => {
//   try {
//     const { description, subjectId, classId, dueDate } = req.body;
    
//     let attachments = [];
//     if (req.files) {
//         attachments = req.files.map(file => file.path);
//     }

//     const newHomework = await Homework.create({
//       description,
//       subject: subjectId,
//       class: classId,
//       teacher: req.user._id,
//       school: req.user.school,
//       dueDate,
//       attachments
//     });

//     res.status(201).json({
//       status: 'success',
//       data: { homework: newHomework }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const createHomework = async (req, res, next) => {
  try {
    const { description, subjectId, classId, dueDate } = req.body;
    
    // 1. Production Validation: Fail fast if data is missing
    if (!description || !subjectId || !classId || !dueDate) {
        return next(new AppError('Please provide description, subject, class, and due date.', 400));
    }

    // 2. Handle Files Safely
    let attachments = [];
    if (req.files && req.files.length > 0) {
        attachments = req.files.map(file => file.path);
    }

    // 3. Create Record
    const newHomework = await Homework.create({
      description,
      subject: subjectId,
      class: classId,
      teacher: req.user._id,
      school: req.user.school,
      dueDate,
      attachments
    });

    res.status(201).json({
      status: 'success',
      message: 'Homework created successfully',
      data: { homework: newHomework }
    });
  } catch (error) {
    next(error);
  }
}


export const getTeacherClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ school: req.user.school })
      .select('className')
      .lean();
    const formattedClasses = classes.map(cls => ({
      classId: cls._id,
      className: cls.className
    }));
    res.status(200).json({
      status: 'success',
      results: classes.length,
      data: { classes: formattedClasses }
    });
  } catch (error) {
    next(error);
  }
};


// --- ATTENDANCE MANAGEMENT ---

// export const markAttendance = async (req, res, next) => {
//   try {
//     const { date, absentStudentIds } = req.body;
    
//     // 1. Validation: Ensure Teacher is a Class Teacher
//     if (!req.user.assignedClass) {
//       return next(new AppError('You are not assigned as a Class Teacher.', 403));
//     }
    
//     const attendanceDate = new Date(date);
//     attendanceDate.setHours(0, 0, 0, 0);

//     // 3. Fetch ALL students in this class
//     const allStudents = await Student.find({ 
//       studentClass: req.user.assignedClass 
//     }).select('_id name rollNumber');

//     if (allStudents.length === 0) {
//       return next(new AppError('No students found in your class to mark attendance.', 404));
//     }

//     // 4. Build the Records Array
//     const attendanceRecords = allStudents.map(student => {
//       const isAbsent = absentStudentIds.includes(student._id.toString());
//       return {
//         student: student._id,
//         status: isAbsent ? 'Absent' : 'Present'
//       };
//     });

//     // 5. Database Operation: Upsert (Update if exists, Insert if new)
//     const attendance = await Attendance.findOneAndUpdate(
//       { 
//         class: req.user.assignedClass, 
//         date: attendanceDate 
//       },
//       {
//         $set: {
//           school: req.user.school,
//           takenBy: req.user._id,
//           records: attendanceRecords
//         }
//       },
//       { new: true, upsert: true, runValidators: true }
//     );

//     res.status(200).json({
//       status: 'success',
//       message: 'Attendance marked successfully',
//       data: { 
//         date: attendance.date,
//         presentCount: attendance.records.filter(r => r.status === 'Present').length,
//         absentCount: attendance.records.filter(r => r.status === 'Absent').length
//       }
//     });

//   } catch (error) {
//     next(error);
//   }
// };




// 1. Get Students for Attendance (with existing status if available)
export const getAttendanceStudents = async (req, res, next) => {
  try {
    // 1. Validation: Ensure Teacher is a Class Teacher
    if (!req.user.assignedClass) {
      return next(new AppError('You are not assigned as a Class Teacher.', 403));
    }

    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    // 2. Fetch ALL students in the assigned class
    const students = await Student.find({ 
      studentClass: req.user.assignedClass 
    })
    .select('_id name rollNumber')
    .sort({ rollNumber: 1 })
    .lean();

    // 3. Fetch existing attendance record for this date (if any)
    const existingAttendance = await Attendance.findOne({
      class: req.user.assignedClass,
      date: queryDate
    }).lean();

    // 4. Map students to include current status
    // If attendance exists, use the saved status. If not, default to 'Present'.
    const studentList = students.map(student => {
      let status = 'Present'; // Default
      
      if (existingAttendance) {
        const record = existingAttendance.records.find(
          r => r.student.toString() === student._id.toString()
        );
        if (record) status = record.status;
      }

      return {
        studentId: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        status: status
      };
    });

    res.status(200).json({
      status: 'success',
      results: studentList.length,
      data: {
        date: queryDate,
        isAlreadyTaken: !!existingAttendance,
        students: studentList
      }
    });

  } catch (error) {
    next(error);
  }
};

// 2. Mark Attendance (Bulk Update)
export const markAttendance = async (req, res, next) => {
  try {
    const { date, absentStudentIds } = req.body;
    
    // 1. Validation
    if (!req.user.assignedClass) {
      return next(new AppError('You are not assigned as a Class Teacher.', 403));
    }
    
    // Validate Date
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      return next(new AppError('Invalid date format.', 400));
    }
    attendanceDate.setHours(0, 0, 0, 0);

    // 2. Fetch ALL students in the class (Source of Truth)
    const allStudents = await Student.find({ 
      studentClass: req.user.assignedClass 
    }).select('_id');

    if (allStudents.length === 0) {
      return next(new AppError('No students found in your class.', 404));
    }

    // 3. Create Records: Map through ALL students
    // If their ID is in the 'absentStudentIds' array => Absent, else => Present
    const attendanceRecords = allStudents.map(student => {
      const isAbsent = absentStudentIds.includes(student._id.toString());
      return {
        student: student._id,
        status: isAbsent ? 'Absent' : 'Present'
      };
    });

    // 4. Upsert Attendance (Create or Update)
    const attendance = await Attendance.findOneAndUpdate(
      { 
        class: req.user.assignedClass, 
        date: attendanceDate 
      },
      {
        $set: {
          school: req.user.school,
          takenBy: req.user._id,
          records: attendanceRecords
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    // 5. Calculate Stats
    const totalStudents = attendance.records.length;
    const absentCount = attendance.records.filter(r => r.status === 'Absent').length;
    const presentCount = totalStudents - absentCount;

    res.status(200).json({
      status: 'success',
      message: 'Attendance marked successfully',
      data: { 
        date: attendance.date,
        stats: {
          total: totalStudents,
          present: presentCount,
          absent: absentCount
        }
      }
    });

  } catch (error) {
    next(error);
  }
};


export const getAttendanceHistory = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!req.user.assignedClass) {
      return next(new AppError('You are not a Class Teacher.', 403));
    }

    let query = { class: req.user.assignedClass };

    // If date provided, fetch specific day. Else fetch recent 30 days.
    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      query.date = queryDate;
    }

    const history = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(30)
      .populate('records.student', 'name rollNumber');

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: { history }
    });

  } catch (error) {
    next(error);
  }
};



