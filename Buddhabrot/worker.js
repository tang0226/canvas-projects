onmessage = function(event) {
    let data = event.data;
    if(data.type == "draw") {
        var coordsToIndex = function(x, y) {
            return y * data.canvasWidth + x;
        }
        
        var indexToCoords = function(i) {
            return [i % data.canvasWidth, Math.floor(i / data.canvasHeight)];
        }
        
        var getValues = function(cRe, cIm) {
            let zRe = cRe;
            let zIm = cIm;
            let n = 1;
        
            let points = [];
        
            while((zRe * zRe + zIm * zIm) ** 0.5 <= 2 && n < data.iterations) {
                let temp = zRe * zRe - zIm * zIm + cRe; //Mandelbrot
                zIm = 2 * zRe * zIm + cIm;
                zRe = temp;

                /*let temp = zRe * zRe - zIm * zIm + cRe; // Burning Ship
                zIm = Math.abs(2 * zRe * zIm) + cIm;
                zRe = temp;*/

                /*let temp = zRe * zRe - zIm * zIm + cRe; // Tricorn
                zIm = -2 * zRe * zIm + cIm;
                zRe = temp;*/

                points.push([zRe, zIm]);
                n++;
            }
        
            //if(n == data.iterations) {
            //if(n != data.iterations) {
            if(n >= data.minIters && n != data.iterations) {
                return points;
            }

            return false;
        }
        
        var coordsToComplex = function(x, y) {
            return [
                data.reCenter + x / data.canvasWidth * data.imWidth - data.imWidth / 2,
                data.imCenter + y / data.canvasHeight * data.reHeight - data.reHeight / 2
            ];
        }
        
        var complexToCoords = function(re, im) {
            return [
                Math.round((im - (data.imCenter - data.reHeight / 2)) / data.reHeight * data.canvasHeight),
                Math.round((re - (data.reCenter - data.imWidth / 2)) / data.imWidth * data.canvasWidth)
            ];
        }
        
        var updateColors = function() {
            for(let i = 0; i < imgData.data.length; i++) {
                let bw = 255 * counts[i] / currMaxCount;
                let j = i * 4;
                imgData.data[j] =
                imgData.data[j + 1] =
                imgData.data[j + 2] = bw;
                imgData.data[j + 3] = 255;
            }
        }


        var imgData = new ImageData(data.canvasWidth, data.canvasHeight);
        for(var i = 0; i < data.canvasWidth * data.canvasHeight; i++) {
            let j = i * 4;
            imgData.data[j] =
            imgData.data[j + 1] =
            imgData.data[j + 2] = 0;
            imgData.data[j + 3] = 255;
        }

        var currMaxCount = 0;
        var counts = new Array(data.canvasWidth * data.canvasHeight);
        counts.fill(0);
        
        let interval = 0;
        while(true) {
            let points;
            while(!points) {
                points = getValues(Math.random() * 4 - 2, Math.random() * 4 - 2);
            }
            if(points) {
                for(let h = 0; h < points.length; h++) {
                    let p = points[h];
                    //console.log(p);
                    //console.log(p[1]);
                    let pCoords = complexToCoords(p[0], p[1]);
                    let px = Math.round(pCoords[0]);
                    let py = Math.round(pCoords[1]);
                    //console.log(px, py);
                    let i = coordsToIndex(px, py);
                    if(i < data.canvasWidth * data.canvasHeight) {
                        counts[i] += 1;
                    }
                }
            }
            interval++;
            if(interval == data.interval) {
                interval = 0;
                this.postMessage({
                    type: "update",
                    counts: counts
                })
            }
        }
    }
}
