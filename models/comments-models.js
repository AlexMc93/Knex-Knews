const connection = require('../db/connection');

const createCommentOnArticle = (comment) => {
    return connection('comments')
            .insert(comment)
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

const updateCommentById = (comment_id, inc_votes = 0) => {

    return connection('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => {
        if (!comment) {
            return Promise.reject({
                status: 404,
                msg: 'Comment not found'
            })
        }
        return comment
    });
}

const removeCommentById = (comment_id) => {
    return connection('comments')
    .where('comment_id', '=', comment_id)
    .del()
    .then((deleteCount) => {
        if (deleteCount) return;
        else return Promise.reject({
            status: 404,
            msg: 'Comment not found'
        });
    });
}

module.exports = { createCommentOnArticle, selectCommentsOnArticle, updateCommentById, removeCommentById }