export interface Token {
  clientId: string;
  accessToken: string;
  accessTokenExpirationTimestampMs: number;
  isAnonymous: boolean;
};

/**
 * https://developer.spotify.com/documentation/web-api/reference/player/get-a-users-available-devices/
 */
export interface Device {
  id: string;
  isActive: boolean;
  isRestricted: boolean;
  name: string;
  type: string;
  volumePercent: string;
}

export interface TrackInfo {
  title: string;
  artist: string;
  isPlaying: boolean;
  coverPhoto: string;
  uri: string;
  progressMs: number;
  context?: {
    type: 'artist' | 'playlist' | 'album';
    href: string;
    externalUrls: {
      spotify: string;
    };
    uri: string;
  };
}
// From API
export interface PlayPostData {
  uris?: string[];
  position_ms?: number;
  context_uri?: string;
  offset?: {
    uri: string;
  },
}
