import Student from '../models/Student.js';
import Notice from '../models/Notice.js';
import AppError from '../utils/appError.js';

export const getMyChildren = async (req, res, next) => {
  try {
    const students = await Student.find({ parent: req.user._id })
      .populate('studentClass', 'grade section');

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: { students }
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardNotices = async (req, res, next) => {
  try {
    // 1. Get all children to find relevant Classes and Student IDs
    const children = await Student.find({ parent: req.user._id });
    
    if (children.length === 0) {
        // If parent is registered but student request pending, they might have no students yet.
        // Return only general school notices
        const notices = await Notice.find({ 
            school: req.user.school, 
            audience: 'All' 
        }).sort('-createdAt');

        return res.status(200).json({
            status: 'success',
            results: notices.length,
            data: { notices }
        });
    }

    const studentIds = children.map(child => child._id);
    const classIds = children.map(child => child.studentClass);

    // 2. Query Notices
    // Criteria: 
    // - School matches
    // - Audience is 'All' 
    // - OR Audience is 'Class' and targetClass is in classIds
    // - OR Audience is 'Student' and targetStudent is in studentIds
    
    const notices = await Notice.find({
      school: req.user.school,
      $or: [
        { audience: 'All' },
        { 
          audience: 'Class', 
          targetClass: { $in: classIds } 
        },
        { 
          audience: 'Student', 
          targetStudent: { $in: studentIds } 
        }
      ]
    })
    .sort('-createdAt')
    .populate('postedBy.userId', 'name'); // Optional: show who posted

    res.status(200).json({
      status: 'success',
      results: notices.length,
      data: { notices }
    });
  } catch (error) {
    next(error);
  }
};