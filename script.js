const themeToggle = document.getElementById('theme-toggle');
const heart = document.getElementById('heart');
const secretMessage = document.getElementById('secret-message');
const deathScreen = document.getElementById('death-screen');
const bilqisToggle = document.getElementById('bilqis-toggle');
const bilqisInvertBtn = document.getElementById('bilqis-invert');
const windSound = document.getElementById('wind-sound'); 
const heartbeatSound = document.getElementById('heartbeat-sound'); 

let audioStarted = false;
let baseAudioDuration = 1.2; 

heartbeatSound.addEventListener('loadedmetadata', () => {
    baseAudioDuration = heartbeatSound.duration; 
});

// Sync logic: restart animation exactly when audio loops
heartbeatSound.addEventListener('play', () => {
    heart.style.animationDuration = `${baseAudioDuration / heartbeatSound.playbackRate}s`;
});

document.body.addEventListener('click', () => {
    if (!audioStarted) {
        // CHANGED: Wind volume lowered again to 0.03 (barely there)
        windSound.volume = 0.03; 
        windSound.play().catch(e => console.log("Audio blocked"));
        
        // Lowered heartbeat volume to 0.7 here
        heartbeatSound.volume = 0.7; 
        heartbeatSound.play().catch(e => console.log("Audio blocked"));
        
        heart.style.animationDuration = `${baseAudioDuration}s`;
        heart.classList.add('beating');
        audioStarted = true;
    }
}, { once: true });

// Theme Toggles
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('goth', themeToggle.checked);
    if (themeToggle.checked) {
        bilqisToggle.checked = false;
        document.body.classList.remove('bilqis', 'inverted');
        bilqisInvertBtn.style.display = 'none';
    }
});

bilqisToggle.addEventListener('change', () => {
    if (bilqisToggle.checked) {
        document.body.classList.add('bilqis');
        bilqisInvertBtn.style.display = 'block'; 
        themeToggle.checked = false;
        document.body.classList.remove('goth');
    } else {
        document.body.classList.remove('bilqis', 'inverted');
        bilqisInvertBtn.style.display = 'none'; 
    }
});

bilqisInvertBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    document.body.classList.toggle('inverted');
});

let clickCount = 0;
let calmDownTimer;
let canChangeMessage = true;

heart.addEventListener('click', () => {
    clickCount++;
    
    // Smooth speed ramping (capped at 3.5 to prevent audio vanishing)
    let speedFactor = Math.min(3.5, 1 + (clickCount * 0.08));
    heartbeatSound.playbackRate = speedFactor;
    heart.style.animationDuration = `${baseAudioDuration / speedFactor}s`;

    const updateMessage = (text) => {
        if (canChangeMessage) {
            secretMessage.textContent = text;
            secretMessage.style.opacity = "1";
            canChangeMessage = false;
            setTimeout(() => { canChangeMessage = true; }, 800);
        }
    };

    if (clickCount > 5 && clickCount <= 18) updateMessage("me when i think about you 😏");
    else if (clickCount > 18 && clickCount <= 30) updateMessage("uhhhh....maybe slow down 🤨");
    else if (clickCount > 30 && clickCount <= 42) updateMessage("okie okie i take it back slow down 😭🙏");
    else if (clickCount > 42 && clickCount <= 55) updateMessage("AAAAAAAAAAAAAAAAAAAAAAAUGGGHHHHHHHHAUGAGHGHGAH");
    else if (clickCount > 55) {
        // DEAD SCREEN TRIGGER
        deathScreen.style.display = "flex";
        heartbeatSound.pause(); // Stop the heartbeat sound immediately
        heartbeatSound.currentTime = 0; // Reset it
        heart.classList.remove('beating'); // Stop the animation
    }

    clearTimeout(calmDownTimer);
    calmDownTimer = setTimeout(() => {
        if (clickCount <= 55) {
            clickCount = 0;
            heartbeatSound.playbackRate = 1.0; 
            heart.style.animationDuration = `${baseAudioDuration}s`;
            secretMessage.style.opacity = "0";
        }
    }, 2000);
});

function resetGame() {
    deathScreen.style.display = "none";
    clickCount = 0;
    heartbeatSound.playbackRate = 1.0;
    heartbeatSound.play(); // Restart the sound
    heart.style.animationDuration = `${baseAudioDuration}s`;
    heart.classList.add('beating'); // Restart the animation
    secretMessage.style.opacity = "0";
}
