const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12341234",
  database: "minhyeong",
});

conn.connect((err) => {
  if (err) console.error("MySQL connect error:", err);
  else console.log("MySQL connected");
});

module.exports = conn;
