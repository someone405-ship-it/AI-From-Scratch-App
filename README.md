# AI From Scratch - Real Mobile App

A real Android app with a clean ChatGPT-style interface for your AI From Scratch project.

## Features

- Clean chat interface (similar to ChatGPT)
- Dark mode
- Thinking modes
- Connects to your public AI backend
- Works as a real installable Android app

---

## How to get the APK on your phone

### Option A – Easiest (Recommended)

1. Install **Expo Go** on your phone from Play Store
2. On your computer run:

```bash
git clone https://github.com/someone405-ship-it/AI-From-Scratch-App.git
cd AI-From-Scratch-App
npm install
npx expo start
```

3. Scan the QR code with Expo Go

### Option B – Real APK file (installable without Expo Go)

```bash
npx expo build:android
```
or the newer way:

```bash
npx eas build -p android --profile preview
```

This will give you a downloadable `.apk` file that you can install on any Android phone.

---

## Connect to your AI

Open `src/config.js` and put your public Hugging Face Space link (or any backend URL).

Example:
```js
export const API_URL = "https://YOUR_USERNAME-AI-From-Scratch.hf.space";
```

---

## Project Structure

```
AI-From-Scratch-App/
├── App.js
├── src/
│   ├── screens/ChatScreen.js
│   ├── components/
│   └── config.js
├── package.json
└── app.json
```

---

This is a real mobile app, not a website.
