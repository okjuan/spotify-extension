import { TrackInfo } from './interface';
import { parse } from './parse';
import { Spotify } from './spotify';
import {
  displayControlButtons,
  displayBox,
  displayTrackInfo,
  registerButtonEvents
} from './dom';
import { CACHE_KEY } from './constants';

export async function render() {
  const sp = new Spotify();
  let playback: TrackInfo;

  await sp.getAccessToken();
  // If user "isAnonymous" is true
  // mean user is not login
  if (sp.token.isAnonymous) {
    displayBox('login-notification');
    return;
  }

  // Get current devices info
  await sp.getDevices();

  if (sp.device) {
    displayBox('player');

    chrome.storage.sync.get([CACHE_KEY], async function (result) {
      const { playingTrack } = result;
      // call to get "playing" track
      let track = await sp.getCurrentPlayBack();

      // If it is a new user & the desktop app is not active
      // Get the recently played track
      if (!track && !playingTrack) {
        track = await sp.getRecentlyPlayedTrack();
      }

      playback = parse(track);

      // Update last song played
      // In case suddently shut down Spotify app
      if (
        !playingTrack ||
        (playback && playback.title !== playingTrack.title) ||
        (playback && playback.isPlaying !== playingTrack.isPlaying) ||
        (playback && playback.uri !== playingTrack.uri) ||
        (playback &&
          playback.uri === playingTrack.uri &&
          playback.progressMs !== playingTrack.progressMs)
      ) {
        chrome.storage.sync.set({ playingTrack: playback });
      } else {
        // if the playback is undefined
        // mean the Spotify App is not in active mode
        if (!playback) {
          playback = {
            ...playingTrack,
            isPlaying: false,
          };
        } else {
          playback = playingTrack;
        }
      }

      if (playback) {
        // update DOM UI
        displayTrackInfo(playback)
        displayControlButtons(playback.isPlaying ? 'pause' : 'play');
      } else {
        displayControlButtons('play');
      }
    });
  } else {
    // Hide player control
    // Display message inform user to open Spotify Desktop App
    displayBox('no-device-open-notification');

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

  registerButtonEvents(sp, playback, render);
}