// 散花效果
let confettiAmount = 60
let confettiColors = [
  '#7d32f5',
  '#f6e434',
  '#63fdf1',
  '#e672da',
  '#295dfe',
  '#6e57ff'
]
let random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
let createConfetti = to => {
  let elem = document.createElement('i')
    let set = Math.random() < 0.5 ? -1 : 1;
  elem.style.setProperty('--x', random(-260, 260) + 'px');
  elem.style.setProperty('--y', random(-160, 160) + 'px');
  elem.style.setProperty('--r', random(0, 360) + 'deg');
  elem.style.setProperty('--s', random(0.6, 1));
  elem.style.setProperty('--b', confettiColors[random(0, 5)]);
  to.appendChild(elem);
}

for(let i = 0; i < confettiAmount; i++) {
  createConfetti(elem);
}

// 移除点
setTimeout(() => {
  elem.querySelectorAll('i').forEach(i => i.remove());
}, 600);
