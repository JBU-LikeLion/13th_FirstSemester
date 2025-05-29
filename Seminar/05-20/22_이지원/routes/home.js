const express = require('express')
const path = require('path') //파일 경로
const router = express.Router()

// 첫 페이지 → HTML 파일로 분리
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// 홈 접근
router.get('/home', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/')
  }

  res.sendFile(path.join(__dirname, '../public/home.html'))
})

// 피라미드 페이지
router.get('/pyramid', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/')
  }
  res.sendFile(path.join(__dirname, '../public/pyramid.html'))
})

module.exports = router
