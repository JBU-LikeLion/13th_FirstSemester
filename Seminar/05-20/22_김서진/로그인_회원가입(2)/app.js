const express = require('express')
const bcrypt = require('bcrypt') // 비밀번호 해싱
const session = require('express-session') // 세션관리
const connection = require('./mysql') //데이터베이스 연결
const path = require('path') // 파일 경로 처리

const app = express()
const port = 3000

// 미들웨어 설정
app.use(express.json())

// 세션 설정
app.use(
  session({
    secret: 'your-secret-key',
    resave: false, // 세션이 변경되도 저장 X
    saveUninitialized: false, // 초기화되지않은 세션 저장 X
    cookie: { secure: false }, // http 에서는 false로로
  })
)

// 보호 파일 직접 접근 차단 미들웨어 (main.html, pyramid.html)
app.use((req, res, next) => {
  // 정적 리소스(css, js, 이미지 등)는 차단하지 않음
  const staticExts = [
    '.css',
    '.js',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.ico',
    '.svg',
  ]
  const isStatic = staticExts.some((ext) => req.path.endsWith(ext)) // 정적파일인지 확인
  // main.html, pyramid.html 직접 접근 차단은 GET 요청에만 적용
  if (
    req.method === 'GET' &&
    !isStatic &&
    (req.path === '/main.html' || req.path === '/pyramid.html') &&
    !req.session.user // 세션이 없는 경우에만 차단
  ) {
    return res
      .status(403)
      .send('<h1>403 Forbidden</h1><p>직접 접근이 금지된 파일입니다.</p>')
  }
  next()
})

// 로그인 여부 확인 미들웨어
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    //세션에 사용자 정보가 있을경우 다음 미들웨어로 이동
    return next()
  }
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    // 클라이언트가 JSON 응답 요청을 했을 경우 로그인 해달라는 메시지 출력
    return res
      .status(401)
      .json({ error: '로그인을 해주십시오.', redirect: '/' })
  }
  return res.send(`
    <script>
      alert('로그인을 해주십시오.');
      window.location.href = '/';
    </script>
  `) // 웹페이지
}

// 루트 경로: 로그인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// index.html 경로
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// signup.html 경로
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'))
})

// POST: 회원가입 처리
app.post('/signup', async (req, res) => {
  const { iduser, userpw } = req.body
  if (!iduser || !userpw) {
    return res.status(400).json({ error: 'ID와 비밀번호를 입력하시오.' })
  }
  try {
    const hashedPassword = await bcrypt.hash(userpw, 10) //비밀번호 해싱(10=보안강도)
    const query = 'INSERT INTO user (iduser, userpw) VALUES (?, ?)'
    connection.query(query, [iduser, hashedPassword], (err, result) => {
      //쿼리에 iduser와 해싱된 비밀번호 삽입
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'ID가 중복되었습니다.' })
        }
        return res.status(500).json({ error: 'DB 오류: ' + err.message })
      }
      res.status(201).json({ message: '회원가입 완료', redirect: '/' })
    })
  } catch (err) {
    res.status(500).json({ error: '서버 오류: ' + err.message })
  }
})

// POST: 로그인 처리
app.post('/login', (req, res) => {
  const { iduser, userpw } = req.body
  if (!iduser || !userpw) {
    return res.status(400).json({ error: 'ID와 비밀번호를 입력하시오.' })
  }
  const query = 'SELECT * FROM user WHERE iduser = ?'
  connection.query(query, [iduser], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'DB 오류: ' + err.message })
    }
    if (results.length === 0) {
      return res.status(401).json({ error: '존재하지 않는 ID입니다.' })
    }
    const user = results[0]
    const match = await bcrypt.compare(userpw, user.userpw) //해싱된 비밀번호와 입력된 비밀번호 비교
    if (!match) {
      return res.status(401).json({ error: '비밀번호가 틀렸습니다.' })
    }
    req.session.user = { iduser: user.iduser, id: user.id } //로그인시 세션에 사용자 정보 저장
    res.status(200).json({ message: '로그인 성공', redirect: '/main' })
  })
})

// GET: 로그아웃 처리
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    // 세션 삭제
    if (err) {
      return res.status(500).json({ error: '로그아웃 실패' })
    }
    res.clearCookie('connect.sid') // 세션 쿠키 삭제
    res.json({ message: '로그아웃 완료', redirect: '/' })
  })
})

// DELETE: 회원탈퇴 처리
app.delete('/user', isAuthenticated, (req, res) => {
  const { iduser } = req.session.user
  const query = 'DELETE FROM user WHERE iduser = ?' //iduser로 회원탈퇴
  connection.query(query, [iduser], (err) => {
    if (err) {
      return res.status(500).json({ error: 'DB 오류: ' + err.message })
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: '세션 삭제 실패' })
      }
      res.clearCookie('connect.sid') // 세션 쿠키 삭제
      res.status(200).json({ message: '회원탈퇴 완료', redirect: '/signup' })
    })
  })
})

// 보호된 라우트
app.get('/main', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'))
})

app.get('/pyramid', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'pyramid.html'))
})

// 테마(다크/라이트) DB 저장 및 불러오기 라우트
app.get('/theme', (req, res) => {
  if (!req.session.user) return res.json({ theme: 'light' }) //기본값은 라이트모드
  const iduser = req.session.user.iduser
  connection.query(
    'SELECT theme FROM user WHERE iduser = ?', //테마값을 조회
    [iduser],
    (err, results) => {
      if (err || results.length === 0) return res.json({ theme: 'light' }) //조회 실패 또는 결과가 0일 경우 라이트모드로
      const theme = results[0].theme === 1 ? 'dark' : 'light' //theme 값이 0이면 라이트모드 1이면 다크모드로
      res.json({ theme })
    }
  )
})

// 테마 저장
app.post('/theme', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '로그인 필요' })
  const { theme } = req.body //클라이언트에서 보낸 테마값
  if (theme !== 'dark' && theme !== 'light')
    return res.status(400).json({ error: '잘못된 테마' })
  const iduser = req.session.user.iduser
  const themeValue = theme === 'dark' ? 1 : 0
  connection.query(
    'UPDATE user SET theme = ? WHERE iduser = ?', //테마값 업데이트
    // theme이 'dark'면 1, 'light'면 0으로 저장
    [themeValue, iduser],
    (err) => {
      if (err) return res.status(500).json({ error: 'DB 오류' })
      res.json({ message: '테마 저장 완료', theme })
    }
  )
})

// 정적 파일 제공 (index.html, signup.html, style.css, main.js 등)
app.use(express.static(__dirname, { index: false }))

// 404 에러 핸들링
app.use((req, res) => {
  res.status(404).json({ error: '페이지를 찾을 수 없습니다.' })
})

// 서버 시작
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
