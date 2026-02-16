import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  takenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  records: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Leave'],
      default: 'Present'
    },
    remark: {
      type: String,
      default: ''
    }
  }]
}, {
  timestamps: true
});

// Compound Index: Ensure a class can only have ONE attendance record per date
attendanceSchema.index({ class: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;