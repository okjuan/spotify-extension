import { parse } from '../lib/parse';
import { rawData } from './fixtures/response';

describe('testing parse', () => {
  it('should return undefined', () => {
    let result = parse(undefined);
    expect(result).toEqual(undefined);

    result = parse({});
    expect(result).toEqual(undefined);
  });

  it('should return data', () => {
    const result = parse(rawData);

    expect(result).toEqual({
      title: 'Jingle Bells',
      artist: {
        name: 'Boney M.',
        url: 'https://open.spotify.com/artist/54R6Y0I7jGUCveDTtI21nb',
      },
      id: '4JRSFd7IbVbEN3BAJVJFJf',
      isPlaying: true,
      coverPhoto: 'https://i.scdn.co/image/ab67616d00001e0230da6905883b7cc2441d7abe',
      uri: 'spotify:track:4JRSFd7IbVbEN3BAJVJFJf',
      progressMs: 9488,
      repeatState: 'off',
      durationMs: 208440,
      trackUrl: 'https://open.spotify.com/track/4JRSFd7IbVbEN3BAJVJFJf',
      context: {
        type: 'playlist',
        href: 'https://api.spotify.com/v1/playlists/5d5HXxz6RG9fzqXbhwbqJT',
        uri: 'spotify:user:davidnguyen179:playlist:5d5HXxz6RG9fzqXbhwbqJT',
        externalUrls: { spotify: 'https://open.spotify.com/playlist/5d5HXxz6RG9fzqXbhwbqJT' },
      },
    });
  });

  it('should return data without "context"', () => {
    const result = parse({ ...rawData, context: null });
    expect(result).toEqual({
      title: 'Jingle Bells',
      artist: {
        name: 'Boney M.',
        url: 'https://open.spotify.com/artist/54R6Y0I7jGUCveDTtI21nb',
      },
      id: '4JRSFd7IbVbEN3BAJVJFJf',
      isPlaying: true,
      coverPhoto: 'https://i.scdn.co/image/ab67616d00001e0230da6905883b7cc2441d7abe',
      uri: 'spotify:track:4JRSFd7IbVbEN3BAJVJFJf',
      progressMs: 9488,
      repeatState: 'off',
      durationMs: 208440,
      context: undefined,
      trackUrl: 'https://open.spotify.com/track/4JRSFd7IbVbEN3BAJVJFJf',
    });
  });

  it('should return data without "artists" & "images"', () => {
    const result = parse({
      ...rawData,
      item: {
        ...rawData.item,
        artists: undefined,
        album: {
          ...rawData.item.album,
          images: undefined,
        },
      },
    });

    expect(result).toEqual({
      title: 'Jingle Bells',
      artist: {
        name: '',
        url: '',
      },
      id: '4JRSFd7IbVbEN3BAJVJFJf',
      isPlaying: true,
      coverPhoto: '',
      uri: 'spotify:track:4JRSFd7IbVbEN3BAJVJFJf',
      progressMs: 9488,
      repeatState: 'off',
      durationMs: 208440,
      trackUrl: 'https://open.spotify.com/track/4JRSFd7IbVbEN3BAJVJFJf',
      context: {
        type: 'playlist',
        href: 'https://api.spotify.com/v1/playlists/5d5HXxz6RG9fzqXbhwbqJT',
        uri: 'spotify:user:davidnguyen179:playlist:5d5HXxz6RG9fzqXbhwbqJT',
        externalUrls: { spotify: 'https://open.spotify.com/playlist/5d5HXxz6RG9fzqXbhwbqJT' },
      },
    });
  });
});
