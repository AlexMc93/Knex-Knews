const { createCommentOnArticle, selectCommentsOnArticle, updateCommentById } = require('../models/comments-models');

const postCommentOnArticle = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = {author: req.body.username, body: req.body.body, article_id: article_id};

    createCommentOnArticle(newComment)
        .then(([createdComment]) => {
            res.status(201).send({comment: createdComment})
        })
        .catch(next)
}

const getCommentsOnArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by, order } = req.query;
    selectCommentsOnArticle(article_id, sort_by, order)
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch(next)
}

const patchCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateCommentById(comment_id, inc_votes)
        .then((comment) => {
            res.status(200).send({ comment })
        })
        .catch(next)
}

module.exports = { postCommentOnArticle, getCommentsOnArticle, patchCommentById }