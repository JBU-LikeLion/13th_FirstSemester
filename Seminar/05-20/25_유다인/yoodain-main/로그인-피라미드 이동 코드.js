fetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" }
})
.then(response => {
    if (response.ok) {
        window.location.href = "/pyramid.html"; // 로그인 성공 시 이동
    } else {
        alert("로그인 실패! 이메일 또는 비밀번호를 확인해주세요.");
    }
});

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login.html"); // 비로그인 상태면 로그인 페이지로 이동
}

app.get("/pyramid.html", isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/pyramid.html");
});
