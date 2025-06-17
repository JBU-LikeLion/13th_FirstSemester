<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>별 삼각형</title>
    <style>
        pre { font-family: monospace; }
        body {
            text-align: center;
            margin-top: 50px;
        }
    </style>
</head>
<body>
    <h1>별 삼각형 만들기</h1>
    <label for="numInput">삼각형 크기:</label>
    <input type="number" id="numInput" min="1" value="5">
    <button onclick="drawTriangle()">생성</button>

    <div id="triangle"></div>

    <script>
        function drawTriangle() {
            let num = parseInt(document.getElementById("numInput").value);
            if (isNaN(num) || num < 1) {
                document.getElementById("triangle").innerHTML = "<pre>올바른 숫자를 입력하세요!</pre>";
                return;
            }

            let triangle = "";
            for (let i = 0; i < num; i++) {
                let space = "&nbsp;".repeat(num - i); // 공백을 HTML 엔티티로 변경
                let stars = "*".repeat(i * 2 + 1);
                triangle += space + stars + "<br>";
            }

            document.getElementById("triangle").innerHTML = `<pre>${triangle}</pre>`;
        }
    </script>
</body>
</html>
