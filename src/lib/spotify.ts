import { Token, PlayPostData, Device, TrackInfo } from './interface';
import { WEB_PLAYER_URL } from './constants';

const END_POINT = 'https://api.spotify.com';
const VALID_DEVICE_TYPES = ['Computer'];

export class Spotify {
  public token: Token;
  public device: Device;

  constructor() {
    this.token = {
      clientId: null,
      accessToken: null,
      accessTokenExpirationTimestampMs: null,
      isAnonymous: null,
    };

    this.device = null;
  }

  public async getDevices(): Promise<Device> {
    try {
      const url = `${END_POINT}/v1/me/player/devices`;

      const res = await fetch(url, {
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      });

      const data = await res.json();
      const devices: Device[] = data.devices
        ? data.devices
            .filter((item) => VALID_DEVICE_TYPES.indexOf(item.type) > -1)
            .map((item) => {
              return {
                id: item.id,
                isActive: item.is_active,
                isRestricted: item.is_restricted,
                name: item.name,
                type: item.type,
                volumePercent: item.volume_percent,
              };
            })
        : [];

      if (devices.length > 0) {
        this.device = devices[0];
      }

      return devices[0];
    } catch (e) {
      return;
    }
  }

  public async getRecentlyPlayedTrack() {
    const url = `${END_POINT}/v1/me/player/recently-played`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      });

      let data = await res.json();

      if (data && data.items.length) {
        const { track: item, context } = data.items[0];
        return { item, context };
      }

      return;
    } catch (e) {
      return;
    }
  }

  public async getCurrentPlayBack() {
    const url = `${END_POINT}/v1/me/player?additional_types=track`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      });

      const data = await res.json();
      return data;
    } catch (e) {
      return;
    }
  }

  public async pause() {
    const url = `${END_POINT}/v1/me/player/pause?device_id=${this.device.id}`;

    try {
      const result = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async play(songInfo: TrackInfo) {
    const url = `${END_POINT}/v1/me/player/play?device_id=${this.device.id}`;

    let postData: PlayPostData = {
      uris: [songInfo.uri],
      position_ms: songInfo.progressMs,
    };

    // If the song is being played in album, playlist, ...
    if (songInfo.context) {
      postData = {
        position_ms: songInfo.progressMs, // the time that current plays
        context_uri: songInfo.context.uri, // current album, playlist, ...
        offset: {
          uri: songInfo.uri, // which song in album, playlist need to resume
        },
      };
    }

    try {
      return await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  public async next() {
    const url = `${END_POINT}/v1/me/player/next?device_id=${this.device.id}`;

    try {
      return await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  public async prev() {
    const url = `${END_POINT}/v1/me/player/previous?device_id=${this.device.id}`;

    try {
      return await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  public async shuffle(state: boolean) {
    const url = `${END_POINT}/v1/me/player/shuffle?state=${state}&device_id=${this.device.id}`;

    try {
      return await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   * https://developer.spotify.com/documentation/web-api/reference/player/set-repeat-mode-on-users-playback/
   */
  public async repeat(state: 'track' | 'context' | 'off') {
    const url = `${END_POINT}/v1/me/player/repeat?state=${state}&device_id=${this.device.id}`;

    try {
      return await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  public async getAccessToken() {
    // Don't cache the token here
    // there is no way the extension know whether or not user signs out to clear cache
    // so the token in "cache" becomes invalid
    const url = `${WEB_PLAYER_URL}/get_access_token`;
    const res = await fetch(url);
    const data: Token = await res.json();
    this.token = data;
    return data;
  }
}
