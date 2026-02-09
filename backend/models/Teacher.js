// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const teacherSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true, // Assuming teachers have unique emails globally or strictly managed
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false,
//   },
//   phone: {
//     type: String,
//   },
//   school: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'School',
//     required: true,
//   },
//   subjects: [{
//     type: String, // e.g. ["Math", "Physics"]
//   }],
//   // The class they are responsible for (Class Teacher)
//   assignedClass: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Class',
//     default: null,
//   },
//   isClassTeacher: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// teacherSchema.pre('save', async function () {
//   if (!this.isModified('password')) {
//     return;
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// teacherSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const Teacher = mongoose.model('Teacher', teacherSchema);
// export default Teacher;


// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const teacherSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     sparse: true, // Allows multiple null values if email is not provided
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false,
//   },
//   phone: {
//     type: String,
//   },
//   school: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'School',
//     required: true,
//   },
//   subjects: [{
//     type: String,
//   }],
//   assignedClass: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Class',
//     default: null,
//   },
//   isClassTeacher: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// teacherSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// teacherSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const Teacher = mongoose.model('Teacher', teacherSchema);
// export default Teacher;


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone: {
    type: String,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  subjects: [{
    type: String,
  }],
  assignedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    default: null,
  },
  isClassTeacher: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// FIXED: Removed 'next' parameter. Mongoose handles async functions automatically.
teacherSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

teacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;