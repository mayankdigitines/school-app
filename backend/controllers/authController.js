import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Admin from '../models/Admin.js';
import Teacher from '../models/Teacher.js';
import Parent from '../models/Parent.js';
import AppError from '../utils/appError.js';
import School from '../models/School.js';
import StudentRequest from '../models/StudentRequest.js';
import Class from '../models/Class.js';

// --- Token Generators ---
const signAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Short-lived Access Token
  });
};

const signRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Long-lived Refresh Token
  });
};

const createSendToken = async (user, role, statusCode, res) => {
  const accessToken = signAccessToken(user._id, role);
  const refreshToken = signRefreshToken(user._id, role);

  // Store Refresh Token in DB
  user.refreshToken = refreshToken;
  // Use validateBeforeSave: false to avoid running all validation logic (like required fields) if just updating token
  await user.save({ validateBeforeSave: false });

  // Hide sensitive data
  user.password = undefined;
  user.refreshToken = undefined;

  // Prepare response object
  const response = {
    status: 'success',
    accessToken,   // Use this for Bearer Auth
    refreshToken,  // Store this securely (SecureStore/HttpOnly Cookie)
  };

  // Only include data if the role is NOT 'Teacher'
  if (role !== 'Teacher') {
    response.data = {
      user,
      role
    };
  }

  res.status(statusCode).json(response);
};

// --- LOGIN CONTROLLER ---
export const login = async (req, res, next) => {
  try {
    let { username, password, role, schoolCode } = req.body;

    // 1) Basic Input Validation
    if (!username || !password || !role) {
      return next(new AppError('Please provide credentials (username/password) and role.', 400));
    }

    username = username.trim();
    role = role.trim();

    let user;

    // 2) Role-Based Login Logic
    if (role === 'SuperAdmin' || role === 'SchoolAdmin') {
      const cleanEmail = username.toLowerCase();
      user = await Admin.findOne({ email: cleanEmail }).select('+password').populate('school');
    } 
    else if (role === 'Teacher') {
      // A. Require School Code
      if (!schoolCode) {
        return next(new AppError('School Code is required for Teacher login.', 400));
      }
      // B. Find School
      const school = await School.findOne({ schoolCode }).select('_id name');
      if (!school) {
        return next(new AppError('Invalid School Code.', 404));
      }
      // C. Find Teacher Scoped to School
      user = await Teacher.findOne({ 
        username: username, 
        school: school._id 
      }).select('+password').populate('school');

      if (!user) {
        return next(new AppError('Invalid credentials or you do not belong to this school.', 401));
      }
    } 
    else if (role === 'Parent') {
      user = await Parent.findOne({ phone: username }).select('+password');
    } 
    else {
      return next(new AppError('Invalid role specified', 400));
    }

    // 3) Password Verification
    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError('Incorrect credentials', 401));
    }
    
    // 4) Integrity Check for SchoolAdmin
    if (role === 'SchoolAdmin' && user.role === 'SchoolAdmin' && !user.school) {
         return next(new AppError('Account configuration error: No school linked.', 500));
    }

    // 5) Generate & Send Tokens
    const finalRole = user.role || role; 
    await createSendToken(user, finalRole, 200, res);

  } catch (error) {
    next(error);
  }
};

// --- REFRESH TOKEN CONTROLLER ---
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh Token is required', 400));
    }

    // 1) Verify Token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      return next(new AppError('Invalid or expired refresh token', 403));
    }

    // 2) Check if user exists & find user
    let user;
    if (decoded.role === 'SuperAdmin' || decoded.role === 'SchoolAdmin') {
      user = await Admin.findById(decoded.id).select('+refreshToken');
    } else if (decoded.role === 'Teacher') {
      user = await Teacher.findById(decoded.id).select('+refreshToken');
    } else if (decoded.role === 'Parent') {
      user = await Parent.findById(decoded.id).select('+refreshToken');
    }

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // 3) Check if Refresh Token matches DB (Security: Detect Reuse)
    if (user.refreshToken !== refreshToken) {
      // Possible token theft! Invalidate current token.
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('Invalid refresh token. Please login again.', 403));
    }

    // 4) Token Rotation: Issue NEW pair
    const newAccessToken = signAccessToken(user._id, decoded.role);
    const newRefreshToken = signRefreshToken(user._id, decoded.role);

    // 5) Update DB with new Refresh Token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    next(error);
  }
};

// --- LOGOUT CONTROLLER ---
export const logout = async (req, res, next) => {
  try {
    // Requires 'protect' middleware before this to get req.user
    const user = req.user;

    // Clear refresh token from DB
    // We need to fetch the user document if req.user doesn't have save() method depending on middleware,
    // but typically protect attaches the Mongoose document.
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// --- PARENT REGISTRATION ---
export const registerParent = async (req, res, next) => {
  try {
    const { 
      name,
      phone, 
      password, 
      schoolCode,
      studentName,
      studentRollNo, 
    ClassName, 
    } = req.body;



    // 1) Verify School Code
    const school = await School.findOne({ schoolCode });
    if (!school) {
      return next(new AppError('Invalid School Code', 404));
    }

    // 2) Verify Class exists in that school
    // Note: Frontend should likely fetch classes first, but we handle raw input here
    const studentClass = await Class.findOne({ 
      school: school._id, 
      className: ClassName
    });

    if (!studentClass) {
      return next(new AppError('Class not found in this school', 404));
    }

    // 3) Create or Find Parent
    // A parent might already exist (second child). 
    let parent = await Parent.findOne({ phone });
    
    if (!parent) {
        parent = await Parent.create({
            name,
            phone,
            password,
            school: school._id
        });
    }

    // 4) Create Student Request
    await StudentRequest.create({
        parent: parent._id,
        school: school._id,
        requestedClass: studentClass._id,
        studentName,
        rollNumber: studentRollNo,
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Waiting for Class Teacher approval.',
    });

  } catch (error) {
    // Handle Duplicate Key Error for Parent Phone
    if (error.code === 11000 && error.keyPattern && error.keyPattern.phone) {
        return next(new AppError('Phone number already registered. Please login.', 400));
    }
    next(error);
  }
};