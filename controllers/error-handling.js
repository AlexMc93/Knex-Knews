const invalidPathError = (req, res, next) => {
    next({status: 404, msg: 'Route not found'})
}

const customError = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

const PSQLError = (err, req, res, next) => {
    if (err.code === '23503') {
        if (err.detail.endsWith('"articles".')) {
            res.status(404).send({msg: 'Article not found'})
        } else if (err.detail.endsWith('"users".')) {
            res.status(404).send({msg: 'User not found'})
        } else if (err.detail.endsWith('"topics".')) {
            res.status(404).send({msg: 'Topic not found'})
        }
    } else if (err.code) {
        res.status(400).send({msg: 'Bad request - please try something else!'})
    } else {
        next(err)
    }
}

const serverError = (err, req, res, next) => {
    res.status(500).send({msg: 'Sorry - server error!'})
}

const invalidMethodError = (req, res, next) => {
    res.status(405).send({ msg: 'Not allowed - invalid request method'})
}

module.exports = { invalidMethodError, customError, invalidPathError, PSQLError, serverError };