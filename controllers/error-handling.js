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
    if (err.code) {
        console.log(err.message, err.code)
        res.status(400).send({msg: 'Bad request - please try something else!'})
    } else {
        next(err)
    }
}

const serverError = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: 'Sorry - server error!'})
}

const invalidMethodError = (req, res, next) => {
    res.status(405).send({ msg: 'Not allowed - invalid request method'})
}

module.exports = { invalidMethodError, customError, invalidPathError, PSQLError, serverError };