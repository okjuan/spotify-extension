chrome.runtime.onInstalled.addListener(function () {
  // Get access token
  handleAccessToken();

  // Make extension works on all pages
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher()],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });

  // Create right click menu
  chrome.contextMenus.create({
    id: 'spotify-extension-search-on-spotify',
    title: 'Search on Spotify: %s',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener(function (info) {
    chrome.tabs.create({
      url: `https://open.spotify.com/search/${info.selectionText}`,
    });
  });
});
