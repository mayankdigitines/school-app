import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subName: {
    type: String,
    required: true,
  },
  subCode: {
    type: String,
    required: true,
  },
  sessions: {
    type: String,
    required: true,
    default: "0" 
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
}, { timestamps: true });

// Ensure unique subject code per school
subjectSchema.index({ school: 1, subCode: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
