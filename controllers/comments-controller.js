const { createCommentOnArticle, selectCommentsOnArticle, updateCommentById, removeCommentById } = require('../models/comments-models');

const postCommentOnArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body; 
    const newComment = {author: username, body, article_id};

    createCommentOnArticle(newComment)
        .then(([comment]) => res.status(201).send({ comment }))
        .catch(next)
}

const getCommentsOnArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by, order, limit, p } = req.query;
    selectCommentsOnArticle(article_id, sort_by, order, limit, p)
        .then(([comment_count, comments]) => res.status(200).send({ comment_count, comments }))
        .catch(next)
}

const patchCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateCommentById(comment_id, inc_votes)
        .then((comment) => res.status(200).send({ comment }))
        .catch(next)
}

const deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id)
        .then(() => res.sendStatus(204))
        .catch(next)
}

module.exports = { postCommentOnArticle, getCommentsOnArticle, patchCommentById, deleteCommentById }