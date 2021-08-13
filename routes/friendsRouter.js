const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const friendsController = require('../controllers/friendsController');

router
  .route('/:id')
  .get('/:id', authController.protect, friendsController.getFriends)
  .patch('/:id', authController.protect, friendsController.addFriend)
  .delete('/:id', authController.protect, friendsController.unfriend);

module.exports = router;
