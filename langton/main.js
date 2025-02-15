var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width, height, halfWidth, halfHeight;

function setCanvasDim(w, h) {
    canvas.width = w;
    canvas.height = h;
    width = w;
    height = h;
    halfWidth = w / 2;
    halfHeight = h / 2;
}

setCanvasDim(1000, 1000);

var squareSize = 3;
var gw = Math.floor(width / squareSize);
var gh = Math.floor(height / squareSize);

var grid = [];
for (let y = 0; y < gh; y++) {
  let row = new Array(gw);
  row.fill(0);
  grid.push(row);
}

var dir = 0;
var x = Math.round(gw / 2);
var y = Math.round(gh / 2);

grid[y][x] = 1;

var onColor = "#000";
var offColor = "#FFF";


// so, speed
var simSpeed = 1;
document.getElementById("sim-speed").innerText = simSpeed;

window.onkeyup = function(e) {
  if (e.key == "ArrowUp") {
    simSpeed *= 2;
    document.getElementById("sim-speed").innerText = simSpeed;
  }
  else if (e.key == "ArrowDown" && simSpeed > 1) {
    simSpeed /= 2;
    document.getElementById("sim-speed").innerText = simSpeed;
  }
}

ctx.fillStyle = offColor;
ctx.fillRect(0, 0, width, height);

function draw() {
  for (let i = 0; i < simSpeed; i++) {
    if (grid[y][x]) {
      grid[y][x] = 0;
      ctx.fillStyle = offColor;
      dir = (dir + 3) % 4;
    }
    else {
      grid[y][x] = 1;
      ctx.fillStyle = onColor;
      dir = (dir + 1) % 4;
    }
  
    ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
  
    switch (dir) {
      case 0:
        x = (x + 1) % gw;
        break;
      case 1:
        y = (y + 1) % gh;
        break;
      case 2:
        x = (x + gw - 1) % gw;
        break;
      case 3:
        y = (y + gh - 1) % gh;
    }
  
  }
  
  window.requestAnimationFrame(draw);
}

draw();
