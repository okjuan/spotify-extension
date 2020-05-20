import { TrackInfo } from './interface';
import { parse } from './parse';
import { Spotify } from './spotify';
import { displayControlButtons, displayBox, displayTrackInfo, registerEvents } from './dom';
import { CACHE_KEY } from './constants';

export class App {
  private readonly sp: Spotify;
  private track: TrackInfo;

  constructor() {
    this.sp = new Spotify();
    this.track = null;
  }

  public async render() {
    // Get access token
    await this.sp.getAccessToken();

    // Get active device
    await this.sp.getDevices();

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

      if (this.shouldUpdateCache(playingTrack, this.track)) {
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

  private updateTrackInfo = (key: keyof TrackInfo, value) => {
    this.track[key] = value as never;
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
      this.sp,
      this.track,
      this.render.bind(this),
      this.updateTrackCache.bind(this),
      this.updateTrackInfo.bind(this)
    );
  };

  private async getTrack(cachedTrack: TrackInfo) {
    let track = await this.sp.getCurrentPlayBack();

    // If it is a new user & the desktop app is not active
    // Get the recently played track
    if ((!track && !cachedTrack) || (track && !track.item)) {
      track = await this.sp.getRecentlyPlayedTrack();
    }

    return parse(track);
  }

  private shouldUpdateCache(prevTrack: TrackInfo, currentTrack: TrackInfo) {
    if (
      !prevTrack ||
      (currentTrack && currentTrack.title !== prevTrack.title) ||
      (currentTrack && currentTrack.isPlaying !== prevTrack.isPlaying) ||
      (currentTrack && currentTrack.uri !== prevTrack.uri) ||
      (currentTrack && currentTrack.uri === prevTrack.uri && currentTrack.progressMs !== prevTrack.progressMs)
    ) {
      return true;
    }
    return false;
  }

  private isDeviceOpening() {
    if (this.sp.device) {
      return true;
    }
    return false;
  }

  private isLogin() {
    return !this.sp.token.isAnonymous;
  }
}
