const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'media must have an author'],
  },
  url: {
    type: String,
    required: [true, 'media must have a secure url'],
  },
  resourceType: {
    type: String,
    required: [true, 'media must have a type'],
  },
  createdAt: Date,
});

mediaSchema.pre('save', function (next) {
  if (this.isNew) this.createdAt = new Date(Date.now());
  next();
});

const Media = new mongoose.model('Media', mediaSchema);
module.exports = Media;
