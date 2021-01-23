const connection = require('../db/connection');

const fetchAllTopics = (slug, sort_by = 'slug', order = 'asc') => {

    if (order !== 'asc' && order !== 'desc') {
        return Promise.reject({
            status: 400, 
            msg: 'Order must be equal to `asc` or `desc`'
        })
    }

    return connection('topics')
        .select('*')
        .orderBy(sort_by, order)
        .modify((query) => {
            if (slug) query.where('slug', '=', slug)
        })
        .then((topics) => {
            if (!topics.length) {
                return Promise.reject({status: 404, msg: `Topic ${slug} not found`})
            } else {
                return topics
            }
        })
};

const createTopic = (newTopic) => {
    const { slug, description } = newTopic;
    return connection('topics')
        .insert([{ slug, description }])
        .returning('*')
}

module.exports = { fetchAllTopics, createTopic }