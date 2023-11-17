const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var canvasWidth = 50000;
var canvasHeight = 5000;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

ctx.fillStyle = "#000000";

const SIZE = 5;

for(let f = 1; f < canvasHeight / SIZE; f++) {
    let n = f;
    while(n * SIZE < canvasWidth) {
        ctx.fillRect(n * SIZE, canvasHeight - f * SIZE, SIZE, SIZE);
        n += f;
    }
}