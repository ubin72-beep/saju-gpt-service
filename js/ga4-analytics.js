// ===================================
// Google Analytics 4 통합 스크립트
// ===================================

// Google Analytics 4 초기화
(function() {
    // GA4 측정 ID를 여기에 입력하세요
    // 예: G-XXXXXXXXXX
    const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Google Analytics에서 발급받은 ID로 교체
    
    // GA4 스크립트 로드
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script1);
    
    // GA4 초기화 스크립트
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
    });
    
    console.log('📊 Google Analytics 4 초기화 완료');
})();

// ===================================
// 커스텀 이벤트 추적
// ===================================

// 사주 계산 버튼 클릭
function trackSajuCalculation() {
    if (window.gtag) {
        gtag('event', 'saju_calculation_start', {
            event_category: 'engagement',
            event_label: 'Saju Calculator',
            value: 1
        });
        console.log('📊 이벤트 추적: 사주 계산 시작');
    }
}

// AI 상담 시작
function trackAIChatStart() {
    if (window.gtag) {
        gtag('event', 'ai_chat_start', {
            event_category: 'engagement',
            event_label: 'AI Chat',
            value: 1
        });
        console.log('📊 이벤트 추적: AI 상담 시작');
    }
}

// 회원가입 완료
function trackSignup() {
    if (window.gtag) {
        gtag('event', 'sign_up', {
            method: 'email'
        });
        console.log('📊 이벤트 추적: 회원가입');
    }
}

// 로그인 완료
function trackLogin() {
    if (window.gtag) {
        gtag('event', 'login', {
            method: 'email'
        });
        console.log('📊 이벤트 추적: 로그인');
    }
}

// 구매 이벤트
function trackPurchase(productName, price, currency = 'KRW') {
    if (window.gtag) {
        gtag('event', 'purchase', {
            transaction_id: `TX_${Date.now()}`,
            value: price,
            currency: currency,
            items: [{
                item_name: productName,
                price: price,
                quantity: 1
            }]
        });
        console.log(`📊 이벤트 추적: 구매 - ${productName} (₩${price})`);
    }
}

// 페이지 스크롤 추적 (50%, 100%)
(function() {
    let scrolled50 = false;
    let scrolled100 = false;
    
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent >= 50 && !scrolled50) {
            scrolled50 = true;
            if (window.gtag) {
                gtag('event', 'scroll', {
                    event_category: 'engagement',
                    event_label: '50%',
                    value: 50
                });
            }
        }
        
        if (scrollPercent >= 90 && !scrolled100) {
            scrolled100 = true;
            if (window.gtag) {
                gtag('event', 'scroll', {
                    event_category: 'engagement',
                    event_label: '100%',
                    value: 100
                });
            }
        }
    });
})();

// ===================================
// 외부 링크 클릭 추적
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="saju-gpt-service.vercel.app"])');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.gtag) {
                gtag('event', 'click', {
                    event_category: 'outbound',
                    event_label: this.href,
                    transport_type: 'beacon'
                });
            }
        });
    });
});

// ===================================
// 에러 추적
// ===================================
window.addEventListener('error', function(e) {
    if (window.gtag) {
        gtag('event', 'exception', {
            description: e.message,
            fatal: false
        });
    }
});

// ===================================
// 전역 함수 export
// ===================================
window.analytics = {
    trackSajuCalculation,
    trackAIChatStart,
    trackSignup,
    trackLogin,
    trackPurchase
};
