export interface Token {
  clientId: string;
  accessToken: string;
  accessTokenExpirationTimestampMs: number;
  isAnonymous: boolean;
}

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
  title?: string;
  artist?: Artist;
  isPlaying?: boolean;
  coverPhoto?: string;
  uri?: string;
  progressMs?: number;
  durationMs?: number;
  trackUrl?: string;
  context?: {
    type: 'artist' | 'playlist' | 'album';
    href: string;
    externalUrls: {
      spotify: string;
    };
    uri: string;
  };
}

export interface Artist {
  name?: string;
  url?: string;
}

// From API
export interface PlayPostData {
  uris?: string[];
  position_ms?: number;
  context_uri?: string;
  offset?: {
    uri: string;
  };
}
