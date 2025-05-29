class Pyramid {
  constructor(shape, count, space) {
    this.shape = shape //형태
    this.count = count //반복 횟수
    this.space = space //공백
  }

  makePyramid() {
    let py = ''
    for (let i = 0; i < this.count; i++) {
      for (let j = 0; j < this.count - 1 - i; j++) {
        py += this.space
      }
      for (let k = 1; k < i * 2; k++) {
        py += this.shape
      }
      py += '<br>'
    }
    document.getElementById('py').innerHTML = py
  }
}

const pm1 = new Pyramid('ㅁ', 5, '\u00a0\u00a0\u00a0\u00a0')
const pm2 = new Pyramid('*', 8, '\u00a0\u00a0')
const pm3 = new Pyramid('O', 10, '\u00a0\u00a0\u00a0')
const pm4 = new Pyramid('🧱', 15, '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0')
