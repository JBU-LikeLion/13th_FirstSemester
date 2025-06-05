const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // 본인 비밀번호
    database: 'hanjin'
});

db.connect((err) => {
    if (err) console.error('DB connection failed:', err);
    else console.log('Connected to DB');
});

app.post('/db', (req, res) => {
    const { id, pw } = req.body;
    const query = 'INSERT INTO USER (id, pw) VALUES (?, ?)';
    db.query(query, [id, pw], (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).send('Error inserting data');
        }
        res.status(200).send('User added successfully');
    });
});

app.get('/db', (req, res) => {
    const query = 'SELECT * FROM USER';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).send('Error retrieving data');
        }
        res.json(results);
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));