const Router = require('express').Router();
const authController = require('../controllers/authController');
const mediaController = require('../controllers/mediaController');

Router.route('/:id')
  .all(authController.protect)
  .post(mediaController.uploadMedia);

module.exports = Router;
