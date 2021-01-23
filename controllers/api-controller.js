const { readEndpointsFile } = require('../models/api-models');

const getAllEndpoints = (req, res, next) => {
    readEndpointsFile()
        .then((endpoints) => {
            res.status(200).send({ endpoints })
        })
        .catch(next)
}

const welcomePage = (req, res, next) => {
    res.status(200).send({msg: "Welcome! Please navigate to /api to view the available endpoints."})
}

module.exports = { getAllEndpoints, welcomePage };