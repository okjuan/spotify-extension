chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log("The color is green.");

    const token = 'BQBSSnq1lY2XTey0D34YiEiowEjQTEZ2tvkV2GRAionCEhabOPhlSEj5t28uF2tW-kwupUpZZZ_YfDu0qc9f5jZ7DnM7xTdLIE18cACmC37V6iZmJweHnmxdRtDFIAmX3PxJ7icqGl-8uS9VPCM6yslxoeSXwDqtlW3hLzjmtuS9ww0YQxtkM2GRi9H0POjP0RRjcf8l-Gy8r6wPSSxKQ2qDHCyO4oKXfd_-SR5dC4PPuUAvY0nvYKcwOmCBcStodY_t7h5OopUW74Un_uC5lg';
    const url = 'https://api.spotify.com/v1/me/player/devices';

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.json())
      .then(data => console.log('asdasdasd', data));

  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'developer.chrome.com' },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});