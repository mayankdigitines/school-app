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

    res.status(200).json({
      status: 'success',
      results: notices.length,
      data: { notices }
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

    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: { requests }
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
        const classId = req.query.classId || req.user.assignedClass;

        if(!classId) {
             return next(new AppError('No class specified or assigned', 400));
        }

        const students = await Student.find({ studentClass: classId }).populate('parent', 'name phone');

        res.status(200).json({
            status: 'success',
            results: students.length,
            data: { students }
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