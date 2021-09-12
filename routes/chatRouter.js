const Router = require('express').Router();
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

Router.use(authController.protect);

Router.post('/:userID', chatController.createConversation);
Router.get('/', chatController.getConversations);
Router.get('/:id', chatController.getConversation);
Router.post('/:id/messages', chatController.sendMessage);

module.exports = Router;
