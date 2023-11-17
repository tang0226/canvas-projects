noStroke();
setCanvasDim(2046, 1150);
FRAME_DELAY = 1 / 60;
colorMode("HEX");
BACKGROUND = "#000";
var randInt = function(lower, upper) {
	return floor(random() * (upper - lower + 1)) + lower;
};
var randBetween = function(lower, upper) {
	return (random() * (upper - lower)) + lower
};
class Star {
	constructor(x, y, r, speed) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.speed = speed;
	}
	draw() {
		fill("#FFF");
		circle(this.x, this.y, this.r);
	}
	update() {
		this.y += this.speed;
	}
}

var newStar = function(y) {
	return new Star(
		randBetween(0, WIDTH),
		y,
		randBetween(MIN_SIZE, MAX_SIZE),
		randBetween(MIN_SPEED, MAX_SPEED)
	);
};

var NUM_STARS = 1000;

var MIN_SIZE = 0.1;
var MAX_SIZE = 1.5;

var MIN_SPEED = 0.001;
var MAX_SPEED = 2;

var stars = [];
for(var i = 0; i < NUM_STARS; i++) {
	stars.push(newStar(randBetween(0, HEIGHT)));
}
running = true;
var loop = function() {
	background(BACKGROUND);
	for(let i = 0; i < NUM_STARS; i++) {
		star = stars[i]
		star.draw();
		if(running) {
			star.update();
			if(star.y - star.r > HEIGHT) {
				stars[i] = newStar(0);
			}
		}
	}
	setTimeout(loop, FRAME_DELAY);
};

loop();
/******************************
 Event Handling
******************************/
mouseDown = function(event) {
	running = !running;
};
INIT_EVENTS(canvas);