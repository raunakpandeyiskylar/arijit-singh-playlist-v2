# **Arijit Singh Playlist v2 — Full Stack Music Player (MERN + Next.js)**

A modern full-stack music playlist application built using **Next.js**, **MongoDB**, **Node.js**, and **raw_lib/raw_cli**.
This is a complete rebuild of the earlier static playlist project, upgraded to support **dynamic song uploads**, **secure private streaming**, and **custom playlists**, celebrating the artist’s signature season of releases.

---

## 🚀 **Tech Stack**

**Frontend**

* Next.js (App Router)
* React
* Tailwind CSS / CSS modules
* Custom UI components
* HTML5 Audio Player
* Optional Lottie / tsParticles animations

**Backend**

* Node.js (Next.js API Routes + Server Actions)
* MongoDB (Mongoose or raw_lib adapter)
* raw_lib for validation, query layer, and clean architecture
* raw_cli for feature scaffolding
* Multer for file uploads
* Local storage (phase 1) → Cloudinary storage (phase 2)

---

## 🎧 **Core Features**

### **1. Dynamic Song Uploads**

* Upload MP3/OGG audio from the browser
* Server stores files in the `storage/uploads/` directory
* Metadata stored in MongoDB
* Optional cover image upload

### **2. Private Audio Streaming**

* Songs are **NOT** publicly exposed
* Streaming endpoint validates ownership before serving audio
* Supports range requests (seek, scrub, fast-forward)
* Convertible to Cloudinary signed URLs later

### **3. Custom Playlists**

* Create playlists
* Add/remove songs
* Drag-and-drop reordering
* Song metadata preview
* Playlist-based playback queue

### **4. Secure Authentication**

* Email + password login
* JWT or httpOnly cookies
* raw_lib validation for user creation & auth flow

### **5. Clean Architecture**

The project uses a layered approach via **raw_lib**:

```
/domain   → entities, validators, mappers  
/usecases → core business logic  
/data     → repositories (MongoDB implement.)  
/api      → Next.js route handlers  
/ui       → React components  
```

Scaffolding via:

```
npx raw_cli generate:feature songs
npx raw_cli generate:feature playlists
```

---

## 🎨 **November-Only Special Effects**

In the month of **November**, the app automatically activates a set of unique UI effects:

* Daily visual themes mapped to each date
* Confetti, gradients, particles, or Lottie animations
* Birthday-style countdown (configurable date)
* Fully customizable via JSON configuration

Example configuration:

```json
{
  "month": 11,
  "effects": [
    { "day": 1,  "type": "confetti" },
    { "day": 5,  "type": "hearts" },
    { "day": 10, "type": "soft-glow" },
    { "day": 20, "type": "floating-notes" },
    { "day": 30, "type": "special-lottie", "asset": "celebration.json" }
  ]
}
```

---

## 📁 **Project Structure**

```
root/
├── app/
│   ├── playlists/
│   ├── songs/
│   ├── api/
│   │   ├── songs/
│   │   │   ├── upload/
│   │   │   └── [id]/stream/
│   │   └── playlists/
│   └── components/
├── domain/
├── usecases/
├── data/
├── storage/
│   └── uploads/
├── raw_lib.config.js
├── package.json
└── README.md
```

---

## 🔐 **Security Model**

* Uploaded audio is **private** by default
* Streaming requires authentication (owner check)
* No direct public URLs for audio files
* File size and type validation enforced server-side
* Optional share tokens for temporary playlist sharing

---

## ☁️ **Cloudinary Integration (Phase 2)**

The app is built to easily transition to Cloudinary:

* Upload local → Cloudinary (server-side)
* Store Cloudinary `public_id` + secure URL
* Replace local stream endpoint with signed Cloudinary links
* Optionally proxy streams through server for extra privacy

---

## 🛠️ **Local Development**

### **1. Install**

```
npm install
```

### **2. Env Setup**

Create `.env.local`:

```
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_CLOUD_NAME=...
```

### **3. Run Dev Server**

```
npm run dev
```

### **4. Storage Folder**

Make sure local upload directory exists:

```
mkdir -p storage/uploads
```

---

## 🚀 **Deploy**

For production:

* Next.js → Vercel or VPS
* Backend/API → Vercel serverless or Node on a VPS
* Use Cloudinary for persistent file storage
* Update `storage.type` in DB from `"local"` to `"cloudinary"` without breaking existing data

---

## 📌 **Future Enhancements**

* Waveform visualization
* Offline download (PWA mode)
* Playlist collaboration
* Smart auto-generated mixes
* Full Cloudinary migration
* Mobile app wrapper (Flutter or React Native)

---
