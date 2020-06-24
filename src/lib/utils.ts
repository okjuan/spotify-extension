import { TrackInfo } from './interface';
import { CACHE_KEY } from './constants';
import { Storage } from './storage';

export function shouldUpdateCache(prevTrack: TrackInfo, currentTrack: TrackInfo) {
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

export function updateTrackCache(value: TrackInfo) {
  const playingTrack = Storage.get(CACHE_KEY);
  if (playingTrack) {
    Storage.set(CACHE_KEY, { ...playingTrack, ...value });
  }
}

export function updateTrackInfo<K1 extends keyof TrackInfo>(track, key: K1, value: TrackInfo[K1]) {
  track[key] = value;
}
