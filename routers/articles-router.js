const articlesRouter = require('express').Router();
const { getArticleById, deleteArticleById, patchArticleById, getAllArticles, postArticle } = require('../controllers/articles-controller');
const { postCommentOnArticle, getCommentsOnArticle } = require('../controllers/comments-controller');
const { invalidMethodError } = require('../controllers/error-handling');

articlesRouter
    .route('/')
    .get(getAllArticles)
    .post(postArticle)
    .all(invalidMethodError)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .delete(deleteArticleById)
    .patch(patchArticleById)
    .all(invalidMethodError)

articlesRouter
    .route('/:article_id/comments')
    .post(postCommentOnArticle)
    .get(getCommentsOnArticle)
    .all(invalidMethodError)

module.exports = articlesRouter;