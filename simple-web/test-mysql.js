var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'wwwurl'
});

connection.connect();
// connection.query('SELECT * FROM links LIMIT 1', function (error, results, fields) {
//   if (error) throw error;
//   // console.log('The solution is: ', results[0].detail);
//   data = results;
// });

// connection.end();

module.exports = connection;