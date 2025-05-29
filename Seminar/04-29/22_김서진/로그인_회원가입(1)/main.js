// 로그인 처리 함수
function Login() {
  var userID = document.getElementById('userID').value
  var password = document.getElementById('pw').value

  var saveUser = localStorage.getItem('user_' + userID)
  if (saveUser) {
    // JSON으로 사용자 정보 읽기
    var user = JSON.parse(saveUser)
    if (user.password == password) {
      sessionStorage.setItem('loginUser', userID)
      alert('로그인 성공!')
      window.location.href = 'main.html'
    } else {
      alert('비밀번호가 틀렸습니다.')
    }
  } else {
    var signup = confirm('계정 정보가 없습니다. 회원가입 하시겠습니까?')
    if (signup) {
      window.location.href = 'signup.html'
    }
  }
}

// 회원가입 처리 함수
function Signup() {
  var userID = document.getElementById('userID').value
  var password = document.getElementById('pw').value

  // 중복 아이디 확인인
  if (localStorage.getItem('user_' + userID)) {
    alert('이미 있는 아이디 입니다.')
    return
  }

  // 사용자 정보 JSON으로 저장
  var user = { userID: userID, password: password }
  localStorage.setItem('user_' + userID, JSON.stringify(user))
  alert('회원가입 성공!')
  window.location.href = 'index.html'
}

function Logout() {
  //로그아웃
  if (confirm('로그아웃 하시겠습니까?')) {
    sessionStorage.removeItem('loginUser')
    window.location.href = 'index.html'
  }
}

//회원 탈퇴
function Delete() {
  if (confirm('정말 회원탈퇴를 진행하시겠습니까?')) {
    localStorage.clear()
    sessionStorage.clear()
    alert('회원탈퇴가 완료되었습니다.')
    window.location.href = 'signup.html'
  }
}
