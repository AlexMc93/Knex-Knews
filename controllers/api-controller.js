const { readEndpointsFile } = require('../models/api-models');

const getAllEndpoints = (req, res, next) => {
    readEndpointsFile()
        .then((endpoints) => {
            res.status(200).send({ endpoints })
        })
        .catch(next)
}

module.exports = { getAllEndpoints };