const fs = require('fs/promises');

async function readEndpointsFile() {
    try {
       const endpoints = await fs.readFile('./endpoints.json', 'utf-8')
       return JSON.parse(endpoints)
    } catch (error) {
       Promise.reject(error)
    }
}

module.exports = { readEndpointsFile }