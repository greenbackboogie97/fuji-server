const Router = require('express').Router();
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

Router.post(
  '/:userID',
  authController.protect,
  chatController.createConversation
);

Router.get('/', authController.protect, chatController.getConversations);
Router.get('/:id/messages', authController.protect, chatController.getMessages);

module.exports = Router;
