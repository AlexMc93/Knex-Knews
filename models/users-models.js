const connection = require('../db/connection');

const fetchUserByUsername = (username) => {
    return connection('users')
        .select('*')
        .where('username', '=', username)
        .then(([user]) => user)
}

module.exports = { fetchUserByUsername };