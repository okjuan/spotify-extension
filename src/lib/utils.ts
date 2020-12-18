import { TrackInfo } from './interface';
import { CACHE_KEY } from './constants';
import { Storage } from './storage';

export function shouldUpdateCache(prevTrack: TrackInfo, currentTrack: TrackInfo) {
  if (
    !prevTrack ||
    (currentTrack && currentTrack.title !== prevTrack.title) ||
    (currentTrack && currentTrack.isPlaying !== prevTrack.isPlaying) ||
    (currentTrack && currentTrack.uri !== prevTrack.uri) ||
    (currentTrack && currentTrack.uri === prevTrack.uri && currentTrack.progressMs !== prevTrack.progressMs) ||
    (currentTrack && currentTrack.uri === prevTrack.uri && currentTrack.isSave !== prevTrack.isSave)
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

export function isChristmasPeriod() {
  const nowDate = new Date();
  const isMidDecember = nowDate.getMonth() === 11 && nowDate.getDate() > 5;
  const isStartJanuary = nowDate.getMonth() === 0 && nowDate.getDate() <= 6;
  return isMidDecember || isStartJanuary;
}
