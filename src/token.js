function handleAccessToken(callback) {
  if (callback) {
    chrome.cookies.getAll({ secure: true }, async (cookies) => {
      const sp = new Spotify();
      const token = await sp.getAccessToken(cookies);
      callback(token);
    });
  }
}
