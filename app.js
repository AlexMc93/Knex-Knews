const express = require('express');
const apiRouter = require('./routers/api-router');
const app = express();
app.use(express.json());

const { customError, invalidPathError, PSQLnotFoundError, genericPSQLError, serverError } = require('./controllers/error-handling');

app.use('/api', apiRouter)

app.all('/*', invalidPathError);

app.use(customError);
app.use(PSQLnotFoundError)
app.use(genericPSQLError);
app.use(serverError);

module.exports = app;