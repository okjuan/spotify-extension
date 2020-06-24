# Spotify Chrome Extension

<div align="center">
  <img src="https://user-images.githubusercontent.com/6290720/82152014-98407200-9899-11ea-9a63-ba6b42aa2c34.png" />
  <br />
  <br />
</div>

Spotify mini player Chrome's exntesion

[![codecov](https://codecov.io/gh/davidnguyen179/spotify-extension/branch/master/graph/badge.svg)](https://codecov.io/gh/davidnguyen179/spotify-extension) [![Build Status](https://travis-ci.com/davidnguyen179/spotify-extension.svg?branch=master)](https://travis-ci.com/davidnguyen179/spotify-extension)

## Motivation

When we are working or just browsing it is inconvenient to have to switch to another window to play/pause or jump to previous tracks or forward to upcoming tracks. Also, we lose focus or get distracted once we navigate away from our current window and open Spotify. With this simple extension we can eliminate the need to navigate away from your current window to control Spotify. This extension has another nifty feature. With a quick right click on the widget, you can search a song by name. So for example if you hear a tune on Youtube you can quickly search it on Spotify without navigating away from your current window. Then you can maybe add it to a playlist later.

- Avoid switching context while you're focusing on your browser by providing mini player which helps to control Spotify with ease from your browser.
- Quick right click to search song by name on Spotify site.

## How it looks like?

![spotify-extension](https://user-images.githubusercontent.com/6290720/85205217-e17e5880-b354-11ea-8b25-bf3f02dfbb71.gif)

### Main screens

<img width="400" alt="Screen Shot 2020-06-21 at 0 20 46" src="https://user-images.githubusercontent.com/6290720/85205249-1d192280-b355-11ea-9c29-f28f9bb6bcbf.png">

<img width="402" alt="Screen Shot 2020-06-21 at 0 20 57" src="https://user-images.githubusercontent.com/6290720/85205252-2b673e80-b355-11ea-97fd-1ccb1cbdcd3a.png">

<img width="403" alt="Screen Shot 2020-06-21 at 0 21 05" src="https://user-images.githubusercontent.com/6290720/85205254-2e622f00-b355-11ea-8725-1860338c911b.png">

### Login screen

**dark**

<img width="403" alt="Screen Shot 2020-06-21 at 0 26 10" src="https://user-images.githubusercontent.com/6290720/85205356-e8f23180-b355-11ea-8892-e01e9752d70e.png">

**light**

<img width="406" alt="Screen Shot 2020-06-21 at 0 26 01" src="https://user-images.githubusercontent.com/6290720/85205358-eabbf500-b355-11ea-8f61-af17c8e8a28f.png">

### No device is opened

**dark**

<img width="403" alt="Screen Shot 2020-06-21 at 0 25 21" src="https://user-images.githubusercontent.com/6290720/85205342-d4159e00-b355-11ea-8e02-c19b4afa4bf8.png">

**light**

<img width="410" alt="Screen Shot 2020-06-21 at 0 25 39" src="https://user-images.githubusercontent.com/6290720/85205345-d546cb00-b355-11ea-9d2c-692b1a9e5614.png">

### Context menu

Search song by name with Chrome's context menu

<img width="487" alt="Screen Shot 2020-05-21 at 23 45 34" src="https://user-images.githubusercontent.com/6290720/82570946-3cd5f300-9bbd-11ea-98d0-c15dda420c2b.png">

## Stores

**Chrome**

[https://chrome.google.com/webstore/detail/mini-spotity-player/bhdjjppbnlpjpeicimhemencfgjeldoa](https://chrome.google.com/webstore/detail/mini-spotity-player/bhdjjppbnlpjpeicimhemencfgjeldoa)

**Firefox**

[https://addons.mozilla.org/en-US/firefox/addon/spotify-player/](https://addons.mozilla.org/en-US/firefox/addon/spotify-player/)

## Development

```bash
npm i
```

**Chrome**

```bash
npm run dev-chrome
```

**Firefox**

```bash
npm run dev-firefox
```

## Production

```bash
npm i
```

**Chrome**

```bash
npm run chrome
```

**Firefox**

```bash
npm run firefox
```

## Load package to Chrome

1. On the browser's URL address bar
2. Enter `chrome://extensions/`
3. Switch to "**Developer mode**"
4. Load "**Load unpacked**"
5. Browse to `dist/` in source code
6. Done!

Check here for more detail: [https://developer.chrome.com/extensions/getstarted](https://developer.chrome.com/extensions/getstarted)

## Load package to Firefox

1. On the browser's URL address bar
2. Enter `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on...**
4. Browser to your `manifest.json` & click **Open**
5. Done!

Check here for more detail: [https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
