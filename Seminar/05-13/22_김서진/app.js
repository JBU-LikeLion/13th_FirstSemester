const express = require('express')
const connection = require('./mysql')
const app = express()
const port = 3000

app.use(express.json()) // JSON 파싱

// POST
app.post('/db', (req, res) => {
  const { iduser, userpw } = req.body

  if (!iduser || !userpw) {
    return res.status(400).json({ error: 'ID와 비밀번호를 입력하시오.' })
  }

  const query = 'INSERT INTO user (iduser, userpw) VALUES (?, ?)' //user table 에 데이터 삽입
  connection.query(query, [iduser, userpw], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // ER_DUP_ENTRY = 중복값 삽입시 발생하는 오류 코드
        return res.status(400).json({ error: 'ID가 중복되었습니다.' }) // 400 = bad request
      }
      return res.status(500).json({ error: 'DB 오류: ' + err.message }) // 500 = internet server error
    }
    res.status(201).json({
      // 201 = create
      message: '사용자 정보 입력 완료',
      userid: results.insertId,
      iduser,
      userpw,
    })
  })
})

// GET
app.get('/db', (req, res) => {
  const query = 'SELECT * FROM user'
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'DB 오류: ' + err.message })
    }
    res.status(200).json(results) // 200 = OK
  })
})

// 서버 시작
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
