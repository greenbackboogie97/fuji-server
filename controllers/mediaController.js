exports.uploadMedia = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Media uploaded to server.',
  });
};
