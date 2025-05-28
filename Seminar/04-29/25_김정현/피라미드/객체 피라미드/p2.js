class Pyramid {
    constructor(height) {
        this.height = height;
        this.output = document.getElementById('pi');
    }

    isValid() {
        return !isNaN(this.height) && this.height > 0;
    }

    draw() {
        this.output.innerHTML = '';
        for (let i = 1; i <= this.height; i++) {
            const space = '&nbsp;'.repeat(this.height - i);
            const stars = '*'.repeat(2 * i - 1);
            this.output.innerHTML += space + stars + '<br>';
        }
    }
}

function p() {
    const num = Number(document.getElementById('num').value);
    const pyramid = new Pyramid(num);
    pyramid.draw();
}
