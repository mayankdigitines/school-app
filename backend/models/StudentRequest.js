import mongoose from 'mongoose';

const studentRequestSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  requestedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  rejectionReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StudentRequest = mongoose.model('StudentRequest', studentRequestSchema);
export default StudentRequest;