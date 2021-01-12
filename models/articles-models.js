const connection = require('../db/connection');

const fetchArticleById = (article_id) => {
    return connection('articles')
        .select('articles.*')
        .where('articles.article_id', '=', article_id)
        .count('comments as comment_count')
        .join('comments', 'comments.article_id', '=', 'articles.article_id')    
        .groupBy('articles.article_id')
        .then((article) => {
            return article[0]
        }) 
}

module.exports = { fetchArticleById };