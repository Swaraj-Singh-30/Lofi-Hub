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