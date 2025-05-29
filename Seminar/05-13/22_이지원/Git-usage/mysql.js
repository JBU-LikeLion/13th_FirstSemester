var mysql = require('mysql2')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'leejiwon',
})

connection.connect()

module.exports = connection
