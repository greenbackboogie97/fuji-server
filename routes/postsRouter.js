const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');

// posts
router.get('/:feed', authController.protect, postsController.getPosts);
router.post('/', authController.protect, postsController.createPost);
router.delete('/:id', authController.protect, postsController.deletePost);

// comments
router
  .route('/:id/comment')
  .get(authController.protect, postsController.getComments)
  .post(authController.protect, postsController.addComment)
  .delete(authController.protect, postsController.deleteComment);

// likes
router
  .route('/:id/like')
  .post(authController.protect, postsController.likePost)
  .delete(authController.protect, postsController.unlikePost);

module.exports = router;
