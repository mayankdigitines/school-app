import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  schoolCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
  }
},
{
  timestamps: true,
});

const School = mongoose.model('School', schoolSchema);
export default School;