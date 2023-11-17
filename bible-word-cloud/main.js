const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var canvasWidth = 3840;
var canvasHeight = 2160;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

ctx.fillStyle = "#000000";

class Frame {
    constructor(cx, cy, w, h) {
        this.cx = cx;
        this.cy = cy;
        this.x = cx - (w / 2);
        this.y = cy - (h / 2);
        this.w = w;
        this.h = h;
    }

    toCanvasCoords(absX, absY) {
        return [
            (absX - this.x) / this.w * canvasWidth,
            (absY - this.y) / this.h * canvasHeight
        ];
    }

    toAbsCoords(canvasX, canvasY) {
        return [
            this.x + canvasX * this.w / canvasWidth,
            this.y + canvasY * this.h / canvasHeight
        ];
    }

    zoom(factor, canvasX, canvasY) {
        let xOffset = canvasX - (canvasWidth / 2);
        let yOffset = canvasY - (canvasHeight / 2);

        let newW = this.w / factor;
        let newH = this.h / factor;

        let focus = this.toAbsCoords(canvasX, canvasY);
        let fx = focus[0];
        let fy = focus[1];

        this.cx = fx - (xOffset * newW / canvasWidth);
        this.cy = fy - (yOffset * newH / canvasHeight);

        this.w = newW;
        this.h = newH

        this.x = this.cx - (this.w / 2);
        this.y = this.cy - (this.h / 2);
    }

    intersects(box) {
        return (
            this.x + this.w > box.x &&
            this.x < box.oppX &&
            this.y + this.h > box.y &&
            this.y < box.oppY
        );
    }
}

class CollisionBox {
    constructor(x, y, w, h, dir) {
        //if(dir == 0) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        /*}
        else if(dir == 1) {
            this.x = x - h;
            this.y = y;
            this.w = h;
            this.h = w;

        }
        else if(dir == -1) {
            this.x = x;
            this.y = y - w;
            this.w = h;
            this.h = w;
        }*/
        this.oppX = this.x + this.w;
        this.oppY = this.y + this.h;
    }

    isColliding(box, margin) {
        return (
            this.oppX + margin > box.x &&
            this.x < box.oppX + margin &&
            this.oppY + margin > box.y &&
            this.y < box.oppY + margin
        );
    }
}

function isNonword(char) {
    return Boolean(char.match(/\W/));
}

function clean(str) {
    let out = str;
    while(true) {
        if(isNonword(out.slice(-1))) {
            out = out.slice(0, -1);
        }
        else if(isNonword(out.charAt(0))) {
            out = out.slice(1);
        }
        else {
            return out;
        }
    }
}

var verses = asv_bible.verses;
var wordCounts = {};
for(let i in verses) {
    let words = verses[i].text.split(" ");
    for(let w in words) {
        let cleaned = clean(words[w]).toLowerCase();
        if(!cleaned) {
            continue;
        }
        if(wordCounts[cleaned]) {
            wordCounts[cleaned]++;
        }
        else {
            wordCounts[cleaned] = 1;
        }
    }
}

var wordsData = [];
var keys = Object.keys(wordCounts);
for(let i in keys) {
    wordsData.push({word: keys[i], count: wordCounts[keys[i]]});
}

wordsData.sort(function(a, b) {
    if(a.count < b.count) {
        return 1;
    }
    if(a.count > b.count) {
        return -1;
    }
    return 0;
});


/*var factor = 100;
for(let x in words) {
    let val = Math.round(Math.log(words[x].count) / Math.log(1.01));
    ctx.fillRect(x, canvasHeight - val, 1, val);
}*/

function fontSize(s) {
    ctx.font = `${s}px sans-serif`;
}

/*
let currY = 0;
for(let i in words) {
    let size = Math.round(words[i].count * scale);
    currY += size;
    fontSize(size);
    ctx.fillText(`${words[i].word}, ${words[i].count}`, 0, currY);
}
console.log(currY);*/

/*function boxedText(text, size, x_, y) {
    fontSize(size);
    let measured = ctx.measureText(text);
    let heightAbove = measured.actualBoundingBoxAscent;
    let heightBelow = measured.actualBoundingBoxDescent;
    // used width or actualBoundingBoxRight prop:
    let width = measured.actualBoundingBoxRight + measured.actualBoundingBoxLeft;
    let height = heightAbove + heightBelow;
    let x = x_ + measured.actualBoundingBoxLeft;

    ctx.fillStyle = "#000000";
    ctx.fillText(text, x, y);
    ctx.strokeRect(x - measured.actualBoundingBoxLeft, y - heightAbove, width, height);
    ctx.fillStyle = "#00FFFF";
    ctx.fillRect(x, y, 10, 10);
}*/


const marginRate = 0.25;
const drawBoxes = false;

var positionedWords = [
    new Word("four", 20, 0, 0, 0),
    new Word("Lope", 5, 0, -50, 0),
    new Word("two", 10, -200, -100, -1),
    new Word("three", 15, 300, 0, 1)
];

var positionedWords = [new Word(wordsData[0].word, wordsData[0].count, -500, -500, 0)];

for(let i = 1; i < wordsData.length; i++) {
    let side = Math.floor(Math.random() * 4);
    //side = 0;
    while(positionedWords.length <= i) {
    //for(let a = 0; a < 100; a++) {
        let newWord = new Word(wordsData[i].word, wordsData[i].count);
        newWord.setDirection(Math.floor(Math.random() * 3) - 1);
        let adjWord = positionedWords[Math.floor(Math.random() * positionedWords.length)];
        //side = 1;
        let margin = newWord.size * marginRate;
        switch(side) {
            case 0:
                newWord.y = adjWord.y - newWord.absHeight - margin;
                newWord.x = adjWord.x + Math.random() * (adjWord.absWidth + newWord.absWidth) - newWord.absWidth;
            break;
            case 1:
                newWord.x = adjWord.x + adjWord.absWidth + margin;
                newWord.y = adjWord.y + Math.random() * (adjWord.absHeight + newWord.absHeight) - newWord.absHeight;
            break;
            case 2:
                newWord.y = adjWord.y + adjWord.absHeight + margin;
                newWord.x = adjWord.x + Math.random() * (adjWord.absWidth + newWord.absWidth) - newWord.absWidth;
            break;
            case 3:
                newWord.x = adjWord.x - newWord.absWidth - margin;
                newWord.y = adjWord.y + Math.random() * (adjWord.absHeight + newWord.absHeight) - newWord.absHeight;
                
        }
        newWord.updateCollisionBox();
        let valid = true;
        for(let j = 0; j < positionedWords.length; j++) {
            if(positionedWords[j].collisionBox.
                isColliding(newWord.collisionBox, margin)) {
                valid = false;
                break;
            }
        }
        if(valid) {
            positionedWords.push(newWord);
        }
    }
    if(i % 100 == 0) {
        console.log(i);
    }
}

/*for(let i = 0; i < 4; i++) {
    let w = new Word(wordsData[i].word, wordsData[i].count, 0, currY, 0);
    positionedWords.push(w);
    currY += w.absHeight;
}*/

var keys = {};
window.onkeydown = function(e) {
    keys[e.key] = true;
};
window.onkeyup = function(e) {
    keys[e.key] = false;
};


var scale = 0.2;
var view = new Frame(0, 0, canvasWidth / scale, canvasHeight / scale);

var zoomFactor = 1.5;
var minDrawnSize = 0.3;

function draw(s) {
    ctx.fillStyle = "rgba(255, 255, 255, 255)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for(let i in positionedWords) {
        let w = positionedWords[i];
        if(w.size * scale > minDrawnSize && view.intersects(w.collisionBox)) {
            positionedWords[i].draw(view, s);
        }
    }
}

draw(scale);
canvas.onclick = function(e) {
    if(keys["Shift"]) {
        scale /= zoomFactor;
        view.zoom(1 / zoomFactor, e.offsetX, e.offsetY);
    }
    else {
        scale *= zoomFactor;
        view.zoom(zoomFactor, e.offsetX, e.offsetY);
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    draw(scale);
}

/*canvas.onmousemove = function(e) {
    console.log(view.toCanvasCoords(...view.toAbsCoords(e.offsetX, e.offsetY)));
}*/

/*
ctx.translate(100, 100);
ctx.rotate(45 * Math.PI / 180);
ctx.fillStyle = "#FF0000";
ctx.fillRect(0, 0, 100, 10);
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.fillRect(0, 0, 100, 10);
ctx.fillStyle = "#000000";
ctx.fillRect(100, 100, 10, 10);*/ 
