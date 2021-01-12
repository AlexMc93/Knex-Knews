const articles = require('../data/test-data/articles');

exports.up = function (knex) {
  console.log('creating articles table...');
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title');
    articlesTable.string('topic').references('topics.slug');
    articlesTable.string('author').references('users.username');
    articlesTable.text('body');
    articlesTable
      .timestamp('created_at')
      .defaultTo(knex.fn.now())
      .notNullable();
  });
};

exports.down = function (knex) {
  console.log('dropping articles table...');
  return knex.schema.dropTable('articles');
};