var mysql = require('mysql2')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dlwlgns123',
  database: 'JIHUN',
})

connection.connect()

module.exports = connection
