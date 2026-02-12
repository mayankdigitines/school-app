import Notice from '../models/Notice.js';
import Homework from '../models/Homework.js';
import StudentRequest from '../models/StudentRequest.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import AppError from '../utils/appError.js';
import Class from '../models/Class.js';

// --- DASHBOARD / HOME ---

export const getTeacherHome = async (req, res, next) => {
  try {
    // 1) Fetch Teacher Data with populated fields
    // We explicitly select fields to keep the response lightweight ("optimized")
    const teacher = await Teacher.findById(req.user._id)
      .populate('school', 'name schoolCode contactInfo')
      .populate('assignedClass', 'grade section')
      .populate('subjects', 'name')
      .select('-password -__v')
      .lean();

    if (!teacher) {
        return next(new AppError('Teacher profile not found.', 404));
    }

    // 2) Fetch Classes this teacher teaches
    const teachingClasses = await Class.find({ 'subjectTeachers.teacher': teacher._id })
      .select('grade section')
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
      teachingClasses: teachingClasses.map(cls => ({
        classId: cls._id,
        grade: cls.grade,
        section: cls.section
      })),
      assignedClass: teacher.assignedClass ? {
        classId: teacher.assignedClass._id,
        grade: teacher.assignedClass.grade,
        section: teacher.assignedClass.section
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
    }).sort('-createdAt');
    // id with their name instead of just id for postedBy and also optmize for like notice id,schoool id with name and postedBy with name and role instead of just id to avoid multiple calls from frontend to get those details
     const formattedNotices = notices.map(notice => ({
        noticeId: notice._id,
        title: notice.title,
        content: notice.content,
        audience: notice.audience,
        attachments: notice.attachments,
        postedBy: {
          userId: notice.postedBy.userId,
          name: notice.postedBy.name,
          role: notice.postedBy.role
        },
        school: {
          schoolId: notice.school._id,
          name: notice.school.name
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
    
    // Convert req.files to array of paths if using multer
    if (req.files) {
        attachments = req.files.map(file => file.path);
    }
    
    // Validation: If teacher tries to post to a class they aren't assigned to? 
    // Business logic: Can a teacher post to ANY class? Usually yes for "Substitute" reasons, 
    // but often restricted. Let's assume open for intra-school flexibility for now.

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
    // A teacher should only see requests for THEIR assigned class
    if (!req.user.assignedClass) {
        return next(new AppError('You are not assigned as a Class Teacher to any class.', 403));
    }

    const requests = await StudentRequest.find({
      school: req.user.school,
      requestedClass: req.user.assignedClass,
      status: 'Pending'
    }).populate('parent', 'name phone');

    const formattedData = requests.map(req => ({
      requestId: req._id,
      studentName: req.studentName,
      rollNumber: req.rollNumber,
      requestedClass: {
        classId: req.requestedClass._id,
        name: req.requestedClass.name
      },
      parent: {
        parentId: req.parent._id,
        name: req.parent.name,
        phone: req.parent.phone
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
    const { requestId, status, rejectionReason } = req.body; // status: 'Approved' or 'Rejected'
    
    if (!['Approved', 'Rejected'].includes(status)) {
        return next(new AppError('Invalid status. Must be Approved or Rejected', 400));
    }

    const request = await StudentRequest.findById(requestId);
    if (!request) {
        return next(new AppError('Request not found', 404));
    }

    // Security check: Is this teacher the class teacher for this request?
    if (request.requestedClass.toString() !== req.user.assignedClass.toString()) {
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
    // 1. Create Student
    const newStudent = await Student.create({
        name: request.studentName,
        rollNumber: request.rollNumber,
        school: request.school,
        studentClass: request.requestedClass,
        parent: request.parent
    });

    // 2. Update Request Status
    request.status = 'Approved';
    await request.save();

    res.status(200).json({
        status: 'success',
        message: 'Student approved and enrolled successfully',
        data: { student: newStudent }
    });

  } catch (error) {
    // Handle Roll No Duplicate
    if (error.code === 11000) {
         return next(new AppError('Roll Number already exists in this class', 400));
    }
    next(error);
  }
};

export const getClassStudents = async (req, res, next) => {
    try {
        // Defaults to assigned class, or allows querying specific class if needed
        // allow all the teacher to see students
        // i Want that subject teachers can also see the students of the classes they teach, not just the class teacher. So if a teacher teaches Math to Class 5A, they should be able to see all students in Class 5A, even if they are not the assigned class teacher for 5A. This is important for them to manage their subject-specific homework and notices effectively.
        
        const isClassTeacher = req.user.assignedClass && req.user.assignedClass.toString() === req.query.classId;
        const isSubjectTeacher = await Class.findOne({ 
            _id: req.query.classId, 
            'subjectTeachers.teacher': req.user._id 
        });
        
        if (!isClassTeacher && !isSubjectTeacher) {
            return next(new AppError('You are not authorized to view students for this class', 403));
        }


        const classId = req.query.classId || req.user.assignedClass;

        if(!classId) {
             return next(new AppError('No class specified or assigned', 400));
        }

        const students = await Student.find({ studentClass: classId }).populate('parent', 'name phone');
    const formattedStudents = students.map(student => ({
    studentId: student._id,
    name: student.name,
    rollNumber: student.rollNumber,
    parent: {
        parentId: student.parent._id,
        name: student.parent.name,
        phone: student.parent.phone
    },
    school: {
        schoolId: student.school._id,
        name: student.school.name
    },
    studentClass: {
        classId: student.studentClass._id,
        name: student.studentClass.name
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
    
    // Convert req.files to array of paths if using multer
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