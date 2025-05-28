const express = require('express');
const db = require('./mysql'); //mysql.js에서 DB 연결 불러오기
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('김정현의 멋사 과제!');
});

app.get('/db', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('조회 오류:', err);
      return res.status(500).send('DB 조회 실패');
    }
    res.json(results);
  });
});

//user 테이블에 UserID, UserPW, UserName 저장
app.post('/db', (req, res) => {
  const { UserID, UserPW, UserName } = req.body;

  if (!UserID || !UserPW || !UserName) {
    return res.status(400).send('UserID, UserPW, UserName 모두 입력해주세요');
  }

  const sql = 'INSERT INTO user (UserID, UserPW, UserName) VALUES (?, ?, ?)';
  db.query(sql, [UserID, UserPW, UserName], (err, result) => {
    if (err) {
      console.error('DB 저장 오류:', err);
      return res.status(500).json({ msg: 'DB 저장 실패' });
    }
    res.json({ msg: 'DB 저장 성공', insertId: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
