// 운세 자동 생성 시스템
const GEMINI_API_KEY = 'AIzaSyBqVH1yCQYQqNjrBcgNzMzQoYz1M_NZvBQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// 띠별 한자 및 특성
const zodiacData = {
    '쥐': { hanja: '子', element: '물', lucky: '검정, 파랑', personality: '영리하고 적응력이 뛰어남' },
    '소': { hanja: '丑', element: '흙', lucky: '갈색, 노랑', personality: '성실하고 끈기가 있음' },
    '호랑이': { hanja: '寅', element: '나무', lucky: '주황, 금색', personality: '용감하고 리더십이 있음' },
    '토끼': { hanja: '卯', element: '나무', lucky: '분홍, 흰색', personality: '온화하고 사려 깊음' },
    '용': { hanja: '辰', element: '흙', lucky: '금색, 은색', personality: '카리스마 있고 야망이 큼' },
    '뱀': { hanja: '巳', element: '불', lucky: '빨강, 보라', personality: '지혜롭고 신비로움' },
    '말': { hanja: '午', element: '불', lucky: '빨강, 초록', personality: '활동적이고 자유로움' },
    '양': { hanja: '未', element: '흙', lucky: '초록, 빨강', personality: '따뜻하고 예술적임' },
    '원숭이': { hanja: '申', element: '금', lucky: '흰색, 금색', personality: '똑똑하고 재치있음' },
    '닭': { hanja: '酉', element: '금', lucky: '금색, 갈색', personality: '성실하고 정직함' },
    '개': { hanja: '戌', element: '흙', lucky: '빨강, 초록', personality: '충성스럽고 정의로움' },
    '돼지': { hanja: '亥', element: '물', lucky: '노랑, 회색', personality: '관대하고 낙천적임' }
};

// 오늘의 운세 생성
async function generateDailyFortune(zodiacSign) {
    const today = new Date();
    const dateString = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    
    const zodiacInfo = zodiacData[zodiacSign];
    
    const prompt = `당신은 20년 경력의 명리학 전문가입니다.

오늘 날짜: ${dateString}
띠: ${zodiacSign}띠 (${zodiacInfo.hanja})
오행: ${zodiacInfo.element}
성격: ${zodiacInfo.personality}

다음 형식으로 오늘의 운세를 작성해주세요 (반드시 이 형식을 따라야 합니다):

안녕하세요! 🌅

📅 ${dateString}

🐾 ${zodiacSign}띠 전체운
[40~60자: 오늘의 전반적인 운세를 긍정적이고 구체적으로 작성. "오늘은~"으로 시작]

💖 연애운: ★★★★☆
[20~30자: 연애운 조언. "~하세요" 로 끝]

💰 재물운: ★★★☆☆
[20~30자: 재물운 조언. "~하세요" 로 끝]

🍀 행운 색깔: [색깔 하나]
🍀 행운 숫자: [1~9 중 하나]

⏰ 주의 시간: [시간대, 예: 오후 2~4시]

━━━━━━━━━━━━━━━
더 자세한 사주가 궁금하다면?
👉 AI 맞춤 상담 (무료 3회)
www.aisaju1000.com
━━━━━━━━━━━━━━━

주의사항:
1. 긍정적이고 희망적인 톤으로 작성
2. 구체적이고 실용적인 조언
3. 과도한 미신적 표현 지양
4. 일상생활에 적용 가능한 팁
5. 별점은 공정하게 (보통 3~4개)
6. 행운 색깔은 ${zodiacInfo.lucky} 중에서 선택`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 600,
                    topP: 0.9
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        const data = await response.json();
        const fortuneText = data.candidates[0].content.parts[0].text;
        
        console.log(`✅ ${zodiacSign}띠 운세 생성 완료`);
        return fortuneText;
        
    } catch (error) {
        console.error(`❌ ${zodiacSign}띠 운세 생성 실패:`, error);
        
        // 대체 운세 (API 실패 시)
        return generateFallbackFortune(zodiacSign, dateString);
    }
}

// 대체 운세 (API 실패 시)
function generateFallbackFortune(zodiacSign, dateString) {
    const zodiacInfo = zodiacData[zodiacSign];
    const stars = ['★★★★★', '★★★★☆', '★★★☆☆'];
    const loveStars = stars[Math.floor(Math.random() * stars.length)];
    const moneyStars = stars[Math.floor(Math.random() * stars.length)];
    const luckyNumber = Math.floor(Math.random() * 9) + 1;
    const colors = zodiacInfo.lucky.split(', ');
    const luckyColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `안녕하세요! 🌅

📅 ${dateString}

🐾 ${zodiacSign}띠 전체운
오늘은 새로운 시작에 좋은 날입니다. 주변 사람들과의 소통이 행운을 가져다줍니다.

💖 연애운: ${loveStars}
솔직한 대화로 관계를 발전시키세요.

💰 재물운: ${moneyStars}
작은 기회를 놓치지 마세요.

🍀 행운 색깔: ${luckyColor}
🍀 행운 숫자: ${luckyNumber}

⏰ 주의 시간: 오후 3~5시

━━━━━━━━━━━━━━━
더 자세한 사주가 궁금하다면?
👉 AI 맞춤 상담 (무료 3회)
www.aisaju1000.com
━━━━━━━━━━━━━━━`;
}

// 12띠 전체 생성
async function generateAllZodiacFortunes() {
    const zodiacs = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
    const fortunes = {};
    
    console.log('🔮 12띠 운세 생성 시작...');
    console.log('⏱️ 예상 소요 시간: 약 12초');
    
    for (let i = 0; i < zodiacs.length; i++) {
        const zodiac = zodiacs[i];
        console.log(`📝 [${i+1}/12] ${zodiac}띠 생성 중...`);
        
        fortunes[zodiac] = await generateDailyFortune(zodiac);
        
        // API 제한 고려 (초당 1회)
        if (i < zodiacs.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    console.log('✅ 모든 운세 생성 완료!');
    return fortunes;
}

// Firebase에 저장
async function saveFortunesToFirebase(fortunes) {
    try {
        const db = firebase.firestore();
        const today = new Date().toISOString().split('T')[0];
        
        await db.collection('daily_fortunes').doc(today).set({
            date: today,
            fortunes: fortunes,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Firebase 저장 완료');
    } catch (error) {
        console.error('❌ Firebase 저장 실패:', error);
    }
}

// 로컬 스토리지에 저장
function saveFortunesToLocalStorage(fortunes) {
    const today = new Date().toISOString().split('T')[0];
    
    const data = {
        date: today,
        fortunes: fortunes,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('dailyFortunes', JSON.stringify(data));
    console.log('💾 로컬 스토리지 저장 완료');
}

// 운세 가져오기
function getTodayFortune(zodiacSign) {
    try {
        const data = JSON.parse(localStorage.getItem('dailyFortunes'));
        const today = new Date().toISOString().split('T')[0];
        
        if (data && data.date === today && data.fortunes[zodiacSign]) {
            console.log(`✅ ${zodiacSign}띠 운세 로드 완료 (로컬)`);
            return data.fortunes[zodiacSign];
        }
        
        console.log(`⚠️ ${zodiacSign}띠 오늘 운세 없음`);
        return null;
    } catch (error) {
        console.error('❌ 운세 로드 실패:', error);
        return null;
    }
}

// 전체 프로세스 실행
async function generateAndSaveFortunes() {
    console.log('🚀 운세 생성 프로세스 시작');
    
    // 12띠 운세 생성
    const fortunes = await generateAllZodiacFortunes();
    
    // 로컬 스토리지에 저장
    saveFortunesToLocalStorage(fortunes);
    
    // Firebase에 저장 (선택사항)
    if (typeof firebase !== 'undefined') {
        await saveFortunesToFirebase(fortunes);
    }
    
    console.log('🎉 모든 프로세스 완료!');
    return fortunes;
}

// 구독자에게 운세 발송 (시뮬레이션)
function sendFortuneToSubscribers() {
    try {
        const subscribers = JSON.parse(localStorage.getItem('kakaoSubscribers') || '[]');
        const fortunes = JSON.parse(localStorage.getItem('dailyFortunes'));
        
        if (!fortunes) {
            console.error('❌ 운세 데이터 없음');
            return;
        }
        
        console.log(`📤 ${subscribers.length}명에게 운세 발송 시작`);
        
        subscribers.forEach((subscriber, index) => {
            const fortune = fortunes.fortunes[subscriber.zodiac];
            
            if (fortune) {
                console.log(`[${index + 1}/${subscribers.length}] ${subscriber.userName} (${subscriber.zodiac}띠) - 발송 완료 ✅`);
                
                // 실제 카카오톡 알림톡 API 연동 시 여기에 코드 추가
                // sendKakaoMessage(subscriber.userPhone, fortune);
            } else {
                console.error(`❌ ${subscriber.userName} - ${subscriber.zodiac}띠 운세 없음`);
            }
        });
        
        console.log('✅ 운세 발송 완료');
        
    } catch (error) {
        console.error('❌ 운세 발송 실패:', error);
    }
}

// 구독자 통계
function getSubscriberStats() {
    try {
        const subscribers = JSON.parse(localStorage.getItem('kakaoSubscribers') || '[]');
        
        const stats = {
            total: subscribers.length,
            byZodiac: {}
        };
        
        subscribers.forEach(sub => {
            stats.byZodiac[sub.zodiac] = (stats.byZodiac[sub.zodiac] || 0) + 1;
        });
        
        console.log('📊 구독자 통계:');
        console.log(`총 구독자: ${stats.total}명`);
        console.log('띠별 분포:');
        
        Object.entries(stats.byZodiac).forEach(([zodiac, count]) => {
            console.log(`  ${zodiac}띠: ${count}명`);
        });
        
        return stats;
        
    } catch (error) {
        console.error('❌ 통계 조회 실패:', error);
        return null;
    }
}

// 사용 예시
console.log('✅ 운세 생성 시스템 로드 완료');
console.log('');
console.log('📖 사용 가능한 함수:');
console.log('  generateAllZodiacFortunes() - 12띠 운세 생성');
console.log('  generateAndSaveFortunes() - 생성 + 저장');
console.log('  getTodayFortune("쥐") - 특정 띠 운세 조회');
console.log('  sendFortuneToSubscribers() - 구독자 발송');
console.log('  getSubscriberStats() - 구독자 통계');
console.log('');

// 자동 실행 (페이지 로드 시 오늘 운세 확인)
document.addEventListener('DOMContentLoaded', async function() {
    const today = new Date().toISOString().split('T')[0];
    const savedData = localStorage.getItem('dailyFortunes');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.date === today) {
            console.log('✅ 오늘 운세 이미 생성됨');
        } else {
            console.log('⚠️ 오늘 운세 없음 - 생성 필요');
            console.log('💡 generateAndSaveFortunes() 실행하세요');
        }
    } else {
        console.log('⚠️ 운세 데이터 없음 - 최초 생성 필요');
        console.log('💡 generateAndSaveFortunes() 실행하세요');
    }
});
