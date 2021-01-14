const connection = require('../db/connection');

const createCommentOnArticle = (article_id, comment) => {
    return connection('comments')
            .insert(comment)
            .where('article_id', '=', article_id)
            .returning('*')
};

const selectCommentsOnArticle = (article_id, sort_by = "created_at", order = "desc") => {
    if (order !== 'asc' && order !== 'desc') {
        return Promise.reject({status: 400, msg: 'Order must be equal to `asc` or `desc`'})
    } else {
        return connection('comments')
        .select('*')
        .where('article_id', '=', article_id)
        .orderBy(sort_by, order)
        .then((comments) => {
            if (comments.length) return [comments];
            else {               
                return Promise.all([
                    comments, 
                    connection.select('*').from('articles').where('article_id', '=', article_id)
                ])
            }
        })
        .then(([comments, articles]) => {
            if (!articles || articles.length) return comments
            else return Promise.reject({status: 404, msg: 'Article not found'})
        })
    }
}

module.exports = { createCommentOnArticle, selectCommentsOnArticle }