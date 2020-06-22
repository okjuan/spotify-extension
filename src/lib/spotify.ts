import { Token, PlayPostData, Device, TrackInfo } from './interface';
import { WEB_PLAYER_URL, END_POINT, VALID_DEVICE_TYPES } from './constants';

export async function getDevices(accessToken: string) {
  try {
    const url = `${END_POINT}/v1/me/player/devices`;

    const res = await fetch(url, {
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

    return devices[0];
  } catch (e) {
    return;
  }
}

export async function getAccessToken() {
  // Don't cache the token here
  // there is no way the extension know whether or not user signs out to clear cache
  // so the token in "cache" becomes invalid
  let token: Token = {
    clientId: null,
    accessToken: null,
    accessTokenExpirationTimestampMs: null,
    isAnonymous: null,
  };

  try {
    const url = `${WEB_PLAYER_URL}/get_access_token`;
    const res = await fetch(url);
    token = await res.json();
  } catch { }

  return token;
}

export async function getCurrentPlayBack(accessToken: string) {
  const url = `${END_POINT}/v1/me/player?additional_types=track`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (e) {
    return;
  }
}

export async function getRecentlyPlayedTrack(accessToken: string) {
  const url = `${END_POINT}/v1/me/player/recently-played`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

export async function pause(deviceId: string, accessToken: string) {
  const url = `${END_POINT}/v1/me/player/pause?device_id=${deviceId}`;

  try {
    const result = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (e) {
    throw e;
  }
}

export async function play(songInfo: TrackInfo, deviceId: string, accessToken: string) {
  const url = `${END_POINT}/v1/me/player/play?device_id=${deviceId}`;

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
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function next(deviceId: string, accessToken: string) {
  const url = `${END_POINT}/v1/me/player/next?device_id=${deviceId}`;

  try {
    return await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function prev(deviceId: string, accessToken: string) {
  const url = `${END_POINT}/v1/me/player/previous?device_id=${deviceId}`;

  try {
    return await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function shuffle(state: boolean, deviceId: string, accessToken: string) {
  const url = `${END_POINT}/v1/me/player/shuffle?state=${state}&device_id=${deviceId}`;

  try {
    return await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    throw e;
  }
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/player/set-repeat-mode-on-users-playback/
 */
export async function repeat(state: 'track' | 'context' | 'off', deviceId: string, accessToken: string) {
  const url = `${END_POINT}/v1/me/player/repeat?state=${state}&device_id=${deviceId}`;

  try {
    return await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    throw e;
  }
}
