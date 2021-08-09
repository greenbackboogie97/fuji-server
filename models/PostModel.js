const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Post must be associated to a user.'],
  },
  content: {
    type: String,
    validate: {
      validator: (content) => content.length < 6000,
      message: 'A post can be no longer than 6,000 characters long.',
    },
  },
  media: [String],
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: Date,
});

postSchema.pre('save', function (next) {
  if (this.isNew) this.createdAt = new Date(Date.now());
  next();
});

postSchema.pre('save', function (next) {
  if (!this.content && !this.media)
    return next(new AppError('Post must have either content or media.', 400));
  next();
});

const Post = new mongoose.model('Post', postSchema);

module.exports = Post;
