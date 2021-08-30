const file = document.getElementById("fileupload");

const container = document.getElementsByClassName("container");
const canvas = document.getElementById("canvas");
let audio = document.getElementById("audio1");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d");
const audioContext = new AudioContext();
let audioSource;
let analyser;
let currentMode;

let barWidth = 8;
let barHeight;
let barSpace = 2;
let r = 125;
let g = 125;
let b = 125;

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

let micToggleBtn = document.getElementById("micBtn");

micToggleBtn.addEventListener("click", () => {
    micToggleBtn.classList.toggle("active");
});

let songTitle = document.getElementById("title-container");
let songArtist = document.getElementById("artist-container");

file.addEventListener("change", function () {
    const files = this.files;
    songTitle.innerHTML = files[0].name;
    console.log(files[0]);
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    // audio.play();
    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let x;
    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiserMirror(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }

    animate();
});

// SIMPLE BARS

// function drawVisualiserSimple(bufferLength, x, barWidth, barHeight, dataArray) {
//     for (let i = 0; i < bufferLength; i++) {
//         barHeight = dataArray[i] * 0.8;
//         r = (i * barHeight) / 20;
//         g = barHeight / 2;
//         b = barHeight * 1.2;
//         ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
//         ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
//         x += barWidth + barSpace;
//     }
// }

// GRAN BARS

// function drawVisualiserGran(bufferLength, x, barWidth, barHeight, dataArray) {
//     let y;
//     for (let i = 0; i < bufferLength; i++) {
//         barHeight = dataArray[i];
//         r = (i * barHeight) / 20;
//         g = barHeight / 2;
//         b = barHeight * 1.2;
//         ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
//         let miniBarHeight = 15;
//         for (
//             y = canvas.height;
//             y > canvas.height - barHeight;
//             y -= miniBarHeight + barSpace
//         ) {
//             ctx.fillRect(x, y, barWidth, miniBarHeight);
//         }
//         x += barWidth + barSpace;
//     }
// }

//MIRROR BARS

function drawVisualiserMirror(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 0.5;
        r = (i * barHeight) / 20;
        g = barHeight / 2;
        b = barHeight * 1.2;
        let y = canvas.height / 2;
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.fillRect(x, y, barWidth, -barHeight);
        x += barWidth + barSpace;
    }
}

// Slider control points

let sizeP = document.getElementById("sizeP");
let redP = document.getElementById("redP");
let greenP = document.getElementById("greenP");
let blueP = document.getElementById("blueP");

sizeP.addEventListener("input", function () {
    barWidth = parseInt(sizeP.value);
});

redP.addEventListener("input", function () {
    r = parseInt(redP.value);
});

greenP.addEventListener("input", function () {
    g = parseInt(greenP.value);
});

blueP.addEventListener("input", function () {
    b = parseInt(blueP.value);
});

//Audio Player
/** Implementation of the presentation of the audio player */

const playIconContainer = document.getElementById("play-icon");
// const audioPlayerContainer = document.getElementById('audio-player-container');
const seekSlider = document.getElementById("seek-slider");
// const volumeSlider = document.getElementById("volume-slider");
// const muteIconContainer = document.getElementById("mute-icon");
let playState = "play";
let muteState = "unmute";

playIconContainer.addEventListener("click", () => {
    if (playState === "play") {
        audio.play();
        playIconContainer.innerHTML = "pause";
        playState = "pause";
    } else {
        audio.pause();
        playIconContainer.innerHTML = "play_arrow";
        playState = "play";
    }
});

// muteIconContainer.addEventListener("click", () => {
//     if (muteState === "unmute") {
//         muteAnimation.playSegments([0, 15], true);
//         audio.muted = true;
//         muteState = "mute";
//     } else {
//         muteAnimation.playSegments([15, 25], true);
//         audio.muted = false;
//         muteState = "unmute";
//     }
// });

/** Implementation of the functionality of the audio player */

const durationContainer = document.getElementById("duration");
const currentTimeContainer = document.getElementById("current-time");
// const outputContainer = document.getElementById("volume-output");
let raf = null;

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
};

const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
};

const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
};

function whilePlaying() {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    raf = requestAnimationFrame(whilePlaying);
}

// function metaDataLoad () {

// }

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
} else {
    audio.addEventListener("loadedmetadata", () => {
        displayDuration();
        setSliderMax();
    });
}

audio.addEventListener("play", whilePlaying());

seekSlider.addEventListener("input", () => {
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    if (!audio.paused) {
        cancelAnimationFrame(raf);
    }
});

seekSlider.addEventListener("change", () => {
    audio.currentTime = seekSlider.value;
    if (!audio.paused) {
        requestAnimationFrame(whilePlaying);
    }
});

// volumeSlider.addEventListener("input", (e) => {
//     const value = e.target.value;

//     outputContainer.textContent = value;
//     audio.volume = value / 100;
// });
