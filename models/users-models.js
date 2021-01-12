const connection = require('../db/connection');

const fetchUserByUsername = (username) => {
    return connection('users')
        .select('*')
        .where('username', '=', username)
}

module.exports = { fetchUserByUsername };