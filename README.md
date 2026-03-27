# Clipart AI — Multi-Style AI Clipart Generator

> Transform any photo into stunning clipart across 5 visual styles using AI. Built for Android with React Native Expo.

---


## Features

**Core**
- Upload photo from gallery or camera with automatic resize/compress
- 5 AI clipart styles: Cartoon, Flat Illustration, Anime, Pixel Art, Sketch
- All selected styles generate in parallel (batch generation)
- Live per-style skeleton loaders during generation
- Download to gallery (saved in "Clipart AI" album)
- Native share sheet for any result
- Fullscreen viewer with pinch-to-zoom

**Bonus / Extra**
- Generation history with thumbnails (persisted locally via Redux Persist)
- Backend proxy — API keys never exposed to the client
- Rate limiting: 5 generation requests per minute per IP
- Input validation and image compression on both client and server
- Auto-retry failed styles visible in UI

---

## Tech Stack

### Frontend (React Native Expo SDK 51)

| Tech | Version | Why |
|---|---|---|
| Expo SDK | 51 (latest stable) | Most stable, widest ecosystem support |
| React Native | 0.74 | Ships with Expo 51 |
| Expo Router | 3.5 | File-based routing, clean navigation |
| Redux Toolkit | 2.x | Predictable state, less boilerplate |
| Redux Persist | 6.x | History survives app restarts |
| NativeWind | 4.x | Tailwind CSS utility classes in RN |
| React Native Reanimated | 3.x | Smooth 60fps animations on native thread |
| Expo Image | latest | Fast image loading with blurhash |
| Expo Image Picker | 15.x | Gallery + camera access |
| Expo Image Manipulator | 12.x | Client-side resize + compress |
| @expo/vector-icons | 14.x | Ionicons + MaterialCommunity (no raw emojis) |
| Expo Media Library | 16.x | Save to device gallery |
| Expo Sharing | 12.x | Native share sheet |
| Axios | 1.7 | HTTP client with interceptors |

### Backend (MERN Stack)

| Tech | Version | Why |
|---|---|---|
| Node.js | 18+ | LTS, fast async |
| Express | 4.18 | Minimal, battle-tested |
| MongoDB + Mongoose | 8.x | Flexible schema for generation records |
| HuggingFace API | — | img2img for clipart |
| Sharp | 0.33 | Server-side image resize/validate |
| express-rate-limit | 7.x | Abuse prevention |
| Helmet | 7.x | HTTP security headers |
| dotenv | 16.x | Environment variable management |

---

## Architecture

```
User
 │
 ▼
React Native App (Expo)
 │  ┌─────────────────────────────┐
 │  │  Redux Store                │
 │  │  ├─ generationSlice         │
 │  │  ├─ historySlice (persisted)│
 │  │  └─ uiSlice                 │
 │  └─────────────────────────────┘
 │
 ▼  POST /api/generation/generate  (base64 image + styles)
Express Backend
 │
 ├─ Validate + rate limit
 ├─ Sharp: resize/validate image
 ├─ Create Generation doc in MongoDB (status: processing)
 ├─ Respond 202 with sessionId  ──────────────► App starts polling
 │
 └─ Background: Promise.allSettled(styles)
       │
       └─ Replicate API (SDXL img2img per style)
             │
             └─ Poll Replicate until done
                   └─ Update MongoDB style entry (completed/failed)

App polls GET /api/generation/status/:sessionId every 3 seconds
→ Updates Redux state live
→ ResultCards animate in as each style completes
```

---

## Project Structure

```
clipart-app/
├── frontend/                    # React Native Expo app
│   ├── app/
│   │   ├── _layout.js           # Root layout (Provider, PersistGate)
│   │   ├── (tabs)/
│   │   │   ├── _layout.js       # Tab bar
│   │   │   ├── index.js         # Create / Home screen
│   │   │   ├── history.js       # Past generations
│   │   │   └── settings.js      # App settings
│   │   ├── result/
│   │   │   └── [sessionId].js   # Live generation results
│   │   └── fullscreen.js        # Fullscreen image viewer
│   ├── src/
│   │   ├── store/
│   │   │   ├── index.js         # Redux store + persist config
│   │   │   └── slices/
│   │   │       ├── generationSlice.js
│   │   │       ├── historySlice.js
│   │   │       └── uiSlice.js
│   │   ├── services/
│   │   │   └── api.js           # Axios instance + API calls
│   │   ├── hooks/
│   │   │   ├── useGenerationPoller.js
│   │   │   └── useToast.js
│   │   ├── utils/
│   │   │   ├── imagePicker.js   # Gallery / camera + compress
│   │   │   └── downloadShare.js # Save + native share
│   │   └── components/
│   │       ├── common/          # Toast, Loading, PromptInput
│   │       ├── upload/          # ImageUploadZone
│   │       ├── styles/          # StyleChip
│   │       └── results/         # ResultCard, OverallProgress
│   ├── tailwind.config.js
│   ├── babel.config.js
│   ├── metro.config.js
│   ├── app.json
│   └── eas.json
│
└── backend/                     # Node + Express API
    ├── src/
    │   ├── server.js
    │   ├── config/db.js
    │   ├── models/Generation.js
    │   ├── controllers/
    │   │   ├── generationController.js
    │   │   └── historyController.js
    │   ├── routes/
    │   │   ├── generation.js
    │   │   └── history.js
    │   ├── middleware/
    │   │   ├── rateLimiter.js
    │   │   ├── validate.js
    │   │   └── errorHandler.js
    │   └── services/
    │       ├── replicateService.js
    │       └── imageService.js
    └── package.json
```

---

## Setup & Running Locally

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Replicate account + API token (free credits available)
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for APK build): `npm install -g eas-cli`

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/clipart-ai.git
cd clipart-ai

# Backend
cd backend
npm install
cp .env
# Fill in MONGODB_URI and REPLICATE_API_TOKEN in .env

# Frontend
cd ../frontend
npm install
cp .env
```

### 2. Get API Keys (Free)


**MongoDB Atlas (Free):**
1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Get connection string → paste into `backend/.env` as `MONGODB_URI`

### 3. Run Backend

```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
# Test: http://localhost:5000/health
```

### 4. Run Frontend

```bash
cd frontend

# For Android emulator (default):
npx expo start --android

# For physical device:
# 1. Find your machine IP: ipconfig (Windows) or ifconfig (Mac/Linux)
# 2. Edit frontend/.env:
#    EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api
# 3. npx expo start
# 4. Scan QR with Expo Go app
```

---

## Building the APK

### Option A — EAS Build (Recommended, Cloud Build)

```bash
cd frontend

# Login to Expo
eas login

# Configure your project (first time only)
eas build:configure

# Build APK for preview/testing
eas build --platform android --profile preview

# After build (~10-15 min), download APK from the EAS dashboard
# Upload to Google Drive and copy the share link
```

### Option B — Local Build

```bash
cd frontend
npx expo run:android --variant release
# APK will be in android/app/build/outputs/apk/release/
```

---

## Deploying the Backend

### Option A — Render.com (Free)
1. Push backend folder to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Connect your repo, set root directory to `backend`
4. Add environment variables from `.env.example`
5. Deploy — get your `https://your-app.onrender.com` URL
6. Update `EXPO_PUBLIC_API_URL` in frontend to the Render URL
7. Rebuild APK

### Option B — Railway.app (Free Tier)
```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
railway variables set MONGODB_URI=... REPLICATE_API_TOKEN=...
```

---

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside the backend folder and add:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development

ALLOWED_ORIGINS=*

MAX_FILE_SIZE_MB=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

IMGBB_API_KEY=your_imgbb_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key


## frontend/.env

# For deployed backend
EXPO_PUBLIC_API_URL=https://your-app.onrender.com/api

# For local development (optional)
YOUR_MACHINE_IP=http://YOUR_LOCAL_IP:5000/api




## License

MIT — built as an assignment submission.
