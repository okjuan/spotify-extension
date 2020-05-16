function handleAccessToken(callback) {
  chrome.storage.sync.get(['token'], function (result) {
    const { token: tokenObj } = result;

    let accessToken = tokenObj ? tokenObj.accessToken : undefined;

    // if there is no token or token is expired
    // then call API again and update token in storage
    if (
      isObjectEmpty(tokenObj) ||
      isExpire(tokenObj.accessTokenExpirationTimestampMs)
    ) {
      chrome.cookies.getAll({ secure: true }, async (cookies) => {
        const sp = new Spotify();
        const token = await sp.getAccessToken(cookies);
        chrome.storage.sync.set({ token });
        accessToken = token.accessToken;
        callback && callback(accessToken);
      });
    } else {
      callback && callback(accessToken);
    }
  });
}

function isObjectEmpty(obj) {
  if (!obj || !Object.keys(obj).length) return true;
  return false;
}

function isExpire(timestamp) {
  return new Date().getTime() >= timestamp;
}
