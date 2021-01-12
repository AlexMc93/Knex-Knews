exports.up = function (knex) {
  console.log('creating comments table...');
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('body').notNullable();
    commentsTable.integer('belongs_to').references('articles.article_id');
    commentsTable.string('author').references('users.username');
    commentsTable.integer('votes').defaultTo(0).notNullable();
    commentsTable
      .timestamp('created_at')
      .defaultTo(knex.fn.now())
      .notNullable();
  });
};

exports.down = function (knex) {
  console.log('dropping comments table...');
  return knex.schema.dropTable('comments');
};
