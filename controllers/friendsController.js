const User = require('../models/UserModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addFriend = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (req.params.id == req.user._id)
    return next(new AppError('You cannot add yourself.', 400));

  const userToAdd = await User.findById(req.params.id);
  if (!userToAdd) return next(new AppError('This user does not exist.', 400));

  if (user.friends.includes(userToAdd._id))
    return next(new AppError('This user is already your friend.', 400));

  if (user.friends.length++ > 5000)
    return next(new AppError('You can have no more than 5,000 friends.', 400));

  if (userToAdd.friends.length++ > 5000)
    return next(
      new AppError(`${userToAdd.name} already has 5,000 friends.`, 400)
    );

  user.friends.push(userToAdd._id);
  userToAdd.friends.push(user._id);
  await user.save({ validateBeforeSave: false });
  await userToAdd.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: `You and ${userToAdd.name} are now friends!`,
    data: {
      friends: user._id,
    },
  });
});

exports.unfriend = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (req.params.id == req.user._id)
    return next(new AppError('You cannot add yourself.', 400));

  const userToUnfriend = await User.findById(req.params.id);
  if (!userToUnfriend)
    return next(new AppError('This user does not exist.', 400));

  if (!user.friends.includes(userToUnfriend._id))
    next(new AppError('This user is not your friend.', 400));

  const positionOfUserToUnfriend = user.friends.indexOf(userToUnfriend._id);
  const positionOfUser = userToUnfriend.friends.indexOf(user._id);
  user.friends.splice(positionOfUserToUnfriend, 1);
  userToUnfriend.friends.splice(positionOfUser, 1);
  await user.save({ validateBeforeSave: false });
  await userToUnfriend.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: `You and ${userToUnfriend.name} are no more friends.`,
    data: {
      friends: user.friends.length,
    },
  });
});
