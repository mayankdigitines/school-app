import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  grade: {
    type: String, // e.g., "1", "10", "KG"
    required: true,
  },
  section: {
    type: String, // e.g., "A", "B"
    required: true,
    uppercase: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Composite Unique Key: A school cannot have duplicate Class (e.g., 1-A)
classSchema.index({ school: 1, grade: 1, section: 1 }, { unique: true });

const Class = mongoose.model('Class', classSchema);
export default Class;