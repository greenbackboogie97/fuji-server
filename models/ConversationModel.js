const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'conversation must have participants'],
    },
  ],
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
    },
  ],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
