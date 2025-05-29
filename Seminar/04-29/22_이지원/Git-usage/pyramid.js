let num = prompt('몇 층짜리 피라미드를 만들까요?: ')
num = Number(num)

let out = ''

for (let i = 1; i <= num; i++) {
  let space = '&nbsp;'.repeat(num - i)
  let star = '*'.repeat(i)
  out += space + star + '<br>'
}

document.getElementById('pyramid').innerHTML = out
