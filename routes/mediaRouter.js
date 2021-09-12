const express = require('express');
const Router = express.Router();
const authController = require('../controllers/authController');
const mediaController = require('../controllers/mediaController');

Router.use(authController.protect);
Router.post('/', mediaController.uploadMedia);
Router.get('/:id', mediaController.getMediaByID);

module.exports = Router;
