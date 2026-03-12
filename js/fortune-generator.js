/**
 * Fortune Generator - AI-powered daily fortune generation
 * 일일 운세 생성 엔진
 */

/**
 * Generate daily fortune for a specific date
 * @param {number} year 
 * @param {number} month (0-based)
 * @param {number} day 
 * @returns {Object} fortune object
 */
function generateDailyFortune(year, month, day) {
    // Create seed from date for consistent results
    const seed = year * 10000 + (month + 1) * 100 + day;
    
    // Use seed to generate pseudo-random values
    const random = seededRandom(seed);
    
    // Calculate overall fortune score (1-5)
    const overallScore = Math.floor(random() * 5) + 1;
    
    // Generate fortune data
    const fortune = {
        year,
        month,
        day,
        seed,
        score: overallScore,
        scoreStars: getStarRating(overallScore),
        overview: generateOverview(seed, overallScore, year, month, day),
        money: generateMoneyFortune(seed, overallScore),
        love: generateLoveFortune(seed, overallScore),
        health: generateHealthFortune(seed, overallScore),
        luckyNumber: generateLuckyNumber(seed),
        luckyColor: generateLuckyColor(seed).name,
        luckyColorCode: generateLuckyColor(seed).code,
        luckyDirection: generateLuckyDirection(seed)
    };
    
    return fortune;
}

/**
 * Seeded random number generator
 */
function seededRandom(seed) {
    let value = seed;
    return function() {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    };
}

/**
 * Convert score to star rating
 */
function getStarRating(score) {
    const fullStars = '★'.repeat(score);
    const emptyStars = '☆'.repeat(5 - score);
    return fullStars + emptyStars;
}

/**
 * Generate overall fortune overview
 */
function generateOverview(seed, score, year, month, day) {
    const random = seededRandom(seed);
    
    // 요일 계산
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    
    // 오행 (Five Elements)
    const elements = ['목(木)', '화(火)', '토(土)', '금(金)', '수(水)'];
    const element = elements[Math.floor(random() * elements.length)];
    
    // 천간지지 (Heavenly Stems and Earthly Branches)
    const stems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const branches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
    
    const stemIndex = (year * 365 + month * 30 + day) % 10;
    const branchIndex = (year * 365 + month * 30 + day) % 12;
    
    const overviews = {
        5: [
            `오늘은 ${dayNames[dayOfWeek]}입니다. ${element} 기운이 강하게 작용하는 매우 길한 날입니다. 모든 일이 순조롭게 풀리며, 특히 새로운 시작에 좋은 기운이 함께합니다. 적극적인 태도로 임하면 예상보다 더 큰 성과를 얻을 수 있습니다.`,
            `${stems[stemIndex]}${branches[branchIndex]}일의 운세가 최상입니다. 하늘의 기운이 당신을 돕고 있으며, 오늘 하루 동안 긍정적인 에너지가 넘칩니다. 주저하지 말고 원하는 것을 추구하세요. 행운이 함께합니다.`,
            `매우 좋은 운세의 날입니다. ${element} 기운이 당신의 길을 밝혀주고 있습니다. 오늘 만나는 사람들과의 인연이 특별할 것이며, 중요한 결정을 내리기에 최적의 시기입니다.`
        ],
        4: [
            `${dayNames[dayOfWeek]}의 운세는 좋습니다. ${element} 기운이 조화롭게 작용하여 대부분의 일이 순탄하게 진행됩니다. 긍정적인 마음가짐을 유지하면 더 좋은 결과를 얻을 수 있습니다.`,
            `오늘은 ${stems[stemIndex]}${branches[branchIndex]}일로 길한 기운이 흐릅니다. 노력한 만큼의 결실을 거둘 수 있는 날입니다. 주변 사람들과의 소통이 원활하니 협력이 필요한 일을 추진하기 좋습니다.`,
            `운세가 좋은 편입니다. ${element}의 기운이 당신을 보호하고 있으며, 하루 동안 작은 행운들이 찾아올 것입니다. 감사하는 마음으로 하루를 시작하세요.`
        ],
        3: [
            `${dayNames[dayOfWeek]}은 평온한 운세입니다. ${element} 기운이 안정적으로 작용하여 큰 변화는 없지만, 꾸준히 노력하면 좋은 결과를 얻을 수 있습니다. 신중한 판단이 필요한 날입니다.`,
            `${stems[stemIndex]}${branches[branchIndex]}일의 운세는 보통입니다. 무리하지 않고 현재 상태를 유지하는 것이 좋습니다. 새로운 도전보다는 기존의 일을 정리하는 데 집중하세요.`,
            `평범하지만 안정적인 하루가 될 것입니다. ${element} 기운이 균형을 이루고 있어 급격한 변화는 없습니다. 침착하게 일상을 보내는 것이 좋습니다.`
        ],
        2: [
            `${dayNames[dayOfWeek]}은 조심스러운 운세입니다. ${element} 기운이 약하게 작용하여 예상치 못한 일이 생길 수 있습니다. 중요한 결정은 미루고, 신중하게 행동하세요.`,
            `오늘은 ${stems[stemIndex]}${branches[branchIndex]}일로 다소 어려운 기운이 흐릅니다. 큰 기대보다는 현실적인 목표를 세우고, 무리한 계획은 피하는 것이 좋습니다.`,
            `운세가 다소 저조한 날입니다. ${element} 기운이 불안정하니 중요한 약속이나 큰 결정은 피하는 것이 현명합니다. 하루를 차분하게 보내세요.`
        ],
        1: [
            `${dayNames[dayOfWeek]}은 주의가 필요한 날입니다. ${element} 기운이 매우 약하여 어려움이 있을 수 있습니다. 새로운 일은 시작하지 말고, 기존의 일도 신중하게 처리하세요.`,
            `${stems[stemIndex]}${branches[branchIndex]}일의 운세가 좋지 않습니다. 오늘은 무리하지 말고 휴식을 취하는 것이 좋습니다. 중요한 일은 다른 날로 미루세요.`,
            `운세가 저조한 하루입니다. ${element} 기운이 흐려져 있어 좋지 않은 일이 생길 수 있습니다. 조심스럽게 행동하고, 긍정적인 마음을 유지하세요.`
        ]
    };
    
    const options = overviews[score] || overviews[3];
    const index = Math.floor(random() * options.length);
    return options[index];
}

/**
 * Generate money fortune
 */
function generateMoneyFortune(seed, score) {
    const random = seededRandom(seed + 1000);
    
    const fortunes = {
        5: [
            `재물운이 매우 좋습니다. 예상치 못한 수입이 생기거나 투자에 좋은 기회가 찾아올 수 있습니다. 금전적인 결정을 내리기에 좋은 날입니다.`,
            `경제적으로 큰 이득을 볼 수 있는 날입니다. 사업이나 투자 제안이 들어온다면 긍정적으로 검토해보세요. 재물이 들어오는 길이 열려 있습니다.`,
            `재정 상태가 크게 개선될 조짐이 보입니다. 오랜 기간 기다렸던 금전적 보상을 받을 수 있으며, 새로운 수입원이 생길 수 있습니다.`
        ],
        4: [
            `재물운이 좋은 편입니다. 작은 이득이 생기거나 절약한 만큼의 효과를 볼 수 있습니다. 계획적인 지출이 도움이 됩니다.`,
            `금전적으로 안정적인 하루가 될 것입니다. 큰 수입은 없지만 예상한 만큼의 결과를 얻을 수 있습니다. 저축을 시작하기 좋은 날입니다.`,
            `경제 활동이 순조롭게 진행됩니다. 급하게 결정하지 말고 차근차근 계획을 세우면 좋은 결과를 얻을 수 있습니다.`
        ],
        3: [
            `재물운은 평범한 수준입니다. 큰 변화는 없지만 안정적입니다. 무리한 투자나 지출은 피하고, 현 상태를 유지하세요.`,
            `금전적으로 특별한 일은 없을 것입니다. 수입과 지출이 균형을 이루는 날입니다. 계획적인 소비를 유지하세요.`,
            `재정 상태가 안정적입니다. 큰 수입은 기대하기 어렵지만 불필요한 지출을 줄이면 더 나은 결과를 얻을 수 있습니다.`
        ],
        2: [
            `재물운이 다소 저조합니다. 예상치 못한 지출이 생길 수 있으니 돈 관리에 신경 쓰세요. 큰 구매나 투자는 피하는 것이 좋습니다.`,
            `금전적으로 조심해야 하는 날입니다. 불필요한 지출을 줄이고, 중요한 금전 거래는 다른 날로 미루세요.`,
            `재정 상황이 다소 불안정할 수 있습니다. 충동적인 소비를 자제하고, 예산을 철저히 관리하세요.`
        ],
        1: [
            `재물운이 좋지 않습니다. 금전 관련 결정은 최대한 미루고, 불필요한 지출을 철저히 통제하세요. 신중함이 필요합니다.`,
            `경제적으로 어려움이 있을 수 있습니다. 오늘은 돈을 쓰기보다 아끼는 데 집중하세요. 투자나 대출은 피하는 것이 현명합니다.`,
            `재정 관리에 각별한 주의가 필요합니다. 사기나 손실에 유의하고, 금전 거래는 철저히 확인하세요.`
        ]
    };
    
    const options = fortunes[score] || fortunes[3];
    const index = Math.floor(random() * options.length);
    return options[index];
}

/**
 * Generate love fortune
 */
function generateLoveFortune(seed, score) {
    const random = seededRandom(seed + 2000);
    
    const fortunes = {
        5: [
            `애정운이 최고조입니다. 연인이 있다면 관계가 한층 깊어지고, 싱글이라면 운명적인 만남이 있을 수 있습니다. 적극적으로 마음을 표현하세요.`,
            `사랑의 기운이 강하게 작용합니다. 고백이나 프러포즈를 계획 중이라면 오늘이 최적의 날입니다. 상대방의 마음도 당신을 향해 있습니다.`,
            `인연의 끈이 강하게 이어지는 날입니다. 소중한 사람과의 시간을 가지면 두 사람의 관계가 더욱 돈독해질 것입니다.`
        ],
        4: [
            `애정운이 좋습니다. 연인과의 관계가 안정적이고 행복한 시간을 보낼 수 있습니다. 솔직한 대화가 관계를 더욱 발전시킵니다.`,
            `사랑하는 사람과 좋은 추억을 만들 수 있는 날입니다. 작은 선물이나 따뜻한 말 한마디가 큰 감동을 줄 것입니다.`,
            `애정 관계가 순조롭습니다. 싱글이라면 새로운 인연을 만날 기회가 있으니 적극적으로 나서보세요.`
        ],
        3: [
            `애정운은 평범한 수준입니다. 큰 변화는 없지만 안정적입니다. 일상적인 대화와 관심이 관계를 유지하는 데 도움이 됩니다.`,
            `연인과의 관계가 무난합니다. 특별한 이벤트는 없지만 서로를 배려하는 마음이 중요한 날입니다.`,
            `사랑에 있어서 차분한 하루가 될 것입니다. 급하게 발전시키려 하기보다는 현재를 즐기세요.`
        ],
        2: [
            `애정운이 다소 저조합니다. 연인과의 작은 오해가 생길 수 있으니 대화할 때 신중하세요. 감정적으로 대응하지 마세요.`,
            `사랑에 있어서 조심스러운 날입니다. 무리한 요구나 기대는 관계에 부담을 줄 수 있으니 여유를 가지세요.`,
            `애정 관계에서 긴장이 있을 수 있습니다. 상대방의 입장을 이해하려 노력하고, 차분하게 대화하세요.`
        ],
        1: [
            `애정운이 좋지 않습니다. 갈등이 생길 가능성이 높으니 중요한 대화는 다른 날로 미루세요. 냉정함을 유지하세요.`,
            `사랑에 있어서 어려움이 있는 날입니다. 감정적으로 행동하면 관계가 악화될 수 있으니 자제력이 필요합니다.`,
            `애정 관계에서 시련이 있을 수 있습니다. 오늘은 거리를 두고 각자의 시간을 갖는 것이 현명합니다.`
        ]
    };
    
    const options = fortunes[score] || fortunes[3];
    const index = Math.floor(random() * options.length);
    return options[index];
}

/**
 * Generate health fortune
 */
function generateHealthFortune(seed, score) {
    const random = seededRandom(seed + 3000);
    
    const fortunes = {
        5: [
            `건강운이 매우 좋습니다. 몸과 마음이 모두 활력이 넘치며, 운동을 시작하기에 최적의 날입니다. 긍정적인 에너지가 충만합니다.`,
            `최상의 컨디션을 유지할 수 있는 날입니다. 건강에 좋은 습관을 시작하면 오래도록 유지할 수 있습니다.`,
            `신체적, 정신적으로 균형이 잘 잡혀 있습니다. 새로운 운동이나 다이어트를 시작하기에 좋은 날입니다.`
        ],
        4: [
            `건강운이 좋습니다. 전반적으로 컨디션이 양호하며, 가벼운 운동이나 산책이 더욱 활력을 줄 것입니다.`,
            `건강 상태가 안정적입니다. 규칙적인 생활 습관을 유지하면 더욱 좋은 컨디션을 유지할 수 있습니다.`,
            `몸과 마음이 편안한 상태입니다. 충분한 휴식과 영양 섭취로 건강을 유지하세요.`
        ],
        3: [
            `건강운은 평범한 수준입니다. 큰 문제는 없지만 과로는 피하세요. 적절한 휴식이 필요합니다.`,
            `건강 상태가 무난합니다. 무리하지 않는 선에서 일상적인 활동을 유지하세요.`,
            `컨디션이 평범합니다. 건강을 해치는 습관은 자제하고, 규칙적인 생활을 유지하세요.`
        ],
        2: [
            `건강운이 다소 저조합니다. 피로가 누적될 수 있으니 충분한 수면과 휴식을 취하세요. 무리한 운동은 피하세요.`,
            `몸이 쉽게 지칠 수 있는 날입니다. 과도한 업무나 스트레스를 피하고, 건강 관리에 신경 쓰세요.`,
            `건강 상태가 다소 불안정할 수 있습니다. 면역력이 약해질 수 있으니 몸을 따뜻하게 하고 영양을 보충하세요.`
        ],
        1: [
            `건강운이 좋지 않습니다. 몸 상태에 각별히 주의하세요. 증상이 있다면 병원을 방문하는 것이 좋습니다.`,
            `컨디션이 매우 저조할 수 있습니다. 오늘은 무리하지 말고 충분히 쉬세요. 건강이 최우선입니다.`,
            `건강에 빨간불이 켜진 날입니다. 무리한 활동은 자제하고, 몸의 신호에 귀를 기울이세요.`
        ]
    };
    
    const options = fortunes[score] || fortunes[3];
    const index = Math.floor(random() * options.length);
    return options[index];
}

/**
 * Generate lucky number
 */
function generateLuckyNumber(seed) {
    const random = seededRandom(seed + 4000);
    return Math.floor(random() * 99) + 1;
}

/**
 * Generate lucky color
 */
function generateLuckyColor(seed) {
    const random = seededRandom(seed + 5000);
    
    const colors = [
        { name: '빨강', code: '#FF0000' },
        { name: '주황', code: '#FF7F00' },
        { name: '노랑', code: '#FFFF00' },
        { name: '초록', code: '#00FF00' },
        { name: '파랑', code: '#0000FF' },
        { name: '남색', code: '#4B0082' },
        { name: '보라', code: '#9400D3' },
        { name: '분홍', code: '#FF69B4' },
        { name: '금색', code: '#FFD700' },
        { name: '은색', code: '#C0C0C0' },
        { name: '흰색', code: '#FFFFFF' },
        { name: '검정', code: '#000000' }
    ];
    
    const index = Math.floor(random() * colors.length);
    return colors[index];
}

/**
 * Generate lucky direction
 */
function generateLuckyDirection(seed) {
    const random = seededRandom(seed + 6000);
    
    const directions = ['동쪽', '서쪽', '남쪽', '북쪽', '북동쪽', '북서쪽', '남동쪽', '남서쪽'];
    const index = Math.floor(random() * directions.length);
    return directions[index];
}

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateDailyFortune,
        getDailyFortuneEmoji: function(year, month, day) {
            const seed = year * 10000 + (month + 1) * 100 + day;
            const emojis = ['🌟', '✨', '🎯', '🍀', '💎', '🌈', '⭐', '💫', '🔥', '🌸', '🎁', '🏆'];
            return emojis[seed % emojis.length];
        }
    };
}
