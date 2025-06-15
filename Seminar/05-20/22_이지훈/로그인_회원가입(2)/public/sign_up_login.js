document.addEventListener('DOMContentLoaded', () => {
    fetch('/user')
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                const usernameDisplay = document.getElementById('username-display');
                if (usernameDisplay) {
                    usernameDisplay.textContent = data.username;
                }
                const usernameInput = document.getElementById('username');
                if (usernameInput) {
                    usernameInput.value = data.username;
                }
            }
        })
        .catch(err => console.error('사용자 정보 가져오기 실패:', err));

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, rememberMe })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        document.getElementById('error-message').textContent = data.error;
                    } else {
                        alert(data.message);
                        window.location.href = data.redirect;
                    }
                })
                .catch(err => {
                    document.getElementById('error-message').textContent = '서버 오류가 발생했습니다.';
                    console.error(err);
                });
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        document.getElementById('error-message').textContent = data.error;
                    } else {
                        alert(data.message);
                        window.location.href = data.redirect;
                    }
                })
                .catch(err => {
                    document.getElementById('error-message').textContent = '서버 오류가 발생했습니다.';
                    console.error(err);
                });
        });
    }
});

function DeleteUserData() {
    fetch('/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('error-message').textContent = data.error;
            } else {
                alert(data.message);
                window.location.href = data.redirect;
            }
        })
        .catch(err => {
            document.getElementById('error-message').textContent = '회원탈퇴 중 오류가 발생했습니다.';
            console.error(err);
        });
}

function logout() {
    fetch('/logout', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.href = data.redirect;
        })
        .catch(err => {
            document.getElementById('error-message').textContent = '로그아웃 중 오류가 발생했습니다.';
            console.error(err);
        });
}
