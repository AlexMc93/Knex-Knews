const { fetchUserByUsername } = require('../models/users-models.js');

const getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    fetchUserByUsername(username)
        .then((user) => {
            res.status(200).send({ user });
        })
        .catch(next)
};

module.exports = { getUserByUsername };