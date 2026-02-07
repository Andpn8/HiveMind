const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.verifyToken, ideaController.createIdea);
router.get('/', ideaController.getAllIdeas);
router.post('/:id/upvote', authMiddleware.verifyToken, ideaController.upvoteIdea);
router.post('/:id/downvote', authMiddleware.verifyToken, ideaController.downvoteIdea);
router.post('/:id/comments', authMiddleware.verifyToken, ideaController.addComment);
router.get('/:id/comments', ideaController.getComments);
router.get('/filter/:filterType', ideaController.getFilteredIdeas);

module.exports = router;