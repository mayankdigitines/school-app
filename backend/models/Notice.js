import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  // Who posted it? Can be SchoolAdmin or Teacher
  postedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, enum: ['SchoolAdmin', 'Teacher'], required: true },
    name: String
  },
  // Target Audience
  audience: {
    type: String,
    enum: ['All', 'Teachers', 'Students', 'Class', 'Student', 'Parents'],
    default: 'All',
  },
  // If audience is 'Class', specify which class
  targetClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
  // If audience is 'Student', specify which student
  targetStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  attachments: [{
    type: String, // URL paths to files
  }],
},
{
  timestamps: true,
});

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;