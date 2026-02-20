import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  attachments: [{
    type: String, // URLs or file paths
  }],
},
{
  timestamps: true,
});

homeworkSchema.index({ school: 1, class: 1 });
homeworkSchema.index({ teacher: 1 });

export default mongoose.model('Homework', homeworkSchema);
