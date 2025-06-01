# 로컬스토리지와 세션스토리지를 이용해 로그인 페이지 구성

## 0.웹 스토리지
> 데이터를 클라이언트 단. 브라우저에 상에 데이터를 저장할 수 있는 기술
> 키와 값으로 이루어진 데이터를 저장할 수 있으며, 로컬 스토리지와 세션 스토리지로 나뉜다.

## 1.index.html
> 로컬스토리지와 세션스토리지를 이용한 방식을 나눌 것이므로, index에서는 각각의 기능을 사용할 수 있도록 구분지어준다.

## 2.LocalStroage
#### 1.로컬스토리지 회원가입 기능
> input 태그 안에 사용할 아이디와 패스워드를 적고 버튼을 눌렀을 때, 자바스크립트 문법인 getElementById를 통해 input에 적은 값을 변수에 저장
> 아이디와 패스워드를 저장한 변수를 localStorage.getItem을 통해 키:값이 id:password 가 되도록 지정.

#### 2.로컬스토리지 확인
> F12를 눌러 localstorage를 확인하면 값이 제대로 들어감.
![localstorage](https://github.com/Juhyeok0603/liki-lion-Web_storage/blob/main/img/localstorage.png)

#### 3.로그인
> 회원가입한 아이디와 패스워드로 로그인

## 3.세션 스토리지.
> 로컬스토리지와 사용방법은 동일
> 다만 회원가입 시 아이디와 패스워드를 sessionstorage에 저장함.