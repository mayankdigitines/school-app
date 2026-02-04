import { body, validationResult } from 'express-validator';
import AppError from '../utils/appError.js';

export const validateRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('schoolCode').notEmpty().withMessage('School Code is required'),
  body('studentName').notEmpty().withMessage('Student Name is required'),
  body('studentRollNo').notEmpty().withMessage('Student Roll Number is required'),
  body('grade').notEmpty().withMessage('Class Grade is required'),
  body('section').notEmpty().withMessage('Class Section is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Map errors to a string message
      const msg = errors.array().map(err => err.msg).join('. ');
      return next(new AppError(msg, 400));
    }
    next();
  }
];

export const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').isIn(['SuperAdmin', 'SchoolAdmin', 'Teacher', 'Parent']).withMessage('Invalid role'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const msg = errors.array().map(err => err.msg).join('. ');
            return next(new AppError(msg, 400));
        }
        next();
    }
];