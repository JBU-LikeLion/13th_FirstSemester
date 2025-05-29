const express = require('express')
const app = express()
const port = 3000

const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'kimseojin',
})

connection.connect()

module.exports = connection
