const catchAsync = require('../utils/catchAsync');
const Conversation = require('../models/ConversationModel');
const AppError = require('../utils/appError');

exports.createConversation = catchAsync(async (req, res, next) => {
  const exist = await Conversation.findOne({
    participants: { $eq: [req.user._id, req.params.userID] },
  });

  if (exist) return next(new AppError('Conversation already exists', 400));

  const conversation = await Conversation.create({
    participants: [req.user._id, req.params.userID],
  });

  res.status(200).json({
    status: 'success',
    data: {
      conversation,
    },
  });
});

exports.getConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: { $in: [req.user._id] },
  }).populate({ path: 'participants', select: '-passwordChangedAt' });

  res.status(200).json({
    status: 'success',
    data: {
      conversations,
    },
  });
});

exports.getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    participants: { $in: [req.user._id] },
  }).populate({ path: 'participants', select: '-passwordChangedAt' });

  if (!conversation)
    return next(
      new AppError(
        'The conversation is either not exist or you do not have access to it.',
        401
      )
    );

  res.status(200).json({
    status: 'success',
    data: {
      conversation,
    },
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content, sentAt } = req.body;

  const conversation = await Conversation.findOne({
    _id: req.params.id,
    participants: { $in: [req.user._id] },
  });

  if (!conversation)
    return next(
      new AppError(
        'The conversation is either not exist or you do not have access to it.',
        401
      )
    );

  conversation.messages.push({
    author: req.user._id,
    content,
    sentAt,
  });
  conversation.save();

  res.status(200).json({
    status: 'success',
  });
});
