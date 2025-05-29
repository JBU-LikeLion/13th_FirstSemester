// server/db.js
const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
})
connection.connect(err => {
  if (err) throw err
  console.log('✅ MySQL 연결 성공!')
})
module.exports = connection
