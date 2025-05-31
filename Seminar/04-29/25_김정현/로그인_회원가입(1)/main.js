function signUp() {
    const id = document.getElementById("signup-id").value;
    const pw = document.getElementById("signup-pw").value;
    if (id && pw) {
      localStorage.setItem("user_" + id, pw);
      alert("회원가입 성공!");
    } else {
      alert("아이디와 비밀번호를 입력하세요.");
    }
  }
  
  function logIn() {
    const id = document.getElementById("login-id").value;
    const pw = document.getElementById("login-pw").value;
    const storedpw = localStorage.getItem("user_" + id);
  
    if (storedpw && storedpw === pw) {
      sessionStorage.setItem("loggedInUser", id);
      document.getElementById("welcome").innerText = id + "님 환영합니다!";
      document.getElementById("happy").innerText = "행복한 하루 되세요!";
    } else {
      alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
    }
  }
  
  function logOut() {
    sessionStorage.removeItem("loggedInUser");
    document.getElementById("welcome").innerText = "";
  }