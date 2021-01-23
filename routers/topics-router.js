const topicsRouter = require('express').Router();
const { getAllTopics, postTopic } = require('../controllers/topics-controller');
const { invalidMethodError } = require('../controllers/error-handling');

topicsRouter
    .route('/')
    .get(getAllTopics)
    .post(postTopic)
    .all(invalidMethodError)


module.exports = topicsRouter;