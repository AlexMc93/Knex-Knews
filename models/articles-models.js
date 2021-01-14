const connection = require('../db/connection');

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
            return Promise.reject({status: 404, msg: `Article ID ${article_id} not found`})
        }
    }) 
}

const removeArticleById = (article_id) => {
    return connection('articles')
    .where('article_id', '=', article_id)
    .del()
}

const updateArticleById = (changeVotes, article_id) => {
    if (!changeVotes) return Promise.reject({status: 400, msg: 'Bad request - please try something else!'})

    return connection('articles')
    .where('article_id', '=', article_id)
    .increment('votes', changeVotes)
    .returning('*')
    .then(([article]) => article)
}

const selectAllArticles = (sort_by = 'created_at', order = 'desc', author, topic) => {
    if (order !== 'asc' && order !== 'desc') {
        return Promise.reject({status: 400, msg: 'Order must be equal to `asc` or `desc`'})
    } else {
        return connection('articles')
    .select('articles.*')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .count('comments.comment_id AS comment_count')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .then((articles) => {
        if (articles.length) {
            return articles.map((article) => {
                article.comment_count = +article.comment_count
                return article
            });
        };
    });
    };
}

module.exports = { selectArticleById, removeArticleById, updateArticleById, selectAllArticles };