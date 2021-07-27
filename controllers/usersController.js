const catchAsync = require('../utils/catchAsync');
const User = require('../models/UserModel');
const AppError = require('../utils/appError');
const sendToken = require('../utils/sendToken');

exports.changePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.validatePassword(req.body.currentPassword, user.password)))
    next(new AppError('Current password is incorrect.', 401));

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  sendToken(user, 200, 'Password has been succesfuly changed.', res);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      results: users.length,
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('This user does not exist', 400));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
