const CACHE_NAME = 'sunwork-pwa-v6.4';
const DYNAMIC_CACHE = 'sunwork-dynamic-v1';

// ไฟล์ตั้งต้นที่ต้องการแคช (กรณีเปิดหน้าเว็บหลัก)
const urlsToCache = [
  '/',
  '/index.html' // เปลี่ยนให้ตรงกับชื่อไฟล์จริงของคุณหากไม่ได้ชื่อ index.html
];

// 1. Install Event: ติดตั้ง Service Worker และบันทึกแคชไฟล์พื้นฐาน
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. Activate Event: ลบแคชเวอร์ชันเก่าทิ้งเมื่อมีการอัปเดต Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: จัดการเมื่อเว็บแอปมีการเรียกขอข้อมูล
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 3.1 บายพาส (Bypass) API ของ Google Apps Script ไม่ต้องแคช เพื่อให้ได้ข้อมูลล่าสุดเสมอ
  if (url.origin === 'https://script.google.com' || url.origin === 'https://script.googleusercontent.com') {
    event.respondWith(fetch(event.request));
    return;
  }

  // 3.2 Cache First, fallback to Network สำหรับไลบรารีภายนอก (CDN)
  // เพราะไฟล์พวกนี้ไม่ค่อยเปลี่ยนแปลง การดึงจากแคชจะทำให้แอปโหลดเร็วมาก
  if (
    url.origin.includes('unpkg.com') || 
    url.origin.includes('cdn.tailwindcss.com') ||
    url.origin.includes('cdn.jsdelivr.net') ||
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // เจอในแคช ให้ส่งกลับเลย
        }
        // ถ้าไม่เจอ ให้ไปดึงจากเน็ต แล้วเอามาเก็บลง DYNAMIC_CACHE
        return fetch(event.request).then(networkResponse => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(err => console.log('[Service Worker] CDN Fetch failed', err));
      })
    );
    return;
  }

  // 3.3 Network First, fallback to Cache สำหรับหน้า HTML และไฟล์อื่นๆ
  // พยายามโหลดเวอร์ชันใหม่ล่าสุดก่อนเสมอ ถ้าเน็ตหลุดถึงจะเอาของเก่ามาแสดง
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // นำของใหม่ไปอัปเดตในแคช
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
