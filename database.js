var bs = require('bookshelf');
var knex = require('knex');
var bookshelf, knexConnection;
var pg = require('pg');

module.exports.connect = function() {
  knexConnection = knex({
    client: 'pg',
    connection: 'http://localhost:5432/concurrency'
  });
  bookshelf = bs(knexConnection);

  console.log('Knex/Bookshelf connected to DB');

  module.exports.bookshelf = bookshelf;
  module.exports.knex = knexConnection;
}
