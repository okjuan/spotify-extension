const player = document.getElementById('spotify-mini-player');
const notification = document.getElementById('spotify-mini-player-notification');
const loginNotification = document.getElementById('spotify-mini-player-login-notification');

const btnPrev = document.getElementById('prev');
const btnPause = document.getElementById('pause');
const btnPlay = document.getElementById('play');
const btnNext = document.getElementById('next');

const songTitle = document.getElementById('title');
const artistName = document.getElementById('artist');
const coverImage = document.getElementById('cover-photo');

let deviceId;
let songInfo;
let tokenGlobal;

function load() {
  handleAccessToken(async function (token) {
    tokenGlobal = token;
    const { accessToken, isAnonymous } = token;

    // If user "isAnonymous" is true
    // mean user is not login
    if (isAnonymous) {
      displayBox('login-notification');
      return;
    }

    const s = new Spotify();
    const { devices } = await s.getDevices(accessToken);

    if (devices.length > 0) {
      displayBox('player');
      deviceId = devices[0].id;
      chrome.storage.sync.get(['playingTrack'], async function (result) {
        const { playingTrack } = result;
        // call to get "playing" track
        let track = await s.getPlayingTrack(accessToken);

        // If it is a new user & the desktop app is not active
        // Get the recently played track
        if (!track && !playingTrack) {
          track = await s.getRecentlyPlayedTrack(accessToken);
        }

        songInfo = parseTrack(track);

        // Update last song played
        // In case suddently shut down Spotify app
        if (
          !playingTrack ||
          (songInfo && songInfo.title !== playingTrack.title) ||
          (songInfo && songInfo.isPlaying !== playingTrack.isPlaying) ||
          (songInfo && songInfo.uri !== playingTrack.uri)
        ) {
          chrome.storage.sync.set({ playingTrack: songInfo });
        } else {
          // if the songInfo is undefined
          // mean the Spotify App is not in active mode
          if (!songInfo) {
            songInfo = {
              ...playingTrack,
              isPlaying: false,
            };
          } else {
            songInfo = playingTrack;
          }
        }

        if (songInfo) {
          const { title, artist, coverPhoto, isPlaying } = songInfo;
          // update DOM UI
          title && (songTitle.textContent = title);
          artist && (artistName.textContent = artist);
          coverPhoto &&
            (coverImage.style.backgroundImage = `url('${coverPhoto}')`);
          displayControlButtons(isPlaying ? 'pause' : 'play');
        } else {
          displayControlButtons('play');
        }
      });
    } else {
      // Hide player control
      // Display message inform user to open Spotify Desktop App
      displayBox('no-device-open-notification');

      // If there is no devices are opening
      // then get the track info from cache and modify the state "isPlaying" to false
      chrome.storage.sync.get(['playingTrack'], async function (result) {
        const { playingTrack } = result;
        if (playingTrack) {
          playingTrack.isPlaying = false;
          chrome.storage.sync.set({ playingTrack });
        }
      });
    }
  });
}

btnPause.onclick = function () {
  displayControlButtons('play');
  const { accessToken } = tokenGlobal;
  const s = new Spotify();
  s.pause(accessToken, deviceId);

  chrome.storage.sync.get(['playingTrack'], async function (result) {
    const { playingTrack } = result;
    if (playingTrack) {
      playingTrack.isPlaying = false;
      chrome.storage.sync.set({ playingTrack });
    }
  });
};

btnPlay.onclick = function () {
  displayControlButtons('pause');
  const s = new Spotify();
  const { accessToken } = tokenGlobal;
  s.play(accessToken, deviceId, songInfo);

  chrome.storage.sync.get(['playingTrack'], async function (result) {
    const { playingTrack } = result;
    if (playingTrack) {
      playingTrack.isPlaying = true;
      chrome.storage.sync.set({ playingTrack });
    }
  });
};

btnPrev.onclick = function () {
  const s = new Spotify();
  const { accessToken } = tokenGlobal;
  s.prev(accessToken, deviceId);
  // after click next song, call API again to update UI
  load();
};

btnNext.onclick = function () {
  const s = new Spotify();
  const { accessToken } = tokenGlobal;
  s.next(accessToken, deviceId);
  // after click next song, call API again to update UI
  load();
};

function displayControlButtons(mode) {
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

function displayBox(mode) {
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

function parseTrack(rawData) {
  if (!rawData) return;

  const {
    is_playing: isPlaying,
    item: {
      name: title,
      artists,
      album: { images },
      uri,
    },
  } = rawData;

  const artist = artists.length > 0 ? artists[0].name : '';
  const coverPhoto = images.length > 0 ? images[1].url : '';

  return {
    title,
    artist,
    isPlaying,
    coverPhoto,
    uri,
  };
}

load();