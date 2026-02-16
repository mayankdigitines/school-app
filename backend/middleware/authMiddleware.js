import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Admin from '../models/Admin.js';
import Teacher from '../models/Teacher.js';
import Parent from '../models/Parent.js';
import AppError from '../utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    let currentUser;
    if (decoded.role === 'SuperAdmin' || decoded.role === 'SchoolAdmin') {
      currentUser = await Admin.findById(decoded.id);
    } else if (decoded.role === 'Teacher') {
      currentUser = await Teacher.findById(decoded.id);
    } else if (decoded.role === 'Parent') {
      currentUser = await Parent.findById(decoded.id);
    }

    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    req.user.role = decoded.role; 
    next();
  } catch (error) {
     // Production Ready: Distinguish between expired and invalid tokens
     if (error.name === 'TokenExpiredError') {
         return next(new AppError('Token expired', 401));
     }
     if (error.name === 'JsonWebTokenError') {
         return next(new AppError('Invalid token', 401));
     }
     return next(new AppError('Not authorized', 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};