//기능별로 라우터 나눔
const express = require('express') //express 모듈 불러오기
const router = express.Router() //라우터 객체 생성(라우팅만 따로 분리하여 유지 보수 쉬움)
const bcrypt = require('bcrypt') //암호화
const db = require('../db/connection') //db연결 모듈 가져오기

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ //문자@문자.문자
const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //숫자+문자, 8자 이상

router.post('/signup', async (req, res) => {
  // post /auth/signup
  const { email, password, nickname } = req.body //json 바디 추출

  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: '이메일 형식 오류' })
  }

  if (!pwRegex.test(password)) {
    return res
      .status(400)
      .json({ msg: '비밀번호는 영문자, 숫자 조합, 8자리 이상' })
  }

  try {
    //DB에 해당 이메일이 이미 존재하는 지 확인
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [
      email,
    ])
    if (users.length > 0) {
      console.log(users)
      return res.status(409).json({ msg: '이미 가입된 이메일' })
    }

    const hashed = await bcrypt.hash(password, 10) //비밀번호 해싱(saltRounds =10)

    // 새 사용자를 db에 저장
    await db.query(
      'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)',
      [email, hashed, nickname]
    )

    return res.status(201).json({ msg: '회원가입 성공' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: '서버 오류' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    //이메일 존재 여부 확인
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [
      email,
    ])
    console.log(users)

    if (users.length === 0) {
      return res.status(401).json({ msg: '이메일이 올바르지 않습니다.' })
    }

    const user = users[0] // 배열에서 유저 정보 1개만 꺼냄

    //비밀번호 비교
    const pwMatch = await bcrypt.compare(password, user.password)

    if (!pwMatch) {
      return res.status(401).json({ msg: '비밀번호가 올바르지 않습니다.' })
    }

    // 로그인 성공 후 세션에 사용자 정보 저장
    req.session.user = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    }

    //home 페이지로 이동
    return res.redirect('/home')
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: '서버 오류' })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    // 서버 세션 삭제
    if (err) {
      console.error('세션 삭제 오류:', err)
    }
    res.clearCookie('connect.sid') // 브라우저 쿠키 삭제
    res.redirect('/')
  })
})

module.exports = router
