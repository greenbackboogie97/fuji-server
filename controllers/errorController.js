const AppError = require('../utils/appError');

const handleJWTErrors = (err) =>
  new AppError(err.message + ', please log in again.', 401);

const handleValidationErrorsDB = (err) => new AppError(err.message, 400);

const handleDuplicateFieldsDB = (err) => {
  const keyValue = Object.entries(err.keyValue).flat();
  const message = `This ${keyValue[0]}: ${keyValue[1]}, is already in use. Please use a different one.`;
  return new AppError(message, 400);
};

const handleUnoperationalErrors = (res) =>
  res.status(500).json({
    status: 'error',
    message: 'Something went wront...',
  });

const handleProductionErrors = (err, res) => {
  console.log(err);
  if (err.operational)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  else handleUnoperationalErrors(res);
};

const handleDevelopmentErrors = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') handleDevelopmentErrors(err, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTErrors(error);
    handleProductionErrors(error, res);
  }
};
