document.addEventListener("DOMContentLoaded", () => {
    const pyramidElement = document.getElementById("pyramid");
    const pyramidSizeInput = document.getElementById("pyramidSize");
    const generateButton = document.getElementById("generateButton");

    // 피라미드 생성 클래스
    class Pyramid {
        constructor(rows) {
            this.rows = rows;
        }

        generate() {
            let pyramid = "";
            for (let i = 1; i <= this.rows; i++) {
                // 공백 추가
                for (let k = 0; k < this.rows - i; k++) {
                    pyramid += "&nbsp;";
                }
                // 별 추가
                for (let j = 0; j < 2 * i - 1; j++) {
                    pyramid += "*";
                }
                pyramid += "<br>";
            }
            return pyramid;
        }
    }

    // 버튼 클릭 이벤트 핸들러
    generateButton.addEventListener("click", () => {
        const rows = parseInt(pyramidSizeInput.value, 10);
        if (!isNaN(rows) && rows > 0) {
            const pyramid = new Pyramid(rows);
            pyramidElement.innerHTML = pyramid.generate();
        } else {
            pyramidElement.innerHTML = "Please enter a valid number greater than 0.";
        }
    });
});