import { TrackInfo, Token, Device, PlayerState } from './interface';
import { parse } from './parse';
import { getDevices, getAccessToken, getCurrentPlayBack, getRecentlyPlayedTrack, checkSavedTrack } from './spotify';
import { displayControlButtons, displayBox, displayTrackInfo, registerEvents } from './dom';
import { CACHE_KEY } from './constants';
import { shouldUpdateCache } from './utils';
import { Storage } from './storage';

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

    await this.displayPlayerBox();
  }

  private async displayPlayerBox() {
    displayBox('player');

    const cachedTrack = Storage.get(CACHE_KEY);

    this.track = await this.getTrack(cachedTrack);

    if (shouldUpdateCache(cachedTrack, this.track)) {
      Storage.set(CACHE_KEY, this.track);
    } else {
      // if the playback is undefined
      // mean the Spotify App is not in active mode
      if (!this.track) {
        this.track = { ...cachedTrack, isPlaying: false };
      } else {
        this.track = cachedTrack;
      }
    }

    this.handleDOM();

    // detect when new song information are fetched and render UI again
    this.startTimer();
  }

  private displayNoDeviceBox() {
    // Hide player control
    // Display message inform user to open Spotify Desktop App
    displayBox('no-device-open-notification');

    // If there is no devices are opening
    // then get the track info from cache and modify the state "isPlaying" to false
    const cachedTrack = Storage.get(CACHE_KEY);

    if (cachedTrack) {
      cachedTrack.isPlaying = false;
      Storage.set(CACHE_KEY, cachedTrack);
    }
  }

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
    registerEvents(this.token, this.device, this.track, this.render.bind(this));
  };

  private async getTrack(cachedTrack: TrackInfo) {
    let track = await getCurrentPlayBack(this.token.accessToken);

    let type: PlayerState;

    if (!track && !cachedTrack) {
      type = 'nothing';
    }

    if (!track && cachedTrack) {
      type = 'cache';
    }

    if (track && !track.item) {
      // device is still active, but no song is being played
      type = 'no-song-playing';
    }

    switch (type) {
      case 'nothing':
      case 'no-song-playing':
        track = await getRecentlyPlayedTrack(this.token.accessToken);
        break;
      case 'cache':
        track = cachedTrack;
        break;
    }

    // If it is a new user & the desktop app is not active
    // Get the recently played track
    track = parse(track);

    if (track) {
      const isSave = await checkSavedTrack(this.token.accessToken, track.id);
      track.isSave = isSave;
    }

    return track;
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
    if (!this.track) return;

    const durationMs = this.track.durationMs;
    const progressMs = this.track.progressMs || 0;

    const timer = setTimeout(async () => {
      await this.displayPlayerBox();
      clearTimeout(timer);
    }, durationMs - progressMs);
  }
}
