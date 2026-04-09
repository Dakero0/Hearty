const themeToggle = document.getElementById('theme-toggle');
const heart = document.getElementById('heart');
const secretMessage = document.getElementById('secret-message');
const deathScreen = document.getElementById('death-screen');

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('goth', themeToggle.checked);
});

let clickCount = 0;
let calmDownTimer;
let canChangeMessage = true;

heart.addEventListener('click', () => {
    clickCount++;
    
    // Speed up heart
    let speed = Math.max(0.06, 1.2 - (clickCount * 0.04));
    heart.style.animationDuration = `${speed}s`;

    // Function to handle the "Space Time" for reading
    const updateMessage = (text) => {
        if (canChangeMessage) {
            secretMessage.textContent = text;
            secretMessage.style.opacity = "1";
            
            // Lock the message for 800ms so they can read it
            canChangeMessage = false;
            setTimeout(() => { canChangeMessage = true; }, 800);
        }
    };

    // Pacing logic
    if (clickCount > 5 && clickCount <= 18) {
        updateMessage("me when i think about you 😏");
    } 
    else if (clickCount > 18 && clickCount <= 30) {
        updateMessage("uhhhh....maybe slow down 🤨");
    } 
    else if (clickCount > 30 && clickCount <= 42) {
        updateMessage("okie okie i take it back slow down 😭🙏");
    } 
    else if (clickCount > 42 && clickCount <= 55) {
        updateMessage("AAAAAAAAAAAAAAAAAAAAAAAUGGGHHHHHHHHAUGAGHGHGAH");
    } 
    else if (clickCount > 55) {
        // The Final Death - we don't need a lock here because it's the end
        deathScreen.style.display = "flex";
    }

    // Reset logic: Only happens if they stop clicking
    clearTimeout(calmDownTimer);
    calmDownTimer = setTimeout(() => {
        if (clickCount <= 55) {
            clickCount = 0;
            heart.style.animationDuration = `1.2s`;
            secretMessage.style.opacity = "0";
        }
    }, 2000);
});