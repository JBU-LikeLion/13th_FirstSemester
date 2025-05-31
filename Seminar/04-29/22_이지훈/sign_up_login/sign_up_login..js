// 쿠키 설정 함수
function setCookie(name, value, days) { //setCookie 함수로 쿠키 설정하며 name, value, days를 매개변수로 받음
    let expires = ""; // 만료일 설정 할 변수 선언
    if (days) { // days에 값이 존재하면
        const date = new Date(); //현재 날짜를 기준으로 date 변수에 저장
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // 하루를 밀리초로 환산하여 현재 시간에 더함(24시간 * 60분 * 60초 * 1000밀리초)
        expires = "; expires=" + date.toUTCString(); // expires 변수에 만료일을 문자열로 저장
    }
    const cookieString = `${name}=${encodeURIComponent(value)}${expires}; path=/`; //cookieString 변수에 쿠키 문자열을 저장(name은 쿠키 이름, value는 쿠키 값, expires는 만료일, path는 쿠키의 경로를 지정)
    document.cookie = cookieString; // document.cookie에 cookieString을 저장하여 쿠키 설정
}

// 쿠키 읽기 함수
function getCookie(name) { // getCookie 함수로 쿠키 불러오기
    console.log(`getCookie 호출: ${name}`); // 호출된 쿠키 이름을 콘솔에 출력
    const nameEQ = name + "="; // 쿠키 이름과 '='를 합쳐서 nameEQ 변수에 저장(username=, password= 등)
    const ca = document.cookie.split(';'); // document.cookie에 저장된 쿠키를 ';'로 나누어 배열로 저장(이름=값; 이름=값; ... 형태로 쿠키를 분리)
    for (let i = 0; i < ca.length; i++) { //ca 배열의 길이만큼 반복하며 쿠키 찾기
        let c = ca[i]; // C에 ca 배열의 쿠키 문자열 저장
        while (c.charAt(0) === ' ') c = c.substring(1); // C(쿠키)의 앞 글자가 공백일 경우 공백이 아닐때까지 제거
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length)); // 변수 c가 nameEQ로 시작하면(원하는 쿠키를 찾았을때), nameEQ 뒤의 값을 디코딩하여 반환
    }
    return null; // 찾는 쿠키가 존재하지 않으면 null
}
 
// 쿠키 삭제 함수
function deleteCookie(name) { 
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

// 로그인 유지 기능 구현
function rememberMe() { // rememberMe 함수로 로그인 유지 기능 구현
    
    const usernameElement = document.getElementById("username"); // 입력된 아이디 가져오기
    const passwordElement = document.getElementById('password'); // 입력된 비번 가져오기 
    const rememberMeElement = document.getElementById('remember-me'); // 로그인 유지 체크박스 가져오기(체크박스가 선택되었는지 확인을 위해)

    if (!usernameElement || !passwordElement || !rememberMeElement) { // 아이디-비번-체크박스 중 하나라도 존재하지 않으면 종료
        return;
    }

    const username = usernameElement.value; // username에 아이디 값 저장
    const password = passwordElement.value; // password에 비밀번호 값 저장
    const rememberMeChecked = rememberMeElement.checked; // 로그인유지 체크박스 선택 여부 저장


    if (username && password && rememberMeChecked) { // 아이디,비번이 존재하고 체크박스가 선택되었을 때
        setCookie('username', username, 7); // 아이디 쿠키 설정(7일 유지)
        setCookie('password', password, 7); // 비밀번호 쿠키 설정(7일 유지)
    } else { // 아이디,비번이 없거나 체크박스가 선택되지 않았을 때
        deleteCookie('username'); // 아이디 쿠키 삭제
        deleteCookie('password'); // 비밀번호 쿠키 삭제
    }
}

document.addEventListener('DOMContentLoaded', function() { // 오류방지를 위해 DOMContentLoaded라는 이름의 이벤트 리스너를 사용하여 DOM이 완전히 로드된 후 실행
    const username = getCookie('username'); // username 변수에 getcookie로 아이디 값 가져오기
    const password = getCookie('password'); // password 변수에 getcookie로 비밀번호 값 가져오기
    console.log('로드 시 쿠키:', username, password); // 콘솔에 로드된 쿠키 출력

    const usernameElement = document.getElementById('username'); // 아이디 입력 요소 가져오기
    const passwordElement = document.getElementById('password'); // 비밀번호 입력 요소 가져오기

    if (usernameElement) usernameElement.value = username; // 아이디 입력 요소가 존재하면 쿠키에서 가져온 아이디 값 넣기
    if (passwordElement) passwordElement.value = password; // 비밀번호 입력 요소가 존재하면 쿠키에서 가져온 비밀번호 값 넣기
});

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
            window.location.href = 'login.html'; 
        
        // 존재하지 않는 회원이면 로컬스토리지에 저장
        }else {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            alert('회원가입 정보가 저장되었습니다!');
            window.location.href = 'login.html';
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
    window.location.href = 'sign_up.html'; 

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
        window.location.href ='login_success.html';
    } else {
        alert('존재하지 않는 회원입니다 ㅠㅠ');
        window.location.href = 'sign_up.html';
    }
}
