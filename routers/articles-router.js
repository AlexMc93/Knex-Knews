const articlesRouter = require('express').Router();
const { getArticleById, deleteArticleById, patchArticleById, getAllArticles } = require('../controllers/articles-controller');
const { postCommentOnArticle, getCommentsOnArticle } = require('../controllers/comments-controller');
const { invalidMethodError } = require('../controllers/error-handling');

articlesRouter
    .route('/')
    .get(getAllArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .delete(deleteArticleById)
    .patch(patchArticleById)
    .post(invalidMethodError)

articlesRouter
    .route('/:article_id/comments')
    .post(postCommentOnArticle)
    .get(getCommentsOnArticle)
    .all(invalidMethodError)

module.exports = articlesRouter;