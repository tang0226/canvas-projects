const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext("2d");

const canvasWidth = 1000;
const canvasHeight = 1000;

canvas.width = canvasWidth;
canvas.height = canvasHeight;


const iterations = 10000;

const endCutoffRate = 0;
//const endCutoff = Math.round(iterations * endCutoffRate);
const endCutoff = 0;

const startCutoffRate = 0.1;
const startCutoff = Math.round(iterations * startCutoffRate);


const minIters = 500;
const logBase = Math.E;
const factor = 1;


var imWidth = 4 * canvasHeight / canvasWidth;
var reHeight = 4;
var reCenter = -0.25;
var imCenter = 0;


var imgData = new ImageData(canvasWidth, canvasHeight);
for(var i = 0; i < canvasWidth * canvasHeight; i++) {
    let j = i * 4;
    imgData.data[j] =
    imgData.data[j + 1] =
    imgData.data[j + 2] = 0;
    imgData.data[j + 3] = 255;
}

const color = [255, 255, 255];
const pointsPerFrame = 1;


const renderWorker = new Worker("./worker.js");

var renders = 0;

renderWorker.onmessage = function(event) {
    let data = event.data;
    if(data.type == "update") {
        let maxCount = 0;
        let normalizedCounts = [];
        for(let i = 0; i < data.counts.length; i++) {
            let count = Math.log(data.counts[i] + 1);
            //let count = (1 - 1 / Math.E ** (data.counts[i] / 10)) ** 1.1;
            //let count = data.counts[i];
            //data.counts[i] = count;
            if(count > maxCount) {
                maxCount = count;
            }
            normalizedCounts.push(count);
        }
        //console.log(maxCount);
        let imgData = new ImageData(canvasWidth, canvasHeight);
        for(let i = 0; i < canvasWidth * canvasHeight; i++) {
            let j = i * 4;
            let bw = 255 * normalizedCounts[i] / maxCount;
            //let bw = 255 * Math.sqrt(normalizedCounts[i]) / Math.sqrt(maxCount);
            imgData.data[j] = bw;
            imgData.data[j + 1] = bw;
            imgData.data[j + 2] = bw;
            imgData.data[j + 3] = 255;
        }

        canvasCtx.putImageData(imgData, 0, 0);
        renders++;
        console.log(renders);
    }
}

renderWorker.postMessage({
    type: "draw",
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    iterations: iterations,
    startCutoff: startCutoff,
    endCutoff: endCutoff,
    minIters: minIters,
    imWidth: imWidth,
    reHeight: reHeight,
    reCenter, reCenter,
    imCenter, imCenter,
    interval: 1000
})

/*
function exportCanvasAsPNG(id, fileName) {

    var canvasElement = document.getElementById(id);

    var MIME_TYPE = "image/png";

    var imgURL = canvasElement.toDataURL(MIME_TYPE);

    var dlLink = document.createElement('a');
    dlLink.download = fileName;
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}
*/