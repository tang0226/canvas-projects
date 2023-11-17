setCanvasDim(window.innerWidth - 2, window.innerHeight - 2);
FRAME_DELAY = 1 / 60;
bgColor = color(0);
colorMode("HSL");
noStroke();

var randInt = function(l, h) {
	return floor(random() * (h - l + 1)) + l
};

var randBetween = function(l, h) {
	return (random() * (h - l)) + l
};

var blob = function(x, y, r, hue, alpha, speed, decay) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.hue = hue;
	this.alpha = alpha;
	this.speed = speed;
	this.decay = decay;
	
	this.draw = function() {
		fill(this.hue, 100, 50, this.alpha);
		circle(this.x, this.y, this.r);
	};
	
	this.update = function() {
		this.r += this.speed;
		this.alpha -= this.decay;
	}
}

var outerRadius = 50;
var alphaRange = [0, 0.35];
var speedRange = [0.05, 0.1];
var decayRange = [0.000025, 0.00025];
var numBlobs = 150;

var randomBlob = function() {
	return new blob(
		randBetween(-outerRadius, WIDTH + outerRadius),  // x
		randBetween(-outerRadius, HEIGHT + outerRadius), // y
		1,                                               // r
		randBetween(0, 360),                             // hue
		randBetween(alphaRange[0], alphaRange[1]),       // alpha
		randBetween(speedRange[0], speedRange[1]),       // speed
		randBetween(decayRange[0], decayRange[1])        // decay
	);
}

var blobs = [];
for(var i = 0; i < numBlobs; i++) {
	blobs.push(randomBlob());
}

var draw = function() {
	background(bgColor);
	nextBlobs = [];
	for(var i = 0; i < numBlobs; i++) {
		var b = blobs[i];
		b.draw();
		b.update();
		if(b.alpha <= 0 || b.x + b.r < 0 || b.x - b.r > WIDTH || b.y + b.r < 0 || b.y - b.r > HEIGHT) {
			nextBlobs.push(randomBlob());
		}
		else {
			
			nextBlobs.push(b);
		}
	}
	blobs = nextBlobs;
	setTimeout(draw, FRAME_DELAY);
}
draw();