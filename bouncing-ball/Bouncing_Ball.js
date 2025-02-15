setCanvasDim(3000, 2000);

const FRAME_DELAY = 0;

noStroke();

colorMode("HEX");

var BALL_HUE = 0;
var BALL_ALPHA = 0.02;
var BALL_COLOR = `hsl(${BALL_HUE}, 100%, 50%, ${BALL_ALPHA})`;
const COLOR_CHANGE_RATE = 0.025;
var radius = 40;

var BACKGROUND_COLOR = "#000000";
background(BACKGROUND_COLOR);

var velRange = 20;

var CEILING = false;

var gravity = 0.1;
var elasticity = 1.005;
elasticity = 1.003;
var drag = 1;

class Ball {
	constructor(x, y, r, xVel, yVel) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.xVel = xVel;
		this.yVel = yVel;
	}
	draw() {
		fill(BALL_COLOR);
		circle(this.x, this.y, this.r);
	}
	update() {
		this.yVel += gravity;
		
		this.xVel *= drag;
		this.yVel *= drag;
		
		this.x += this.xVel;
		this.y += this.yVel;
		
		if(this.x < this.r) {
			this.x = this.r + this.x;
			this.xVel *= -elasticity;
		}
		if(this.x > WIDTH - this.r) {
			this.x = WIDTH - this.r;
			this.xVel *= -elasticity;
		}
		if(CEILING) {
			if(this.y < this.r) {
				this.y = this.r;
				this.yVel *= -elasticity;
			}
		}
		if(this.y > HEIGHT - this.r) {
			this.y = HEIGHT - this.r;
			this.yVel *= -elasticity;
		}
	}
};

var ball = new Ball(
	randBetween(radius, WIDTH - radius),
	randBetween(radius, HEIGHT - radius),
	radius,
	randBetween(-velRange, velRange),
	0 //randBetween(-velRange, velRange)
);

var speed = 1000;

var draw = function() {
	//background(BACKGROUND_COLOR);
	for (let i = 0; i < speed; i++) {
		BALL_HUE = (BALL_HUE + COLOR_CHANGE_RATE) % 360;
		BALL_COLOR = `hsla(${BALL_HUE}, 100%, 50%, ${BALL_ALPHA})`;
		ball.draw();
		ball.update();
	}
	setTimeout(draw, FRAME_DELAY);
};

draw();