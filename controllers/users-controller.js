const { fetchUserByUsername, fetchAllUsers, createUser } = require('../models/users-models.js');

const getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    fetchUserByUsername(username)
        .then((user) => res.status(200).send({ user }))
        .catch(next)
}

const getAllUsers = (req, res, next) => {
    const { sort_by, order, limit, p } = req.query;
    fetchAllUsers(sort_by, order, limit, p)
        .then(([user_count, users]) => res.status(200).send({ user_count, users }))
        .catch(next)
}

const postUser = (req, res, next) => {
    const newUser = req.body;
    createUser(newUser)
        .then((user) => res.status(201).send({ user }))
        .catch(next)
}

module.exports = { getUserByUsername, getAllUsers, postUser };