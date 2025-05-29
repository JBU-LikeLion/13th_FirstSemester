// 회원가입 처리
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("signupId").value;
    const password = document.getElementById("signupPassword").value;

    // 이미 존재하는 아이디 체크
    if (localStorage.getItem(id)) {
        showAlert("이미 존재하는 아이디입니다.", null, function () {
          document.getElementById("signupId").value = "";
          document.getElementById("signupPassword").value = "";
        });
        return;
      }
    
    // localStorage에 사용자 저장
    localStorage.setItem(id, password);
    showAlert("회원가입 완료!", "login.html");
  });
}

// 로그인 처리
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("loginId").value;
    const password = document.getElementById("loginPassword").value;

    const storedPassword = localStorage.getItem(id);

    if (storedPassword === password) {
        sessionStorage.setItem("loggedInUser", id);
        showAlert("로그인 성공!", "home.html");
      } else {
        showAlert("아이디 또는 비밀번호가 틀렸습니다.", null, function () {
            document.getElementById("loginId").value = "";
            document.getElementById("loginPassword").value = "";
          });
      }
  });
}

function showAlert(message, redirectUrl = null, onClose = null) {

    const alertBox = document.querySelector("#customAlert .alertBox");

    document.getElementById("alertMessage").innerText = message;
    document.getElementById("customAlert").style.display = "flex";
  
    // ✨ 여기서 애니메이션 클래스 추가!
    alertBox.classList.remove("fade-in"); // 중복 방지용
    void alertBox.offsetWidth; // 트리거 재실행용 (브라우저 reflow)
    alertBox.classList.add("fade-in");

    const confirmButton = document.querySelector("#customAlert button");
    confirmButton.onclick = function () {
      document.getElementById("customAlert").style.display = "none";
  
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else if (onClose) {
        onClose();  // 콜백 실행
      }
    };
  }
  