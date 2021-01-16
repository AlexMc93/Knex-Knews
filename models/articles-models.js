const connection = require('../db/connection');
const { fetchUserByUsername } = require('./users-models');
const { fetchAllTopics } = require('./topics-models');

const selectArticleById = (article_id) => {
    return connection('articles')
    .select('articles.*')
    .where('articles.article_id', '=', article_id)
    .count('comments AS comment_count')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')    
    .groupBy('articles.article_id')
    .then(([article]) => {
        if (article) {
            article.comment_count = +article.comment_count
            return article;
        } else {
            return Promise.reject({
                status: 404, 
                msg: `Article ID ${article_id} not found`
            })
        }
    }) 
}

const removeArticleById = (article_id) => {
    return connection('articles')
    .where('article_id', '=', article_id)
    .del()
    .then((deleteCount) => {
        if (!deleteCount) {
            return Promise.reject({status: 404, msg: `Article ID ${article_id} not found`})
        }
    })
}

const updateArticleById = (changeVotes = 0, article_id) => {
    return connection('articles')
    .where('article_id', '=', article_id)
    .increment('votes', changeVotes)
    .returning('*')
    .then(([article]) => {
        if (!article) {
            return Promise.reject({status: 404, msg: `Article ID ${article_id} not found`})
        } else {
            return article
        }
    })
}

const selectAllArticles = (sort_by = 'created_at', order = 'desc', author, topic) => {

    if (order !== 'asc' && order !== 'desc') {
        return Promise.reject({
            status: 400, 
            msg: 'Order must be equal to `asc` or `desc`'
        })
    }

    let userQuery = undefined;
    let topicQuery = undefined;

    if (author) userQuery = fetchUserByUsername(author);
    if (topic) topicQuery = fetchAllTopics(topic);

    const articleQuery = connection('articles')
    .select('articles.*')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .count('comments.comment_id AS comment_count')
    .modify((query) => {
        if (author) query.where('articles.author', '=', author)
        if (topic) query.where('articles.topic', '=', topic)
    })
    .groupBy('articles.article_id')
    .orderBy(sort_by, order);

    return Promise.all([userQuery, topicQuery, articleQuery])
    .then(([userExists, topicExists, articles]) => {
        if (articles.length) {
            return articles.map((article) => {
                article.comment_count = +article.comment_count
                return article
            })
        } else {
            return articles
        }
    })
}

const insertArticle = (newArticle) => {
    return connection('articles')
    .insert(newArticle)
    .returning('*')
}

module.exports = { selectArticleById, removeArticleById, updateArticleById, selectAllArticles, insertArticle };