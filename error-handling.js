const customError = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

const invalidMethodError = (req, res, next) => {
    res.status(405).send({ msg: 'Not allowed - invalid request method'})
}

module.exports = { invalidMethodError, customError };