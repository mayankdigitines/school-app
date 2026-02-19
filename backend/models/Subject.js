import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  }, // <--- Ensure this comma exists
  // [ADDED] Field to store the SVG string
  subjectIcon: {
    type: String,
    required: true
  }
},{
  timestamps: true,
});

subjectSchema.index({ name: 1, school: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;