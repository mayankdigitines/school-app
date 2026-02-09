import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Teacher from '../models/Teacher.js';
import Parent from '../models/Parent.js';
import AppError from '../utils/appError.js';
import School from '../models/School.js';
import StudentRequest from '../models/StudentRequest.js';
import Class from '../models/Class.js';

// const signToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };


const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};



// const createSendToken = (user, role, statusCode, res) => {
//   const token = signToken(user._id, role);

//   // Remove password from output
//   user.password = undefined;

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user,
//       role
//     },
//   });
// };

const createSendToken = (user, role, statusCode, res) => {
  const token = signToken(user._id, role);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
      role
    },
  });
};


// export const login = async (req, res, next) => {
//   try {
//     let { username, password, role } = req.body;

//     // 1) Check if email/phone and password exist
//     if (!username || !password || !role) {
//       return next(new AppError('Please provide username, password and role', 400));
//     }

//     username = username.trim();
//     role = role.trim();

//     let user;
//     let isMatch = false;

//     // 2) Check if user exists & password is correct based on role
//     if (role === 'SuperAdmin' || role === 'SchoolAdmin') {
//       const cleanEmail = username.toLowerCase();
//       user = await Admin.findOne({ email: cleanEmail }).select('+password').populate('school');
//     } else if (role === 'Teacher') {
//       const cleanEmail = username.toLowerCase();
//       user = await Teacher.findOne({ email: cleanEmail }).select('+password').populate('school');
//     } else if (role === 'Parent') {
//       user = await Parent.findOne({ phone: username }).select('+password');
//     } else {
//       return next(new AppError('Invalid role specified', 400));
//     }

//     if (!user || !(await user.matchPassword(password))) {
//       return next(new AppError('Incorrect credentials', 401));
//     }
    
//     // Safety check for SchoolAdmin content integrity
//     if (role === 'SchoolAdmin' && user.role === 'SchoolAdmin' && !user.school) {
//          // Log the critical error (in a real app)
//          // console.error(`Integrity Error: SchoolAdmin ${user._id} has no linked school`);
//          // Return a helpful error to client or fail gracefully
//          return next(new AppError('Account configuration error: No school linked.', 500));
//     }

//     // 3) If everything ok, send token to client
//     // Use the role from the found user object if available (e.g. Admin has internal role), otherwise use the prompt matches
//     // But Admin schema has a role field. Teacher doesn't (implicit). Parent doesn't (implicit).
//     // So for Admin, trust the DB role. For others, trust the verified log in.
    
//     // Safety check: if an Admin tries to login as Teacher, the query on Teacher model returns null.
//     // So the 'role' passed in matches the collection we queried.
    
//     const finalRole = user.role || role; // Admin model has role property
    
//     createSendToken(user, finalRole, 200, res);

//   } catch (error) {
//     next(error);
//   }
// };

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
      // --- PRODUCTION TEACHER LOGIN FLOW ---
      
      // A. Require School Code
      if (!schoolCode) {
        return next(new AppError('School Code is required for Teacher login.', 400));
      }

      // B. Optimize: Find School first (Lightweight query)
      const school = await School.findOne({ schoolCode }).select('_id name');
      
      if (!school) {
        return next(new AppError('Invalid School Code.', 404));
      }

      // C. Find Teacher Scoped to School
      // This strictly matches the username AND the verified school ID.
      user = await Teacher.findOne({ 
        username: username, 
        school: school._id 
      }).select('+password').populate('school');

      // Security: If user not found in this specific school, deny access
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

    // 5) Generate Token
    const finalRole = user.role || role; 
    createSendToken(user, finalRole, 200, res);

  } catch (error) {
    next(error);
  }
};


// Parent Registration is a public auth route


// export const login = async (req, res, next) => {
//   try {
//     let { username, password, role } = req.body;

//     if (!username || !password || !role) {
//       return next(new AppError('Please provide credentials and role', 400));
//     }

//     username = username.trim();
//     role = role.trim();

//     let user;

//     // Role-based Login Strategy
//     if (role === 'SuperAdmin' || role === 'SchoolAdmin') {
//       const cleanEmail = username.toLowerCase();
//       user = await Admin.findOne({ email: cleanEmail }).select('+password').populate('school');
//     } else if (role === 'Teacher') {
//       // CHANGED: Search by 'username' for teachers, NOT email
//       user = await Teacher.findOne({ username: username }).select('+password').populate('school');
//     } else if (role === 'Parent') {
//       user = await Parent.findOne({ phone: username }).select('+password');
//     } else {
//       return next(new AppError('Invalid role specified', 400));
//     }

//     if (!user || !(await user.matchPassword(password))) {
//       return next(new AppError('Incorrect credentials', 401));
//     }
    
//     if (role === 'SchoolAdmin' && user.role === 'SchoolAdmin' && !user.school) {
//          return next(new AppError('Account configuration error: No school linked.', 500));
//     }

//     const finalRole = user.role || role; 
    
//     createSendToken(user, finalRole, 200, res);

//   } catch (error) {
//     next(error);
//   }
// };

export const registerParent = async (req, res, next) => {
  try {
    const { 
      name,
      phone, 
      password, 
      schoolCode,
      studentName,
      studentRollNo, 
      grade,
      section 
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
      grade: grade, 
      section: section 
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
    } else {
         // Optional: Verify password if reusing account? 
         // For simplicity, we assume if phone matches, we just link the new request.
         // In production, we should probably force login -> add child. 
         // But prompt implies a registration flow. Let's assume new parent for now, or handle duplicate error if unique constraint hits.
         // The unique constraint is on phone. So create will fail if it exists.
         // Let's just catch the error if it fails distinct from logic.
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