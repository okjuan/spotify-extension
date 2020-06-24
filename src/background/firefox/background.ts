import { CONTEXT_MENU_ITEM, WEB_PLAYER_URL } from '../../lib/constants';

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
