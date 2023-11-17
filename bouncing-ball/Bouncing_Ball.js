setCanvasDim(600, 600);

noStroke();

colorMode("HEX");

var BALL_COLOR = "#8888FF";
var radius = 40;

var BACKGROUND_COLOR = "#000000";

var velRange = 50;

var CEILING = false;

var gravity = 0.75;
var elasticity = 0.85;
var drag = 0.995;

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
			this.x = this.r;
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
	randBetween(-velRange, velRange)
);
var draw = function() {
	background(BACKGROUND_COLOR);
	ball.draw();
	ball.update();
	setTimeout(draw, FRAME_DELAY);
};
draw();