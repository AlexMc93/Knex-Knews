const { selectArticleById, removeArticleById, updateArticleById, selectAllArticles } = require('../models/articles-models');

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            if (!article) {
            return Promise.reject({status: 404, msg: `Article ID ${article_id} not found`})
            } else {
            res.status(200).send({ article })
            }
        })
        .catch(next)
}

const deleteArticleById = (req, res, next) => {
    const { article_id } = req.params;
    removeArticleById(article_id)
        .then((deleteCount) => {
            if (deleteCount) {
                res.sendStatus(204)
            } else {
                return Promise.reject({status: 404, msg: `Article ID ${article_id} not found`})
            }
        })
        .catch(next)
}

const patchArticleById = (req, res, next) => {
    const changeVotes = req.body.inc_votes;
    const { article_id } = req.params;
    updateArticleById(changeVotes, article_id)
        .then((article) => {
            if (!article) {
            return Promise.reject({status: 404, msg: `Article ID ${article_id} not found`})
            } else {
            res.status(200).send({ article })
            }
        })
        .catch(next)
}

const getAllArticles = (req, res, next) => {
    const { sort_by, order, author, topic } = req.query;
    selectAllArticles(sort_by, order, author, topic)
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch(next)
}

module.exports = { getArticleById, deleteArticleById, patchArticleById, getAllArticles }