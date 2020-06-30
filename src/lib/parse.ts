import { TrackInfo } from './interface';

export function parse(rawData): TrackInfo {
  if (!rawData || (rawData && !rawData.item)) return;

  const {
    is_playing: isPlaying,
    progress_ms: progressMs,
    item: {
      name: title,
      artists,
      album: { images },
      uri,
      id,
      duration_ms: durationMs,
      external_urls: { spotify: trackUrl },
    },
  } = rawData;

  let artistName = '';
  let artistUrl = '';

  if (artists?.length) {
    artistName = artists[0].name;
    artistUrl = artists[0].external_urls.spotify;
  }

  const coverPhoto = images?.length ? images[1].url : '';

  let context;
  if (rawData.context) {
    const { type, href, external_urls, uri } = rawData.context;
    context = {
      type,
      href,
      uri,
      externalUrls: external_urls,
    };
  }

  return {
    title,
    artist: {
      name: artistName,
      url: artistUrl,
    },
    isPlaying,
    coverPhoto,
    uri,
    progressMs,
    context,
    durationMs,
    trackUrl,
    id,
  };
}
