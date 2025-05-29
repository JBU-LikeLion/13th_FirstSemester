const mysql = require('mysql2') //mysql 불러오기

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

module.exports = pool.promise() //MySQL 쿼리를 async/await 형식으로 사용
