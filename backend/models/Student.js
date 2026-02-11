import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  studentClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true,
  },
},{
  timestamps: true,
});

// Ensure roll number is unique within the class
studentSchema.index({ studentClass: 1, rollNumber: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;