const emergencyFactor = 500;
const emergencyThreshold = 3;

class Word {
    constructor(word, count, x, y, dir) {
        this.word = word;
        this.count = count;
        this.size = count / 100;

        if(this.size < emergencyThreshold) {
            fontSize(this.size * emergencyFactor);
        }
        else {
            fontSize(this.size);
        }
        
        this.measured = ctx.measureText(this.word);

        if(y != undefined && x != undefined) {
            this.x = x;
            this.y = y;
        }
        if(dir != undefined) {
            this.dir = dir;
            this.updateDim();
        }
        if(x != undefined && y != undefined && dir != undefined) {
            this.collisionBox = new CollisionBox(x, y, this.absWidth, this.absHeight, dir);
        }
    }

    updateDim() {
        let length = this.measured.actualBoundingBoxRight + this.measured.actualBoundingBoxLeft;
        let height = this.measured.actualBoundingBoxAscent + this.measured.actualBoundingBoxDescent;
        this.absWidth = this.dir == 0 ? length : height;
        this.absHeight = this.dir == 0 ? height : length;

        if(this.size < emergencyThreshold) {
            this.absWidth /= emergencyFactor;
            this.absHeight /= emergencyFactor;
        }
    }

    updateCollisionBox() {
        this.collisionBox = new CollisionBox(this.x, this.y, this.absWidth, this.absHeight, this.dir);
    }

    setPosition(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.updateDim();

        this.updateCollisionBox();
    }

    setDirection(dir) {
        this.dir = dir;
        this.updateDim();
    }

    draw(frame, scale) {
        fontSize(this.size * scale);
        let m = ctx.measureText(this.word);

        let c = frame.toCanvasCoords(this.x, this.y);
        let x = c[0];
        let y = c[1];
        let w = (m.actualBoundingBoxRight + m.actualBoundingBoxLeft);
        let h = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
        ctx.fillStyle = "#000000";

        if(this.dir == 0) {
            ctx.translate(x, y);
        }
        else if(this.dir == 1) {
            ctx.translate(x + h, y);
            ctx.rotate(Math.PI / 2);
        }
        else if(this.dir == -1) {
            ctx.translate(x, y + w);
            ctx.rotate(-Math.PI / 2);
        }

        ctx.fillText(this.word, m.actualBoundingBoxLeft, m.actualBoundingBoxAscent);
        if(drawBoxes) ctx.strokeRect(
            0, 0, w, h
        );

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}