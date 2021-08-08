const mongoose = require('mongoose');

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
    required: [true, 'Post must have content.'],
  },
  media: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Media',
    },
  ],
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

const Post = new mongoose.model('Post', postSchema);

module.exports = Post;
