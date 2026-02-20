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
      // FIX 1: Add 'subjectIcon' to the populate selection
      .populate('subjects', 'name subjectIcon') 
      .select('-password -__v')
      .lean();

    if (!teacher) {
      return next(new AppError('Teacher profile not found.', 404));
    }

    // 2) Fetch Classes this teacher teaches as a Subject Teacher
    const teachingClasses = await Class.find({ 'subjectTeachers.teacher': teacher._id })
      .select('className')
      .lean();

    let classTeacherData = null;

    // 3) Process Assigned Class Data (Class Teacher Role)
    if (teacher.assignedClass) {
      const pendingRequestsCount = await StudentRequest.countDocuments({
        requestedClass: teacher.assignedClass._id,
        status: 'Pending'
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendanceRecord = await Attendance.findOne({
        class: teacher.assignedClass._id,
        date: today
      }).select('presentCount absentCount').lean();

      classTeacherData = {
        classId: teacher.assignedClass._id,
        className: teacher.assignedClass.className,
        
      };
    }

    // 4) Fetch Latest 5 Homeworks POSTED BY THIS TEACHER
    const myLatestHomeworks = await Homework.find({ 
        teacher: req.user._id,
        school: req.user.school 
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('class', 'className')
      // FIX 2: Homework has a single 'subject', not 'subjects'
      .populate('subject', 'name subjectIcon') 
      .lean();

     const mylatestNotices = await Notice.find({ 
        school: req.user.school,
        audience: { $in: ['All', 'Teachers'] } 
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title content audience postedBy createdAt')
      .lean();
    const myTodaysAttendance = await Attendance.findOne({
        class: teacher.assignedClass?._id,
        date: new Date().setHours(0, 0, 0, 0)
    }).select('presentCount absentCount date').lean();
      
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
      subjects: teacher.subjects.map(sub => ({ 
          subjectName: sub.name, 
          subjectId: sub._id, 
          subjectIcon: sub.subjectIcon 
      })),
      myRecentHomeworks: myLatestHomeworks.map(hw => ({
        homeworkId: hw._id,
        description: hw.description,
        subject: hw.subject?.name || 'N/A',
        className: hw.class?.className || 'N/A',
        createdAt: hw.createdAt
      })),
      recentNotices: mylatestNotices.map(notice => ({
        id: notice._id,
        title: notice.title,
        content: notice.content.substring(0, 100) + '...',
        audience: notice.audience,
        postedBy: notice.postedBy?.role === 'SchoolAdmin' ? 'Admin' : notice.postedBy?.name,
        createdAt: notice.createdAt,
      })),
      
      todaysAttendance: {
        ...myTodaysAttendance, 
        date: new Date(myTodaysAttendance?.date).toDateString({timezone: 'Asia/Kolkata'})
      },
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


export const createHomework = async (req, res, next) => {
  try {
    const { description, subjectId, classId } = req.body;
    
    // 1. Production Validation: Fail fast if data is missing
    if (!description || !subjectId || !classId) {
        return next(new AppError('Please provide description, subject, and class.', 400));
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

// --- ATTENDANCE MANAGEMENT (NEW) ---

export const markAttendance = async (req, res, next) => {
  try {
    const { date, absentStudentIds } = req.body;
    
    // 1. Validation: Only Class Teachers can take attendance
    if (!req.user.assignedClass) {
        return next(new AppError('You are not assigned as a Class Teacher.', 403));
    }

    if (!date) {
        return next(new AppError('Date is required.', 400));
    }

    // 2. Fetch all students in the class to build the complete record
    const students = await Student.find({ 
        studentClass: req.user.assignedClass, 
        school: req.user.school 
    }).select('name rollNumber');

    if (!students.length) {
        return next(new AppError('No students found in your class.', 404));
    }

    // 3. Construct Attendance Records
    // Default everyone to 'Present', mark selected IDs as 'Absent'
    let presentCount = 0;
    let absentCount = 0;

    const records = students.map(student => {
        const isAbsent = absentStudentIds && absentStudentIds.includes(student._id.toString());
        if (isAbsent) absentCount++; else presentCount++;
        
        return {
            student: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            status: isAbsent ? 'Absent' : 'Present'
        };
    });

    // 4. Normalize Date (Strip time to ensure one entry per day)
    // Date is in India timezone, so we need to adjust it to UTC before stripping time
   

   // save local date not utc date
    let attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // 5. Save (Upsert: Create new or Update existing for that day)
    const attendance = await Attendance.findOneAndUpdate(
        { 
            class: req.user.assignedClass, 
            date: attendanceDate 
        },
        {
            school: req.user.school,
            teacher: req.user._id,
            records: records,
            presentCount,
            absentCount
        },
        { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Attendance submitted successfully',
        data: { attendance }
    });

  } catch (error) {
    next(error);
  }
};

export const getAttendanceHistory = async (req, res, next) => {
  try {
    const { date } = req.query; // (YYYY-MM-DD) Optional filter for specific date

    if (!req.user.assignedClass) {
        return next(new AppError('You are not assigned as a Class Teacher.', 403));
    }

    const query = { 
        class: req.user.assignedClass,
        school: req.user.school
    };

    // Optional: Filter by specific date
    if (date) {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);
        query.date = queryDate;
    }

    const history = await Attendance.find(query)
        .sort({ date: -1 }) // Latest first
        .lean();
      
    const formattedHistory = history.map(record => ({
      ...record,
        attendanceId: record._id,
        date: new Date(record.date).toDateString({timezone: 'Asia/Kolkata'}),
    }));

    res.status(200).json({
        status: 'success',
        results: history.length,
        data: { history: formattedHistory }
    });

  } catch (error) {
    next(error);
  }
};

// Add this export at the bottom of the file
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Input Validation
    if (!currentPassword || !newPassword) {
      return next(new AppError('Please provide both current password and new password.', 400));
    }

    if (currentPassword === newPassword) {
      return next(new AppError('New password must be different from the current password.', 400));
    }

    // 2. Fetch the teacher explicitly selecting the password field (since it is select: false in schema)
    const teacher = await Teacher.findById(req.user._id).select('+password');
    if (!teacher) {
      return next(new AppError('Teacher not found.', 404));
    }

    // 3. Verify the current password
    const isMatch = await teacher.matchPassword(currentPassword);
    if (!isMatch) {
      return next(new AppError('Incorrect current password.', 401));
    }

    // 4. Update to the new password
    teacher.password = newPassword;
    
    // The pre('save') hook in Teacher model will automatically hash the new password
    await teacher.save(); 

    // 5. Send Success Response
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });

  } catch (error) {
    next(error);
  }
};