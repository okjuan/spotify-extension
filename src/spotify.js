const END_POINT = 'https://api.spotify.com';

class Spotify {
  async getDevices(token) {
    const url = `${END_POINT}/v1/me/player/devices`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
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
      throw e;
    }
  }

  async pause(token) {
    const url = `${END_POINT}/v1/me/player/pause`;

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

  async play(token) {
    const url = `${END_POINT}/v1/me/player/play`;

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

  async next(token) {
    const url = `${END_POINT}/v1/me/player/next`;

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

  async prev(token) {
    const url = `${END_POINT}/v1/me/player/previous`;

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
    /*
     * clientId
     * accessToken
     * accessTokenExpirationTimestampMs
     * isAnonymous
     */
    const url = 'https://open.spotify.com/get_access_token';

    const res = await fetch(url, {
      cookie: JSON.stringify(cookies),
    });

    const data = await res.json();

    return data;
  }
}
