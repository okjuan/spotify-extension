const player = document.getElementById('spotify-mini-player');
const notification = document.getElementById(
  'spotify-mini-player-notification'
);

const btnPrev = document.getElementById('prev');
const btnPause = document.getElementById('pause');
const btnPlay = document.getElementById('play');
const btnNext = document.getElementById('next');

const songTitle = document.getElementById('title');
const artistName = document.getElementById('artist');
const coverImage = document.getElementById('cover-photo');

let deviceId;
let songInfo;

function load() {
  handleAccessToken(async function (accessToken) {
    const s = new Spotify();
    const devices = await s.getDevices(accessToken);

    if (devices.length > 0) {
      displayBox('player');

      deviceId = devices[0].id;

      chrome.storage.sync.get(['playingTrack'], async function (result) {
        const { playingTrack } = result;
        // call to get "playing" track
        const track = await s.getPlayingTrack(accessToken);
        songInfo = parseTrack(track);

        if (
          !playingTrack ||
          (songInfo && songInfo.title !== playingTrack.title) ||
          (songInfo && songInfo.isPlaying !== playingTrack.isPlaying)
        ) {
          chrome.storage.sync.set({ playingTrack: songInfo });
        } else {
          songInfo = playingTrack;
        }

        const { title, artist, coverPhoto, isPlaying } = songInfo;

        // update DOM UI
        title && (songTitle.textContent = title);
        artist && (artistName.textContent = artist);
        coverPhoto &&
          (coverImage.style.backgroundImage = `url('${coverPhoto}')`);

        displayControlButtons(isPlaying ? 'pause' : 'play');
      });
    } else {
      // Hide player control
      // Display message inform user to open Spotify Desktop App
      displayBox('notification');

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
  handleAccessToken(function (accessToken) {
    const s = new Spotify();
    s.pause(accessToken, deviceId);

    chrome.storage.sync.get(['playingTrack'], async function (result) {
      const { playingTrack } = result;
      if (playingTrack) {
        playingTrack.isPlaying = false;
        chrome.storage.sync.set({ playingTrack });
      }
    });
  });
};

btnPlay.onclick = function () {
  displayControlButtons('pause');
  handleAccessToken(function (accessToken) {
    const s = new Spotify();
    s.play(accessToken, deviceId);

    chrome.storage.sync.get(['playingTrack'], async function (result) {
      const { playingTrack } = result;
      if (playingTrack) {
        playingTrack.isPlaying = true;
        chrome.storage.sync.set({ playingTrack });
      }
    });
  });
};

btnPrev.onclick = function () {
  handleAccessToken(async function (accessToken) {
    const s = new Spotify();
    s.prev(accessToken, deviceId);
    // after click next song, call API again to update UI
    load();
  });
};

btnNext.onclick = function () {
  handleAccessToken(async function (accessToken) {
    const s = new Spotify();
    await s.next(accessToken, deviceId);
    // after click next song, call API again to update UI
    load();
  });
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
      break;
    case 'notification':
      player.style.display = 'none';
      notification.style.display = 'flex';
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
    },
  } = rawData;

  const artist = artists.length > 0 ? artists[0].name : '';
  const coverPhoto = images.length > 0 ? images[1].url : '';

  return {
    title,
    artist,
    isPlaying,
    coverPhoto,
  };
}

load();
