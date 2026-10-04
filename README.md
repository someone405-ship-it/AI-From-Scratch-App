# AI From Scratch - Real Mobile App

ChatGPT-style Android app connected to your AI From Scratch backend.

## Repositories

- **AI Backend**: https://github.com/someone405-ship-it/AI-From-Scratch
- **This Mobile App**: https://github.com/someone405-ship-it/AI-From-Scratch-App

---

## How to connect everything

### 1. Deploy the AI backend (public link)

1. Go to https://huggingface.co/spaces
2. Create a new Space → choose **Gradio**
3. Upload the files from the AI-From-Scratch repository
4. Copy your public link, example:
   ```
   https://YOUR_USERNAME-AI-From-Scratch.hf.space
   ```

### 2. Connect the mobile app

Open `src/config.js` and put your link:

```js
export const API_URL = "https://YOUR_USERNAME-AI-From-Scratch.hf.space";
```

### 3. Run the app on your phone

```bash
git clone https://github.com/someone405-ship-it/AI-From-Scratch-App.git
cd AI-From-Scratch-App
npm install
npx expo start
```

- Install **Expo Go** from Play Store
- Scan the QR code

### 4. Build a real APK (optional)

```bash
npx eas build -p android --profile preview
```

---

## Features in the app

- Clean ChatGPT-style dark interface
- Thinking modes: Fast / Balanced / Strong / Research
- Real connection to your AI backend
- Loading indicator while thinking

---

The app is now properly connected to the AI backend.
