/// <reference types="web-ext-types"/>
import { CONTEXT_MENU_ITEM, WEB_PLAYER_URL, HOUR_IN_SECOND } from '../../lib/constants';
import { isChristmasPeriod } from '../../lib/utils';

setChristmasIcon();
setInterval(setChristmasIcon, HOUR_IN_SECOND);

browser.menus.create({
  id: CONTEXT_MENU_ITEM,
  title: 'Search Spotify for "%s"',
  contexts: ['selection'],
});

browser.menus.onClicked.addListener(function (info) {
  if (info.menuItemId === CONTEXT_MENU_ITEM) {
    browser.tabs.create({
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
