const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getPosts = catchAsync(async (req, res, next) => {
  let query;

  if (req.params.feed === 'friends') {
    query = { author: { $in: [req.user._id, ...req.user.friends] } };
  } else if (req.params.feed === 'community') {
    query = null;
  }
  const posts = await Post.find(query)
    .populate({ path: 'author', select: '-friends' })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { content } = req.body;

  const post = await Post.create({
    author: req.user._id,
    content,
  });

  res.status(201).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const deleted = await Post.findOneAndDelete({
    _id: req.params.id,
    author: req.user._id,
  });

  if (!deleted)
    return next(
      new AppError('This post is either not yours or not exists.', 401)
    );

  res.status(204).json({});
});

exports.getComments = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('This post does not exist', 400));

  const comments = await Comment.find({ post: post._id }).sort('+createdAt');

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('this post does not exist', 400));

  const author = req.user._id;

  const { content } = req.body;

  const comment = await Comment.create({
    author,
    post: post._id,
    content,
  });

  if (comment) {
    post.comments.push(comment._id);
    await post.save();
  }

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = req.body.comment;

  if (!comment) return next(new AppError('please provide a commnet id.', 400));

  const deleted = await Comment.findOneAndDelete({
    _id: comment,
    author: req.user._id,
    post: req.params.id,
  });

  if (!deleted)
    return next(
      new AppError('This comment is either not yours or not exists.', 401)
    );

  const post = await Post.findById(req.params.id);
  const commentIndex = post.comments.indexOf(comment);
  post.comments.splice(commentIndex, 1);
  await post.save();

  res.status(204).json({});
});

exports.likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('This post does no longer exists.', 400));

  if (post.likes.includes(req.user._id))
    return next(new AppError('Already liked this post.', 400));

  post.likes.push(req.user._id);
  await post.save();

  res.status(200).json({
    status: 'success',
  });
});

exports.unlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('This post does no longer exists.', 400));

  if (!post.likes.includes(req.user._id))
    return next(new AppError('You do not like this post.', 400));

  const likeIndex = post.likes.indexOf(req.user._id);
  post.likes.splice(likeIndex, 1);
  await post.save();

  res.status(201).json({});
});
