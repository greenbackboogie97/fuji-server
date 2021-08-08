exports.uploadMedia = async (req, res) => {
  const files = await fs.readdir('../uploads');

  res.status(201).json({
    status: 'success',
    message: 'Media uploaded to server.',
    data: {
      files,
    },
  });
};
