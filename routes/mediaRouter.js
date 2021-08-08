const express = require('express');
const Router = express.Router();
const authController = require('../controllers/authController');
const mediaController = require('../controllers/mediaController');

Router.post('/', authController.protect, mediaController.uploadMedia);

module.exports = Router;
