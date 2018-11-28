var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_premere',
  password        : '9110',
  database        : 'cs340_premere'
});
module.exports.pool = pool;
