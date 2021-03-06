const express = require('express');
const apiRouter = require('./routers/api-router');
const { welcomePage } = require('./controllers/api-controller');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const { customError, invalidPathError, PSQLnotFoundError, genericPSQLError, serverError } = require('./controllers/error-handling');

app.route('/').get(welcomePage);
app.use('/api', apiRouter);

app.all('/*', invalidPathError);

app.use(customError);
app.use(PSQLnotFoundError)
app.use(genericPSQLError);
app.use(serverError);

module.exports = app;