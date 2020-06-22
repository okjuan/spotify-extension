import { TrackInfo, Token, Device } from './interface';
import { parse } from './parse';
import {
  getDevices,
  getAccessToken,
  getCurrentPlayBack,
  getRecentlyPlayedTrack
} from './spotify';
import { displayControlButtons, displayBox, displayTrackInfo, registerEvents } from './dom';
import { CACHE_KEY } from './constants';
import { shouldUpdateCache } from './utils';

export class App {
  private track: TrackInfo;
  private token: Token;
  private device: Device;

  constructor() {
    this.token = null;
    this.track = null;
    this.device = null;
  }

  public async render() {
    // Get access token
    this.token = await getAccessToken();

    // Get active device
    this.device = await getDevices(this.token.accessToken);

    if (!this.isLogin()) {
      displayBox('login-notification');
      return;
    }

    if (!this.isDeviceOpening()) {
      this.displayNoDeviceBox();
      return;
    }

    this.displayPlayerBox();
  }

  private displayPlayerBox() {
    displayBox('player');

    chrome.storage.sync.get([CACHE_KEY], async (result) => {
      const { playingTrack } = result;

      this.track = await this.getTrack(playingTrack);

      if (shouldUpdateCache(playingTrack, this.track)) {
        chrome.storage.sync.set({ playingTrack: this.track });
      } else {
        // if the playback is undefined
        // mean the Spotify App is not in active mode
        if (!this.track) {
          this.track = { ...playingTrack, isPlaying: false };
        } else {
          this.track = playingTrack;
        }
      }

      this.handleDOM();

      // detect when new song information are fetched and render UI again
      this.startTimer();
    });
  }

  private displayNoDeviceBox() {
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

  private updateTrackCache(value: TrackInfo) {
    chrome.storage.sync.get([CACHE_KEY], (result) => {
      const { playingTrack } = result;
      if (playingTrack) {
        chrome.storage.sync.set({ ...playingTrack, ...value });
      }
    });
  }

  private updateTrackInfo = <K1 extends keyof TrackInfo>(key: K1, value: TrackInfo[K1]) => {
    this.track[key] = value;
  };

  private handleDOM = () => {
    if (this.track) {
      // update DOM UI
      displayTrackInfo(this.track);
      displayControlButtons(this.track.isPlaying ? 'pause' : 'play');
    } else {
      displayControlButtons('play');
    }

    // register events for player controls
    // prev, play, next
    registerEvents(
      this.token,
      this.device,
      this.track,
      this.render.bind(this),
      this.updateTrackCache.bind(this),
      this.updateTrackInfo.bind(this)
    );
  };

  private async getTrack(cachedTrack: TrackInfo) {
    let track = await getCurrentPlayBack(this.token.accessToken);

    // If it is a new user & the desktop app is not active
    // Get the recently played track
    if ((!track && !cachedTrack) || (track && !track.item)) {
      track = await getRecentlyPlayedTrack(this.token.accessToken);
    }

    return parse(track);
  }

  private isDeviceOpening() {
    if (this.device) {
      return true;
    }
    return false;
  }

  private isLogin() {
    return !this.token.isAnonymous;
  }

  /*
   * When the player box still opens and the song is ended
   * It will automatically call API to get new song information
   * and render UI with new song information
   */
  private startTimer() {
    const timer = setInterval(() => {
      this.displayPlayerBox();
      clearInterval(timer);
    }, this.track.durationMs - this.track.progressMs);
  }
}
