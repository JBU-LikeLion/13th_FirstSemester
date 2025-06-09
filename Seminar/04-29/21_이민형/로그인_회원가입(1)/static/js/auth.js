function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function signup(type) {
  const id = document.getElementById("id").value;
  const pw = document.getElementById("pw").value;
  const pwCheckInput = document.getElementById("pwCheck");
  let pwCheck = null;

  if (pwCheckInput !== null) {
    pwCheck = pwCheckInput.value;
  }

  const users = getUsers();

  if (!id || !pw) return alert("아이디와 비밀번호를 입력하세요.");
  if (users[id]) return alert("이미 존재하는 ID입니다.");

  users[id] = pw;
  saveUsers(users);

  if (type === "local") {
    localStorage.setItem("loggedInUser", id);
  } else {
    sessionStorage.setItem("loggedInUser", id);
  }

  alert("회원가입 성공!");
  location.href = "home.html";
}

function login(type) {
  const id = document.getElementById("id").value;
  const pw = document.getElementById("pw").value;
  const users = getUsers();

  if (!users[id] || users[id] !== pw) {
    return alert("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
  }

  if (type === "local") {
    localStorage.setItem("loggedInUser", id);
  } else {
    sessionStorage.setItem("loggedInUser", id);
  }

  alert("로그인 성공!");
  location.href = "home.html";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  sessionStorage.removeItem("loggedInUser");
  location.reload();
}

function displayLoginStatus() {
  const localUser = localStorage.getItem("loggedInUser");
  const sessionUser = sessionStorage.getItem("loggedInUser");
  const statusEl = document.getElementById("status");

  if (localUser) {
    statusEl.innerText = `${localUser}님 (로컬스토리지 로그인 중)`;
  } else if (sessionUser) {
    statusEl.innerText = `${sessionUser}님 (세션스토리지 로그인 중)`;
  } else {
    statusEl.innerText = `로그인되어 있지 않습니다.`;
  }
}
function updateNavbarVisibility() {
  const localUser = localStorage.getItem("loggedInUser");
  const sessionUser = sessionStorage.getItem("loggedInUser");
  const isLoggedIn = localUser || sessionUser;
  const loginLinks = document.querySelectorAll(".login-only");

  loginLinks.forEach((link) => {
    link.style.display = isLoggedIn ? "none" : "";
  });

  const logoutButton = document.getElementById("logout_button");
  if (logoutButton) {
    logoutButton.style.display = isLoggedIn ? "inline-block" : "none";
  }
}
