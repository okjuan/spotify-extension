import { TrackInfo } from './interface';
import { Spotify } from './spotify';

export function displayTrackInfo(playback: TrackInfo) {
  const songTitle = document.getElementById('title');
  const artistName = document.getElementById('artist');
  const coverImage = document.getElementById('cover-photo');

  const { title, artist, coverPhoto } = playback;
  // update DOM UI
  title && (songTitle.textContent = title);
  artist && (artistName.textContent = artist);
  coverPhoto && (coverImage.style.backgroundImage = `url('${coverPhoto}')`);
}

export function displayControlButtons(mode: ButtonType) {
  const btnPause = document.getElementById('pause');
  const btnPlay = document.getElementById('play');

  switch (mode) {
    case 'play':
      btnPlay.style.display = 'block';
      btnPause.style.display = 'none';
      break;
    case 'pause':
      btnPlay.style.display = 'none';
      btnPause.style.display = 'block';
      break;
  }
}

export function displayBox(mode: BoxType) {
  const player = document.getElementById('spotify-mini-player');
  const notification = document.getElementById('spotify-mini-player-notification');
  const loginNotification = document.getElementById('spotify-mini-player-login-notification');

  switch (mode) {
    case 'player':
      player.style.display = 'flex';
      notification.style.display = 'none';
      loginNotification.style.display = 'none';
      break;
    case 'no-device-open-notification':
      player.style.display = 'none';
      notification.style.display = 'flex';
      loginNotification.style.display = 'none';
      break;
    case 'login-notification':
      player.style.display = 'none';
      notification.style.display = 'none';
      loginNotification.style.display = 'flex';
      break;
  }
}

export function registerEvents(
  sp: Spotify,
  playback: TrackInfo,
  render: () => void,
  updateTrackCache: (value: TrackInfo) => void,
  updateTrackInfo: (key: keyof TrackInfo, value) => void
) {
  const btnPrev = document.getElementById('prev');
  const btnPause = document.getElementById('pause');
  const btnPlay = document.getElementById('play');
  const btnNext = document.getElementById('next');

  document.addEventListener('keydown', async (e) => {
    e.preventDefault();
    if (e.code === 'Space') {
      if (playback.isPlaying === true) {
        await pause();
      } else {
        await play();
      }
    }
  });

  btnPause.onclick = async function (e) {
    e.preventDefault();
    await pause();
  };

  btnPlay.onclick = async function (e) {
    e.preventDefault();
    await play();
  };

  btnPrev.onclick = async function (e) {
    e.preventDefault();
    await sp.prev();
    // after click next song, call API again to update UI
    render();
  };

  btnNext.onclick = async function (e) {
    e.preventDefault();
    await sp.next();
    // after click next song, call API again to update UI
    render();
  };

  async function pause() {
    displayControlButtons('play');
    await sp.pause();
    updateTrackInfo('isPlaying', false);
    updateTrackCache({ isPlaying: false });
  }

  async function play() {
    displayControlButtons('pause');
    await sp.play(playback);
    updateTrackInfo('isPlaying', true);
    updateTrackCache({ isPlaying: true });
  }
}

type ButtonType = 'play' | 'pause';
type BoxType = 'player' | 'no-device-open-notification' | 'login-notification';
