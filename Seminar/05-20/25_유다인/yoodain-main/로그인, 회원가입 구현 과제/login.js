const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.listen(3000, () => console.log("🚀 서버 실행 중..."));

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("User", UserSchema);

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET_KEY = "supersecretkey"; // 🔥 JWT 서명 키

// 🔥 회원가입 API
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // ✅ 비밀번호 해싱

    try {
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "✅ 회원가입 성공!" });
    } catch (error) {
        res.status(400).json({ message: "❌ 이미 가입된 이메일입니다." });
    }
});

// 🔐 로그인 API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "❌ 가입되지 않은 이메일입니다." });
    }

    const match = await bcrypt.compare(password, user.password); // ✅ 비밀번호 검증
    if (match) {
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" }); // ✅ JWT 생성

        // ✅ 로그인 성공 후 피라미드 프로그램 페이지로 이동
        res.status(200).json({ 
            message: "✅ 로그인 성공!", 
            token, 
            redirect: "/pyramid"
        });
    } else {
        res.status(401).json({ message: "❌ 비밀번호가 틀렸습니다." });
    }
});

module.exports = router;


async function register() {
    const email = document.getElementById("signup-email").value.toLowerCase();
    const password = document.getElementById("signup-password").value;

    const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;
}

async function login() {
    const email = document.getElementById("login-email").value.toLowerCase();
    const password = document.getElementById("login-password").value;

    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;

    if (data.token) {
        sessionStorage.setItem("authToken", data.token); // ✅ JWT 저장
        showPage("home");
    }
}
