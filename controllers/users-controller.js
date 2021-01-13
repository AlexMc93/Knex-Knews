const { fetchUserByUsername } = require('../models/users-models.js');

const getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    fetchUserByUsername(username)
        .then((user) => {
            if (!user) {
            return Promise.reject({status: 404, msg: `User ${username} not found`})
            } else {
            res.status(200).send({ user });
            }
        })
        .catch(next)
};

module.exports = { getUserByUsername };