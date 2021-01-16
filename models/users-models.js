const connection = require('../db/connection');

const fetchUserByUsername = (username) => {
    return connection('users')
        .select('*')
        .where('username', '=', username)
        .then(([user]) => {
            if (!user) {
                return Promise.reject({status: 404, msg: `User ${username} not found`})
            } else {
                return user
            }
        });
}

module.exports = { fetchUserByUsername };