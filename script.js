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
    if (pomodoroClock.style.display === "none" || pomodoroClock.style.display === "") {
        pomodoroClock.style.display = "block";
        todoList.style.display = "none"; // Hide todo list when showing pomodoro
    } else {
        pomodoroClock.style.display = "none";
        // Do NOT pausePomodoro here!
    }
}

// Initialize Pomodoro clock hidden and timer display
pomodoroClock.style.display = "none";
updatePomodoroDisplay();
showPomodoroState("idle");

// To-Do List Functionality

const todoList = document.getElementById("todo-list");
todoList.style.display = "none"
function toggleTodo(state) {
  if(todoList.style.display === "none" || todoList.style.display === ""){
    todoList.style.display = "block";
    pomodoroClock.style.display = "none"; // Hide pomodoro when showing todo list
  }
  else{
    todoList.style.display = "none"
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

// Gift functionality
const gifUrls = ["https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2U0dDdkaTVycDFtMWo2NmF4bWQ3eTl1cmhocHVtaHphZXZ4dXhubyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CW16nFVXLSQxSMUEMd/giphy.gif","https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmY0aGt6dG0wanpjanI0cm44ZmVnNXpsc2N3bnpkaGNzeHh1dWFiZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XyeHw1D6PNN3TRXFci/giphy.gif", "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJraG96cTB1NzFma2N1MWR5b3B1ZG9pa3hqenBsbHhiYzJxOHVoMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RMwgs5kZqkRyhF24KK/giphy.gif", "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGE0ZHg0aG9pYXJieXJ2ajJkMDN4MHNxMHVidm5vYWM0cHA0a3NpbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7F2HFcT5Ww7C5rRjso/giphy.gif", "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2NvZ3J1bHY1dHN6amc2MThjenBhdW1jMDZlNHNhcnh3Nzlubjh2dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KxbHmvL3MGcctzlfdX/giphy.gif", "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGp5NDUyYzdiY2NnMjB3azdjbGcxYmZ5bmZvbzNjZjBpb2VxcjFjciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUOwGcu6wd0cXBj5n2/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWQwc3pkcTlyYmF4dTltMTB4c3Q3M3IzOW1leWpmMXIyY3p0ZnU3OCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/tXzFpjeqVnE7m/giphy.gif", "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDQ2aGJndmRhcXludGI3Znh0OXY4dXU1eTlzcGFuN20ycjJrcXlvYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1fnu914Z79qQpVi2xZ/giphy.gif", "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWhha3E2M3Ftc3JqbTJ6YjFhMXJ6dnlmbW9qZm5tcmNjdjgxZDk3MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vLi3T5m3RH45y/giphy.gif", "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmY0aGt6dG0wanpjanI0cm44ZmVnNXpsc2N3bnpkaGNzeHh1dWFiZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XyeHw1D6PNN3TRXFci/giphy.gif", "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTAycXp2ZWczOWx3bDhrdmF1aXlyZTd4aWE0aTd1Z25xemxjY2xkMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1yld7nW3oQ2IyRubUm/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NXpydWVmaTEyczFqMmxvd2RwNmxtcXVycXR4NnMwa2U3eXlxMWd0cCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/JM0VkYyDrik3S/giphy.gif", "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjU2eHVoa2k4cGQ5ZXM0bzZteHB4OTc0czJ6OXh1aDhmbjQyMnRpMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pVGsAWjzvXcZW4ZBTE/giphy.gif", "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExODdkNjVud2g2ZTQ4ZzkyMDZkY3Bmb2NwdmVveHRhczZscHJmNmI2NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Basrh159dGwKY/giphy.gif", "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmZ1c25jYjhxcTI4cHUxN2dqdHM2cHN1Ymswd2hic2p4YjNiem93NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xWMPYx55WNhX136T0V/giphy.gif", "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmpqem5jZGN3ODBudGtyMG5hNGYxeDI0NXRhOW9pemY1dnVpOW1kMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TRebCjNbc4dIA/giphy.gif", "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnBtZWJzeXUzYzc4MXVwZmxlb29ka2w5bHVzYXJ6MGF0aTg3Ym5laCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SJle9EuvPEb16/giphy.gif","https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExajU3N3gwb3l1OWpvZDBuNTVrb3lvaXZhbzFka3Rxdmoya3EwNGd4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NKEt9elQ5cR68/giphy.gif","https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHMzeHl1NDhzbmxwMDR2MnJucjVoMGJ6ZmsyM2JxczcxN2xjZDRnMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tjYS8yUChlzSmdKx9x/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHMzeHl1NDhzbmxwMDR2MnJucjVoMGJ6ZmsyM2JxczcxN2xjZDRnMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/A5ffIYwJoEpVcMOYiO/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHMzeHl1NDhzbmxwMDR2MnJucjVoMGJ6ZmsyM2JxczcxN2xjZDRnMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ssq8oGi0pPO5rMLrEV/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aHQwbzdzcG90c2Fucmh0dGJzajMxcGVzeHZzMGFqNjBxeTk4YTc1NCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/A39hlmeW1On7LOtHO8/giphy.gif", "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OTdjdTF5YmhrNXh5aGlmam50MTdocDhqbm93enJoaHc1MXdmb3U0MCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/ckr4W2ppxPBeIF8dx4/giphy.gif", "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExenIyNWFlbTZ3MnNxZXN4NHQ1NGZoaWd3NWU1amhscGdvdXByczRlbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6705G9I9sUcNCaJF10/giphy.gif"];

let currentGifIndex = 0;
function showRandomGif() {
    currentGifIndex = Math.floor(Math.random() * gifUrls.length);
    const gifImg = document.getElementById("lofi-gif");
    if (gifImg) {
        gifImg.src = gifUrls[currentGifIndex];
    }
}

document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === "g") {
        showRandomGif();
    }
});

let playerState = "playing";
const playerImg = document.getElementById("pause-btn");
// Play Pause Functionality
function togglePlay() {
    if(playerState !== "paused"){
    player.pauseVideo();
    playerState = "paused";
    playerImg.src = "/assets/play.png";
    playerImg.alt = "Play Icon";
    }
    else{
    player.playVideo();
    playerState = "playing";
    playerImg.src = "/assets/pause.png";
    playerImg.alt = "Pause Icon";
    }
}