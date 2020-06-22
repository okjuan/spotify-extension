import { TrackInfo } from './interface';

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
