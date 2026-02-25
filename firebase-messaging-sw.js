// MilkTrack Service Worker — PWA + Firebase Cloud Messaging

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDVWT2482mQTj8whjTWRLDAzY9Oa9mnw_E",
  authDomain: "farmsmilk.firebaseapp.com",
  projectId: "farmsmilk",
  storageBucket: "farmsmilk.firebasestorage.app",
  messagingSenderId: "175276296664",
  appId: "1:175276296664:web:e4ba8302824164f9484aad"
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: icon || '/img/icon-192.png',
    badge: '/img/badge-72.png',
    vibrate: [200, 100, 200],
    data: payload.data,
    actions: [
      { action: 'view', title: '👁 View Details' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  });
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// PWA Cache Strategy
const CACHE_NAME = 'milktrack-v1';
const STATIC_ASSETS = ['/', '/index.html', '/css/style.css', '/js/app.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});