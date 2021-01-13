const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics-controller');
const { invalidMethodError } = require('../controllers/error-handling');

topicsRouter
    .route('/')
    .get(getAllTopics)
    .all(invalidMethodError)


module.exports = topicsRouter;