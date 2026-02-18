import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId, // The teacher who marked it
    ref: 'Teacher',
    required: true,
  },
  records: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent'],
      default: 'Present'
    },
    rollNumber: String, // Cached for easier display in history
    name: String        // Cached for easier display in history
  }],
  presentCount: {
    type: Number,
    default: 0
  },
  absentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

// Ensure only one attendance record exists per class per day
attendanceSchema.index({ class: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;