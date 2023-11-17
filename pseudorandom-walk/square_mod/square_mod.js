var BACKGROUND = "#000";
var PSEUDO_PATH = "#55F";
var RANDOM_PATH = "#F00";
var showPseudo = true;
var showRandom = false;

var stepsPerFrame = 100;

c.fillStyle = BACKGROUND;
c.fillRect(0, 0, WIDTH, HEIGHT);

var PIXEL_SIZE = 1;

var seed = floor(random() * 1000000000) + 10;
// var mod = seed + floor(random() * 1000000000);
var mod = 5915587277 * 2;

var value = seed;
var sequence= seed.toString();

var pseudoX = WIDTH / 2;
var pseudoY = HEIGHT / 2;
var randomX = pseudoX;
var randomY = pseudoY;

var s;
var seedLength = seed.toString().length;

var draw = function() {
	for(let i = 0; i < stepsPerFrame; i++) {
		value  = (value * value) % mod;
		s = value.toString();
		l = s.length;
		var start = floor((l - seedLength) / 2);
		value = Number(s.substring(start, start + seedLength));
		
		switch(value % 4) {
			case 0:
				pseudoY -= PIXEL_SIZE;
			break;
			case 1:
				pseudoX += PIXEL_SIZE;
			break;
			case 2:
				pseudoY += PIXEL_SIZE;
			break;
			case 3:
				pseudoX -= PIXEL_SIZE;
		}
		
		switch(floor(random() * 4)) {
			case 0:
				randomY -= PIXEL_SIZE;
			break;
			case 1:
				randomX += PIXEL_SIZE;
			break;
			case 2:
				randomY += PIXEL_SIZE;
			break;
			case 3:
				randomX -= PIXEL_SIZE;
		}
		
		if(pseudoX > WIDTH) {
			pseudoX = 0;
		}
		if(pseudoX < 0) {
			pseudoX = WIDTH;
		}
		if(pseudoY > HEIGHT) {
			pseudoY = 0;
		}
		if(pseudoY < 0) {
			pseudoY = HEIGHT;
		}

		if(randomX > WIDTH) {
			randomX = 0;
		}
		if(randomX < 0) {
			randomX = WIDTH;
		}
		if(randomY > HEIGHT) {
			randomY = 0;
		}
		if(randomY < 0) {
			randomY = HEIGHT;
		}

		if(showPseudo) {
			c.fillStyle = PSEUDO_PATH;
			c.fillRect(pseudoX, pseudoY, PIXEL_SIZE, PIXEL_SIZE);
		}
		if(showRandom) {
			c.fillStyle = RANDOM_PATH;
			c.fillRect(randomX, randomY, PIXEL_SIZE, PIXEL_SIZE);
		}
	}
	
	// console.log(value);
	
	setTimeout(draw, 0);
}
draw();
