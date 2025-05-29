# MySQL 실습 테스트

## 목적

Express와 MySQL을 연결하고 Postman 활용하여 API 요청을 테스트함으로써 백엔드 개발의 기본 개념인 라우팅, DB연결, 요청 처리, 데이터 저장 및 확인 과정을 실습하고 익히기 위함이다.

---

## 과정

1. **새 DB 생성** - DB명은 본인 이름으로 설정
2. **USER Table 생성 후 ID/PW 저장**

3. **POST 요청 구현** - postman을 사용하여 app.post() ID,PW가 저장되도록 구현
4. **GET 요청 구현** - localhost:3000/db로 접속 후, user 데이터 확인
5. **GitHub 레포지토리 업로드 및 제출**

## 실행 결과

| 과정 단계  | 스크린샷                               |
| ---------- | -------------------------------------- |
| DB 생성    | ![db_creation](./images/DB.png)        |
| Table 생성 | ![postman_request](./images/table.png) |
| POST 요청  | ![postman_request](./images/POST.png)  |
| GET 요청   | ![db_check](./images/GET.png)          |

## 요약 및 결과

- Express와 MySQL 연동
- API 요청을 통해 GET(조회 기능), POST(데이터 저장)
- Postman을 활용한 테스트
