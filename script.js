let player;
let isPlayerReady = false;
let userHasInteracted = false;
let hasPlayerStarted = false;

// This function is the main entry point to create the player.
function createPlayer() {
    if (player) {
        // Player already exists, do nothing.
        return;
    }
    player = new YT.Player("player", {
        height: "100%",
        width: "100%",
        videoId: "5yx6BWlEVcY",
        playerVars: {
            autoplay: 0,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1
        },
        events: {
            onReady: () => {
                console.log("YouTube player ready ✅");
                isPlayerReady = true;
                tryStartPlayer();
            }
        }
    });
}

// A single function to manage the start logic, preventing multiple attempts.
function tryStartPlayer() {
    if (isPlayerReady && userHasInteracted && !hasPlayerStarted) {
        hasPlayerStarted = true;
        console.log("Starting player now...");

        player.unMute();
        player.playVideo();

        document.getElementById("overlay").style.display = "none";
        document.getElementById("player-wrapper").style.display = "block";
    }
}

// User interaction handler.
function initPlayer() {
    // No filter for modifier keys. Any key press will trigger this function.
    if (!userHasInteracted) {
        userHasInteracted = true;
        console.log("User has interacted 👋");
        tryStartPlayer();
    }
}

// Check if the YouTube API is already loaded when our script runs.
if (typeof YT !== 'undefined' && YT.Player) {
    createPlayer();
}

// This function is the official callback for when the YouTube API script loads.
function onYouTubeIframeAPIReady() {
    createPlayer();
}

// Add event listeners for keydown and click.
document.addEventListener("keydown", initPlayer, { once: true });
document.addEventListener("click", initPlayer, { once: true });

//Buttons functionalities

const fullscreenBtn = document.getElementById('fullscreen-btn');
const fullscreenIcon = document.getElementById('fullscreen-icon');

function toggleFullscreen() {
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    
    if (!isFullscreen) {
        // Enter fullscreen mode
        const bodyElement = document.documentElement;
        if (bodyElement.requestFullscreen) {
            bodyElement.requestFullscreen();
        } else if (bodyElement.webkitRequestFullscreen) {
            bodyElement.webkitRequestFullscreen();
        } else if (bodyElement.mozRequestFullScreen) {
            bodyElement.mozRequestFullScreen();
        } else if (bodyElement.msRequestFullscreen) {
            bodyElement.msRequestFullscreen();
        }
        // Change icon to 'windowed' state
        fullscreenIcon.src = "/assets/windowMode.png";
        fullscreenIcon.alt = "Exit Fullscreen";
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        // Change icon back to 'fullscreen' state
        fullscreenIcon.src = "/assets/fullScreen.png";
        fullscreenIcon.alt = "Fullscreen";
    }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);
function openTwitter(){
    window.open("https://x.com/__Swaraj", "_blank"); 
}
function openGitHub(){
    window.open("https://github.com/Swaraj-Singh-30/Lofi-Hub", "_blank");
}

// Pomodoro Timer Functionality

const pomodoroClock = document.getElementById("pomodoro-clock");
const pomodoroTimer = document.getElementById("pomodoro-timer");
const pomodoroStart = document.getElementById("pomodoro-start");
const pomodoroReset = document.getElementById("pomodoro-reset");
const pomodoroContinue = document.getElementById("pomodoro-continue");
const pomodoroStop = document.getElementById("pomodoro-stop");
const pomodoroOptions = document.getElementById("pomodoro-options");
const pomodoroAlarm = document.getElementById("pomodoro-alarm"); // new

let pomodoroInterval = null;
let pomodoroTime = 25 * 60; // 25 minutes in seconds
let pomodoroPaused = false;
let pomodoroRemaining = pomodoroTime;

function updatePomodoroDisplay() {
    const minutes = String(Math.floor(pomodoroRemaining / 60)).padStart(2, '0');
    const seconds = String(pomodoroRemaining % 60).padStart(2, '0');
    pomodoroTimer.textContent = `${minutes}:${seconds}`;
}

function showPomodoroState(state) {
    // state: 'idle', 'running', 'paused', 'ended'
    pomodoroStart.style.display = "none";
    pomodoroStop.style.display = "none";
    pomodoroContinue.style.display = "none";
    pomodoroReset.style.display = "none";
    pomodoroOptions.style.display = "none";

    if (state === "idle") {
        pomodoroStart.style.display = "inline-block";
        pomodoroReset.style.display = "inline-block";
    } else if (state === "running") {
        pomodoroStop.style.display = "inline-block";
    } else if (state === "paused") {
        pomodoroOptions.style.display = "flex";
        pomodoroContinue.style.display = "inline-block";
        pomodoroReset.style.display = "inline-block";
    } else if (state === "ended") {
        pomodoroOptions.style.display = "flex";
        pomodoroContinue.style.display = "none";
        pomodoroReset.style.display = "inline-block";
    }
}

function startPomodoro() {
    if (pomodoroInterval) return;
    pomodoroPaused = false;
    showPomodoroState("running");
    pomodoroInterval = setInterval(() => {
        if (pomodoroRemaining > 0) {
            pomodoroRemaining--;
            updatePomodoroDisplay();
        } else {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            pomodoroTimer.textContent = "Time's up!";
            showPomodoroState("ended");
            if (pomodoroAlarm) {
                pomodoroAlarm.currentTime = 0;
                pomodoroAlarm.play();
            }
        }
    }, 1000);
}

function pausePomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        pomodoroPaused = true;
        showPomodoroState("paused");
    }
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    pomodoroRemaining = pomodoroTime;
    updatePomodoroDisplay();
    pomodoroPaused = false;
    showPomodoroState("idle");
}

function continuePomodoro() {
    if (!pomodoroInterval && pomodoroPaused) {
        pomodoroPaused = false;
        showPomodoroState("running");
        pomodoroInterval = setInterval(() => {
            if (pomodoroRemaining > 0) {
                pomodoroRemaining--;
                updatePomodoroDisplay();
            } else {
                clearInterval(pomodoroInterval);
                pomodoroInterval = null;
                pomodoroTimer.textContent = "Time's up!";
                showPomodoroState("ended");
                if (pomodoroAlarm) {
                    pomodoroAlarm.currentTime = 0;
                    pomodoroAlarm.play();
                }
            }
        }, 1000);
    }
}

function stopPomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        pomodoroPaused = true;
        showPomodoroState("paused");
    }
}

// Button event listeners
pomodoroStart.addEventListener("click", startPomodoro);
pomodoroReset.addEventListener("click", resetPomodoro);
pomodoroTimer.addEventListener("click", pausePomodoro);
pomodoroContinue.addEventListener("click", continuePomodoro);
pomodoroStop.addEventListener("click", stopPomodoro);

// Toggle Pomodoro Clock visibility (does NOT pause timer)
function togglePomodoro() {
    if (pomodoroClock.style.display === "none" || pomodoroClock.style.display === "") {
        pomodoroClock.style.display = "block";
    } else {
        pomodoroClock.style.display = "none";
        // Do NOT pausePomodoro here!
    }
}

// Initialize Pomodoro clock hidden and timer display
pomodoroClock.style.display = "none";
updatePomodoroDisplay();
showPomodoroState("idle");