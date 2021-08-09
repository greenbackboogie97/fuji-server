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

  res.status(200).json({
    status: 'success',
    data: {
      upload,
    },
  });
});

exports.getMediaByID = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const fetch = await cloudinary.search.expression(id).execute();

  res.status(200).json({
    status: 'success',
    data: fetch,
  });
});
