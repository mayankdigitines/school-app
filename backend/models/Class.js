import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
 className: {
    type: String, 
    required: true,
    trim: true,
    uppercase: true
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

classSchema.index({ school: 1, className: 1 }, { unique: true });

const Class = mongoose.model('Class', classSchema);
export default Class;