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
  .all(authController.protect)
  .get(postsController.getComments)
  .post(postsController.addComment)
  .delete(postsController.deleteComment);

// likes
router
  .route('/:id/like')
  .all(authController.protect)
  .post(postsController.likePost)
  .delete(postsController.unlikePost);

module.exports = router;
