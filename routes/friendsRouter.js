const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const friendsController = require('../controllers/friendsController');

router
  .route('/:id')
  .get(authController.protect, friendsController.getFriends)
  .patch(authController.protect, friendsController.addFriend)
  .delete(authController.protect, friendsController.unfriend);

module.exports = router;
