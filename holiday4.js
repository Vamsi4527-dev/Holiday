let audioPlayer = document.getElementById('audioPlayer');
let isPlaying = false;
let currentSongCard = null;
let allSongs = [];
audioPlayer.addEventListener('loadedmetadata', () => {
    document.getElementById('totalTime').textContent = formatTime(audioPlayer.duration);
});
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextSong);
function uploadAudio() {
    const files = document.getElementById('audioFile').files;
    const uploadedSongsContainer = document.getElementById('uploadedSongs');
    for (let file of files) {
        if (file.type.startsWith('audio/')) {
            const url = URL.createObjectURL(file);
            const songCard = createSongCard(file.name, 'Unknown Artist', 'User Upload', url);
            uploadedSongsContainer.appendChild(songCard);
            allSongs.push(songCard);
        }
    }
    document.getElementById('audioFile').value = '';
    alert(`${files.length} audio file(s) uploaded successfully!`);
}
function createSongCard(title, artist, album, audioSrc) {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.setAttribute('data-audio', audioSrc);
    card.innerHTML = `
        <div class="song-image"></div>
        <div class="song-info">
            <h3>${title}</h3>
            <p>Singer: ${artist}</p>
            <p>Album: ${album}</p>
        </div>
        <button class="play-btn" onclick="playSong(this.parentElement)">▶️</button>
    `;
    return card;
}

function playSong(card) {
    const audioSrc = card.getAttribute('data-audio');
    const title = card.querySelector('h3').textContent;
    const artist = card.querySelector('p').textContent.replace('Singer: ', '');

    document.querySelectorAll('.song-card').forEach(c => c.classList.remove('playing'));
    card.classList.add('playing');
    currentSongCard = card;

    document.getElementById('currentSong').textContent = title;
    document.getElementById('currentArtist').textContent = artist;

    audioPlayer.src = audioSrc;
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayButton();
    });
}
function togglePlay() {
    if (!audioPlayer.src) return;

    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    isPlaying = !isPlaying;
    updatePlayButton();
}
function updatePlayButton() {
    document.getElementById('playPauseBtn').textContent = isPlaying ? '⏸️' : '▶️';
}
function previousSong() {
    if (!allSongs.length) return;
    const index = allSongs.indexOf(currentSongCard);
    playSong(allSongs[index > 0 ? index - 1 : allSongs.length - 1]);
}
function nextSong() {
    if (!allSongs.length) return;
    const index = allSongs.indexOf(currentSongCard);
    playSong(allSongs[(index + 1) % allSongs.length]);
}
function seekSong(e) {
    if (!audioPlayer.duration) return;
    const bar = e.currentTarget;
    const seekTime = (e.offsetX / bar.offsetWidth) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
}
function changeVolume() {
    audioPlayer.volume = document.getElementById('volumeSlider').value / 100;
}
function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
}
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
//initial setiup
document.addEventListener('DOMContentLoaded', () => {
    allSongs = Array.from(document.querySelectorAll('.song-card'));
    audioPlayer.volume = 0.7;
    document.getElementById('searchInput').addEventListener('input', e => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.song-card').forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const artist = card.querySelector('p').textContent.toLowerCase();
            card.style.display = title.includes(searchTerm) || artist.includes(searchTerm) ? 'block' : 'none';
        });
    });
});
