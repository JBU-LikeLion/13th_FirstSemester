

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

// JSON 데이터 파싱을 위한 설정 추가
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'yoodain'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/db', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required!');
    }

    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        res.send('User registered successfully!');
    });
});

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/users/:username', (req, res) => {
    const { username } = req.params;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.status(404).send('User not found!');
        }

        res.json(result[0]); // JSON 형식으로 사용자 데이터 반환
    });
});

app.get('/db', (req, res) => {
    const sql = 'SELECT username, password FROM users';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        res.json(result); // JSON 형식으로 데이터 반환
    });



});


const port = 3000; // 원하는 포트 번호 설정
app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
