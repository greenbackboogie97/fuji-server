const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const friendsController = require('../controllers/friendsController');

router.patch(
  '/:id',
  //  authController.protect,
  friendsController.addFriend
);
router.delete(
  '/:id',
  //  authController.protect,
  friendsController.unfriend
);

module.exports = router;
