const catchAsync = require('../utils/catchAsync');

exports.uploadMedia = catchAsync(async (req, res, next) => {
  const file = req.body.data;
  res.status(200).json({
    status: 'success',
    data: {
      file,
    },
  });
});
