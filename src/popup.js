const btnPrev = document.getElementById('prev');
const btnPause = document.getElementById('pause');
const btnPlay = document.getElementById('play');
const btnNext = document.getElementById('next');

btnPause.onclick = function () {
  handleAccessToken(function (accessToken) {
    const s = new Spotify();
    s.pause(accessToken);
  });
};

btnPlay.onclick = function () {
  handleAccessToken(function (accessToken) {
    const s = new Spotify();
    s.play(accessToken);
  });
};

btnPrev.onclick = function () {
  handleAccessToken(function (accessToken) {
    const s = new Spotify();
    s.prev(accessToken);
  });
};

btnNext.onclick = function () {
  handleAccessToken(function (accessToken) {
    const s = new Spotify();
    s.next(accessToken);
  });
};
