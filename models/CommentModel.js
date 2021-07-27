const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author.'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must have a parent post.'],
  },
  content: {
    type: String,
    validate: {
      validator: (content) => content.length < 1500,
      message: 'Comment can be no longer than 1,500 characters long.',
    },
    required: [true, 'Comment must have content.'],
  },
  createdAt: Date,
});

commentSchema.pre('save', function (next) {
  if (!this.isNew) next();
  this.createdAt = new Date(Date.now());
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
