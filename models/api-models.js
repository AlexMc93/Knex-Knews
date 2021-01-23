const endpoints = require('../endpoints.json');

const readEndpointsFile = () => {
   return Promise.resolve(endpoints)
}

module.exports = { readEndpointsFile }