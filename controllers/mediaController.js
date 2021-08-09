const User = require('../models/UserModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require('../utils/cloudinary');

exports.uploadMedia = catchAsync(async (req, res, next) => {
  const fileURL = req.body.data;
  if (!fileURL)
    return next(
      new AppError('The server did not recive a file URL to upload.', 400)
    );

  const upload = await cloudinary.uploader.upload(fileURL, {
    upload_preset: 'fuji',
    public_id: `${req.user._id}-${Date.now()}`,
  });

  const URL = upload.secure_url;
  console.log(URL);
  const user = req.user;
  user.media.push(URL);
  await user.save();

  res.status(200).json({
    status: 'success',
    URL,
  });
});

exports.getMediaByID = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user)
    return next(new AppError('Provided ID does not match any existing user.'));

  const fetch = await cloudinary.search.expression(id).execute();
  const URL = fetch.resources[0].secure_url;

  res.status(200).json({
    status: 'success',
    URL,
  });
});
