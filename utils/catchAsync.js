const catchAsync = (fn) => (req, res, next) => {
  return fn(req, res, next).catch((err) => next(err));
};

module.exports = catchAsync;
