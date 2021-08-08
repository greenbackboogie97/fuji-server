const Router = require('express').Router();
const authController = require('../controllers/authController');
const mediaController = require('../controllers/mediaController');

Router.post('/', authController.protect, mediaController.uploadMedia);
