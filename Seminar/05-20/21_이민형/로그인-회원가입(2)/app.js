const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./mysql");
const path = require("path");

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// 정적 파일 서빙: static 폴더 하나로 통일
app.use(express.static(path.join(__dirname, "static")));

// 인증 체크 미들웨어
function authCheck(req, res, next) {
  if (!req.session.userId) return res.redirect("/login.html");
  next();
}

// 홈 화면 (로그인 필요)
app.get("/", authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

// 회원가입 처리
app.post("/users", async (req, res) => {
  const { id, pw } = req.body;
  if (!id || !pw) return res.status(400).json({ msg: "id, pw required" });

  try {
    const hashedPw = await bcrypt.hash(pw, 10);
    db.query(
      "INSERT INTO users (id, pw) VALUES (?, ?)",
      [id, hashedPw],
      (err, results) => {
        if (err && err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ msg: "id exists" });
        }
        if (err) return res.status(500).json({ msg: "db error" });

        req.session.userId = id;
        req.session.userNo = results.insertId;

        res.json({ msg: "saved" });
      }
    );
  } catch (err) {
    res.status(500).json({ msg: "hash error" });
  }
});

// 로그인 처리
app.post("/login", (req, res) => {
  const { id, pw } = req.body;
  if (!id || !pw) return res.status(400).json({ msg: "id, pw required" });

  db.query("SELECT * FROM users WHERE id = ?", [id], async (err, rows) => {
    if (err) return res.status(500).json({ msg: "db error" });
    if (rows.length === 0) return res.status(400).json({ msg: "id not found" });

    const user = rows[0];
    const match = await bcrypt.compare(pw, user.pw);
    if (!match) return res.status(401).json({ msg: "wrong password" });

    req.session.userId = user.id;
    req.session.userNo = user.user_no;
    res.redirect("/");
  });
});

// 로그아웃
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// 유저 목록 확인용 (관리자용)
app.get("/db", (_, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).json({ msg: "db error" });
    res.json(rows);
  });
});

// 로그인 상태 확인 API (프론트에서 사용)
app.get("/check", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});
