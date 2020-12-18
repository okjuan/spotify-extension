/// <reference types="chrome"/>
import { CONTEXT_MENU_ITEM, WEB_PLAYER_URL, HOUR_IN_SECOND } from '../../lib/constants';
import { isChristmasPeriod } from '../../lib/utils';

setChristmasIcon();
setInterval(setChristmasIcon, HOUR_IN_SECOND);

chrome.runtime.onInstalled.addListener(function () {
  // Make extension work on all pages
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });

  // Create right click menu
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ITEM,
    title: 'Search Spotify for "%s"',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId === CONTEXT_MENU_ITEM) {
    chrome.tabs.create({
      url: `${WEB_PLAYER_URL}/search/${info.selectionText}`,
    });
  }
});

function setChristmasIcon() {
  if (isChristmasPeriod()) {
    chrome.browserAction.setIcon({ path: 'images/spotify-mini-player-xmas-128.png' });
  } else {
    chrome.browserAction.setIcon({ path: 'images/spotify-mini-player-128.png' });
  }
}
