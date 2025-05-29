// 회원가입 처리
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const ID = document.getElementById("signupId").value;
    const PW = document.getElementById("signupPassword").value;

    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ID, PW })
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("회원가입 완료!", "login.html");
      } else {
        showAlert(data.message, null, function () {
          document.getElementById("signupId").value = "";
          document.getElementById("signupPassword").value = "";
        });
      }
    } catch (err) {
      showAlert("서버 오류가 발생했습니다.");
    }
  });
}

// 로그인 처리
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const ID = document.getElementById("loginId").value;
    const PW = document.getElementById("loginPassword").value;

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ID, PW })
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("loggedInUser", ID);
        showAlert("로그인 성공!", "home.html");
      } else {
        showAlert(data.message, null, function () {
          document.getElementById("loginId").value = "";
          document.getElementById("loginPassword").value = "";
        });
      }
    } catch (err) {
      showAlert("서버 오류가 발생했습니다.");
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
  