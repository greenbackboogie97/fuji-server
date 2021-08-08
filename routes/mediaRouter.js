const Router = require('express').Router();
const authController = require('../controllers/authController');
const mediaController = require('../controllers/mediaController');
const { uploadImages } = require('../utils/multerImageUpload');

Router.post(
  '/',
  authController.protect,
  uploadImages,
  mediaController.uploadMedia
);

module.exports = Router;
