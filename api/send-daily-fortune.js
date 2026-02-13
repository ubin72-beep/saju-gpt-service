/**
 * 매일 아침 7시 카카오톡 운세 발송 - Vercel Serverless Function
 * 
 * 실행 흐름:
 * 1. GitHub Actions에서 매일 오전 7시 이 함수 호출
 * 2. Table API에서 활성 구독자 목록 조회
 * 3. 각 구독자의 일주(日柱)에 맞는 오늘의 운세 생성
 * 4. 카카오 비즈니스 API로 메시지 발송
 */

// 60갑자 일주 데이터 (간략 버전 - 실제로는 더 상세한 운세 생성)
const ILJU_DATA = {
  '갑자': { emoji: '🌊', title: '창의적 예술가' },
  '을축': { emoji: '🌱', title: '섬세한 실무자' },
  '병인': { emoji: '🔥', title: '열정적 리더' },
  '정묘': { emoji: '🌸', title: '우아한 완벽주의자' },
  '무진': { emoji: '🏔️', title: '든든한 기둥' },
  '기사': { emoji: '🌾', title: '풍요로운 조력자' },
  '경오': { emoji: '⚔️', title: '강한 개척자' },
  '신미': { emoji: '💎', title: '빛나는 예술혼' },
  '임신': { emoji: '🌊', title: '지혜로운 전략가' },
  '계유': { emoji: '💧', title: '섬세한 감성파' },
  '갑술': { emoji: '🗻', title: '신뢰받는 리더' },
  '을해': { emoji: '🌿', title: '순수한 이상가' },
  '병자': { emoji: '🔥', title: '열정적인 도전자' },
  '정축': { emoji: '🕯️', title: '따뜻한 조력자' },
  '무인': { emoji: '🏔️', title: '굳건한 수호자' },
  '기묘': { emoji: '🌾', title: '부드러운 협상가' },
  '경진': { emoji: '⚔️', title: '강력한 변혁가' },
  '신사': { emoji: '💎', title: '매력적인 설득가' },
  '임오': { emoji: '🌊', title: '지혜로운 리더' },
  '계미': { emoji: '💧', title: '감성적인 예술가' },
  '갑신': { emoji: '🌳', title: '혁신적인 개척자' },
  '을유': { emoji: '🌱', title: '섬세한 장인' },
  '병술': { emoji: '🔥', title: '열정적인 수호자' },
  '정해': { emoji: '🕯️', title: '따뜻한 지혜자' },
  '무자': { emoji: '🏔️', title: '든든한 기반' },
  '기축': { emoji: '🌾', title: '풍요로운 실무자' },
  '경인': { emoji: '⚔️', title: '강력한 리더' },
  '신묘': { emoji: '💎', title: '빛나는 협상가' },
  '임진': { emoji: '🌊', title: '지혜로운 전략가' },
  '계사': { emoji: '💧', title: '섬세한 지도자' },
  '갑오': { emoji: '🐴', title: '역동적인 행동가' },
  '을미': { emoji: '🌱', title: '부드러운 조력자' },
  '병신': { emoji: '🔥', title: '열정적인 혁신가' },
  '정유': { emoji: '🕯️', title: '따뜻한 예술가' },
  '무술': { emoji: '🏔️', title: '굳건한 보호자' },
  '기해': { emoji: '🌾', title: '풍요로운 지혜자' },
  '경자': { emoji: '⚔️', title: '강력한 전략가' },
  '신축': { emoji: '💎', title: '빛나는 실무자' },
  '임인': { emoji: '🌊', title: '지혜로운 개척자' },
  '계묘': { emoji: '💧', title: '섬세한 완벽주의자' },
  '갑진': { emoji: '🐉', title: '패기있는 개척자' },
  '을사': { emoji: '🌱', title: '섬세한 전략가' },
  '병오': { emoji: '🔥', title: '열정적인 리더' },
  '정미': { emoji: '🕯️', title: '따뜻한 조력자' },
  '무신': { emoji: '🏔️', title: '든든한 혁신가' },
  '기유': { emoji: '🌾', title: '풍요로운 예술가' },
  '경술': { emoji: '⚔️', title: '강력한 수호자' },
  '신해': { emoji: '💎', title: '빛나는 지혜자' },
  '임자': { emoji: '🌊', title: '지혜로운 창의가' },
  '계축': { emoji: '💧', title: '섬세한 실무자' },
  '갑인': { emoji: '🐅', title: '용맹한 개척자' },
  '을묘': { emoji: '🌱', title: '부드러운 완벽주의자' },
  '병진': { emoji: '🔥', title: '열정적인 도전자' },
  '정사': { emoji: '🕯️', title: '따뜻한 전략가' },
  '무오': { emoji: '🏔️', title: '굳건한 행동가' },
  '기미': { emoji: '🌾', title: '풍요로운 조력자' },
  '경신': { emoji: '⚔️', title: '강력한 혁신가' },
  '신유': { emoji: '💎', title: '빛나는 장인' },
  '임술': { emoji: '🌊', title: '지혜로운 보호자' },
  '계해': { emoji: '💧', title: '섬세한 이상가' }
};

// 오늘의 운세 생성 함수
function generateDailyFortune(ilju, date) {
  const iljuInfo = ILJU_DATA[ilju] || { emoji: '⭐', title: '특별한 운세' };
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  
  // 운세 메시지 템플릿 (랜덤으로 다양하게)
  const fortunes = [
    `오늘은 새로운 시작의 에너지가 강합니다. ${iljuInfo.title}인 당신에게 좋은 기회가 찾아올 것입니다. 🍀`,
    `주변 사람들과의 관계에서 좋은 소식이 있을 것입니다. 긍정적인 마음을 유지하세요. ✨`,
    `오늘은 조금 쉬어가는 것도 좋습니다. 무리하지 마시고 자신을 돌보는 시간을 가지세요. 🌿`,
    `재물운이 상승하는 날입니다. 작은 투자나 새로운 시도를 해보는 것도 좋습니다. 💰`,
    `건강에 주의가 필요한 날입니다. 충분한 휴식과 수분 섭취를 챙기세요. 🏥`,
    `창의력이 폭발하는 날입니다. 새로운 아이디어를 메모해두세요. 💡`,
    `사랑운이 좋은 날입니다. 좋아하는 사람에게 마음을 전해보세요. 💕`,
    `오늘은 학습운이 좋습니다. 새로운 것을 배우기에 최적의 날입니다. 📚`
  ];
  
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  
  return {
    emoji: iljuInfo.emoji,
    title: iljuInfo.title,
    fortune: randomFortune,
    luckyNumber: Math.floor(Math.random() * 100) + 1,
    luckyColor: ['빨강', '파랑', '노랑', '초록', '보라', '주황'][Math.floor(Math.random() * 6)]
  };
}

// 카카오 메시지 전송 함수
async function sendKakaoMessage(phone, name, ilju, fortune) {
  const KAKAO_API_KEY = process.env.KAKAO_API_KEY;
  const KAKAO_SENDER_KEY = process.env.KAKAO_SENDER_KEY;
  const KAKAO_TEMPLATE_CODE = process.env.KAKAO_TEMPLATE_CODE || 'daily_fortune';
  
  if (!KAKAO_API_KEY || !KAKAO_SENDER_KEY) {
    console.error('카카오 API 환경 변수가 설정되지 않았습니다.');
    return { success: false, error: 'API_KEY_MISSING' };
  }
  
  // 카카오 비즈니스 메시지 API 호출
  const messageData = {
    sender_key: KAKAO_SENDER_KEY,
    template_code: KAKAO_TEMPLATE_CODE,
    receiver: phone,
    template_parameter: {
      name: name,
      ilju: ilju,
      emoji: fortune.emoji,
      title: fortune.title,
      fortune: fortune.fortune,
      lucky_number: fortune.luckyNumber,
      lucky_color: fortune.luckyColor,
      date: new Date().toLocaleDateString('ko-KR')
    }
  };
  
  try {
    // 실제 카카오 API 호출
    const response = await fetch('https://api.kakao.com/v1/api/send', {
      method: 'POST',
      headers: {
        'Authorization': `KakaoAK ${KAKAO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}(${phone})님에게 운세 발송 성공`);
      return { success: true, result };
    } else {
      console.error(`❌ ${name}(${phone})님 발송 실패:`, result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error(`❌ ${name}(${phone})님 발송 중 오류:`, error);
    return { success: false, error: error.message };
  }
}

// 메인 핸들러 함수
export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  // 인증 토큰 확인 (보안)
  const authToken = req.headers['x-auth-token'] || req.body.auth_token;
  const CRON_SECRET = process.env.CRON_SECRET || 'default-secret-change-me';
  
  if (authToken !== CRON_SECRET) {
    console.error('❌ 인증 실패: 잘못된 토큰');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  console.log('🚀 매일 아침 운세 발송 시작:', new Date().toLocaleString('ko-KR'));
  
  try {
    // 1. 활성 구독자 목록 조회
    const BASE_URL = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const subscribersResponse = await fetch(`${BASE_URL}/tables/kakao_subscribers?limit=1000`);
    
    if (!subscribersResponse.ok) {
      throw new Error('구독자 목록 조회 실패');
    }
    
    const subscribersData = await subscribersResponse.json();
    const subscribers = subscribersData.data || [];
    
    // 활성 구독자만 필터링 (무료 체험 기간 포함)
    const today = Date.now();
    const activeSubscribers = subscribers.filter(sub => {
      return sub.status === 'active' && 
             (!sub.free_until || new Date(sub.free_until).getTime() >= today);
    });
    
    console.log(`📊 전체 구독자: ${subscribers.length}명, 활성 구독자: ${activeSubscribers.length}명`);
    
    if (activeSubscribers.length === 0) {
      return res.status(200).json({
        success: true,
        message: '발송할 활성 구독자가 없습니다.',
        total: 0,
        sent: 0,
        failed: 0
      });
    }
    
    // 2. 각 구독자에게 운세 발송
    const results = {
      total: activeSubscribers.length,
      sent: 0,
      failed: 0,
      details: []
    };
    
    const currentDate = new Date();
    
    for (const subscriber of activeSubscribers) {
      const { name, phone, birth_year } = subscriber;
      
      // 일주 계산 (간단한 방식 - 실제로는 더 정확한 계산 필요)
      const ilju = subscriber.ilju || '갑자'; // 저장된 일주 사용 또는 기본값
      
      // 오늘의 운세 생성
      const fortune = generateDailyFortune(ilju, currentDate);
      
      // 카카오 메시지 발송
      const sendResult = await sendKakaoMessage(phone, name, ilju, fortune);
      
      if (sendResult.success) {
        results.sent++;
        results.details.push({
          name,
          phone,
          status: 'success'
        });
      } else {
        results.failed++;
        results.details.push({
          name,
          phone,
          status: 'failed',
          error: sendResult.error
        });
      }
      
      // API 호출 제한 방지 (100ms 대기)
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ 발송 완료: 성공 ${results.sent}명, 실패 ${results.failed}명`);
    
    // 3. 발송 결과 반환
    return res.status(200).json({
      success: true,
      message: `${results.sent}명에게 운세를 성공적으로 발송했습니다.`,
      ...results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 운세 발송 중 오류:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
