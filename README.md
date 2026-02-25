# 🥛 MilkTrack — Farm Portal

A **Progressive Web App (PWA)** for dairy farms to register milk cars, track lab approvals, and receive real-time push notifications. Built with Firebase (Auth + Firestore + FCM) and deployable to Firebase Hosting or GitHub Pages — **100% free tier**.

---

## 📱 What This App Does (Farm-Side)

| Feature | Description |
|---|---|
| **Register** | Farm submits milk car plate, driver, quantity, arrival time |
| **Real-time status** | See approval/rejection instantly, no refresh needed |
| **Push notifications** | Notification when lab approves or rejects — even when app is closed |
| **PWA** | Works on mobile & PC, installable like a native app |
| **History** | Full log of all past registrations with lab results & SAP doc numbers |

---

## 🗂 Project Structure

```
milktrack/
├── index.html                  ← Main app (auth + all views)
├── manifest.json               ← PWA manifest
├── firebase.json               ← Firebase hosting config
├── firestore.rules             ← Firestore security rules
├── firebase-messaging-sw.js    ← Service worker (push notifications + offline)
├── css/
│   └── style.css               ← All styles
├── js/
│   ├── firebase-config.js      ← Your Firebase credentials (fill in!)
│   └── app.js                  ← Full app logic (reference file)
└── img/
    ├── icon-192.png            ← App icon (add your own)
    └── icon-512.png            ← App icon (add your own)
```

---

## 🔥 STEP 1 — Create Firebase Project (Free)

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"**
3. Name it `milktrack` (or anything)
4. Disable Google Analytics (optional for demo)
5. Click **Create project**

### Enable Authentication
1. Left sidebar → **Build → Authentication**
2. Click **Get started**
3. Enable **Email/Password** provider → Save

### Enable Firestore
1. Left sidebar → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for demo — tighten rules later)
4. Select a region close to you (e.g. `europe-west1` for Middle East)

### Enable Cloud Messaging (Push Notifications)
1. Left sidebar → **Project Settings** (gear icon)
2. **Cloud Messaging** tab
3. Under **Web Push certificates**, click **Generate key pair**
4. Copy the **VAPID key** — you'll need it

---

## 🔧 STEP 2 — Get Your Firebase Config

1. **Project Settings** (gear icon) → **General** tab
2. Scroll to **Your apps** → Click **</>** (Web)
3. Register app as `milktrack-web`
4. Copy the `firebaseConfig` object

### Update these 2 files:

**`index.html`** — find `const firebaseConfig = {` near the bottom and replace:
```javascript
const firebaseConfig = {
  apiKey:            "your-actual-api-key",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123:web:abc123"
};
const VAPID_KEY = "your-vapid-key-from-cloud-messaging";
```

**`firebase-messaging-sw.js`** — update the same values at the top of the file.

---

## 🚀 STEP 3 — Deploy to Firebase Hosting (Free)

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login & Deploy
```bash
cd milktrack/
firebase login
firebase init hosting    # Select your project, public dir = ".", SPA = yes
firebase deploy
```

Your app will be live at:
```
https://YOUR-PROJECT-ID.web.app
```

---

## 🐙 STEP 4 — Deploy to GitHub Pages (Alternative / Free)

GitHub Pages also works — great for sharing with management.

### Setup
1. Create a new GitHub repo (e.g. `milktrack`)
2. Push all files to the `main` branch
3. Go to **Settings → Pages**
4. Source: **Deploy from branch → main → / (root)**
5. Your URL: `https://YOUR-USERNAME.github.io/milktrack`

> ⚠️ **Note for GitHub Pages**: Firebase push notifications require HTTPS — GitHub Pages provides this automatically. However, the service worker path must be `/firebase-messaging-sw.js` at the root — which is already set up correctly.

---

## 🔒 STEP 5 — Tighten Security Rules

Once tested, deploy proper Firestore rules:
```bash
firebase deploy --only firestore:rules
```
The `firestore.rules` file is already written — it ensures farms can only see their own data.

---

## 🏗 Full System Architecture

```
FARM (Mobile/PC)          YOUR ORGANIZATION
     │                           │
     │  Register milk car        │  Admin Dashboard
     ▼                           ▼  (Power Apps / React)
 Firebase Auth ──────────── Firestore DB
     │                           │
     │  Submit registration      │  Lab updates status
     ▼                           ▼
 Firestore ──── onSnapshot() ─── Real-time sync
     │
     ▼
 FCM Push Notification → Farm's phone
     │
     ▼
 Farm sees: ✅ Approved → Come to lab
     │
     ▼
 Lab Analysis → SAP integration via:
   • SAP RFC / BAPI calls
   • SAP Business Technology Platform (BTP)
   • Power Automate + SAP connector (if org has it)
   • Azure Logic Apps
```

---

## 💰 Free Tier Limits (Firebase Spark)

| Service | Free Limit | Your Usage Estimate |
|---|---|---|
| Authentication | Unlimited users | ✅ Fine |
| Firestore reads | 50,000/day | ✅ Fine for < 100 farms |
| Firestore writes | 20,000/day | ✅ Fine |
| Hosting bandwidth | 10 GB/month | ✅ Fine |
| Cloud Messaging (Push) | Unlimited | ✅ Free forever |

---

## 🔌 SAP Integration (Next Phase)

When ready to connect to SAP, use one of:

1. **Power Automate + SAP connector** — easiest if org has M365 license
2. **SAP BTP Integration Suite** — enterprise-grade
3. **Node.js backend on Firebase Functions** — call SAP RFC/BAPI APIs
4. **Azure Logic Apps** — good middle ground

The Firestore data model is already designed for SAP: each approved registration stores `sapDocId` once posted.

---

## 📞 Support

Built as a prototype for management demo. Replace `YOUR_*` placeholders with real Firebase credentials to go live.
