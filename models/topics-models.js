const connection = require('../db/connection');

const fetchAllTopics = () => {
    return connection('topics')
        .select('*')
        .then()
}

module.exports = { fetchAllTopics }