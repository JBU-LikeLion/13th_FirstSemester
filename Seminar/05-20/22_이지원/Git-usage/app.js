require('dotenv').config()
const express = require('express') //express 불러오기
//const path = require('path')
const session = require('express-session')
const authRoutes = require('./routes/auth') //회원가입/로그인 관련
const homeRoutes = require('./routes/home') //홈페이지 라우터
//const logsRoutes = require('./routes/logs')

const app = express() //express 앱 생성

// 세션 설정 (쿠키 기반)
app.use(
  session({
    secret: process.env.SESSION_SECRET, //비밀 키
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, //1시간
    },
  })
)

//요청 바디 파싱(JSON, form 데이터)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 라우터
app.use('/auth', authRoutes)
app.use('/', homeRoutes)
//app.use('/logs', logsRoutes)

app.listen(process.env.PORT || 3000, () => {
  console.log('서버 실행 중: http://localhost:3000')
})
