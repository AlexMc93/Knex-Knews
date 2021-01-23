const { fetchAllTopics, createTopic } = require('../models/topics-models');

const getAllTopics = (req, res, next) => {
    const { slug, sort_by, order } = req.query
    fetchAllTopics(slug, sort_by, order)
        .then((topics) => res.status(200).send({ topics }))
        .catch(next) 
}

const postTopic = (req, res, next) => {
    const newTopic = req.body
    createTopic(newTopic)
        .then(([topic]) => res.status(201).send({ topic }))
        .catch(next)
}

module.exports = { getAllTopics, postTopic };