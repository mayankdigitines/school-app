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
},
{
  timestamps: true,
}
);

classSchema.index({ school: 1, grade: 1, section: 1 }, { unique: true });

const Class = mongoose.model('Class', classSchema);
export default Class;