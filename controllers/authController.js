const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/UserModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendToken(newUser, 201, `${req.body.name} welcome to Fuji!`, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide an email and a password.', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.validatePassword(password, user.password))) {
    return next(new AppError('Invalid credentials.', 401));
  }

  sendToken(user, 200, `Good to see you again ${user.name}!`, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (!req.cookies.jwt) {
    next(new AppError('You are not logged in.', 401));
  }
  token = req.cookies.jwt;

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    next(
      new AppError(
        'This user does no longer exist. Please log in with a different user.',
        401
      )
    );

  if (currentUser.checkPasswordChanged(decoded.iat))
    next(
      new AppError(
        'The password has been changed recently. Please log in again',
        401
      )
    );

  req.user = currentUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  if (!email) next(new AppError('Please provide an email.'));
  const user = await User.findOne({ email });
  if (!user)
    next(
      new AppError(
        `We could'nt find a user with the provided email. Please try again.`,
        400
      )
    );

  const resetToken = await user.createResetToken();

  const subject = `You'r Fuji password reset token! (valid for 10 minutes)`;
  const message = `Hey ${user.name}, to reset you'r password please submit a patch request to: ${req.protocol}://${req.hostname}/users/resetPassword/${resetToken} \nIf you did'nt forget you'r password, please ignore this email.`;
  await sendEmail(email, subject, message);

  res.status(200).json({
    status: 'success',
    message:
      'We have sent a reset token to your. The token will expire in 10 minutes.',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({ passwordResetToken: hashedToken });

  const expired = user.passwordResetTokenExpire < new Date(Date.now());
  if (expired) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('This token has expired.', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Your password has successfuly changed.',
  });
});
