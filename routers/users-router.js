const usersRouter = require('express').Router();
const { getUserByUsername, getAllUsers, postUser } = require('../controllers/users-controller.js');
const { invalidMethodError } = require('../controllers/error-handling');

usersRouter
    .route('/')
    .get(getAllUsers)
    .post(postUser)

usersRouter
    .route('/:username')
    .get(getUserByUsername)
    .all(invalidMethodError)


module.exports = usersRouter;