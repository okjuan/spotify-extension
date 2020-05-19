import { TrackInfo } from './interface';
import { Spotify } from './spotify';
import { CACHE_KEY } from './constants';

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

export function registerButtonEvents(sp: Spotify, playback, render: () => void) {
  const btnPrev = document.getElementById('prev');
  const btnPause = document.getElementById('pause');
  const btnPlay = document.getElementById('play');
  const btnNext = document.getElementById('next');

  btnPause.onclick = async function () {
    displayControlButtons('play');
    await sp.pause();

    chrome.storage.sync.get([CACHE_KEY], function (result) {
      const { playingTrack } = result;
      if (playingTrack) {
        playingTrack.isPlaying = false;
        chrome.storage.sync.set({ playingTrack });
      }
    });
  };

  btnPlay.onclick = async function () {
    displayControlButtons('pause');
    await sp.play(playback);

    chrome.storage.sync.get([CACHE_KEY], function (result) {
      const { playingTrack } = result;
      if (playingTrack) {
        playingTrack.isPlaying = true;
        chrome.storage.sync.set({ playingTrack });
      }
    });
  };

  btnPrev.onclick = async function () {
    await sp.prev();
    // after click next song, call API again to update UI
    render();
  };

  btnNext.onclick = async function () {
    await sp.next();
    // after click next song, call API again to update UI
    render();
  };
}

type ButtonType = 'play' | 'pause';
type BoxType = 'player' | 'no-device-open-notification' | 'login-notification';
