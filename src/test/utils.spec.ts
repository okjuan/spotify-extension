import { sandbox, useFakeTimers } from 'sinon';
import { shouldUpdateCache, updateTrackCache, updateTrackInfo } from '../lib/utils';
import { Storage } from '../lib/storage';
import { cachedTrack } from './fixtures/playback';

describe('Testing utils', () => {
  let sandboxes;
  let getFunc;
  let setFunc;

  beforeEach(() => {
    sandboxes = sandbox.create();
    getFunc = sandboxes.stub(Storage, 'get');
    setFunc = sandboxes.stub(Storage, 'set');
  });

  afterEach(() => {
    sandboxes.restore();
  });

  describe('updateTrackCache', () => {
    it('should update cache', () => {
      getFunc.returns(cachedTrack);
      updateTrackCache({ isPlaying: false });
      expect(setFunc.called).toBeTruthy();
    });

    it('should do nothing', () => {
      getFunc.returns(undefined);
      updateTrackCache({ isPlaying: false });
      expect(setFunc.called).toBeFalsy();
    });
  });

  describe('updateTrackInfo', () => {
    it('should update the track information', () => {
      const cloneTrack = { ...cachedTrack };
      expect(cloneTrack.isPlaying).toBeTruthy();
      updateTrackInfo(cloneTrack, 'isPlaying', false);
      expect(cloneTrack.isPlaying).toBeFalsy();
    });
  });

  describe('shouldUpdateCache', () => {
    it('should return false', () => {
      const prevTrack = { ...cachedTrack };
      const currentTrack = { ...cachedTrack };
      const result = shouldUpdateCache(prevTrack, currentTrack);
      expect(result).toBeFalsy();
    });

    it('should return true - song titles are different', () => {
      const prevTrack = { ...cachedTrack };
      const currentTrack = { ...cachedTrack, title: 'Pneuma' };
      const result = shouldUpdateCache(prevTrack, currentTrack);
      expect(result).toBeTruthy();
    });

    it('should return true - song isPlaying are different', () => {
      const prevTrack = { ...cachedTrack };
      const currentTrack = { ...cachedTrack, isPlaying: false };
      const result = shouldUpdateCache(prevTrack, currentTrack);
      expect(result).toBeTruthy();
    });

    it('should return true - song uri are different', () => {
      const prevTrack = { ...cachedTrack };
      const currentTrack = { ...cachedTrack, uri: 'new-uri' };
      const result = shouldUpdateCache(prevTrack, currentTrack);
      expect(result).toBeTruthy();
    });

    it('should return true - song progressMs are different', () => {
      const prevTrack = { ...cachedTrack };
      const currentTrack = { ...cachedTrack, progressMs: 0 };
      const result = shouldUpdateCache(prevTrack, currentTrack);
      expect(result).toBeTruthy();
    });
  });
});
