import Notice from '../models/Notice.js';
import Homework from '../models/Homework.js';
import StudentRequest from '../models/StudentRequest.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import AppError from '../utils/appError.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';

// --- DASHBOARD / HOME ---

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
    
    const formattedData = {
      teacherId: teacher._id,
      name: teacher.name,
      username: teacher.username,
      school: {
        schoolId: teacher.school._id,
        schoolName: teacher.school.name,
        schoolCode: teacher.school.schoolCode,
        contactInfo: teacher.school.contactInfo
      },
      // Classes where they are a Subject Teacher
      teachingClasses: teachingClasses.map(cls => ({
        classId: cls._id,
        className: cls.className
      })),
      // Class where they are the Class Teacher (if any)
      assignedClass: teacher.assignedClass ? {
        classId: teacher.assignedClass._id,
        className: teacher.assignedClass.className
      } : null,
      subjects: teacher.subjects.map(sub => ({ subjectName: sub.name, subjectId: sub._id })),
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt
    }

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
    .populate('requestedClass', 'grade section')
    .lean();

    const formattedData = requests.map(req => ({
      requestId: req._id,
      studentName: req.studentName,
      rollNumber: req.rollNumber,
      requestedClass: {
        classId: req.requestedClass?._id,
        grade: req.requestedClass?.grade,
        section: req.requestedClass?.section
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

    const request = await StudentRequest.findById(requestId);
    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    // Security check: Only the Class Teacher of the requested class can approve
    if (!req.user.assignedClass || request.requestedClass.toString() !== req.user.assignedClass.toString()) {
         return next(new AppError('You are not authorized to manage requests for this class', 403));
    }

    if (status === 'Rejected') {
        request.status = 'Rejected';
        request.rejectionReason = rejectionReason || 'No reason provided';
        await request.save();
        
        return res.status(200).json({
            status: 'success',
            message: 'Request rejected'
        });
    }

    // APPROVAL LOGIC
    const newStudent = await Student.create({
        name: request.studentName,
        rollNumber: request.rollNumber,
        school: request.school,
        studentClass: request.requestedClass,
        parent: request.parent
    });

    request.status = 'Approved';
    await request.save();

    res.status(200).json({
        status: 'success',
        message: 'Student approved and enrolled successfully',
        data: { student: newStudent }
    });

  } catch (error) {
    if (error.code === 11000) {
         return next(new AppError('Roll Number already exists in this class', 400));
    }
    next(error);
  }
};

export const getClassStudents = async (req, res, next) => {
    try {
        const { classId } = req.query;
        const teacherId = req.user._id;

        // 1. Find ALL classes where this teacher has authorization
        // (Either as Class Teacher OR Subject Teacher)
        const authorizedClasses = await Class.find({
            $or: [
                { classTeacher: teacherId },
                { 'subjectTeachers.teacher': teacherId }
            ]
        }).select('_id grade section').lean();

        // Extract IDs for easy comparison
        const authorizedClassIds = authorizedClasses.map(c => c._id.toString());
        
        let targetClassIds = [];

        if (classId) {
            // Case A: User requests a specific class
            if (!authorizedClassIds.includes(classId)) {
                return next(new AppError('You are not authorized to view students for this class', 403));
            }
            targetClassIds = [classId];
        } else {
            // Case B: No specific class requested -> Return students from ALL authorized classes
            // This handles the "Subject Teacher" case who teaches multiple classes
            if (authorizedClassIds.length === 0) {
                 return next(new AppError('You are not assigned to any classes.', 404));
            }
            targetClassIds = authorizedClassIds;
        }

        // 2. Fetch Students
        const students = await Student.find({ studentClass: { $in: targetClassIds } })
            .populate('parent', 'name phone')
            .populate('studentClass', 'grade section') // Populate to show which class the student belongs to
            .lean();

        const formattedStudents = students.map(student => ({
            studentId: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            parent: {
                parentId: student.parent?._id,
                name: student.parent?.name,
                phone: student.parent?.phone
            },
            school: {
                schoolId: student.school
            },
            class: {
                classId: student.studentClass?._id,
                grade: student.studentClass?.grade,
                section: student.studentClass?.section
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

export const createHomework = async (req, res, next) => {
  try {
    const { description, subjectId, classId, dueDate } = req.body;
    
    let attachments = [];
    if (req.files) {
        attachments = req.files.map(file => file.path);
    }

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
      data: { homework: newHomework }
    });
  } catch (error) {
    next(error);
  }
};
// all teacher get classes in school

export const getTeacherClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ school: req.user.school })
      .select('grade section')
      .lean();
    const formattedClasses = classes.map(cls => ({
      classId: cls._id,
      grade: cls.grade,
      section: cls.section
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

export const markAttendance = async (req, res, next) => {
  try {
    const { date, absentStudentIds } = req.body;
    
    // 1. Validation: Ensure Teacher is a Class Teacher
    if (!req.user.assignedClass) {
      return next(new AppError('You are not assigned as a Class Teacher.', 403));
    }
    
    // 2. Normalize Date (Strip time to avoid timezone duplicates)
    // Create date object from string and set to midnight UTC or local equivalent for consistency
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // 3. Fetch ALL students in this class
    const allStudents = await Student.find({ 
      studentClass: req.user.assignedClass 
    }).select('_id name rollNumber');

    if (allStudents.length === 0) {
      return next(new AppError('No students found in your class to mark attendance.', 404));
    }

    // 4. Build the Records Array
    // Loop through ALL students. If their ID is in the 'absentStudentIds' list, mark Absent.
    const attendanceRecords = allStudents.map(student => {
      const isAbsent = absentStudentIds.includes(student._id.toString());
      return {
        student: student._id,
        status: isAbsent ? 'Absent' : 'Present'
      };
    });

    // 5. Database Operation: Upsert (Update if exists, Insert if new)
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

    res.status(200).json({
      status: 'success',
      message: 'Attendance marked successfully',
      data: { 
        date: attendance.date,
        presentCount: attendance.records.filter(r => r.status === 'Present').length,
        absentCount: attendance.records.filter(r => r.status === 'Absent').length
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