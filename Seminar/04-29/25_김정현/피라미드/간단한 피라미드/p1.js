function p() {
    const input = document.getElementById('num').value;
    const num = Number(input);
    const output = document.getElementById('pi');
    output.innerHTML = '';

    for (let i = 1; i <= num; i++) {
        const space = '&nbsp;'.repeat(num - i);
        const stars = '*'.repeat(2 * i - 1);
        output.innerHTML += space + stars + '<br>';
    }
}
