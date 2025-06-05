const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'world'
})

connection.connect()

connection.query('SELECT * FROM city LIMIT 20;', (err, rows, fields) => {

    console.log(rows)

    
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

connection.end()