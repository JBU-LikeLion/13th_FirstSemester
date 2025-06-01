# nodejs Mysql
### msyql에서 테이블 생성 후 node와 연결하기

1. 테이블 생성
mysql 워크벤치에서 테이블 만들기

>db생성
create database juhyeok;
>테이블 생성
![db&table](https://github.com/Juhyeok0603/express_mysql/blob/main/img/db%26table.png)
img db&table


2. nodejs, express 설치
> npm init --yes
-> npm 초기화. package.json 파일 생성

> npm install express
-> express 설치. node_modules 폴더, package-lock.json 파일 생성

> 서버 코드 작성
-> app.js 파일을 만들고 express사이트 - 시작하기 - hello world에 따라가서 코드 복사
![mysql 서버용 코드](https://github.com/Juhyeok0603/express_mysql/blob/main/img/mysql%EC%84%9C%EB%B2%84%EC%9A%A9%20%EC%BD%94%EB%93%9C.png?raw=true)

> 터미널
-> 터미널에서 node app.js를 치면 localhost:3000에서 서버가 돌아감.


3. mysql 연동
> msyql 설치
-> 터미널창에 npm install mysql2

> 테스트 파일
-> mysql을 테스트할 파일 mysql.js를 만듦

> 연동 코드
-> express 사이트 - 안내서 - 데이터베이스 통합 을 들어가 MySQL에 대한 연동 코드를 찾는다.

> 연동 테스트
-> mysql.js에 해당 코드를 작성하고 자신의 db정보에 맞게 수정

-> 터미널에서 node mysql.js를 쳤을 때 'The solution is: 2'가 뜨면 성공

4. post로 db내용 가져오기
> 사전 작업
-> 가져올 테이블을 만들기
![테이블 채워두기](https://github.com/Juhyeok0603/express_mysql/blob/main/img/%ED%85%8C%EC%9D%B4%EB%B8%94%20%EC%B1%84%EC%9B%8C%EB%91%90%EA%B8%B0.png)


-> express.json, express.urlencoded
express.json은 express에서 json형태의 request body를 파싱하기 위해 사용되는 미들웨어
express.urlencoded는 post 요청의 body에 인코딩된 데이터를 해석하고, req.body 객체에 채워주는 역할
각각의 코드를 상단에 배치
![json_urlencoded](https://github.com/Juhyeok0603/express_mysql/blob/main/img/json_urlencoded.png)

-> app.js폴더
서버를 실행할 때 app.()은 method 방식을 지정한다
app.메소드('요청경로(?)',(req,res)=>{   })

> mysql 연동 코드
-> app.js에서 작업할 것이기 때문에, mysql의 기본 정보들을 가져온다
![mysql기본정보](https://github.com/Juhyeok0603/express_mysql/blob/main/img/mysql%EA%B8%B0%EB%B3%B8%EC%A0%95%EB%B3%B4.png)

> app.post()
-> app.post로 된 코드를 하나 만들고 mysql에 연결시키는 코드를 넣는다. /db로 접속했을 때 post 요청이 가도록 했다
![app_post_db](https://github.com/Juhyeok0603/express_mysql/blob/main/img/app_post_db.png)

> 코드 수정
-> 쿼리 부분을 수정해준다. 'SELECT * FROM juhyeok.id_table' 
-> postman에서 접속했을 때 body내용을 확인하기 위해 에러 처리 아래에 res.json(rows)를 추가
![쿼리 수정한 db](https://github.com/Juhyeok0603/express_mysql/blob/main/img/%EC%BF%BC%EB%A6%AC%20%EC%88%98%EC%A0%95%ED%95%9Cdb.png)

> postman
-> postman에서 localhost:3000/db에 post로 접속하여 body에 내용이 있는지 확인
![postman](https://github.com/Juhyeok0603/express_mysql/blob/main/img/postman.png)

