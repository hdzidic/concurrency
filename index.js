const database = require('./database');
console.log('hello world');

database.connect();

const knex = database.knex;

for (var i=0;i<50;i++) {
  insert(Math.floor(Math.random()*50+1));
}

function insert (num) {
  knex.transaction(function(trx) {
   return trx
   .raw('set transaction isolation level serializable;')
   .then(function() {
      return knex('test')
      .where({
        testnumber: num
      })
      .select('testnumber')
      .transacting(trx);
    })
    .then(function(res) {
      if (res && res.length > 0) {
        return res;
      } else {
        return knex('test').returning('testnumber').insert({testnumber: num}).transacting(trx);
      }
    })
    .then(trx.commit)
    .catch(trx.rollback)
   })
   .then(function(inserts) {
     console.log(num + ' saved or exists');
   })
   .catch(function(error) {
     console.log(num + ' failed');
   })
   .done();
}
