const articlesRouter = require('express').Router();
const { getArticleById, deleteArticleById, patchArticleById } = require('../controllers/articles-controller');
const { invalidMethodError } = require('../controllers/error-handling');

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .delete(deleteArticleById)
    .patch(patchArticleById)
    .post(invalidMethodError)

module.exports = articlesRouter;