import {
  getDevices,
  getCurrentPlayBack,
  getAccessToken,
  getRecentlyPlayedTrack,
  pause,
  play,
  prev,
  next,
  repeat,
  shuffle
} from '../lib/spotify';
import { parse } from '../lib/parse';
import { playback } from './fixtures/playback';
import { devices } from './fixtures/devices';
import { token } from './fixtures/token';
import { rawData } from './fixtures/response';
import { recentlyPlayedTrack } from './fixtures/recently-played';
import { Token, Device } from '../lib/interface';

function mockFetchResolve(data?) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
    })
  );
}

function mockFetchReject() {
  return jest.fn().mockImplementation(() => Promise.reject({ ok: false }));
}

describe('testing Spotify class', () => {
  const token: Token = {
    clientId: '0971d',
    accessToken: 'fake token',
    accessTokenExpirationTimestampMs: 1589898018127,
    isAnonymous: false,
  };

  const device: Device = {
    id: '5fbb3ba6aa454b5534c4ba43a8c7e8e45a63ad0e',
    isActive: false,
    isRestricted: false,
    name: 'Web Player (Chrome)',
    type: 'Computer',
    volumePercent: '100',
  };
  const originalFetch = window.fetch;

  afterEach(() => {
    window.fetch = originalFetch;
  });

  it('should return data of getCurrentPlayBack', async () => {
    window.fetch = mockFetchResolve(playback);
    const data = await getCurrentPlayBack(token.accessToken);
    expect(data).toBeDefined();
  });

  it('should return undefined of getCurrentPlayBack', async () => {
    window.fetch = mockFetchReject();
    const data = await getCurrentPlayBack(token.accessToken);
    expect(data).toBeUndefined();
  });

  it('should return data of getDevices', async () => {
    window.fetch = mockFetchResolve(devices);
    const data = await getDevices(token.accessToken);
    expect(data).toEqual({
      id: '5fbb3ba6aa454b5534c4ba43a8c7e8e45a63ad0e',
      isActive: false,
      isRestricted: false,
      name: 'Web Player (Chrome)',
      type: 'Computer',
      volumePercent: 100,
    });
  });

  it('should return undefined of getDevices - reponse is empty', async () => {
    window.fetch = mockFetchResolve([]);
    const data = await getDevices(token.accessToken);
    expect(data).toBeUndefined();
  });

  it('should return undefined of getDevices', async () => {
    window.fetch = mockFetchReject();
    const data = await getDevices(token.accessToken);
    expect(data).toBeUndefined();
  });

  it('should return data of getRecentlyPlayedTrack', async () => {
    window.fetch = mockFetchResolve(recentlyPlayedTrack);
    const result = await getRecentlyPlayedTrack(token.accessToken);
    expect(result).toBeDefined();
  });

  it('should return undefined of getRecentlyPlayedTrack - response is empty', async () => {
    window.fetch = mockFetchResolve({ items: [] });
    const result = await getRecentlyPlayedTrack(token.accessToken);
    expect(result).toBeUndefined();
  });

  it('should return undefined of getRecentlyPlayedTrack', async () => {
    window.fetch = mockFetchReject();
    const data = await getRecentlyPlayedTrack(token.accessToken);
    expect(data).toBeUndefined();
  });

  it('should run pause', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await pause(device.id, token.accessToken);
    expect(ok).toBeTruthy();
  });

  it('should not run pause', async () => {
    window.fetch = mockFetchReject();
    try {
      await pause(device.id, token.accessToken);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should run next', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await next(device.id, token.accessToken);
    expect(ok).toBeTruthy();
  });

  it('should not run next', async () => {
    window.fetch = mockFetchReject();
    try {
      await next(device.id, token.accessToken);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should run prev', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await prev(device.id, token.accessToken);
    expect(ok).toBeTruthy();
  });

  it('should not run prev', async () => {
    window.fetch = mockFetchReject();
    try {
      await prev(device.id, token.accessToken);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should run shuffle', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await shuffle(true, device.id, token.accessToken);
    expect(ok).toBeTruthy();
  });

  it('should not run shuffle', async () => {
    window.fetch = mockFetchReject();
    try {
      await shuffle(true, device.id, token.accessToken);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should run repeat', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await repeat('track', device.id, token.accessToken);
    expect(ok).toBeTruthy();
  });

  it('should not run repeat', async () => {
    window.fetch = mockFetchReject();
    try {
      await repeat('track', device.id, token.accessToken);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should get token', async () => {
    window.fetch = mockFetchResolve(token);
    const result = await getAccessToken();
    expect(result).toEqual({
      clientId: '0971d',
      accessToken: 'fake token',
      accessTokenExpirationTimestampMs: 1589898018127,
      isAnonymous: false,
    });
  });

  it('should run play', async () => {
    window.fetch = mockFetchResolve();
    const songInfo = parse(rawData);
    const result = await play(songInfo, device.id, token.accessToken);
    expect(result.ok).toBeTruthy();
  });

  it('should not run play', async () => {
    window.fetch = mockFetchReject();
    try {
      const songInfo = parse(rawData);
      await play(songInfo, device.id, token.accessToken);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should not run play without context', async () => {
    window.fetch = mockFetchReject();
    try {
      const songInfo = parse({ ...rawData, context: null });
      await play(songInfo, device.id, token.accessToken);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should not run play', async () => {
    window.fetch = mockFetchReject();
    try {
      const songInfo = parse(rawData);
      await play(songInfo, device.id, token.accessToken);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });
});
