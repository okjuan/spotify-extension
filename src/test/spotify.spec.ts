import { Spotify } from '../lib/spotify';
import { parse } from '../lib/parse';
import { playback } from './fixtures/playback';
import { devices } from './fixtures/devices';
import { token } from './fixtures/token';
import { rawData } from './fixtures/response';
import { recentlyPlayedTrack } from './fixtures/recently-played';

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
  let sp: Spotify;
  const originalFetch = window.fetch;

  beforeEach(() => {
    sp = new Spotify();
    sp.device = {
      id: '5fbb3ba6aa454b5534c4ba43a8c7e8e45a63ad0e',
      isActive: false,
      isRestricted: false,
      name: 'Web Player (Chrome)',
      type: 'Computer',
      volumePercent: '100',
    };
  });

  afterEach(() => {
    sp = null;
    window.fetch = originalFetch;
  });

  it('should return data of getCurrentPlayBack', async () => {
    window.fetch = mockFetchResolve(playback);
    const data = await sp.getCurrentPlayBack();
    expect(data).toBeDefined();
  });

  it('should return undefined of getCurrentPlayBack', async () => {
    window.fetch = mockFetchReject();
    const data = await sp.getCurrentPlayBack();
    expect(data).toBeUndefined();
  });

  it('should return data of getDevices', async () => {
    window.fetch = mockFetchResolve(devices);
    const data = await sp.getDevices();
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
    const data = await sp.getDevices();
    expect(data).toBeUndefined();
  });

  it('should return undefined of getDevices', async () => {
    window.fetch = mockFetchReject();
    const data = await sp.getDevices();
    expect(data).toBeUndefined();
  });

  it('should return data of getRecentlyPlayedTrack', async () => {
    window.fetch = mockFetchResolve(recentlyPlayedTrack);
    const result = await sp.getRecentlyPlayedTrack();
    expect(result).toBeDefined();
  });

  it('should return undefined of getRecentlyPlayedTrack - response is empty', async () => {
    window.fetch = mockFetchResolve({ items: [] });
    const result = await sp.getRecentlyPlayedTrack();
    expect(result).toBeUndefined();
  });

  it('should return undefined of getRecentlyPlayedTrack', async () => {
    window.fetch = mockFetchReject();
    const data = await sp.getRecentlyPlayedTrack();
    expect(data).toBeUndefined();
  });

  it('should run pause', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await sp.pause();
    expect(ok).toBeTruthy();
  });

  it('should not run pause', async () => {
    window.fetch = mockFetchReject();
    try {
      await sp.pause();
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should run next', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await sp.next();
    expect(ok).toBeTruthy();
  });

  it('should not run next', async () => {
    window.fetch = mockFetchReject();
    try {
      await sp.next();
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should run prev', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await sp.prev();
    expect(ok).toBeTruthy();
  });

  it('should not run prev', async () => {
    window.fetch = mockFetchReject();
    try {
      await sp.prev();
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should run shuffle', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await sp.shuffle(true);
    expect(ok).toBeTruthy();
  });

  it('should not run shuffle', async () => {
    window.fetch = mockFetchReject();
    try {
      await sp.shuffle(true);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should run repeat', async () => {
    window.fetch = mockFetchResolve();
    const { ok } = await sp.repeat('track');
    expect(ok).toBeTruthy();
  });

  it('should not run repeat', async () => {
    window.fetch = mockFetchReject();
    try {
      await sp.repeat('track');
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should get token', async () => {
    window.fetch = mockFetchResolve(token);
    const result = await sp.getAccessToken();
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
    const result = await sp.play(songInfo);
    expect(result.ok).toBeTruthy();
  });

  it('should not run play', async () => {
    window.fetch = mockFetchReject();
    try {
      const songInfo = parse(rawData);
      await sp.play(songInfo);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should not run play without context', async () => {
    window.fetch = mockFetchReject();
    try {
      const songInfo = parse({ ...rawData, context: null });
      await sp.play(songInfo);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });

  it('should not run play', async () => {
    window.fetch = mockFetchReject();
    try {
      const songInfo = parse(rawData);
      await sp.play(songInfo);
    } catch (e) {
      expect(e.ok).toBeFalsy();
    }
  });
});
