var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = window.innerWidth - 2;
var h = 1300;

var s = 1;

var m = 3;
var squish = 60;

canvas.style.width = canvas.width = w;
canvas.style.height = canvas.height = h;
ctx.fillStyle = "#000000";
for (var n = 1; n < w * squish; n++) {
  let i = 0;
  let x = s + n;
  while (x != 1) {
    x = x % 2 == 0 ? x / 2 : 3 * x + 1;
    if (Math.log10(x) > 45) {
      console.log(s + n, x);
    }
    i++;
  }
  ctx.fillRect(Math.floor(n / squish), h - i * m, m, m);
}