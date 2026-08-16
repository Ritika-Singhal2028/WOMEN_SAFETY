let audio = document.getElementById("ringtone");
let timerInterval;
let seconds = 0;

window.onload = () => {
    // wait for click on overlay to start
    let overlay = document.getElementById("startSimulationOverlay");
    overlay.addEventListener("click", () => {
        overlay.style.display = "none";
        playRingtone();
    });
};

function playRingtone(){
    audio.loop = true;
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Accept call
function acceptCall(){
    audio.pause();
    audio.currentTime = 0;
    
    // UI Update
    document.body.classList.add("connected");
    
    // Hide incoming text, show timer
    document.getElementById("incomingText").style.display = "none";
    document.getElementById("timer").style.display = "inline";
    
    // Hide extra actions completely
    document.getElementById("extraActions").style.display = "none";
    
    // Show in-call options grid
    let inCallOptions = document.getElementById("inCallOptions");
    inCallOptions.style.display = "flex";
    setTimeout(() => {
        inCallOptions.style.opacity = "1";
    }, 10);
    
    // Hide accept button after CSS transition
    setTimeout(() => {
        document.getElementById("acceptContainer").style.display = "none";
    }, 500);

    // Start Timer
    startTimer();
}

function startTimer() {
    let timerElement = document.getElementById("timer");
    timerInterval = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        timerElement.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

// Decline call
function endCall(){
    audio.pause();
    audio.currentTime = 0;
    if(timerInterval) {
        clearInterval(timerInterval);
    }
    window.location.href = "index.html"; // Go back to home
}

if(navigator.vibrate){
    navigator.vibrate([500, 300, 500]);
}