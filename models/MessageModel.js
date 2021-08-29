const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
    required: [true, 'message must belong to a conversation'],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'message must have an author'],
  },
  content: {
    type: String,
    required: [true, 'message must have content'],
  },
  sentAt: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
