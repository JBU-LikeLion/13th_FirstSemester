
// 회원가입 기능 구현
function saveUserData() {
    
    // 아이디-비번 입력값 저장
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 아이디와 비밀번호 로컬스토리지에서 불러오기(중복체크)
    if (username && password) {
        const existingUsername = localStorage.getItem('username');
        
        // 이미 존재하는 회원이면 로그인 페이지로 이동
        if (existingUsername === username) {
            alert('이미 존재하는 회원입니다.');
            window.location.href = '로그인.html'; 
        
        // 존재하지 않는 회원이면 로컬스토리지에 저장
        }else {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            alert('회원가입 정보가 저장되었습니다!');
            window.location.href = '로그인.html';
        }
    // 아무것도 입력하지 않았을시 출력
    } else {
        alert('아이디, 비밀번호를 입력해주세요.');
    }
}

// 회원탈퇴 기능 구현
function DeleteUserData() {

    // 로컬스토리지에서 회원가입 정보 삭제
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    alert('회원가입 정보가 삭제되었습니다 ㅠㅠ');
    window.location.href = '회원가입.html'; 

}
// 회원여부 확인
function CorrectUser() {
    // 아이디-비번 입력값 저장
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // 로컬스토리지에서 아이디-비번값 가져오기
    const CorrectUsername = localStorage.getItem('username');
    const CorrectPassword = localStorage.getItem('password');
    // 아이디-비번 체크
    if (username === CorrectUsername && password === CorrectPassword) {
        // 세션스토리지에 로그인 정보 저장
        sessionStorage.setItem('loginUser', username);
        alert('로그인 성공!');
        window.location.href = '로그인 성공.html';
    } else {
        alert('존재하지 않는 회원입니다 ㅠㅠ');
        window.location.href = '회원가입.html';
    }
}
//로그인 유지 기능 구현
function rememberMe(){
    // 아이디-비번 입력값 저장 및 체크박스 상태 확인
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMeChecked = document.getElementById('remember-me').checked;
    // 로컬스토리지에 아이디-비번 저장
    if(username && password && rememberMeChecked){
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        alert('아이디와 비밀번호가 저장되었습니다.');
    // 로컬스토리지에 아이디-비번 삭제
    }else{
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        alert('아이디와 비밀번호가 저장되지 않았습니다.');
    }
}
