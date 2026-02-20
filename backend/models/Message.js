// backend/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['Parent', 'Teacher', 'Admin']
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel'
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['Parent', 'Teacher', 'Admin']
  },
  content: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);
export default Message;