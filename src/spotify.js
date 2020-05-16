const END_POINT = 'https://api.spotify.com';

class Spotify {
  async getDevices(token) {
    try {
      const url = `${END_POINT}/v1/me/player/devices`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { devices } = await res.json();
      return devices
        ? devices.filter((item) => {
            return (
              item.type === 'Computer' && !item.name.includes('Web Player')
            );
          })
        : [];
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
      return null;
    }
  }

  async pause(token, deviceId) {
    const url = `${END_POINT}/v1/me/player/pause?device_id=${deviceId}`;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === '204') {
        alert('pause');
      }
    } catch (e) {
      throw e;
    }
  }

  async play(token, deviceId) {
    console.log('deviceId', deviceId);
    const url = `${END_POINT}/v1/me/player/play?device_id=${deviceId}`;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === '204') {
        alert('pause');
      }
    } catch (e) {
      throw e;
    }
  }

  async next(token, deviceId) {
    const url = `${END_POINT}/v1/me/player/next?device_id=${deviceId}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === '204') {
        alert('pause');
      }
    } catch (e) {
      throw e;
    }
  }

  async prev(token, deviceId) {
    const url = `${END_POINT}/v1/me/player/previous?device_id=${deviceId}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === '204') {
        alert('pause');
      }
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
