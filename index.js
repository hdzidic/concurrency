const database = require('./database');
console.log('hello world');
var Q = require('q');

database.connect();

const knex = database.knex;
var promises = [];
var failed=0;
var success=0;

for (var i=0;i<50;i++) {
  promises.push(insert(Math.floor(Math.random()*50+1)));
}
Q.allSettled(promises)
.then(function (results) {
    results.forEach(function (result) {
        if (result.state === "fulfilled") {
          success++;
        } else {
          failed++;
        }
    });
    console.log(`${success} jobs passed and ${failed} failed`);
    process.exit();    
})

function insert (num) {
  return knex.transaction(function(trx) {
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
  });
}
/*
   .then(function(inserts) {
     console.log(num + ' saved or exists');
   })
   .catch(function(error) {
     console.log(num + ' failed');
   })
   .done();
}
*/
