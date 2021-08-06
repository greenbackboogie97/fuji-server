const mongoose = require('mongoose');
const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary');

exports.uploadMedia = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const fileStr = req.body.data;

  const media = await cloudinary.uploader.upload(fileStr);

  res.status(200).json({
    status: 'success',
    data: {
      media,
    },
  });
});
