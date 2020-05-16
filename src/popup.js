const root = document.getElementById('spotify-mini-player');
const btnPrev = document.getElementById('prev');
const btnPause = document.getElementById('pause');
const btnPlay = document.getElementById('play');
const btnNext = document.getElementById('next');

const songTitle = document.getElementById('title');
const artistName = document.getElementById('artist');
const coverImage = document.getElementById('cover-photo');

function load() {
  handleAccessToken(async function (accessToken) {
    const s = new Spotify();
    const track = await s.getPlayingTrack(accessToken);
    const { title, artist, coverPhoto, isPlaying } = parseTrack(track);

    // update DOM UI
    songTitle.textContent = title;
    artistName.textContent = artist;
    coverImage.style.backgroundImage = `url('${coverPhoto}')`;

    displayControlButtons(isPlaying ? 'pause' : 'play');
  });
}

load();

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

function parseTrack(rawData) {
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

btnPause.onclick = function () {
  displayControlButtons('play');
  handleAccessToken(function (accessToken) {
    const s = new Spotify();
    s.pause(accessToken);
  });
};

btnPlay.onclick = function () {
  displayControlButtons('pause');
  handleAccessToken(function (accessToken) {
    const s = new Spotify();
    s.play(accessToken);
  });
};

btnPrev.onclick = function () {
  handleAccessToken(async function (accessToken) {
    const s = new Spotify();
    s.prev(accessToken);
    // after click next song, call API again to update UI
    load();
  });
};

btnNext.onclick = function () {
  handleAccessToken(async function (accessToken) {
    const s = new Spotify();
    await s.next(accessToken);
    // after click next song, call API again to update UI
    load();
  });
};
