# Clickify Chrome Extension

> Log hours on Clockify at the same time you change status on Clickup on a Chrome Extension

## How to install

## install dependencies

```bash
npm i
```

## Build

```bash
npm run build
```

## Load Unpacked Extensions

[Getting Started Tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/)

1. Open the Extension Management page by navigating to `chrome://extensions`.
2. Enable Developer Mode by clicking the toggle switch next to `Developer mode`.
3. Click the `LOAD UNPACKED` button and select the `/dist` directory.

![Example](https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/vOu7iPbaapkALed96rzN.png?auto=format&w=571)

## After install

A new button will appear on the screen for each task in Clickup next to the task id, but it will be disabled, to activate it, follow the steps below;

[![Captura-de-Tela-2023-11-24-a-s-13-45-58.png](https://i.postimg.cc/0yrPkcYT/Captura-de-Tela-2023-11-24-a-s-13-45-58.png)](https://postimg.cc/Sn0wVLtd)

You will need to provide your CLOCKIFY API KEY, so to get it, follow the instructions below:

1. Access the clockify website and log in;
2. Access your profile settings by clicking on your photo in the top right corner;
3. Inside the settings there will be a session called API and below it will be your API KEY, copy it.
4. Open the Clickify extension, paste the API KEY into the input and click on SAVE button
5. Done. Now, you are ready to enjoy the extension.
