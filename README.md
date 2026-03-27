# Clipart AI — Multi-Style AI Clipart Generator

> Transform any photo into stunning clipart across 5 visual styles using AI. Built for Android with React Native Expo.

---

## APK Download

[Download APK from Google Drive](#) ← _Replace with your Drive link after building_

## Screen Recording

[Watch Full Walkthrough on Google Drive](#) ← _Replace with your Drive recording link_

---

## App Screenshots

| Upload Screen | Style Selection | Generating | Results Grid |
|---|---|---|---|
| Upload your photo from gallery or camera | Pick one or all 5 styles | Live skeleton loaders per style | Download or share any result |

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
- Custom prompt editor to fine-tune generation
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
| Replicate API | — | Access to SDXL img2img for clipart |
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
cp .env.example .env
# Fill in MONGODB_URI and REPLICATE_API_TOKEN in .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Get API Keys (Free)

**Replicate API Token:**
1. Sign up at [replicate.com](https://replicate.com)
2. Go to Account → API tokens
3. Copy token → paste into `backend/.env` as `REPLICATE_API_TOKEN`

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

## How to Submit

1. Build APK using `eas build --platform android --profile preview`
2. Download APK from EAS dashboard
3. Upload APK to Google Drive → Get shareable link
4. Record a 1-3 min screen recording showing:
   - Upload flow (gallery pick)
   - Style selection
   - Generation with live skeleton loaders
   - Results grid with completed images
   - Download / share action
5. Upload recording to Google Drive → Get shareable link
6. Push code to GitHub
7. Submit: APK link + Recording link + GitHub repo URL

---

## Tradeoffs & Decisions

### Replicate over OpenAI DALL-E
Replicate's SDXL supports img2img (image-to-image), which preserves the person's likeness better. DALL-E 3 doesn't support img2img natively. Replicate also has a free credits tier suitable for this assignment.

### Polling over WebSockets
WebSockets add significant infrastructure complexity. Polling every 3 seconds is simple, reliable, and perfectly adequate for a ~30–60 second generation time. The UX is identical from the user's perspective.

### Redux Toolkit over Zustand/Context
RTK's `createSlice` + `createAsyncThunk` pattern is structured and scales well. The thunk pattern makes the generation state machine (idle → starting → processing → done) very readable. Redux Persist adds history without any extra backend.

### NativeWind over StyleSheet
NativeWind allows writing Tailwind utility classes directly in JSX, making UI iteration extremely fast. For a time-constrained assignment this is the right tradeoff — the output is as performant as StyleSheet.

### Parallel style generation
All selected styles hit Replicate simultaneously via `Promise.allSettled`. This means a 5-style batch takes the time of one generation, not five. Failed styles don't block others.

### Client-side image compression
Images are resized to max 1024px and re-encoded to JPEG at 82% quality before upload, reducing payload size by 60-80% on typical phone photos. The server also validates and reprocesses with Sharp as a second layer.

### MongoDB TTL index
Generation records auto-expire after 7 days via a TTL index — no manual cleanup needed.

---

## Security

- API keys stored only in backend `.env`, never in the app bundle
- Backend acts as proxy — client never touches Replicate directly
- Input validation on both client and server (file type, size, style whitelist)
- Rate limiting: global (50 req/15 min) + generation-specific (5 req/min)
- Helmet.js sets security headers (XSS, CORS, etc.)
- Base64 image validated with Sharp before processing (prevents fake image attacks)

---

## License

MIT — built as an assignment submission.
