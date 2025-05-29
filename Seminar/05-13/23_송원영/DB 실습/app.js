const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000

app.use(express.json())

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
})

connection.connect(err => {
  if (err) {
    console.error('MySQL 연결 실패:', err)
    return
  }
  console.log('MySQL 연결 성공!')
})

app.post('/register', (req, res) => {
  const { ID, PW } = req.body

  if (!ID || !PW) {
    return res.status(400).json({ message: 'ID와 PW를 모두 입력해야 합니다.' })
  }

  const sql = 'INSERT INTO users (ID, PW) VALUES (?, ?)'

  connection.query(sql, [ID, PW], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: '이미 존재하는 ID입니다.' })
      }
      console.error('DB 저장 실패:', err)
      return res.status(500).json({ message: '서버 오류' })
    }

    res.status(201).json({ message: '사용자 등록 완료', user: { ID,  PW } })
  })
})

app.get('/', (req, res) => {
  res.send('서버가 정상적으로 실행 중입니다!')
})

app.get('/db', (req, res) => {
  connection.query('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('DB 조회 실패:', err)
      return res.status(500).json({ message: '서버 오류' })
    }

    res.status(200).json(rows)
  })
})
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중`)
})
