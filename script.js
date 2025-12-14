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
document.addEventListener('click', function (e) {
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
document.addEventListener('click', function (e) {
    const todoList = document.getElementById('todo-list');
    const todoBtn = document.querySelector('button[onclick="toggleTodo()"]');

    // Only close if visible
    if (todoList && (todoList.style.display === 'block' || getComputedStyle(todoList).display === 'block')) {
        const clickedInside = todoList.contains(e.target) || (todoBtn && todoBtn.contains(e.target));

        if (!clickedInside) {
            todoList.style.display = 'none';
            // Optional: Remove active class if we used one
            document.body.classList.remove("todo-active");
        }
    }
});

// Make Todo List Draggable
const todoHeader = todoList.querySelector("h3");
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

todoHeader.addEventListener("mousedown", dragStart);
document.addEventListener("mouseup", dragEnd);
document.addEventListener("mousemove", drag);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === todoHeader) {
        isDragging = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, todoList);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

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
// Single keydown listener that ignores typing in inputs/textareas/contenteditables
function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return true;
    if (el.isContentEditable) return true;
    // also check ancestors for contentEditable="true"
    let p = el;
    while (p) {
        if (p.contentEditable === "true") return true;
        p = p.parentElement;
    }
    return false;
}

document.addEventListener("keydown", function (e) {
    const active = document.activeElement || e.target;
    if (isTypingTarget(active)) return; // don't run shortcuts while typing

    const key = (e.key || "").toLowerCase();

    if (key === "g") {
        showRandomGif();
        return;
    }

    // Space (handle different browsers)
    if (key === " " || key === "spacebar" || e.code === "Space") {
        e.preventDefault();
        togglePlay();
        return;
    }

    if (key === "s") {
        shuffleTrack();
        return;
    }

    if (key === "m") {
        toggleMute();
        return;
    }

    if (key === "f") {
        toggleFullscreen();
        return;
    }

    if (key === "c" || key === "p") {
        togglePomodoro();
        return;
    }

    if (key === "t") {
        toggleTodo();
        return;
    }
});

// Video Call Functionality
let peer = null;
let localStream = null;
let currentCall = null;
let isExplicitHangup = false;
let joinAttempts = {};

function toggleVideoCall() {
    const videoPopup = document.getElementById("video-call-popup");
    const aboutPopup = document.getElementById("about-popup");
    const pomodoroClock = document.getElementById("pomodoro-clock");
    const todoList = document.getElementById("todo-list");

    if (videoPopup.style.display === "none" || videoPopup.style.display === "") {
        videoPopup.style.display = "block";
        // Don't close other popups to allow multitasking

        // Initialize PeerJS and stream if not already done
        if (!peer) {
            initPeer();
        }
        if (!localStream) {
            startLocalVideo();
        }
    } else {
        videoPopup.style.display = "none";
        // Only stop the camera if NOT in a call!!
        if (!currentCall) {
            stopLocalStream();
        }
    }
}

function initPeer() {
    const savedId = sessionStorage.getItem('lofi_peer_id');
    const config = {
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        }
    };

    if (savedId) {
        peer = new Peer(savedId, config);
    } else {
        peer = new Peer(config);
    }

    peer.on('open', function (id) {
        document.getElementById("my-peer-id").innerText = id;
        document.getElementById("call-status").innerText = "Ready to connect";
        sessionStorage.setItem('lofi_peer_id', id);
    });

    peer.on('connection', function (conn) {
        conn.on('data', function (data) {
            if (data && data.type === 'REJECT' && data.reason === 'ROOM_FULL') {
                showToast("Meeting is full. Only 2 participants allowed.");
                conn.close();
            }
        });
    });

    peer.on('call', function (call) {
        // Check if room is full
        if (currentCall) {
            const callerId = call.peer;
            joinAttempts[callerId] = (joinAttempts[callerId] || 0) + 1;

            if (joinAttempts[callerId] > 5) {
                showToast("Someone is trying to join the meeting...");
            }

            // Reject the call
            const conn = peer.connect(callerId);
            conn.on('open', function () {
                conn.send({ type: 'REJECT', reason: 'ROOM_FULL' });
                setTimeout(() => {
                    conn.close();
                    call.close();
                }, 500);
            });
            return;
        }

        // Show custom modal instead of confirm
        const modal = document.getElementById("incoming-call-modal");
        const acceptBtn = document.getElementById("btn-accept-call");
        const declineBtn = document.getElementById("btn-decline-call");

        modal.style.display = "flex";

        //Handle Accept 
        acceptBtn.onclick = function () {
            modal.style.display = "none";
            if (localStream) {
                call.answer(localStream);
                currentCall = call;
                handleCallStream(call);
                document.getElementById("call-status").innerText = "Connected";
            } else {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    localStream = stream;
                    document.getElementById("local-video").srcObject = stream;

                    // Reset buttons to match the new stream (Active = ON)
                    document.getElementById("btn-toggle-audio").classList.remove("active");
                    document.getElementById("btn-toggle-video").classList.remove("active");

                    call.answer(stream);
                    currentCall = call;
                    handleCallStream(call);
                    document.getElementById("call-status").innerText = "Connected";
                }).catch((err) => {
                    console.error('Failed to get local stream', err);
                    alert("Could not access camera/microphone.");
                });
            }
        };

        // Handle Decline
        declineBtn.onclick = function () {
            modal.style.display = "none";
            call.close();
        };
    });

    peer.on('error', function (err) {
        console.error(err);
        if (err.type === 'peer-unavailable') {
            showToast("Peer not available or code inactive");
        } else if (err.type === 'unavailable-id') {
            // If saved ID is unavailable, clear it and retry
            sessionStorage.removeItem('lofi_peer_id');
            peer.destroy();
            initPeer();
        } else {
            alert("PeerJS Error: " + err.type);
        }
    });
}

function startLocalVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localStream = stream;
        const localVideo = document.getElementById("local-video");
        localVideo.srcObject = stream;
        localVideo.muted = true; // Always mute local video to avoid feedback

        // Reset buttons to default state (ON)
        document.getElementById("btn-toggle-audio").classList.remove("active");
        const videoBtn = document.getElementById("btn-toggle-video");
        videoBtn.classList.remove("active");
        videoBtn.disabled = false;
    }).catch((err) => {
        console.error('Failed to get local stream', err);
        document.getElementById("call-status").innerText = "Error: No Camera/Mic access";
    });
}

function connectToPeer() {
    const remoteId = document.getElementById("remote-peer-id").value.trim();
    const myId = document.getElementById("my-peer-id").innerText;

    if (!remoteId) {
        showToast("Please enter a Peer ID");
        return;
    }

    if (remoteId === myId) {
        showToast("You can't call yourself, that's lonely! 🥺"); //LOL!!!
        return;
    }

    if (!peer) {
        alert("PeerJS not initialized. Try reopening the popup.");
        return;
    }

    if (currentCall) {
        showToast("You need to leave the current meeting to join another.");
        return;
    }

    document.getElementById("call-status").innerText = "Connecting...";

    // Get stream again to be sure (or reuse localStream)
    if (localStream) {
        const call = peer.call(remoteId, localStream);
        currentCall = call;
        handleCallStream(call);
    } else {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            localStream = stream;
            document.getElementById("local-video").srcObject = stream;

            // Reset buttons to match the new stream
            document.getElementById("btn-toggle-audio").classList.remove("active");
            document.getElementById("btn-toggle-video").classList.remove("active");

            const call = peer.call(remoteId, stream);
            currentCall = call;
            handleCallStream(call);
        }).catch((err) => {
            console.error('Failed to get local stream', err);
            alert("Could not access camera/microphone.");
        });
    }
}

function handleCallStream(call) {
    call.on('stream', function (remoteStream) {
        const remoteVideo = document.getElementById("remote-video");

        // Prevent re-assigning the same stream which causes AbortError
        if (remoteVideo.srcObject === remoteStream) {
            return;
        }

        remoteVideo.srcObject = remoteStream;
        document.getElementById("call-status").innerText = "Connected";

        // Explicitly play video for mobile compatibility
        const playPromise = remoteVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                if (e.name === 'AbortError') {
                    // Ignore AbortError as it means the video is loading/playing
                    console.log("Video play aborted (likely due to new stream load)");
                } else {
                    console.error("Error playing remote video:", e);
                }
            });
        }

        // Handle remote track mute/unmute (Camera toggle) to avoid frozen frames
        const videoTrack = remoteStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.onmute = function () {
                console.log("Remote video muted");
                remoteVideo.style.opacity = "0"; // Hide video to show placeholder
            };
            videoTrack.onunmute = function () {
                console.log("Remote video unmuted");
                remoteVideo.style.opacity = "1"; // Show video
            };
        }
    });

    call.on('close', function () {
        if (!isExplicitHangup) {
            endCallUI(true); // Remote hangup
        }
    });

    call.on('error', function (err) {
        console.error(err);
        endCallUI(true); // Treat error as remote hangup/disconnect
    });
}

function endCall() {
    isExplicitHangup = true; // Mark as local hangup
    if (currentCall) {
        currentCall.close();
    }
    endCallUI(false); // Local hangup
}

function stopLocalStream() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    const localVideo = document.getElementById("local-video");
    if (localVideo) {
        localVideo.srcObject = null;
    }
}

function endCallUI(isRemote) {
    currentCall = null;
    document.getElementById("remote-video").srcObject = null;
    document.getElementById("call-status").innerText = "Call Ended / Ready";

    // Stop the camera/mic when the call ends (regardless of who ended it)
    stopLocalStream();

    // Show End Screen
    const endScreen = document.getElementById("call-ended-screen");
    const endTitle = endScreen.querySelector("h2");
    const endMsg = endScreen.querySelector("p");

    if (isRemote) {
        endTitle.innerText = "Peer Left";
        endMsg.innerText = "The peer has left the meeting.";
    } else {
        endTitle.innerText = "Call Ended";
        endMsg.innerText = "Hope you had a productive session! 🚀";
    }

    endScreen.style.display = "flex";

    // Hide Video Grid & Controls
    document.querySelector(".video-grid").style.display = "none";
    document.querySelector(".control-bar").style.display = "none";
    document.querySelector(".video-header").style.display = "none";

    // Reset Buttons to "OFF" state (visually) since stream is stopped
    document.getElementById("btn-toggle-audio").classList.add("active");
    document.getElementById("btn-toggle-video").classList.add("active");

    // Destroy Peer connection so host appears unavailable
    if (peer) {
        peer.destroy();
        peer = null;
    }
}

function resetVideoUI() {
    isExplicitHangup = false; // Reset flag
    // Hide End Screen
    document.getElementById("call-ended-screen").style.display = "none";

    // Show Video Grid & Controls
    document.querySelector(".video-grid").style.display = "grid";
    document.querySelector(".control-bar").style.display = "flex";
    document.querySelector(".video-header").style.display = "flex";

    // Restart Local Video for next call
    startLocalVideo();

    // Re-initialize Peer connection
    if (!peer) {
        initPeer();
    }
}

function shareOnTwitter() {
    const text = encodeURIComponent("Just had a great study session on Lofi Hub! 🎵✨ Check it out:");
    const url = encodeURIComponent("https://lofihub.netlify.app");
    const hashtags = encodeURIComponent("lofi,study,focus");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`, "_blank");
}

function starOnGitHub() {
    window.open("https://github.com/Swaraj-Singh-30/Lofi-Hub", "_blank");
}

function toggleAudio() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            const btn = document.getElementById("btn-toggle-audio");
            btn.classList.toggle("active", !audioTrack.enabled);
            // Don't change innerText to avoid removing SVG
        }
    }
}

function toggleVideo() {
    const btn = document.getElementById("btn-toggle-video");
    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks().find(t => t.readyState === 'live');

    if (videoTrack && videoTrack.enabled) {
        // Turn OFF: Stop the track and signal peer
        videoTrack.enabled = false;
        videoTrack.stop();
        localStream.removeTrack(videoTrack);
        btn.classList.add("active");

        // Signal remote peer that video is gone
        if (currentCall && currentCall.peerConnection) {
            const sender = currentCall.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
            if (sender) {
                sender.replaceTrack(null);
            }
        }
    } else {
        // Turn ON: Request a new video stream
        btn.disabled = true; // Prevent double-clicks
        navigator.mediaDevices.getUserMedia({ video: true }).then((newStream) => {
            const newVideoTrack = newStream.getVideoTracks()[0];
            localStream.addTrack(newVideoTrack);
            btn.classList.remove("active");

            // If in a call, replace the track
            if (currentCall && currentCall.peerConnection) {
                const sender = currentCall.peerConnection.getSenders().find(s => s.track === null || s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(newVideoTrack);
                }
            }
        }).catch(err => {
            console.error("Failed to restart video:", err);
            alert("Could not restart camera.");
        }).finally(() => {
            btn.disabled = false;
        });
    }
}

function copyPeerId() {
    const idText = document.getElementById("my-peer-id").innerText;
    if (idText && idText !== "Generating...") {
        navigator.clipboard.writeText(idText).then(() => {
            showToast("ID copied to clipboard! 📋");
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
}

// Custom Toast Function
function showToast(message) {
    const toast = document.getElementById("toast-notification");
    const toastMsg = document.getElementById("toast-message");

    if (toast && toastMsg) {
        toastMsg.innerText = message;
        toast.classList.add("show");

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
}
