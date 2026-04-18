# SafeSaathi – With you, every step

SafeSaathi is a personal safety application designed to ensure user safety during travel. It incorporates features like live GPS tracking, AI-based route deviation simulation, periodic safety check-ins, an interactive SOS emergency system, and questionnaire-based identity verification.

Due to the constraints of the AI Studio preview environment (web iframe), this prototype is built as a **Mobile-First Progressive Web App (PWA)** using React and Vite, perfectly mirroring the UI of a React Native app. 

## Features Integrated

1. **Authentication:** Register/Login via Firebase (Email/Password) and User Profiles stored in Firestore.
2. **Onboarding:** Stores security questions and user profile information.
3. **Home Dashboard:** High-quality dark UI matching the strict requirements.
4. **Live Journey Tracking:** Simulated GPS route map and deviation detection alerts.
5. **Security Check (Feeling Safe?):** Challenges the user with their random security question. Drops to SOS on failure.
6. **Trusted Contacts:** Manage trusted SOS contacts dynamically via Firestore subcollections.
7. **SOS Emergency System:** An overlay Modal that triggers a countdown, simulating police/contact dispatch with simulated offline SMS fallback logic embedded.

## Project Structure

```
/src
  /components           # Reusable UI like BottomNav, SOSButton, SOSOverlay
  /firebase             # Firebase initialization config (config.ts)
  /screens              # Pages (Home, Login, Register, Profile, Journey, etc)
  /store                # Global state using Zustand (useAppStore.ts)
```

## Step-by-step Setup

1. **Install Node.js**: Ensure Node.js (v18+) is installed on your local machine.
2. **Install CLI Tooling**: Since this prototype uses Vite, you only need standard npm.
3. **Clone project**: Download the ZIP or clone the repository to your machine.
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Setup Firebase project**: 
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Add a new Web App and get the configuration keys.
   - Enable "Email/Password" Auth in Firebase Authentication.
   - Enable Firestore Database (Enterprise/Native mode).
6. **Add API keys**: 
   - Place your Firebase configuration into `firebase-applet-config.json` or replace the variables directly in `src/firebase/config.ts`.
7. **Run app**:
   ```bash
   npm run dev
   ```
   (Access on `http://localhost:3000` from Mobile or Desktop. Use Desktop Chrome DevTools "Device Toolbar" to view as a mobile app).
8. **Test flows**:
   - Register a new user (Add a custom security answer).
   - Configure a trusted contact via the contacts tab.
   - Start a journey to see the route deviation and live mapping UI.
   - Click "Feeling safe?" and enter a wrong answer to test the Auto-SOS hook.
   - Click the central SOS button to trigger a system-wide simulated distress signal.

---
_Note: Native expo-sensors and direct SMS integration require compiling to a real Android/iOS binary using Expo Application Services (EAS). This web-prototype uses standard browser equivalents where applicable._
