// server/app.js
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const connection = require('./db')
const app = express()
const port = 3000
const path = require('path')
const cookieParser = require('cookie-parser')


app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, '..')))

// 회원가입
app.post('/signup', async (req, res) => {
  const { ID, PW } = req.body
  if (!ID || !PW) return res.status(400).json({ message: 'ID/PW 필수' })

  try {
    const hashedPW = await bcrypt.hash(PW, 10)
    const sql = 'INSERT INTO users (ID, PW) VALUES (?, ?)'
    connection.query(sql, [ID, hashedPW], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: '이미 존재하는 ID입니다.' })
        }
        return res.status(500).json({ message: 'DB 오류' })
      }
      res.status(201).json({ message: '회원가입 완료' })
    })
  } catch (err) {
    res.status(500).json({ message: '해시 오류' })
  }
})

app.post('/login', (req, res) => {
  const { ID, PW } = req.body
  if (!ID || !PW) return res.status(400).json({ message: 'ID/PW 필수' })

  const sql = 'SELECT * FROM users WHERE ID = ?'
  connection.query(sql, [ID], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB 오류' })
    if (results.length === 0) return res.status(401).json({ message: '존재하지 않는 ID입니다.' })

    const user = results[0]
    const isMatch = await bcrypt.compare(PW, user.PW)

    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' })
    }

    // ✅ 쿠키 설정 추가
    res.cookie('user', ID, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24
    });

    res.status(200).json({ message: '로그인 성공!' })
  })
})


// 계정 삭제하기
app.delete('/delete-account', (req, res) => {
  const { ID } = req.body;
  if (!ID) return res.status(400).json({ message: 'ID 필수' });

  const sql = 'DELETE FROM users WHERE ID = ?';
  connection.query(sql, [ID], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB 오류' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '해당 ID를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '회원 탈퇴 완료' });
  });
});


app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`)
})
