// import mongoose from 'mongoose';

// const classSchema = new mongoose.Schema({
//   grade: {
//     type: String, // e.g., "1", "10", "KG"
//     required: true,
//   },
//   section: {
//     type: String, // e.g., "A", "B"
//     required: true,
//     uppercase: true,
//   },
//   school: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'School',
//     required: true,
//   },
//   classTeacher: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     default: null,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Composite Unique Key: A school cannot have duplicate Class (e.g., 1-A)
// classSchema.index({ school: 1, grade: 1, section: 1 }, { unique: true });

// const Class = mongoose.model('Class', classSchema);
// export default Class;

// fileName: backend/models/Class.js
// import mongoose from 'mongoose';

// const classSchema = new mongoose.Schema({
//   grade: {
//     type: String,
//     required: true,
//   },
//   section: {
//     type: String,
//     required: true,
//     uppercase: true,
//   },
//   school: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'School',
//     required: true,
//   },
//   // ADMINISTRATIVE: The single teacher responsible for this class
//   classTeacher: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     default: null,
//   },
//   // ACADEMIC: List of subjects and who teaches them in this class
//   subjectTeachers: [{
//     subject: {
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'Subject',
//         required: true
//     },
//     teacher: {
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'Teacher',
//         required: true
//     }
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// classSchema.index({ school: 1, grade: 1, section: 1 }, { unique: true });

// const Class = mongoose.model('Class', classSchema);
// export default Class;

import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  grade: {
    type: String, 
    required: true,
  },
  section: {
    type: String, 
    required: true,
    uppercase: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  // ADMINISTRATIVE ROLE: The single "Class Teacher"
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null,
  },
  // ACADEMIC SCHEDULE: Who teaches what in this class
  subjectTeachers: [{
    subject: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Teacher',
        required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

classSchema.index({ school: 1, grade: 1, section: 1 }, { unique: true });

const Class = mongoose.model('Class', classSchema);
export default Class;