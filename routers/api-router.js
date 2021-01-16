const usersRouter = require('./users-router');
const topicsRouter = require('./topics-router');
const commentsRouter = require('./comments-router');
const articlesRouter = require('./articles-router');
const { getAllEndpoints } = require('../controllers/api-controller');
const { invalidMethodError } = require('../controllers/error-handling');
const apiRouter = require('express').Router();

apiRouter.route('/').get(getAllEndpoints).all(invalidMethodError);

apiRouter.use('/users', usersRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;