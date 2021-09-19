const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name!'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email!'],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password!'],
    validate: {
      validator: validator.isStrongPassword,
      message:
        'Required at least 8 chars, 1 Lowercase, 1 Uppercase, 1 Number, 1 Symbol',
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Passwords must match!'],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: 'Passwords must match!',
    },
  },
  bio: {
    type: String,
    validate: [
      (el) => el.length < 60,
      'Your bio can be no longer than 60 characters.',
    ],
  },
  profilePicture: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  this.passwordConfirm = undefined;
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now());
  next();
});

userSchema.methods.validatePassword = async (candidatePassword, hash) =>
  await bcrypt.compare(candidatePassword, hash);

userSchema.methods.checkPasswordChanged = function (tokenIAT) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
  if (changedTimestamp > tokenIAT) return true;

  return false;
};

userSchema.methods.createResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.passwordResetTokenExpire = new Date(Date.now() + 10 * 60 * 1000);
  this.save({ validateBeforeSave: false });

  return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
