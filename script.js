// ==========================================
// 1. DOM ELEMENTS & VARIABLES
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const heart = document.getElementById('heart');
const secretMessage = document.getElementById('secret-message');
const deathScreen = document.getElementById('death-screen');
const bilqisToggle = document.getElementById('bilqis-toggle');
const bilqisInvertBtn = document.getElementById('bilqis-invert');
const windSound = document.getElementById('wind-sound'); 
const heartbeatSound = document.getElementById('heartbeat-sound'); 
const frozenSong = document.getElementById('frozen-song'); // Added to top

let audioStarted = false;
let baseAudioDuration = 1.2; 
let isFrozenMode = false; // Moved to top so the click listener can see it

// ==========================================
// 2. AUDIO SYNC & INITIALIZATION
// ==========================================
heartbeatSound.addEventListener('loadedmetadata', () => {
    baseAudioDuration = heartbeatSound.duration; 
});

// Sync logic: restart animation exactly when audio loops
heartbeatSound.addEventListener('play', () => {
    // Only sync to the normal heartbeat if we aren't in frozen mode
    if (!isFrozenMode) {
        heart.style.animationDuration = `${baseAudioDuration / heartbeatSound.playbackRate}s`;
    }
});

document.body.addEventListener('click', () => {
    if (!audioStarted) {
        windSound.volume = 0.03; 
        windSound.play().catch(e => console.log("Audio blocked"));
        
        heartbeatSound.volume = 0.2; 
        heartbeatSound.play().catch(e => console.log("Audio blocked"));
        
        heart.style.animationDuration = `${baseAudioDuration}s`;
        heart.classList.add('beating');
        audioStarted = true;
    }
}, { once: true });

// ==========================================
// 3. THEME TOGGLES
// ==========================================
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

// ==========================================
// 4. HEART CLICK LOGIC (MERGED)
// ==========================================
let clickCount = 0;
let calmDownTimer;
let canChangeMessage = true;

heart.addEventListener('click', () => {
    // ✨ Stop normal clicking if the Easter Egg is active!
    if (isFrozenMode) return; 

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
        heartbeatSound.pause(); 
        heartbeatSound.currentTime = 0; 
        heart.classList.remove('beating'); 
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
    
    // Only restart normal heartbeat if we aren't frozen
    if (!isFrozenMode) {
        heartbeatSound.playbackRate = 1.0;
        heartbeatSound.play(); 
        heart.style.animationDuration = `${baseAudioDuration}s`;
        heart.classList.add('beating'); 
    }
    secretMessage.style.opacity = "0";
}

// =========================================
// ✨ 5. THE EASTER EGGS (FROZEN & FIRE) ✨
// =========================================
let typedKeys = '';

// Exactly 85 BPM for "Fleeting Frozen Heart"
const songBPM = 85; 
const beatDuration = 60 / songBPM; // Calculates the perfect animation speed

document.addEventListener('keydown', (e) => {
    // Only works if we are in Bilqis mode
    if (!document.body.classList.contains('bilqis')) return;

    // Log the keys typed
    typedKeys += e.key.toLowerCase();

    // Trigger Frozen if they type 'frozen' and it's not already frozen
    if (typedKeys.includes('frozen') && !isFrozenMode) {
        typedKeys = ''; // Reset the keys
        triggerFrozenSequence();
    }
    
    // Trigger Fire if they type 'fire' and it IS currently frozen
    if (typedKeys.includes('fire') && isFrozenMode) {
        typedKeys = ''; // Reset the keys
        triggerFireSequence();
    }

    // Keep the string short so it doesn't take up memory
    if (typedKeys.length > 20) typedKeys = typedKeys.slice(-10);
});

function triggerFrozenSequence() {
    isFrozenMode = true; // Locks the heart clicks
    clickCount = 0; // Reset clicks so it doesn't carry over later

    // 1. THE FREEZE
    heartbeatSound.pause();
    windSound.pause();
    
    heart.classList.remove('beating');
    heart.style.animation = 'none';
    heart.style.transform = 'rotate(-45deg) scale(1)'; 

    secretMessage.textContent = "freezing...";
    secretMessage.style.color = "#aaddff"; 
    secretMessage.style.textShadow = "0 0 15px #0088ff"; 
    secretMessage.style.opacity = "1";

    // 2. THE DROP 
    setTimeout(() => {
        secretMessage.style.opacity = "0"; 
        
        frozenSong.volume = 0.4;
        frozenSong.play().catch(e => console.log("Audio blocked", e));
        
        heart.style.animation = `heartbeat ${beatDuration}s cubic-bezier(0.17, 0.89, 0.32, 1.28) infinite`;

        // The Icy Colors
        document.body.style.setProperty('--heart-color', '#aaddff'); 
        document.body.style.setProperty('--glow-color', '#0088ff');  
        document.body.style.setProperty('--bg-color', '#020611');    
        document.body.style.setProperty('--switch-bg', '#1a3355');   
        document.body.style.transition = "background-color 2s ease, filter 2s ease";
        
    }, 2000); 
}

function triggerFireSequence() {
    // 1. THE THAW
    frozenSong.pause();
    frozenSong.currentTime = 0; // Rewind the frozen song for next time
    
    heart.style.animation = 'none'; // Pause the fast beating temporarily

    // Fiery visual feedback
    secretMessage.textContent = "melting...";
    secretMessage.style.color = "#ffaa00"; // Fiery orange/yellow
    secretMessage.style.textShadow = "0 0 15px #ff2200"; // Hot red glow
    secretMessage.style.opacity = "1";

    // 2. BACK TO NORMAL
    setTimeout(() => {
        isFrozenMode = false; // Unlock standard clicks
        secretMessage.style.opacity = "0";
        
        // Remove the icy CSS properties so it defaults back to your stylesheet
        document.body.style.removeProperty('--heart-color'); 
        document.body.style.removeProperty('--glow-color');  
        document.body.style.removeProperty('--bg-color');    
        document.body.style.removeProperty('--switch-bg'); 
        
        // Restart normal sounds
        windSound.play().catch(e => console.log("Audio blocked"));
        heartbeatSound.playbackRate = 1.0;
        heartbeatSound.play().catch(e => console.log("Audio blocked"));
        
        // Restore standard heartbeat animation
        heart.style.animation = ''; // Clear inline animation
        heart.style.transform = ''; // Clear inline transform
        heart.style.animationDuration = `${baseAudioDuration}s`;
        heart.classList.add('beating');
        
    }, 1500); // 1.5 second thaw time
}
