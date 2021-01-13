const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users-controller.js');
const { invalidMethodError } = require('../controllers/error-handling');

usersRouter
    .route('/:username')
    .get(getUserByUsername)
    .all(invalidMethodError)


module.exports = usersRouter;