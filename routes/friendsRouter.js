const express = require('express');
const Router = express.Router();
const authController = require('../controllers/authController');
const friendsController = require('../controllers/friendsController');

Router.use(authController.protect)
  .route('/:id')
  .get(friendsController.getFriends)
  .patch(friendsController.addFriend)
  .delete(friendsController.unfriend);

module.exports = Router;
