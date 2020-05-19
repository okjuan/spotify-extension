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
    },
  } = rawData;

  const artist = artists && artists.length ? artists[0].name : '';
  const coverPhoto = images && images.length ? images[1].url : '';

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
    artist,
    isPlaying,
    coverPhoto,
    uri,
    progressMs,
    context,
  };
}
