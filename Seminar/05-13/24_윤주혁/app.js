const express = require('express')
const app = express()
const port = 3000

// Express 애플리케이션에서 JSON 형태의 요청(request) body를 파싱(parse)하기 위해 사용되는 미들웨어
app.use(express.json())
//HTTP POST 요청의 본문(body)에 인코딩된 데이터를 해석하고, req.body 객체에 채워넣어주는 역할을 합니다.
app.use(express.urlencoded({extended:false}))


var mysql      = require('mysql2');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '1234',
        database : 'juhyeok'
    });


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/sign_up.html',(req,res)=>{
    res.sendFile(__dirname+'/sign_up.html')
})


//회원가입 
app.post('/sign_up',(req,res)=>{
    console.log(req.body)

    const id = req.body.id
    const pw = req.body.pw
    connection.connect();
    connection.query(`INSERT INTO juhyeok.id_table(id,pw) VALUE('${id}', '${pw}');`,
        function(err,rows,fields){
            if(err) throw err;
            console.log(rows)
        }
    )
    res.send(`
        <script>
        alert('회원가입 완료!');
        location.href='/';
        </script>
        `)
})


//login하기
app.post('/login',(req,res)=>{
    //post로 요청된 body의 name에 있는 값을 받아옴옴
    const id = req.body.id
    const pw = req.body.pw
    let f_id
    connection.connect();
    connection.query(`SELECT id FROM juhyeok.id_table where id='${id}';`, function(err, rows, fields){
        if(err) throw err;
        if(rows != ''){
            console.log("아이디 확인"+rows)
            connection.query(`SELECT pw FROM juhyeok.id_table where pw='${pw}';`, function(err, row, fields){
            if(err) throw err;
            if(row != ''){
                console.log("비번 확인"+row)
                res.send(`<script>alert("로그인 성공!");
                location.href="/login.html";
                localStorage.setItem('id','${id}')
                </script>`)
                
            }else{
                console.log("비번x")
                res.send(`<script>alert("비번 아님");
                location.href="/";
                </script>`)
                
            }
    });
        }else{
            console.log("아이디x")
            res.send(`<script>alert("아이디 아님");
                location.href="/";
                </script>`)
        }
    });
})
//login 성공 후 페이지
app.get('/login.html',(req,res)=>{
    res.sendFile(__dirname+'/login.html')
})



app.post('/db',(req,res)=>{
    connection.connect();
    const id = req.body.id
    const pw = req.body.pw
    connection.query(`INSERT INTO juhyeok.id_table(id,pw) VALUE('${id}', '${pw}');`,function(err,rows,fields){
        res.send("저장완료")
    })
    // connection.query(`SELECT * FROM juhyeok.id_table;`,
    //     function(err,rows,fields){
    //         if(err) throw err;
    //         console.log(rows)
    //         res.json(rows)
    //     })
    
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})