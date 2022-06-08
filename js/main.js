// VARIABLES
// GENERAL
const container = document.getElementsByClassName("container");
const pageContent = document.getElementById("content");
const settings = document.getElementById("settings");

//CANVAS
const canvas = document.getElementById("canvas");
const canvasContainer = document.getElementById("canvasCont")
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d");
const settingsBtn = document.getElementById("settingsBtn");
const fullBtn = document.getElementById("fullBtn");

//AUDIO
const audio = document.getElementById("audio1");
let audioContext;
let audioSource;

//AUDIO PLAYER
const playIconContainer = document.getElementById("play-icon");
const songTitle = document.getElementById("title-container");
const songArtist = document.getElementById("artist-container");
const seekSlider = document.getElementById("seek-slider");
const durationContainer = document.getElementById("duration");
const currentTimeContainer = document.getElementById("current-time");
const micToggleBtn = document.getElementById("micBtn");
const queueBtn = document.getElementById("queueBtn")
const file = document.getElementById("fileupload");

//SETTINGS
const newPatternBtn = document.getElementById("addPattern");
const patternBtnContainer = document.getElementById("patternBtnCont");
const patternBtns = document.getElementsByClassName("settings_label");
const simpleBtn = document.getElementById("toggleSimple");
const granBtn = document.getElementById("toggleGran");
const mirrorBtn = document.getElementById("toggleMirror");
const colorModeBtn = document.getElementById("checkColorMode");
const sizeP = document.getElementById("sizeP");
const spaceP = document.getElementById("spaceP");
const redP = document.getElementById("redP");
const greenP = document.getElementById("greenP");
const blueP = document.getElementById("blueP");

//VISUALIZER
let barWidth = 8;
let barHeight;
let barSpace = 2;
let miniBarHeight = 15;
let r = 125;
let g = 125;
let b = 125;
let rangeColor;
let currentPattern = 0;

//MODAL
const modal = document.getElementById("modal");

function initQueueList(files) {
    let queueList = document.getElementById("queueList");
    console.log(files)
    for (i = 0; i < files.length; i++) {
        queueList.innerHTML += `
        <div id="queueElement" class="queueList_queueElement">
                <div class="queueElement_song">${files[i].name}</div>
        </div>`

    }
}

//AUDIO AND VIZUALIZER INIT FUNCTION
//

function animate() {
    let x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentPattern == "0") {
        drawVisualiserSimple(
            bufferLength,
            x,
            barWidth,
            barHeight,
            dataArray
        );
    } else if (currentPattern == "1") {
        drawVisualiserGran(bufferLength, x, barWidth, barHeight, dataArray);
    } else if (currentPattern == "2") {
        drawVisualiserMirror(
            bufferLength,
            x,
            barWidth,
            barHeight,
            dataArray
        );
    }

    requestAnimationFrame(animate);
}

function setMicAudio() {
    if (micToggleBtn.className === "active") {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                audio.src = "";
                audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                audioSource = audioContext.createMediaStreamSource(stream);
                analyser.fftSize = 2048;
                audioSource.connect(analyser);
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                function animate() {
                    analyser.getByteFrequencyData(dataArray);
                    let x = 0;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if (currentPattern == "0") {
                        drawVisualiserSimple(
                            bufferLength,
                            x,
                            barWidth,
                            barHeight,
                            dataArray
                        );
                    } else if (currentPattern == "1") {
                        drawVisualiserGran(bufferLength, x, barWidth, barHeight, dataArray);
                    } else if (currentPattern == "2") {
                        drawVisualiserMirror(
                            bufferLength,
                            x,
                            barWidth,
                            barHeight,
                            dataArray
                        );
                    }

                    requestAnimationFrame(animate);
                }
                animate();
            })
            .catch(function (error) {
                console.log(error)
            })
    } else {
        navigator.mediaStream.getAudioTracks()[0].enabled = false;
    }

}

file.addEventListener("change", function () {
    const files = this.files;
    initQueueList(files)
    audioContext = new AudioContext();
    playIconContainer.ariaDisabled = "false";
    songTitle.innerHTML = files[0].name;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audioSource = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function animate() {

        let x = 0;
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (currentPattern == "0") {
            drawVisualiserSimple(
                bufferLength,
                x,
                barWidth,
                barHeight,
                dataArray
            );
        } else if (currentPattern == "1") {
            drawVisualiserGran(bufferLength, x, barWidth, barHeight, dataArray);
        } else if (currentPattern == "2") {
            drawVisualiserMirror(
                bufferLength,
                x,
                barWidth,
                barHeight,
                dataArray
            );
        }

        requestAnimationFrame(animate);
    }
    animate();
});

//CANVAS HEAVIOR

settingsBtn.addEventListener("click", function () {
    settings.classList.toggle("collapsed");
    pageContent.classList.toggle("resize-settings");
});

fullBtn.addEventListener("click", function () {
    canvasContainer.classList.toggle("fullscreen")
})


//TO DRAW VIZUALIZER BEHAVIOR
// SIMPLE BARS

function drawVisualiserSimple(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 0.8;
        rangeColor = i;
        if (colorModeBtn.checked) {
            ctx.fillStyle =
                "rgb(" +
                (i * barHeight) / (r * 0.1) +
                "," +
                barHeight / (g * 0.01) +
                "," +
                barHeight / (b * 0.01) +
                ")";
        } else {
            ctx.fillStyle = ctx.fillStyle =
                "rgb(" + r + "," + g + "," + b + ")";
        }
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + barSpace;
    }
}

// GRAN BARS

function drawVisualiserGran(bufferLength, x, barWidth, barHeight, dataArray) {
    let y;
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        rangeColor = i;
        if (colorModeBtn.checked) {
            ctx.fillStyle =
                "rgb(" +
                (i * barHeight) / (r * 0.1) +
                "," +
                barHeight / (g * 0.01) +
                "," +
                barHeight / (b * 0.01) +
                ")";
        } else {
            ctx.fillStyle = ctx.fillStyle =
                "rgb(" + r + "," + g + "," + b + ")";
        }
        for (
            y = canvas.height;
            y > canvas.height - barHeight;
            y -= miniBarHeight + barSpace
        ) {
            ctx.fillRect(x, y, barWidth, miniBarHeight);
        }
        x += barWidth + barSpace;
    }
}

//MIRROR BARS

function drawVisualiserMirror(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 0.5;
        rangeColor = i;
        let y = canvas.height / 2;
        if (colorModeBtn.checked) {
            ctx.fillStyle =
                "rgb(" +
                (i * barHeight) / (r * 0.1) +
                "," +
                barHeight / (g * 0.01) +
                "," +
                barHeight / (b * 0.01) +
                ")";
        } else {
            ctx.fillStyle = ctx.fillStyle =
                "rgb(" + r + "," + g + "," + b + ")";
        }
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.fillRect(x, y, barWidth, -barHeight);
        x += barWidth + barSpace;
    }
}

//SETTINGS BEHAVIOR

//NEW PATTERN BTN
newPatternBtn.addEventListener("click", function () {
    if (modal.innerHTML == "") {
        modal.innerHTML = `
                    <form class="modal_form">
                        <div class="modal_nameP">
                            <label for="name">Name </label>
                            <input class="modal_input--text" type="text" />
                        </div>
                        <div class="modal_colorP">
                            <label for="color">Color </label>
                            <div id="modal_pickerContainer"></div>
                        </div>
                        <div class="modal_sizeP">
                            <label for="size">Size </label>
                            <input class="modal_input--text" type="" />
                        </div>
                        <div class="modal_formP">
                            <label for="form">Form </label>
                            <input class="modal_input--text" type="text" />
                        </div>

                        <div
                            id="modal_newPatBtn"
                            class="modal_btn"
                        >
                            Create New Pattern
                        </div>
                    </form> `;

        modal.classList.toggle("modal--close");
    }
});

//PATERNS BTNS
function changeActivePattern() {
    for (let i = 0; i < patternBtns.length; i++) {
        patternBtns[i].classList.remove("selected");
    }
}

simpleBtn.addEventListener("click", function () {
    changeActivePattern();
    simpleBtn.classList.add("selected");
    currentPattern = 0;
});

granBtn.addEventListener("click", function () {
    changeActivePattern();
    granBtn.classList.add("selected");
    currentPattern = 1;
});

mirrorBtn.addEventListener("click", function () {
    changeActivePattern();
    mirrorBtn.classList.add("selected");
    currentPattern = 2;
});

//SILDERS
redP.addEventListener("input", function () {
    r = parseInt(redP.value);
});

greenP.addEventListener("input", function () {
    g = parseInt(greenP.value);
});

blueP.addEventListener("input", function () {
    b = parseInt(blueP.value);
});

sizeP.addEventListener("input", function () {
    barWidth = parseInt(sizeP.value);
});

//MODAL BEAHVIOR

//NEW PATTERN

modal.addEventListener(
    "click",
    function (e) {
        let target = e.target;

        if (target && target.id === "modal_newPatBtn") {
            modal.innerHTML = "";
            modal.classList.toggle("modal--close");
            // modal.style.visibility = "hidden";
        }
    },
    false
);

//AUDIO PLAYER BEHAVIOR

let playState = "none";
let muteState = "unmute";
let raf;

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

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
} else {
    audio.addEventListener("loadedmetadata", () => {
        displayDuration();
        setSliderMax();
        playState = "play";
    });
}

playIconContainer.addEventListener("click", () => {
    if (playState === "play") {
        audio.play();
        playIconContainer.innerHTML = "pause";
        playState = "pause";
    } else if (playState === "pause") {
        audio.pause();
        playIconContainer.innerHTML = "play_arrow";
        playState = "play";
    }
});

audio.addEventListener("play", whilePlaying());





micToggleBtn.addEventListener("click", () => {
    micToggleBtn.classList.toggle("active");
    setMicAudio()
});

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

queueBtn.addEventListener("click", () => {
    let queueList = document.getElementById("queueList");
    queueList.classList.toggle("closed");
})

// LOCAL STORAGE BEHAVIOR

function colorModeState() {
    if (colorModeBtn.checked) return true;
    else return false;
}

window.onbeforeunload = () => {
    const userConfig = [
        pattern = currentPattern,
        barWidth = sizeP.value,
        r = redP.value,
        g = greenP.value,
        b = blueP.value,
        colorModeState = colorModeState(),
    ];
    window.localStorage.setItem("user", JSON.stringify(userConfig));
};

window.onload = checkConfig;

function checkConfig() {
    if (window.localStorage.getItem("user")) {
        let toLoad = JSON.parse(localStorage.getItem("user"));
        currentPattern = toLoad[0];
        sizeP.value = toLoad[1];
        redP.value = toLoad[2];
        greenP.value = toLoad[3];
        blueP.value = toLoad[4];
        colorModeBtn.checked = toLoad[5];
    }
    switch (currentPattern) {
        case 0:
            simpleBtn.classList.add("selected");
            break;
        case 1:
            granBtn.classList.add("selected");
            break;
        case 2:
            mirrorBtn.classList.add("selected");
            break;
    }
    r = redP.value;
    g = greenP.value;
    b = blueP.value;
}
