const express = require('express');
const Router = express.Router();
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

Router.post('/signup', authController.signup);
Router.post('/signin', authController.login);
Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);
Router.get('/cookie', authController.protect, authController.returnUser);

Router.patch(
  '/changePassword',
  authController.protect,
  usersController.changePassword
);

Router.patch('/', authController.protect, usersController.editUser);

Router.get('/', authController.protect, usersController.getAllUsers);
Router.get('/:id', authController.protect, usersController.getUser);

module.exports = Router;
