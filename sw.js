/**
 * Service Worker - 2026 병오년 만세력
 * PWA 기능: 오프라인 지원, 캐싱, 푸시 알림
 */

const CACHE_NAME = 'saju2026-v1.0.0';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/ai-chat.html',
    '/pricing.html',
    '/mypage.html',
    '/referral.html',
    '/css/style.css',
    '/css/chat.css',
    '/css/pricing.css',
    '/js/main.js',
    '/js/ai-chat.js',
    '/js/payment-system.js',
    '/js/saju-calculator.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap'
];

// ===== 설치 이벤트 =====
self.addEventListener('install', (event) => {
    console.log('[Service Worker] 설치 중...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] 캐시 저장 중...');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] 설치 완료!');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] 캐시 저장 실패:', error);
            })
    );
});

// ===== 활성화 이벤트 =====
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] 활성화 중...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] 이전 캐시 삭제:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] 활성화 완료!');
                return self.clients.claim();
            })
    );
});

// ===== Fetch 이벤트 (캐싱 전략) =====
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // API 요청은 네트워크 우선
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return new Response(
                        JSON.stringify({ error: '오프라인 상태입니다.' }),
                        {
                            headers: { 'Content-Type': 'application/json' },
                            status: 503
                        }
                    );
                })
        );
        return;
    }
    
    // 정적 리소스는 캐시 우선 (Cache First)
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // 캐시된 리소스 반환
                    return cachedResponse;
                }
                
                // 캐시에 없으면 네트워크 요청
                return fetch(request)
                    .then((networkResponse) => {
                        // 성공적인 응답만 캐시
                        if (networkResponse && networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // 오프라인 폴백 페이지
                        if (request.destination === 'document') {
                            return caches.match('/offline.html');
                        }
                    });
            })
    );
});

// ===== 푸시 알림 수신 =====
self.addEventListener('push', (event) => {
    console.log('[Service Worker] 푸시 알림 수신:', event);
    
    let data = {};
    if (event.data) {
        data = event.data.json();
    }
    
    const title = data.title || '2026 병오년 만세력';
    const options = {
        body: data.body || '새로운 알림이 도착했습니다.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        image: data.image,
        vibrate: [200, 100, 200],
        tag: data.tag || 'default',
        requireInteraction: false,
        actions: [
            {
                action: 'view',
                title: '확인하기',
                icon: '/icons/check.png'
            },
            {
                action: 'close',
                title: '닫기',
                icon: '/icons/close.png'
            }
        ],
        data: {
            url: data.url || '/',
            timestamp: Date.now()
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// ===== 알림 클릭 이벤트 =====
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] 알림 클릭:', event);
    
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // 이미 열린 탭이 있으면 포커스
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // 없으면 새 탭 열기
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// ===== 백그라운드 동기화 =====
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] 백그라운드 동기화:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    try {
        // 오프라인 상태에서 저장된 데이터 동기화
        const cache = await caches.open('offline-data');
        const requests = await cache.keys();
        
        for (const request of requests) {
            await fetch(request);
            await cache.delete(request);
        }
        
        console.log('[Service Worker] 데이터 동기화 완료');
    } catch (error) {
        console.error('[Service Worker] 동기화 실패:', error);
    }
}

// ===== 주기적 백그라운드 동기화 =====
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-fortune') {
        event.waitUntil(updateDailyFortune());
    }
});

async function updateDailyFortune() {
    try {
        const response = await fetch('/api/fortune/daily');
        const data = await response.json();
        
        // 캐시 업데이트
        const cache = await caches.open(CACHE_NAME);
        await cache.put('/api/fortune/daily', new Response(JSON.stringify(data)));
        
        // 알림 전송
        await self.registration.showNotification('오늘의 운세 업데이트', {
            body: '새로운 운세가 도착했습니다!',
            icon: '/icons/icon-192x192.png',
            data: { url: '/daily.html' }
        });
    } catch (error) {
        console.error('[Service Worker] 운세 업데이트 실패:', error);
    }
}

// ===== 메시지 수신 =====
self.addEventListener('message', (event) => {
    console.log('[Service Worker] 메시지 수신:', event.data);
    
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data.action === 'clearCache') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

console.log('[Service Worker] 로드 완료');
