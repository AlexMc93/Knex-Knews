const { fetchAllTopics } = require('../models/topics-models');

const getAllTopics = (req, res, next) => {
   fetchAllTopics()
    .then((topics) => {
       res.status(200).send({ topics })
   })
    .catch(next) 
}

module.exports = { getAllTopics };