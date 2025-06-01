const express = require('express')
const app = express()
const port = 3000
const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');

const session = require('express-session')

//get요청이 오면 uri변수들이 파싱되어 req.cookies 객체에 저장된다
app.use(cookieParser())

// Express 애플리케이션에서 JSON 형태의 요청(request) body를 파싱(parse)하기 위해 사용되는 미들웨어
app.use(express.json())
//HTTP POST 요청의 본문(body)에 인코딩된 데이터를 해석하고, req.body 객체에 채워넣어주는 역할을 합니다.
app.use(express.urlencoded({extended:true}))


app.use(session({
     // [필수] SID를 생성할 때 사용되는 비밀키로 String or Array 사용 가능
    secret: 'mySecretKey123',
    // true(default): 변경 사항이 없어도 세션을 다시 저장, false: 변경시에만 다시 저장
    resave:false, 
    // true: 어떠한 데이터도 추가되거나 변경되지 않은 세션 설정 허용, false: 비허용
    saveUninitialized: true
}))



var mysql      = require('mysql2');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234'
});


app.get('/', (req, res) => {
    res.sendFile(__dirname+'/page/index.html')
})

app.get('/main',(req,res)=>{
    //브라우저에서 쿠키값 불러오기
    const cook = req.cookies.user
    console.log(cook)
    //sessionID 불러오기
    const sess = req.sessionID
    console.log(sess)
    if(cook == sess){
        //쿠키값이랑 sessionID랑 일치하면 페이지 띄워주기
        console.log(cook)
        console.log(sess)
        console.log("-일치-")
        res.sendFile(__dirname+'/page/main.html')
    }else{
        console.log("불일치")
        res.send(`<script>
            alert('로그인하고 오세요');
            location.href='/'
            </script>`)
    }
    console.log("--------")
    
})

app.get('/sign_up',(req,res)=>{
    res.sendFile(__dirname+'/page/sign_up.html')
})


app.post('/sign_up', (req, res) => {
    const id = req.body.id
    const pw = req.body.pw

    console.log(id)
    console.log(pw)
    
    //salt 값이 높을수록 암호화 연산이 증가한다
    const salt = 5
    const hash = bcrypt.hashSync(pw,salt)
    console.log(id)
    console.log(hash);

    connection.connect()
    connection.query(`SELECT * FROM hyeok.id_table WHERE id = '${id}';`,(err,rows,fields)=>{
        if(rows != ''){
            res.send(`<script>
                alert("중복된 아이디입니다");
                location.href="/sign_up"
                </script>`)
        }else{
            connection.query(`INSERT INTO hyeok.id_table(id,pw) VALUE('${id}','${hash}');`,(err,rows,fields)=>{
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


app.post('/login',(req,res)=>{
    const id = req.body.id
    const pw = req.body.pw
    

    connection.connect()
    connection.query(`SELECT pw FROM hyeok.id_table WHERE id = '${id}'`,(err,rows,fields)=>{
        if(err) throw err;
        const db_pw = rows[0].pw
        console.log(db_pw)
        const check = bcrypt.compareSync(pw,db_pw)
        if(check){
            console.log('확인')
            // 세션에 id추가
            req.session.user=id;
            console.log(req.session.cookie)
            console.log(req.sessionID)
            const sess = req.sessionID
            // sessionID를 쿠키값으로 추가
            res.cookie('user',sess)
    
            res.send(`<script>
                alert('로그인 성공!');
                location.href='/main';
                </script>`)
        }else{
            console.log('x')
            res.send(`<script>
                alert('로그인 실패!');
                location.href='/';
                </script>`)
        }
    })
})


app.post('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.clearCookie('user')
        res.redirect('/')
    })
})

app.get('/content',(req,res)=>{
    const cook = req.cookies.user
    const sess = req.sessionID
    if(cook == sess){
        console.log(cook)
        console.log(sess)
        console.log("-일치-")
        res.sendFile(__dirname+'/page/content.html')
    }else{
        console.log("불일치")
        res.send(`<script>
            alert('로그인하고 오세요');
            location.href='/'
            </script>`)
    }
    console.log("--------")


})

app.post('/write',(req,res)=>{

    const cook = req.cookies.user
    const sess = req.sessionID
    if(cook == sess){
        console.log(cook)
        console.log(sess)
        console.log("-일치-")
        const content = req.body.content
        const writer = req.session.user
        const title = req.body.title

        connection.connect()
        connection.query(`INSERT INTO hyeok.content(title, writer, content) VALUE('${title}','${writer}','${content}');`,(err,rows,fields)=>{
            if(err) throw err;
            console.log('등록 완료')
            res.send(`<script>
                alert('등록 완료')
                location.href='/main'
                </script>`)
        })
    }else{
        console.log("불일치")
        res.send(`<script>
            alert('로그인하고 오세요');
            location.href='/'
            </script>`)
    }
    console.log("--------")
})



app.get('/pyramid',(req,res)=>{

    const cook = req.cookies.user
    const sess = req.sessionID
    if(cook == sess){
        console.log(cook)
        console.log(sess)
        console.log("-일치-")
        res.sendFile(__dirname+'/page/pyramid.html')
    }else{
        console.log("불일치")
        res.send(`<script>
            alert('로그인하고 오세요');
            location.href='/'
            </script>`)
    }
    console.log("--------")
})

app.get('/pyramid_f',(req,res)=>{
    const cook = req.cookies.user
    const sess = req.sessionID
    if(cook == sess){
        console.log(cook)
        console.log(sess)
        console.log("-일치-")
        res.sendFile(__dirname+'/page/pyramid_f.html')
    }else{
        console.log("불일치")
        res.send(`<script>
            alert('로그인하고 오세요');
            location.href='/'
            </script>`)
    }
    console.log("--------")
})

app.post('/list',(req,res)=>{

    const cook = req.cookies.user
    const sess = req.sessionID
    if(cook == sess){
        console.log(cook)
        console.log(sess)
        console.log("-일치-")
        const num = req.body.num
        console.log(num)
        connection.connect()
        connection.query(`SELECT * FROM hyeok.content WHERE idx='${num}'`,(err,rows,fields)=>{
            if(err) throw err;
            const title = rows[0].title
            const writer = rows[0].writer
            const content = rows[0].content
            console.log(title)
            console.log(content)
            console.log(writer)
            res.send(
                `<button onclick=back()>뒤로 가기</button>
                <br>
                <script>
                function back(){
                    location.href='/main'
                };
                document.writeln("제목:"+"${title}"+"<br>");
                document.writeln("작성자:"+"${writer}"+"<br>")
                document.writeln("내용:"+"${content}");
                </script>`) 
        })
    }else{
        console.log("불일치")
        res.send(`<script>
            alert('로그인하고 오세요');
            location.href='/'
            </script>`)
    }
    console.log("--------")

})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})