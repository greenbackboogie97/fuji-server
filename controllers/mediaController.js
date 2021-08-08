const fs = require('fs');

exports.uploadMedia = async (req, res) => {
  await fs.readdir('../uploads', (err, files) => {
    res.status(201).json({
      status: 'success',
      message: 'Media uploaded to server.',
      data: {
        files,
      },
    });
  });
};
