import Student from '../models/Student.js';
import StudentRequest from '../models/StudentRequest.js';
import Attendance from '../models/Attendance.js';
import Notice from '../models/Notice.js';
import Message from '../models/Message.js';
import AppError from '../utils/appError.js';

// 1. Request to register a child to a class
export const requestChildRegistration = async (req, res, next) => {
  try {
    const { requestedClass, studentName, rollNumber } = req.body;

    // Check if request already exists
    const existingRequest = await StudentRequest.findOne({
      school: req.user.school,
      requestedClass,
      rollNumber,
      status: 'Pending'
    });

    if (existingRequest) {
      return next(new AppError('A request for this roll number is already pending.', 400));
    }

    const newRequest = await StudentRequest.create({
      parent: req.user._id,
      school: req.user.school,
      requestedClass,
      studentName,
      rollNumber
    });

    res.status(201).json({
      success: true,
      message: 'Child registration request submitted successfully to the class teacher.',
      data: newRequest
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get details of approved registered children
export const getMyChildren = async (req, res, next) => {
  try {
    const children = await Student.find({ parent: req.user._id })
      .populate({
        path: 'studentClass',
        select: 'className classTeacher',
        populate: { path: 'classTeacher', select: 'name' }
      });

    res.status(200).json({
      success: true,
      data: children
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get child's attendance history
export const getChildAttendance = async (req, res, next) => {
  try {
    const { childId } = req.params;

    // Verify this child actually belongs to the logged-in parent
    const child = await Student.findOne({ _id: childId, parent: req.user._id });
    if (!child) {
      return next(new AppError('Child not found or unauthorized access.', 404));
    }

    // Retrieve attendance where this student's ID exists in the records array
    // The "select('date records.$')" ensures we only pull the specific child's status from the array, not the whole class
    const attendances = await Attendance.find({
      school: req.user.school,
      class: child.studentClass,
      'records.student': childId
    })
    .select('date records.$')
    .sort({ date: -1 });

    // Format for easier frontend consumption
    const attendanceHistory = attendances.map(att => ({
      date: att.date,
      status: att.records[0].status
    }));

    res.status(200).json({
      success: true,
      data: attendanceHistory
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get notices applicable to the parent and their children
export const getNotices = async (req, res, next) => {
  try {
    // Get parent's children to extract their class and student IDs
    const children = await Student.find({ parent: req.user._id });
    const classIds = children.map(child => child.studentClass);
    const studentIds = children.map(child => child._id);

    // Fetch notices targeted at All, Parents, specific Classes of their children, or specifically to their children
    const notices = await Notice.find({
      school: req.user.school,
      $or: [
        { audience: 'All' },
        { audience: 'Parents' },
        { audience: 'Class', targetClass: { $in: classIds } },
        { audience: 'Student', targetStudent: { $in: studentIds } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notices
    });
  } catch (error) {
    next(error);
  }
};

// 5. Message the class teacher of a specific child
export const sendMessageToTeacher = async (req, res, next) => {
  try {
    const { childId, content } = req.body;

    // Verify child belongs to parent and find the class
    const child = await Student.findOne({ _id: childId, parent: req.user._id }).populate('studentClass');
    if (!child) {
      return next(new AppError('Child not found or unauthorized access.', 404));
    }

    const classTeacherId = child.studentClass?.classTeacher;
    if (!classTeacherId) {
      return next(new AppError('No class teacher is currently assigned to this class.', 400));
    }

    const message = await Message.create({
      school: req.user.school,
      sender: req.user._id,
      senderModel: 'Parent',
      receiver: classTeacherId,
      receiverModel: 'Teacher',
      content
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully to the class teacher.',
      data: message
    });
  } catch (error) {
    next(error);
  }
};