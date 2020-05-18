function handleAccessToken(callback) {
  if (callback) {
    // Don't cache the token here
    // there is no way the extension know whether or not user signs out to clear cache
    // so the token in "cache" becomes invalid
    chrome.cookies.getAll({ secure: true }, async (cookies) => {
      const sp = new Spotify();
      const token = await sp.getAccessToken(cookies);
      callback(token);
    });
  }
}
