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

<img width="409" alt="Screen Shot 2020-07-01 at 15 31 12" src="https://user-images.githubusercontent.com/6290720/86210759-1c338c80-bbb0-11ea-96c6-b0f781e5df15.png">

<img width="406" alt="Screen Shot 2020-07-01 at 15 33 13" src="https://user-images.githubusercontent.com/6290720/86210952-77fe1580-bbb0-11ea-9c67-34d53bfb3b4b.png">

<img width="410" alt="Screen Shot 2020-07-01 at 15 31 40" src="https://user-images.githubusercontent.com/6290720/86210974-83e9d780-bbb0-11ea-8fcb-2d69a4ab6895.png">

<img width="411" alt="Screen Shot 2020-07-01 at 15 31 25" src="https://user-images.githubusercontent.com/6290720/86210977-864c3180-bbb0-11ea-8319-c0d112fb720e.png">


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
