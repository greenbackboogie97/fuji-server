const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'conversation must have participants'],
    },
  ],
  messages: [],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
