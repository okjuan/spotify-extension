/**
 * @jest-environment jsdom
 */
import sinon, { useFakeTimers } from 'sinon';
import { Storage } from '../lib/storage';
import { App } from '../lib/app';
import { token, nonLoginToken } from './fixtures/token';
import { activeDevice } from './fixtures/devices';
import { playback, cachedTrack } from './fixtures/playback';
import { recentlyPlayedTrack } from './fixtures/recently-played';
import * as Spotify from '../lib/spotify';
import * as Dom from '../lib/dom';
import * as Utils from '../lib/utils';
import { parse } from '../lib/parse';

describe('Testing App', () => {
  let sandboxes;
  let getFunc;
  let setFunc;
  let getAccessToken;
  let getDevices;
  let getCurrentPlayBack;
  let getRecentlyPlayedTrack;
  let timer;

  // Dom
  let displayBox;
  let displayControlButtons;
  let registerEvents;
  let displayTrackInfo;

  // utils
  let shouldUpdateCache;

  beforeEach(() => {
    sandboxes = sinon.createSandbox();
    getFunc = sandboxes.stub(Storage, 'get');
    setFunc = sandboxes.stub(Storage, 'set');
    getAccessToken = sandboxes.stub(Spotify, 'getAccessToken');
    getDevices = sandboxes.stub(Spotify, 'getDevices');
    getCurrentPlayBack = sandboxes.stub(Spotify, 'getCurrentPlayBack');
    getRecentlyPlayedTrack = sandboxes.stub(Spotify, 'getRecentlyPlayedTrack');

    // Dom
    displayBox = sandboxes.stub(Dom, 'displayBox');
    displayControlButtons = sandboxes.stub(Dom, 'displayControlButtons');
    registerEvents = sandboxes.stub(Dom, 'registerEvents');
    displayTrackInfo = sandboxes.stub(Dom, 'displayTrackInfo');

    // utils
    shouldUpdateCache = sandboxes.stub(Utils, 'shouldUpdateCache');

    timer = useFakeTimers();
  });

  afterEach(() => {
    sandboxes.restore();
    timer.restore();
  });

  it('should display song from API', async () => {
    shouldUpdateCache.returns(true);
    getAccessToken.returns(token);
    getDevices.returns(activeDevice);
    getCurrentPlayBack.returns(playback);
    getFunc.returns(undefined);
    const app = new App();
    await app.render();
    const mode = displayBox.args[0][0];
    expect(mode).toEqual('player');
    expect(displayControlButtons.called).toBeTruthy();
    expect(displayTrackInfo.called).toBeTruthy();
    expect(registerEvents.called).toBeTruthy();
  });

  it('should call getRecentlyPlayedTrack - type "nothing"', async () => {
    shouldUpdateCache.returns(true);
    getAccessToken.returns(token);
    getDevices.returns(activeDevice);
    getCurrentPlayBack.returns(undefined);
    getFunc.returns(undefined);
    const { track: item, context } = recentlyPlayedTrack.items[0];
    getRecentlyPlayedTrack.returns({ item, context });
    const app = new App();
    await app.render();
    const mode = displayBox.args[0][0];
    expect(mode).toEqual('player');
    expect(displayControlButtons.called).toBeTruthy();
    expect(displayTrackInfo.called).toBeTruthy();
    expect(registerEvents.called).toBeTruthy();
  });

  it('should call getRecentlyPlayedTrack - type "no-song-playing"', async () => {
    const clonePlayback = { ...playback };
    delete clonePlayback.item;
    shouldUpdateCache.returns(true);
    getAccessToken.returns(token);
    getDevices.returns(activeDevice);
    getCurrentPlayBack.returns(clonePlayback);
    getFunc.returns(undefined);
    const { track: item, context } = recentlyPlayedTrack.items[0];
    getRecentlyPlayedTrack.returns({ item, context });
    const app = new App();
    await app.render();
    const mode = displayBox.args[0][0];
    expect(mode).toEqual('player');
    expect(displayControlButtons.called).toBeTruthy();
    expect(displayTrackInfo.called).toBeTruthy();
    expect(registerEvents.called).toBeTruthy();
  });

  it('should display play button when Spotify app is not active', async () => {
    shouldUpdateCache.returns(false);
    getAccessToken.returns(token);
    getDevices.returns(activeDevice);
    getCurrentPlayBack.returns(undefined);
    getFunc.returns(cachedTrack);
    const app = new App();
    await app.render();
    expect(displayControlButtons.called).toBeTruthy();
    expect(displayTrackInfo.called).toBeTruthy();
    expect(registerEvents.called).toBeTruthy();
  });

  it('should auto call displayPlayerBox with new song', async () => {
    shouldUpdateCache.returns(true);
    getAccessToken.returns(token);
    getDevices.returns(activeDevice);
    getCurrentPlayBack.returns(playback);
    getFunc.returns(undefined);
    const app = new App();
    await app.render();
    const mode = displayBox.args[0][0];
    expect(mode).toEqual('player');
    expect(displayControlButtons.called).toBeTruthy();
    expect(displayTrackInfo.called).toBeTruthy();
    expect(registerEvents.called).toBeTruthy();

    const { durationMs, progressMs } = parse(playback);

    timer.tick(durationMs - progressMs);
    expect(displayControlButtons.called).toBeTruthy();
  });

  it('should get track from cache', async () => {
    shouldUpdateCache.returns(false);
    getAccessToken.returns(token);
    getDevices.returns(activeDevice);
    getCurrentPlayBack.returns(playback);
    getFunc.returns(cachedTrack);
    const app = new App();
    await app.render();
    expect(displayControlButtons.called).toBeTruthy();
    expect(displayTrackInfo.called).toBeTruthy();
    expect(registerEvents.called).toBeTruthy();
  });

  it('should only display play button', async () => {
    shouldUpdateCache.returns(true);
    getAccessToken.returns(token);
    getDevices.returns(activeDevice);
    getCurrentPlayBack.returns(undefined);
    getFunc.returns(undefined);
    const app = new App();
    await app.render();
    expect(displayControlButtons.called).toBeTruthy();
    expect(registerEvents.called).toBeTruthy();
  });

  it('should display "Need Login Box"', async () => {
    getAccessToken.returns(nonLoginToken);
    getDevices.returns(undefined);
    const app = new App();
    await app.render();
    const mode = displayBox.args[0][0];
    expect(mode).toEqual('login-notification');
  });

  it('should display "No Device Is Opening Box"', async () => {
    getAccessToken.returns(token);
    getDevices.returns(undefined);
    const app = new App();
    await app.render();
    const mode = displayBox.args[0][0];
    expect(mode).toEqual('no-device-open-notification');
  });

  it('should display "No Device Is Opening Box", when "suddenly" Spotify app is turned off', async () => {
    getAccessToken.returns(token);
    getDevices.returns(undefined);
    getFunc.returns(cachedTrack);
    expect(cachedTrack.isPlaying).toBeTruthy();
    const app = new App();
    await app.render();
    const mode = displayBox.args[0][0];
    expect(mode).toEqual('no-device-open-notification');
    expect(setFunc.called).toBeTruthy();
    expect(cachedTrack.isPlaying).toBeFalsy();
  });
});
