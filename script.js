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
        height: "20%",
        width: "20%",
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
            onReady: function (event) {
                console.log("YouTube player ready ✅");
                isPlayerReady = true;
                tryStartPlayer();
                updatePlayerTitle();
                // Listen for state changes to update title
                event.target.addEventListener('onStateChange', function () {
                    updatePlayerTitle();
                });
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

// Hamburger menu toggle for mobile
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger-menu');
    const headerBtns = document.getElementById('header-btns');
    if (hamburger && headerBtns) {
        hamburger.addEventListener('click', function () {
            headerBtns.classList.toggle('active');
        });
        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 600 && !headerBtns.contains(e.target) && !hamburger.contains(e.target)) {
                headerBtns.classList.remove('active');
            }
        });
    }
});

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
function openTwitter() {
    const text = encodeURIComponent("Chilling to lofi beats✨  at");
    const url = encodeURIComponent("https://lofihub.netlify.app");
    const hashtags = encodeURIComponent("lofi,music,chill");
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;

    window.open(twitterUrl, "_blank");
}

function openGitHub() {
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
const pomodoroAlarm = document.getElementById("pomodoro-alarm"); // Alarm sound element

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
    const aboutPopup = document.getElementById("about-popup");
    if (pomodoroClock.style.display === "none" || pomodoroClock.style.display === "") {
        pomodoroClock.style.display = "block";
        todoList.style.display = "none";
        if (aboutPopup) aboutPopup.style.display = "none";
    } else {
        pomodoroClock.style.display = "none";
    }
}

// Initialize Pomodoro clock hidden and timer display
pomodoroClock.style.display = "none";
updatePomodoroDisplay();
showPomodoroState("idle");

// Hide pomodoro clock when clicking outside
document.addEventListener('click', function(e) {
    const pomodoroClock = document.getElementById('pomodoro-clock');
    const pomodoroBtn = document.querySelector('button[onclick="togglePomodoro()"]');
    if (pomodoroClock && pomodoroClock.style.display === 'block') {
        const clickedInside = pomodoroClock.contains(e.target) || (pomodoroBtn && pomodoroBtn.contains(e.target));
        if (!clickedInside) {
            pomodoroClock.style.display = 'none';
        }
    }
});


// To-Do List Functionality
const todoList = document.getElementById("todo-list");
todoList.style.display = "none"
function toggleTodo() {
    const aboutPopup = document.getElementById("about-popup");
    if (todoList.style.display === "none" || todoList.style.display === "") {
        todoList.style.display = "block";
        pomodoroClock.style.display = "none";
        if (aboutPopup) aboutPopup.style.display = "none";
    } else {
        todoList.style.display = "none";
    }
}

function addTask() {
    const input = document.getElementById("new-task-input");
    const text = input.value.trim();
    const maxLength = 50; // limit task length

    if (text === "") {
        console.log("add something");
        return;
    }

    if (text.length > maxLength) {
        alert(`Task cannot exceed ${maxLength} characters.`);
        return;
    }

    const ul = document.getElementById("task-list");
    const li = document.createElement("li");

    // Task text
    const span = document.createElement("span");
    span.textContent = text;

    // Cross/Uncross button
    const crossBtn = document.createElement("button");
    crossBtn.textContent = "✔️";
    crossBtn.onclick = function () {
        span.style.textDecoration =
            span.style.textDecoration === "line-through" ? "none" : "line-through";
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = function () {
        li.remove();
    };

    // Append everything
    li.appendChild(span);
    li.appendChild(crossBtn);
    li.appendChild(deleteBtn);
    ul.appendChild(li);

    input.value = "";
}

// Hide todo list when clicking outside
document.addEventListener('click', function(e) {
    const todoList = document.getElementById('todo-list');
    const todoBtn = document.querySelector('button[onclick="toggleTodo()"]');
    if (todoList && todoList.style.display === 'block') {
        const clickedInside = todoList.contains(e.target) || (todoBtn && todoBtn.contains(e.target));
        if (!clickedInside) {
            todoList.style.display = 'none';
        }
    }
});

// Gift functionality
const gifUrls = ["https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHpnb2Q5amUyc2o1czczMTlvdXc4NjdmZDhvcnQyNHNnMzd4d2wwdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/A5ffIYwJoEpVcMOYiO/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bzJveGNvcXppYjJjaTJnMjIzMmdlbjc4aHVjam1iN25jZXJ1N3hpeSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/LSKHkpRJySs5W81D7B/giphy.gif", "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDBzNmFxcHVqNHhxZmI4bjlibmhyYWplZ2NuNDFsMTR0dzAzbmtqMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZCSZp478OpzSMpAAFc/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExand0ZzVkaXV2ajQ3a3ZjemM4NGdrYWF1M3R6aXA4YW1xMHhvcm80YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BbmDhO2gx3o96CpVM1/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHA0emw4aWtub3Qwb3RsMWo0aDl0djF2cWowOGQ2NnA5Z2gyZWdwbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dvreHY4p06lzVSDrvj/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bG1nbTZ2YmpzbHlsMXdteHU4dTRlZnB0YWZ0cTFrM2Rvc3VvcHZuayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RgZFvGuI4OxLjuSvRF/giphy.gif"];

const gifUrlsMobile = ["https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTZxdjhrN2NpMTEybzAyZm5hNHgzd3VnM2R2MDlobms4MjR6eHd5ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/k8kITi9SAwe9JWbUaH/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTZxdjhrN2NpMTEybzAyZm5hNHgzd3VnM2R2MDlobms4MjR6eHd5ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/H62NM1ab7wzMXURdoi/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTZxdjhrN2NpMTEybzAyZm5hNHgzd3VnM2R2MDlobms4MjR6eHd5ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/c2CDTcHLscXaU5s1vK/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eHd5eHY3c3N2dnA2Nm9td2lob29iNGt3NjEyZDZlc3Z6NXA5dDM0OCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/QxSveBdhdtLgagcKdR/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHpnb2Q5amUyc2o1czczMTlvdXc4NjdmZDhvcnQyNHNnMzd4d2wwdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/A5ffIYwJoEpVcMOYiO/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bzJveGNvcXppYjJjaTJnMjIzMmdlbjc4aHVjam1iN25jZXJ1N3hpeSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/LSKHkpRJySs5W81D7B/giphy.gif"];

let currentGifIndex = 0;

function isMobileDevice() {
    // User-Agent check (covers most phones/tablets)
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function showRandomGif() {
    // Detect if mobile by width OR userAgent
    const isMobile = window.innerWidth <= 768 || isMobileDevice();

    // Pick correct gif array
    const gifs = isMobile ? gifUrlsMobile : gifUrls;

    // Random index
    currentGifIndex = Math.floor(Math.random() * gifs.length);

    // Update the image
    const gifImg = document.getElementById("lofi-gif");
    if (gifImg) {
        gifImg.src = gifs[currentGifIndex];
        console.log(`Showing ${isMobile ? "MOBILE" : "DESKTOP"} GIF:`, gifImg.src);
    }
}

// Run when DOM is ready
window.addEventListener("DOMContentLoaded", showRandomGif);

// Also re-check on resize or orientation change
window.addEventListener("resize", showRandomGif);
window.addEventListener("orientationchange", showRandomGif);

// Run on page load
window.addEventListener("load", showRandomGif);

// // Optional: change GIF if window is resized
// window.addEventListener("resize", showRandomGif);

// Play Pause Functionality
let playerState = "playing";
const playerImg = document.getElementById("pause-btn");

function togglePlay() {
    if (playerState !== "paused") {
        player.pauseVideo();
        playerState = "paused";
        playerImg.src = "/assets/play.png";
        playerImg.alt = "Play Icon";
    }
    else {
        player.playVideo();
        playerState = "playing";
        playerImg.src = "/assets/pause.png";
        playerImg.alt = "Pause Icon";
    }
}


// Volume Control
const volumeSlider = document.getElementById("volume-slider");

// Set initial volume when player is ready
function setInitialVolume() {
    if (player && typeof player.setVolume === "function") {
        player.setVolume(volumeSlider.value);
    }
}

// Update player volume when slider changes
volumeSlider.addEventListener("input", () => {
    if (player && typeof player.setVolume === "function") {
        player.setVolume(volumeSlider.value);
    }
});

// Ensure initial volume is set when player is ready
function onYouTubePlayerReady() {
    setInitialVolume();
}

// If player is already ready, set volume
if (isPlayerReady) {
    setInitialVolume();
}

if (typeof YT !== 'undefined' && YT.Player) {
    createPlayer();
    setTimeout(setInitialVolume, 1000); // fallback in case onReady is async
}


// Mute/Unmute Functionality
let isMuted = false;
const volumeIcon = document.getElementById("volume-icon");

function toggleMute() {
    if (!isMuted) {
        player.mute();
        isMuted = true;
        volumeIcon.src = "/assets/muteIcon.png";
        volumeIcon.alt = "Muted Icon";
        volumeSlider.value = 0;
    } else {
        player.unMute();
        isMuted = false;
        volumeIcon.src = "/assets/volumeIcon.png";
        volumeIcon.alt = "Volume Icon";
        volumeSlider.value = 50;
    }
}

// Update mute icon and state whenever the slider changes
volumeSlider.addEventListener("input", () => {
    if (volumeSlider.value == 0) {
        isMuted = true;
        volumeIcon.src = "/assets/muteIcon.png";
        volumeIcon.alt = "Muted Icon";
    } else {
        isMuted = false;
        volumeIcon.src = "/assets/volumeIcon.png";
        volumeIcon.alt = "Volume Icon";
    }
});

// Set the correct icon on load based on slider value
if (volumeSlider.value == 0) {
    isMuted = true;
    volumeIcon.src = "/assets/muteIcon.png";
    volumeIcon.alt = "Muted Icon";
} else {
    isMuted = false;
    volumeIcon.src = "/assets/volumeIcon.png";
    volumeIcon.alt = "Volume Icon";
}

//Preserving the default state of volume slider and icon

if (volumeSlider) {
    // Set the slider value to a default (e.g., 50)
    volumeSlider.value = 50;

    // Set the volume of the player to match the new slider value
    if (player && typeof player.setVolume === "function") {
        player.setVolume(volumeSlider.value);
    }

    // Ensure the player is unmuted
    if (player && typeof player.unMute === "function") {
        player.unMute();
    }

    // Set the icon to the unmuted state
    volumeIcon.src = "/assets/volumeIcon.png";
    volumeIcon.alt = "Volume Icon";
    isMuted = false;
}

// Live YT lofi tracks IDs
const myTrackIds = ["4xDzrJKXOOY", "HuFYqnbVbzY", "UI5NKkW8acM", "yf5NOyy1SXU", "Gm4YmrKKHA8", "5yx6BWlEVcY"];

let currentTrackIndex = 0;

function shuffleTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % myTrackIds.length;
    player.loadVideoById(myTrackIds[currentTrackIndex]);
    showRandomGif();
}

// Video title updating 
function updatePlayerTitle() {
    var playerTitle = document.getElementById("player-title");
    if (player && typeof player.getVideoData === "function") {
        var videoTitle = player.getVideoData().title || "Now Playing";
        if (playerTitle) {
            const spans = playerTitle.querySelectorAll("span");
            spans.forEach(span => span.innerText = videoTitle);
        }
    }
}

// Call after loading a new video
function onTrackChange() {
    updatePlayerTitle();
}

// Call once on load (after player is ready)
if (isPlayerReady) {
    updatePlayerTitle();
}

// About Popup Functionality
var isAboutPopOpen = false;
function openAbout() {
    const aboutPopup = document.getElementById("about-popup");
    const pomodoroClock = document.getElementById("pomodoro-clock");
    const todoList = document.getElementById("todo-list");
    if (!isAboutPopOpen) {
        aboutPopup.style.display = "block";
        isAboutPopOpen = true;
        if (pomodoroClock) pomodoroClock.style.display = "none";
        if (todoList) todoList.style.display = "none";
    } else {
        aboutPopup.style.display = "none";
        isAboutPopOpen = false;
    }
}

// Shortcut keys functionality
//Changing GIF
document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === "g") {
        showRandomGif();
    }
});

//Play/Pause
document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === " ") {
        togglePlay();
    }
});

//Shuffle Track
document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === "s") {
        shuffleTrack();
    }
});

//Mute
document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === "m") {
        toggleMute();
    }
});

//Fullscreen
document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
    }
});

//Pomodoro
document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === "c" || e.key.toLowerCase() === "p") {
        togglePomodoro();
    }
})

//todo-list
document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === "t") {
        toggleTodo();
    }
})