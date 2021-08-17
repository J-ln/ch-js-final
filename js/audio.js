const file = document.getElementById("fileupload");

const container = document.getElementsByClassName("container");
const canvas = document.getElementById("canvas1");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d");
const audioContext = new AudioContext();
let audioSource;
let analyser;

// btn1.addEventListener("click", playSound);

// function playSound() {
//     const osc = audioCtx.createOscillator();
//     osc.connect(audioCtx.destination);
//     osc.type = "triangle";
//     osc.start();
//     setTimeout(function () {
//         osc.stop();
//     }, 1000);
// }

// adrep.addEventListener("click", function () {
//     audio1.play();
//     audioSource = audioContext.createMediaElementSource(audio1);
//     analy = audioContext.createAnalyser();
//     audioSource.connect(analy);
//     analy.connect(audioContext.destination);
//     analy.fftSize = 2048;
//     const bufferLength = analy.frequencyBitCount;
//     const dataArray = new Uint8Array(bufferLength);
// });

// let audio1 = document.getElementById("audio1");

// const micToggleBtn = getElementById("mic-button")

// navigator.getUserMedia =
//     navigator.getUserMedia ||
//     navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia;


// navigator.getUserMedia({ video: false, audio: true }, callback);

// let mic = ctx.createMediaStreamSource(stream);
// let audios = document.getElementById("audio1");
// let audio1 = document.getElementById("audio1");

// let micToggle = () => {
//     let toggler = getElementById("mic-button");
//     toggler.addEventListener("click", {
//         change() {
//             if (audio1 === audios) {
//                 toggler.classList.toggle("mic-on");
//                 audio1 = mic;
//                 let analyser = ctx.createAnalyser();
//                 let osc = ctx.createOscillator();
//                 audio.connect(analyser);
//                 osc.connect(ctx.destination);
//                 osc.start(0);

//                 var data = new Uint8Array(analyser.frequencyBinCount);
//             } else {
//                 toggler.classList.toggle("mic-on");
//                 audio1 = audios;
//             }
//         },
//     });
// };

file.addEventListener("change", function () {
    // const files = this.files;
    let audio1 = document.getElementById("audio1");
    // console.log(audio1);
    window.addEventListener("DOMContentLoaded", () => {
    navigator.mediaDevices
    .getUserMedia({ audio: { noiseSuppression: true } })
    .then((stream) => {
      mic = audioCtx.createMediaStreamSource(stream);
    });
    audio1.src = URL.createObjectURL(mic);
    audio1.load();
    audio1.play();

    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 20;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
});

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 0.8;
        let r = (i * barHeight) / 20;
        let g = barHeight / 2;
        let b = barHeight * 1.2;
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}

// function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
//     for (let i = 0; i < bufferLength; i++) {
//         barHeight = dataArray[i] * 0.5;
//         let r = (i * barHeight) / 20;
//         let g = barHeight / 2;
//         let b = barHeight * 1.2;
//         let ydown = canvas.height / 2;
//         let yup = canvas.height / 2 ;
//         ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
//         ctx.fillRect(x, ydown, barWidth, barHeight);
//         ctx.fillRect(x, yup, barWidth, -barHeight);
//         x += barWidth;
//     }
// }
