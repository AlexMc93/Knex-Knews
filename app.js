const express = require('express');
const app = express();
const usersRouter = require('./routers/users-router');
const topicsRouter = require('./routers/topics-router');
const commentsRouter = require('./routers/comments-router');
const articlesRouter = require('./routers/articles-router');
const { customError, invalidPathError } = require('./controllers/error-handling');
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/articles', articlesRouter);

app.all('/*', invalidPathError);

app.use(customError);


app.use((err, req, res, next) => {
    console.log(err)
    res.status(400).send({msg: err.message.split(" - ")[1]})
})

module.exports = app;