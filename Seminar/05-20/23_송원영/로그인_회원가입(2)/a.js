

let h = prompt("피라미드 높이를 입력하세요: ");
h = parseInt(h);

for (let i = 1; i <= h; i++) {
    let row = "";
    for (let j = 1; j <= i; j++) {
        row += "*";
    }
    console.log(row);
}