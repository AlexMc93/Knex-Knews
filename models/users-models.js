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

const fetchAllUsers = (sort_by = 'username', order = 'asc', limit = 10, p = 1) => {

    if (order !== 'asc' && order !== 'desc') {
        return Promise.reject({
            status: 400, 
            msg: 'Order must be equal to `asc` or `desc`'
        })
    }

    return connection('users')
        .select('*')
        .orderBy(sort_by, order)
        .limit(limit)
        .offset(limit * (p - 1))
        .then((users) => {
            if (!users.length) {
                return Promise.reject({status: 404, msg: 'No users exist! Post one at `/api/users`'})
            } else {
                return users
            }
        })
}

const createUser = (newUser) => {
  const { username, name, avatar_url } = newUser;
  return connection('users')
    .insert([{ username, name, avatar_url }])
    .returning('*')
    .then(([user]) => user)
}

module.exports = { fetchUserByUsername, fetchAllUsers, createUser };