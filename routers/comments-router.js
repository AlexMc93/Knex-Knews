const commentsRouter = require('express').Router();
const { invalidMethodError } = require('../controllers/error-handling');
const { patchCommentById, deleteCommentById } = require('../controllers/comments-controller');

commentsRouter
    .route('/:comment_id')
    .patch(patchCommentById)
    .delete(deleteCommentById)
    .post(invalidMethodError)



module.exports = commentsRouter;