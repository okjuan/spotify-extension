const END_POINT = 'https://api.spotify.com';

class Spotify {
  async getDevices(token) {
    try {
      const url = `${END_POINT}/v1/me/player/devices`;

      const res = await fetch(url, {
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      let devices = [];
      if (data.devices) {
        devices = data.devices.filter((item) => {
          return (
            item.type === 'Computer' && !item.name.includes('Web Player')
          );
        });
      }

      return {
        ...data,
        devices,
      };
    } catch (e) {
      throw e;
    }
  }

  async getRecentlyPlayedTrack(token) {
    const url = `${END_POINT}/v1/me/player/recently-played`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = await res.json();
      if (data && data.items.length) {
        data = {
          item: {
            ...data.items[0].track,
          },
        };
      }
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getPlayingTrack(token) {
    const url = `${END_POINT}/v1/me/player/currently-playing?additional_types=track`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    } catch (e) {
      return;
    }
  }

  async pause(token, deviceId) {
    const url = `${END_POINT}/v1/me/player/pause?device_id=${deviceId}`;

    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    } catch (e) {
      throw e;
    }
  }

  async play(token, deviceId, songInfo) {
    const url = `${END_POINT}/v1/me/player/play?device_id=${deviceId}`;

    const postData = {
      uris: [songInfo.uri]
    };

    try {
      await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    } catch (e) {
      throw e;
    }
  }

  async next(token, deviceId) {
    const url = `${END_POINT}/v1/me/player/next?device_id=${deviceId}`;

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async prev(token, deviceId) {
    const url = `${END_POINT}/v1/me/player/previous?device_id=${deviceId}`;

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async shuffle(token, state, deviceId) {
    const url = `${END_POINT}/v1/me/player/shuffle?state=${state}&device_id=${deviceId}`;

    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async repeat(token, state, deviceId) {
    const url = `${END_POINT}/v1/me/player/repeat?state=${state}&device_id=${deviceId}`;

    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async getAccessToken(cookies) {
    const url = 'https://open.spotify.com/get_access_token';
    const res = await fetch(url, {
      cookie: JSON.stringify(cookies),
    });

    const data = await res.json();

    return data;
  }
}
