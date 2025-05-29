
        let audioPlayer = document.getElementById('audioPlayer');
        let isPlaying = false;
        let currentSongCard = null;
        let allSongs = [];

        // Initialize audio player event listeners
        audioPlayer.addEventListener('loadedmetadata', updateTimeDisplay);
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', nextSong);
        audioPlayer.addEventListener('error', handleAudioError);

        function uploadAudio() {
            const fileInput = document.getElementById('audioFile');
            const files = fileInput.files;
            
            if (files.length === 0) {
                alert('Please select audio files to upload');
                return;
            }

            const uploadedSongsContainer = document.getElementById('uploadedSongs');
            
            for (let file of files) {
                if (file.type.startsWith('audio/')) {
                    const url = URL.createObjectURL(file);
                    const songCard = createSongCard(file.name, 'Unknown Artist', 'User Upload', url);
                    uploadedSongsContainer.appendChild(songCard);
                    allSongs.push(songCard);
                }
            }
            
            fileInput.value = ''; // Clear the input
            alert(`${files.length} audio file(s) uploaded successfully!`);
        }

        function createSongCard(title, artist, album, audioSrc) {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.setAttribute('data-audio', audioSrc);
            
            songCard.innerHTML = `
                <div class="song-image"></div>
                <div class="song-info">
                    <h3>${title}</h3>
                    <p>Singer: ${artist}</p>
                    <p>Album: ${album}</p>
                </div>
                <button class="play-btn" onclick="playSong(this.parentElement)">▶️</button>
            `;
            
            return songCard;
        }

        function playSong(songCard) {
            const audioSrc = songCard.getAttribute('data-audio');
            const title = songCard.querySelector('h3').textContent;
            const artist = songCard.querySelector('p').textContent.replace('Singer: ', '');
            
            // Remove playing class from all cards
            document.querySelectorAll('.song-card').forEach(card => {
                card.classList.remove('playing');
            });
            
            // Add playing class to current card
            songCard.classList.add('playing');
            currentSongCard = songCard;
            
            // Update now playing info
            document.getElementById('currentSong').textContent = title;
            document.getElementById('currentArtist').textContent = artist;
            
            // Load and play audio
            if (audioSrc && audioSrc !== './path/to/your/audio1.mp3' && !audioSrc.includes('path/to/your')) {
                audioPlayer.src = audioSrc;
                audioPlayer.load();
                
                audioPlayer.addEventListener('canplay', function() {
                    audioPlayer.play().then(() => {
                        isPlaying = true;
                        updatePlayButton();
                    }).catch(err => {
                        console.error('Error playing audio:', err);
                        alert('Could not play this audio file. Please check the file format.');
                    });
                }, { once: true });
            } else {
                alert('Please upload an audio file or update the audio path for this song.');
            }
        }

        function togglePlay() {
            if (!audioPlayer.src) {
                alert('Please select a song first');
                return;
            }

            if (isPlaying) {
                audioPlayer.pause();
                isPlaying = false;
            } else {
                audioPlayer.play().then(() => {
                    isPlaying = true;
                }).catch(err => {
                    console.error('Error playing audio:', err);
                    alert('Could not play audio. Please check the file.');
                });
            }
            updatePlayButton();
        }

        function updatePlayButton() {
            const playBtn = document.getElementById('playPauseBtn');
            playBtn.textContent = isPlaying ? '⏸️' : '▶️';
        }

        function previousSong() {
            if (!allSongs.length) return;
            
            const currentIndex = allSongs.indexOf(currentSongCard);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : allSongs.length - 1;
            playSong(allSongs[prevIndex]);
        }

        function nextSong() {
            if (!allSongs.length) return;
            
            const currentIndex = allSongs.indexOf(currentSongCard);
            const nextIndex = (currentIndex + 1) % allSongs.length;
            playSong(allSongs[nextIndex]);
        }

        function seekSong(event) {
            if (!audioPlayer.src) return;
            
            const progressBar = event.currentTarget;
            const clickX = event.offsetX;
            const width = progressBar.offsetWidth;
            const duration = audioPlayer.duration;
            
            if (duration) {
                const seekTime = (clickX / width) * duration;
                audioPlayer.currentTime = seekTime;
            }
        }

        function changeVolume() {
            const volume = document.getElementById('volumeSlider').value;
            audioPlayer.volume = volume / 100;
        }

        function updateProgress() {
            if (audioPlayer.duration) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                document.getElementById('progressBar').style.width = progress + '%';
                
                // Update time display
                document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
            }
        }

        function updateTimeDisplay() {
            document.getElementById('totalTime').textContent = formatTime(audioPlayer.duration);
        }

        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function handleAudioError(e) {
            console.error('Audio error:', e);
            alert('Error loading audio file. Please check the file format and try again.');
            isPlaying = false;
            updatePlayButton();
        }

        // Initialize all songs array with existing cards
        document.addEventListener('DOMContentLoaded', function() {
            allSongs = Array.from(document.querySelectorAll('.song-card'));
            
            // Set initial volume
            audioPlayer.volume = 0.7;
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const songCards = document.querySelectorAll('.song-card');
            
            songCards.forEach(card => {
                const songTitle = card.querySelector('h3').textContent.toLowerCase();
                const songArtist = card.querySelector('p').textContent.toLowerCase();
                
                if (songTitle.includes(searchTerm) || songArtist.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = searchTerm === '' ? 'block' : 'none';
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                togglePlay();
            }
        });
    