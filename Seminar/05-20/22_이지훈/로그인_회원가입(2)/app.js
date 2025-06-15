const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dlwlgns123', // MySQL 비밀번호로 변경
    database: 'JIHUN'
});

db.connect(err => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        throw err;
    }
    console.log('MySQL Connected to JIHUN database...');
});

// 세션 저장소 설정
const sessionStore = new MySQLStore({
    host: 'localhost',
    user: 'root',
    password: 'dlwlgns123', // MySQL 비밀번호로 변경
    database: 'JIHUN',
    createDatabaseTable: true
});

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key', // 보안 키로 변경
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7일 유지
}));

// 로그인 여부 확인 미들웨어
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ error: '로그인이 필요합니다.', redirect: '/login.html' });
};

// 라우팅
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password, rememberMe } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
    }

    try {
        const [rows] = await db.promise().query('SELECT * FROM USER WHERE ID = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).json({ error: '존재하지 않는 회원입니다.' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.PW);
        if (!match) {
            return res.status(400).json({ error: '비밀번호가 틀렸습니다.' });
        }

        // 세션 저장
        req.session.userId = user.ID;
        req.session.username = user.ID;

        // 로그인 유지 체크
        if (rememberMe) {
            req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7일
        } else {
            req.session.cookie.expires = false; // 브라우저 종료 시 세션 만료
        }

        res.json({ message: '로그인 성공!', redirect: '/login_success.html' });
    } catch (err) {
        console.error('로그인 오류:', err);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign_up.html'));
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
    }

    try {
        const [rows] = await db.promise().query('SELECT * FROM USER WHERE ID = ?', [username]);
        if (rows.length > 0) {
            return res.status(400).json({ error: '이미 존재하는 회원입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query('INSERT INTO USER (ID, PW) VALUES (?, ?)', [username, hashedPassword]);

        res.json({ message: '회원가입 성공!', redirect: '/login.html' });
    } catch (err) {
        console.error('회원가입 오류:', err);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

app.post('/delete', isAuthenticated, async (req, res) => {
    try {
        await db.promise().query('DELETE FROM USER WHERE ID = ?', [req.session.userId]);
        req.session.destroy();
        res.json({ message: '회원탈퇴 성공!', redirect: '/signup.html' });
    } catch (err) {
        console.error('회원탈퇴 오류:', err);
        res.status(500).json({ error: '회원탈퇴 중 오류가 발생했습니다.' });
    }
});

app.get('/login_success.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login_success.html'));
});

app.get('/Pyramid.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Pyramid.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: '로그아웃 성공!', redirect: '/login.html' });
});

app.get('/user', (req, res) => {
    if (req.session.userId) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ error: '로그인되지 않음' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
