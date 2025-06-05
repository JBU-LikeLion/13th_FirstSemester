//app.js
const session = require('express-session')
const bcrypt = require('bcrypt');
const express = require('express')
const app = express()
const port = 3000
// path 모듈을 사용하여 파일 경로를 처리합니다.
const path = require('path');
const router = express.Router();
var mysql      = require('mysql2');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234'
});
//미들웨어
app.use(session({
    secret: 'mySecretKey123',
    resave:false,
    saveUninitialized: false
}))
// Express 애플리케이션에서 JSON 형태의 요청(request) body를 파싱(parse)하기 위해 사용되는 미들웨어
app.use(express.json())
//HTTP POST 요청의 본문(body)에 인코딩된 데이터를 해석하고, req.body 객체에 채워넣어주는 역할을 합니다.

app.use(express.static(path.join(__dirname, 'public')));
// 정적 파일 제공을 위한 미들웨어 추가


app.use(express.urlencoded({ extended: true })); // <-- 이 줄을 추가해야 합니다!


app.post('/login',(req,res)=>{


        console.log("id 확인")

    const id = req.body.id
    const pw = req.body.pw

    console.log(id)
    
		//아이디를 확인용으로 썼어요.
    connection.connect()
    //id값에 맞게 db에서 pw값을 불러오기
    connection.query(`SELECT pw FROM hanjin.id_table WHERE id = '${id}'`,(err,rows,fields)=>{
        if(err) throw err;
        //불러온 pw값은 배열과 json으로 저장되어 있기 때문에, 값만 따로 뺄게요
        const db_pw = rows[0]?.pw
        console.log(db_pw)
        //bcrypt에서 제공하는 해시와 비번 비교입니다
        //동일하면 check가 true가 되요
        const check = bcrypt.compareSync(pw,db_pw)
        if(check){
            // 로그인 성공 시 main.html로 리다이렉트
            res.redirect('/main');
            console.log('확인');
        } else {
            // 로그인 실패 시 처리
            res.status(401).send('로그인 실패');
            console.log('x');
        }
    })
    
})




// 정적 파일 제공 미들웨어를 통해 main.html 제공
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/main.html'));
});
//주소창에 '/' 접속했을 때 index.html을 띄워줍니다.
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/index.html'));
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/signup.html'));
})


 connection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err);
        process.exit(1); // 연결 실패 시 프로세스 종료
    } else {
        console.log('MySQL 연결 성공');

        
    }
});


app.post('/signup', (req, res) => {
    const id = req.body.id
    const pw = req.body.pw
    console.log(id)
    console.log(pw)
    
    //salt 값이 높을수록 암호화 연산이 증가한다.
    const salt = 5
    //pw -> 해시암호화 해서 hash에 저장
    const hash = bcrypt.hashSync(pw,salt)
    console.log(id)
    console.log(hash);

    
    connection.query(`SELECT * FROM hanjin.id_table WHERE id = '${id}';`,(err,rows,fields)=>{
        if(rows != ''){
            res.send(`<script>
                alert("중복된 아이디입니다");
                location.href="/signup.html"
                </script>`)
        }else{
            //pw를 hash로 저장
            connection.query(`INSERT INTO hanjin.id_table(id,pw) VALUE('${id}','${hash}');`,(err,rows,fields)=>{
        if(err) throw err;
        console.log(rows)
        res.send(`<script>
            alert("회원가입 성공!");
            location.href="/"
            </script>`)
    })
        }
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})