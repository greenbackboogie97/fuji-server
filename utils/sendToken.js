const jwt = require('jsonwebtoken');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sendToken = (user, status, message, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    Expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'none',
    domain: 'omerziger.com',
  };

  res.cookie('jwt', token, cookieOptions);

  res.head;

  user.password = undefined;
  user.passwordChangedAt = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;

  res.status(status).json({
    status: 'success',
    message,
    data: {
      user,
      token,
    },
  });
};

module.exports = sendToken;
