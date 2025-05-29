const express = require('express')
const app = express()
const port = 3000
const db = require('./mysql.js')

app.use(express.json())

//GET 요청
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/db', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) { 
      console.err('쿼리 오류:', err)
      return res.status(500).send('DB 조회 실패')
    }
    res.json(results)
  })
})

//POST 요청
app.post('/db', (req, res) => {
  const { ID, PW } = req.body

  if (!ID || !PW) {
    return res.status(400).send('ID와 PW를 모두 입력해주세요')
  }
  const sql = 'INSERT INTO user (ID, PW) VALUES (?,?)'
  db.query(sql, [ID, PW], (err, results) => {
    if (err) {
      console.error('DB 저장 오류:', err)
      return res.status(500).json({ msg: 'DB 저장 실패' })
    }
    res.json({ 'msg:': 'DB 저장 성공', insertId: results.insertId })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
