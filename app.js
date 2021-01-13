const express = require('express');
const app = express();
const usersRouter = require('./routers/users-router');
const topicsRouter = require('./routers/topics-router');
const commentsRouter = require('./routers/comments-router');
const articlesRouter = require('./routers/articles-router');
const { customError, invalidPathError, PSQLError, serverError } = require('./controllers/error-handling');
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/articles', articlesRouter);

app.all('/*', invalidPathError);

app.use(customError);
app.use(PSQLError);
app.use(serverError);

module.exports = app;