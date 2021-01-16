const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');
const { changeTimeFormat, createLookup, formatComments } = require('../utils/data-manipulation');

exports.seed = (knex) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([
        knex.insert(topicData).into('topics'),
        knex.insert(userData).into('users')
      ]) 
    })
    .then(() => {
      const formattedArticles = changeTimeFormat(articleData)
      return knex
      .insert(formattedArticles)
      .into('articles')
      .returning('*')
    })
    .then((articleRows) => {
      const articleLookup = createLookup(articleRows, 'title', 'article_id');
      const timeComments = changeTimeFormat(commentData);
      const formattedComments = formatComments(timeComments, articleLookup);
      return knex
      .insert(formattedComments)
      .into('comments')
    });
};
