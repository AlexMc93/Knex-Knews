const { selectArticleById, removeArticleById, updateArticleById, selectAllArticles, insertArticle } = require('../models/articles-models');

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => res.status(200).send({ article }))
        .catch(next)
}

const deleteArticleById = (req, res, next) => {
    const { article_id } = req.params;
    removeArticleById(article_id)
        .then(() => res.sendStatus(204))
        .catch(next)
}

const patchArticleById = (req, res, next) => {
    const { inc_votes } = req.body;
    const { article_id } = req.params;
    updateArticleById(inc_votes, article_id)
        .then((article) => res.status(200).send({ article }))
        .catch(next)
}

const getAllArticles = (req, res, next) => {
    const { sort_by, order, author, topic, limit, p } = req.query;
    selectAllArticles(sort_by, order, author, topic, limit, p)
        .then((articles) => res.status(200).send({ articles }))
        .catch(next)
}

const postArticle = (req, res, next) => {
    const { title, topic, author, body } = req.body;
    const newArticle = { title, topic, author, body };
    insertArticle(newArticle)
        .then(([article]) => res.status(201).send({ article }))
        .catch(next)
}

module.exports = { getArticleById, deleteArticleById, patchArticleById, getAllArticles, postArticle }