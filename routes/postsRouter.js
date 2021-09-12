const express = require('express');
const Router = express.Router();
const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');

Router.use(authController.protect);

// posts
Router.get('/:feed', postsController.getPosts);
Router.post('/', postsController.createPost);
Router.delete('/:id', postsController.deletePost);

// comments
Router.route('/:id/comment')
  .get(postsController.getComments)
  .post(postsController.addComment)
  .delete(postsController.deleteComment);

// likes
Router.route('/:id/like')
  .post(postsController.likePost)
  .delete(postsController.unlikePost);

module.exports = Router;
