const music = document.getElementById('background-music');
const muteButton = document.querySelector('.mute-button');

let isMuted = false;
let isFading = false;
let fadeDuration = 2000;
let targetVol = 0.03;

function saveMute(state) {
    localStorage.setItem('muted', state)
}

function loadMute() {
    return localStorage.getItem('muted') === 'true';
}

music.volume = 0.03;
music.muted = false;

function fadeOutMusic(audio, duration) {
    if (isFading) return;
    isFading = true;
    muteButton.disabled = true;
    saveMute(true);
    let startVol = audio.volume;
    let startTime = performance.now();

    function fadeStep(timestamp) {
        let elapsed = timestamp - startTime;
        let progress = elapsed / duration;

        audio.volume = startVol * Math.pow(1 - progress, 2);

        if (progress < 1) {
            requestAnimationFrame(fadeStep);
        } else {
            audio.volume = 0;
            audio.muted = true;
            muteButton.disabled = false;
            isFading = false;
        }
    }

    requestAnimationFrame(fadeStep);
}

function fadeInMusic(audio, duration) {
    if (isFading) return;
    isFading = true;
    muteButton.disabled = true;
    saveMute(false);
    let startVol = 0;
    music.volume = startVol;
    music.muted = false;
    let startTime = performance.now();

    function fadeStep(timestamp) {
        let elapsed = timestamp - startTime;
        let progress = elapsed / duration;

        audio.volume = targetVol * Math.pow(progress, 2);

        if (progress < 1) {
            requestAnimationFrame(fadeStep);
        } else {
            audio.volume = targetVol;
            isFading = false;
            muteButton.disabled = false;
        }
    }

    requestAnimationFrame(fadeStep);
}

muteButton.addEventListener('click', () => {
    if (isFading) return;
    if (!isMuted) {
        fadeOutMusic(music, fadeDuration);
        muteButton.textContent = 'Unmute';
    } else if(isMuted) {      
        fadeInMusic(music, fadeDuration);
        muteButton.textContent = 'Mute';
    }

    isMuted = !isMuted;
})

window.addEventListener('load', () => {
    isMuted = loadMute();
    console.log(isMuted);
    if (isMuted) {
        music.muted = true;
        music.volume = 0;
        muteButton.textContent = 'Unmute';
    } else {
        music.muted = false;
        music.volume = targetVol;
        muteButton.textContent = 'Mute';
    }
})