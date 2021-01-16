const connection = require('../db/connection');

const fetchAllTopics = (slug) => {
    return connection('topics')
        .select('*')
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

module.exports = { fetchAllTopics }