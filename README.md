# KenLive TV - Digital Broadcast Web Platform (tv.kenlive.co.ke)

KenLive TV is Kenya's premier 24/7 digital live television station, built with React 19, TypeScript, Vite, Tailwind CSS, and HLS.js. Designed mobile-first for fast loading on Kenyan networks with a bold, broadcast-grade news finish.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production deployment
npm run build
```

---

## ⚙️ Configuration Files (Non-Developer Friendly)

All live settings, streams, and program schedules are organized in dedicated files under `src/config/`:

| File | Purpose | Key Settings |
|------|---------|--------------|
| `src/config/stream.ts` | **Live Stream & Radio** | `STREAM_URL` (HLS `.m3u8` feed), `YOUTUBE_FALLBACK_ID` (YouTube Live fallback), `RADIO_STREAM_URL` |
| `src/config/site.ts` | **Contact & Brand Links** | Phone/WhatsApp (`+254 703 103677`), Email (`info@kenlive.co.ke`), Socials (Facebook, X, YouTube, TikTok, Instagram, WhatsApp Channel) |
| `src/config/schedule.ts` | **Weekly TV Schedule** | Monday to Sunday broadcast slots, air times (EAT UTC+3), show titles, presenters |
| `src/config/shows.ts` | **Show Directory** | Slugs, presenter bios, air schedules, thumbnails, synopses |
| `src/config/replays.ts` | **Video Clips & Replays** | YouTube clip IDs, titles, view counts, categories |
| `src/config/sponsors.ts` | **Partners & Ad Packages** | Corporate sponsor logos, commercial advertising rates and packages |

---

## 📺 Live Stream & Standby Broadcast Slate

When `STREAM_CONFIG.STREAM_URL` in `src/config/stream.ts` is empty `""` or unreachable:
1. The player displays the **"We're Back Soon"** broadcast standby slate.
2. It features the KenLive badge logo, SMPTE test pattern accents, and East Africa Time (EAT) clock.
3. It computes the **next upcoming show** and displays a live ticking countdown.
4. It provides two instant fallback actions:
   - **"Watch on YouTube"**: embeds the official Ken Wakuraya / KenLive YouTube Live stream.
   - **"Listen to KenLive Radio"**: plays the live audio stream.

---

## 💬 Live Chat & Firebase Realtime Database

Live Chat is built to work immediately out of the box with an interactive simulated broadcast chat and is pre-wired to connect to **Firebase Realtime Database** with zero UI modifications.

### Connecting Real Firebase:
Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="kenlive-tv.firebaseapp.com"
VITE_FIREBASE_DATABASE_URL="https://kenlive-tv-default-rtdb.firebaseio.com"
VITE_FIREBASE_PROJECT_ID="kenlive-tv"
VITE_FIREBASE_STORAGE_BUCKET="kenlive-tv.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
```
The chat layer automatically reads these variables from `src/lib/firebase.ts` and listens on `/chat/main/messages` (capped at the latest 50 messages).

---

## 📰 Curated WordPress News Feed

The News desk (`src/lib/wordpress.ts`) requests articles from `https://kenlive.co.ke/wp-json/wp/v2/posts?_embed`:
- Strictly queries categories: `business`, `health`, `politics`, `generalnews`, and `sports`.
- Automatically excludes casino and spam posts.
- Validates that every post contains a verified featured image and legitimate headline.
- Features skeleton loaders and a resilient offline/CORS fallback.
- Every story opens in a new tab on `kenlive.co.ke`.

---

## 📱 Mobile-First Features

- **Floating Mini-Player**: Automatically collapses into a floating mini-player when scrolling past the main player on mobile.
- **Data Saver Mode**: Allows viewers on limited Kenyan mobile bundles to reduce stream bitrate with one tap.
- **Fixed Bottom Navigation**: 4 quick-action tabs (Live, Schedule, News, Radio) for instant thumb reach on smartphones.
- **EAT Timezone Engine**: Converts browser time to East Africa Time (UTC+3) to highlight the current live show and dim past slots.
