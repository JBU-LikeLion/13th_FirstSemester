const mysql = require('mysql2'); 
const express = require('express'); 
const bcrypt = require('bcrypt'); // 암호화
const path = require('path'); // 경로 처리 유틸
const session = require('express-session'); // 세션 관리
const app = express(); // Express 앱 생성
const port = 3000; 

// 세션 설정: 로그인 상태 유지 (브라우저 종료 또는 만료 시 해제)
app.use(session({
  secret: 'my-secret-key', // 세션 암호화 키
  resave: false, // 매 요청마다 세션 저장 X
  saveUninitialized: false, // 초기화되지 않은 세션 저장 X
  cookie: { maxAge: 1000 * 60 * 30 } // 쿠키 유효시간: 30분
}));

// JSON, URL 인코딩된 요청 본문 파싱 + 정적 파일 제공
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // form 데이터 파싱
app.use(express.static(path.join(__dirname, 'front'))); // front 폴더 정적 제공

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'kimjunghyun'
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'home.html'));
});

// 회원가입 요청 처리
app.post('/signup', async (req, res) => {
  const { id, pw, name } = req.body; // 요청에서 값 추출
  if (!id || !pw || !name) return res.status(400).send('모든 필드를 입력하세요.');
  try {
    const hash = await bcrypt.hash(pw, 10); // 비밀번호 암호화
    const sql = 'INSERT INTO user (UserID, UserPW, UserName) VALUES (?, ?, ?)';
    connection.query(sql, [id, hash, name], (err) => { // DB에 저장
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).send('이미 존재하는 아이디입니다.');
        return res.status(500).send('DB 오류');
      }
      res.send('회원가입 성공!');
    });
  } catch (e) {
    res.status(500).send('서버 오류');
  }
});

// 로그인 요청 처리
app.post('/login', (req, res) => {
  const { id, pw } = req.body;
  if (!id || !pw) return res.status(400).send('아이디와 비밀번호를 입력하세요.');

  const sql = 'SELECT * FROM user WHERE UserID = ?';
  connection.query(sql, [id], async (err, results) => {
    if (err) return res.status(500).send('DB 오류');
    if (results.length === 0) return res.status(401).send('존재하지 않는 아이디입니다.');

    const user = results[0];
    const isMatch = await bcrypt.compare(pw, user.UserPW); // 비밀번호 비교
    if (!isMatch) return res.status(401).send('비밀번호가 일치하지 않습니다.');

    req.session.user = { id: user.UserID, name: user.UserName }; // 세션에 로그인 정보 저장
    res.send('로그인 성공!');
  });
});

// 현재 로그인된 사용자 정보 반환
app.get('/me', (req, res) => {
  if (req.session.user) res.json(req.session.user); // 로그인 중이면 정보 반환
  else res.status(401).send('로그인 필요'); // 아니면 오류
});

// 로그아웃 처리
app.post('/logout', (req, res) => {
  req.session.destroy(() => { // 세션 삭제
    res.clearCookie('connect.sid'); // 쿠키도 제거
    res.send('로그아웃 되었습니다.');
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
