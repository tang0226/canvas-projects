setCanvasDim(1750, 1000);
background(0);
strokeWeight(2);

var NODE_COLOR = color(0, 200, 0);
var NODE_SIZE = 4;
var EVEN_COLOR = color(0, 128, 255);
var ODD_COLOR = color(255, 0, 0);

var FONT_SIZE = 30;
var FONT = "Arial";
var textLeftMargin = 10;
font(FONT);
fontSize(FONT_SIZE);

var AVERAGE_TREE_MODE = false;

var targetDepth = 25;
var layerThickness = 30;
var bottomBorder = targetDepth * layerThickness;

var currDepth = 1;
var nodes = [[{
	val: 1,
	gender: "odd",
	sequence: "",
	children: []
}]];
var currNodes = nodes[0];

var buildTree = function() {
	// Build technical things about tree (values, children, etc.)
	while(currDepth < targetDepth) {
		var newNodes = [];
		var l = currNodes.length;
		var nodeIndex = 0;
		for(var i = 0; i < l; i++) {
			let newNode = {
				val: currNodes[i].val * 2,
				gender: "even",
				sequence: "E" + currNodes[i].sequence,
				children: []
			}
			newNodes.push(newNode);
			currNodes[i].children.push(nodeIndex);
			nodeIndex++;
			var try3N1 = Number((currNodes[i].val - 1) / 3);
			if((currNodes[i].val - 1) % 3 == 0 && try3N1 % 2 == 1 && try3N1 != 1) {
				newNodes.push({
					val: try3N1,
					gender: "odd",
					sequence: "O" + currNodes[i].sequence,
					children: []
				});
				currNodes[i].children.push(nodeIndex);
				nodeIndex++;
			}
		}
		nodes.push(newNodes);
		currNodes = newNodes;
		currDepth += 1;
	}
	
	// Give coordinates to bottom layer (x coordinates for building up
	var l = nodes[targetDepth - 1].length;
	for(var i = 0; i < l; i++) {
		nodes[targetDepth - 1][i].x = (WIDTH / (l + 1)) * (i + 1);
		nodes[targetDepth - 1][i].y = layerThickness * targetDepth;
	}

	// Give coordinates to rest of tree (build up from bottom)
	for(var i = targetDepth - 2; i > -1; i--) {
		var numNodes = nodes[i].length;
		
		for(var j = 0; j < numNodes; j++) {
			let x;
			let numChildren;
			let children = nodes[i][j].children;
			let child1 = nodes[i + 1][children[0]];
			if(children.length == 2) {
				numChildren = 2;
				if(AVERAGE_TREE_MODE) {
					x = (child1.x + nodes[i + 1][children[1]].x) / 2;
				} else {
					x = child1.x;
				}
			} else {
				x = child1.x;
				numChildren = 1;
			}
			nodes[i][j].x = x;
			nodes[i][j].y = layerThickness * (i + 1);
		}
	}
};
var drawTree = function() {
	strokeWeight(3);
	for(var i = 0; i < targetDepth - 1; i++) {
		let numNodes = nodes[i].length;
		for(var j = 0; j < numNodes; j++) {
			let currNode = nodes[i][j];
			let numChildren = currNode.children.length;
			for(var k = 0; k < numChildren; k++) {
				let child = nodes[i + 1][currNode.children[k]];
				if(child.gender == "even") {
					stroke(EVEN_COLOR);
				} else {
					stroke(ODD_COLOR);
				}
				line(nodes[i][j].x, nodes[i][j].y, child.x, child.y);
			}
		}
	}
};

var drawLines = function(thickness) {
	stroke(255);
	strokeWeight(1.5);
	for(var y = 1; y < targetDepth + 1; y++) {
		line(0, y * thickness, WIDTH, y * thickness);
	}
};

buildTree();

var getDistance = function(x1, y1, x2, y2) {
	return (((x1 - x2) ** 2) + (y1 - y2) ** 2) ** (1 / 2);
}

var mouseX = 0;
var mouseY = 0;

draw = function() {
	background(0);
	drawLines(layerThickness);
	drawTree();
	var rows = nodes.length;
	for(var i = 0; i < rows; i++) {
		var l = nodes[i].length;
		for(var j = 0; j < l; j++) {
			var node = nodes[i][j]
			if(getDistance(mouseX, mouseY, node.x, node.y) <= NODE_SIZE) {
				noStroke();
				fill(0, 255, 0);
				circle(node.x, node.y, NODE_SIZE);
				
				fill(255);
				text(node.val, textLeftMargin, bottomBorder + FONT_SIZE);
				text("Sequence: ", textLeftMargin, bottomBorder + (2 * FONT_SIZE));
				let currX = textLeftMargin + measureText("Sequence: ");
				for(var k = 0; k < i; k++) {
					if(node.sequence[k] == "E") {
						fill(EVEN_COLOR);
					} else {
						fill(ODD_COLOR);
					}
					text(node.sequence[k], currX, bottomBorder + (2 * FONT_SIZE));
					currX += measureText(node.sequence[k]);
				}
				fill(255);
				text("Collatz factor: " + round(node.sequence.length / node.val, 7), textLeftMargin, bottomBorder + (3 * FONT_SIZE));
			}
		}
	}
	setTimeout(draw, 0);
}

mouseMoved = function(event) {
	mouseX = event.offsetX;
	mouseY = event.offsetY;
}

addEvent("mousemove", mouseMoved);
draw();