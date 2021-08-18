const catchAsync = require('../utils/catchAsync');
const Conversation = require('../models/ConversationModel');
const AppError = require('../utils/appError');
const Message = require('../models/MessageModel');

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

exports.getMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({ conversation: req.params.id });

  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
