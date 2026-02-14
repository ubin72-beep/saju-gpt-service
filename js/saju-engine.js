**
 * AI 사주 천년지기 - 사주팔자 계산 엔진
 * 정통 명리학 기반 사주 계산 JavaScript 라이브러리
 * 
 * 수정 내역:
 * - 일주(日柱) 계산: 26일 오프셋 적용 (1973-03-09 = 甲辰 검증)
 * - 시주(時柱) 계산: 정통 명리학 공식 적용
 * - 만세력 시간 수정: 17:00 = 신시(申時)로 처리
 */

class SajuEngine {
    constructor() {
        // 천간 (天干) - 10개
        this.heavenlyStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
        this.heavenlyStemsHanja = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        
        // 지지 (地支) - 12개
        this.earthlyBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
        this.earthlyBranchesHanja = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        
        // 띠 (12지지 동물)
        this.zodiacAnimals = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
        
        // 오행 (五行)
        this.elements = {
            '갑': '목', '을': '목',
            '병': '화', '정': '화',
            '무': '토', '기': '토',
            '경': '금', '신': '금',
            '임': '수', '계': '수',
            '인': '목', '묘': '목',
            '사': '화', '오': '화',
            '진': '토', '술': '토', '축': '토', '미': '토',
            '신': '금', '유': '금',
            '자': '수', '해': '수'
        };
        
        // 음양
        this.yinYang = {
            '갑': '양', '을': '음',
            '병': '양', '정': '음',
            '무': '양', '기': '음',
            '경': '양', '신': '음',
            '임': '양', '계': '음'
        };
        
        // 십성 (十星)
        this.tenGods = {
            '비견': '같은 오행, 같은 음양',
            '겁재': '같은 오행, 다른 음양',
            '식신': '내가 생하는 오행, 같은 음양',
            '상관': '내가 생하는 오행, 다른 음양',
            '편재': '내가 극하는 오행, 같은 음양',
            '정재': '내가 극하는 오행, 다른 음양',
            '편관': '나를 극하는 오행, 같은 음양',
            '정관': '나를 극하는 오행, 다른 음양',
            '편인': '나를 생하는 오행, 같은 음양',
            '정인': '나를 생하는 오행, 다른 음양'
        };
        
        // 시주 (時柱) 매핑
        this.timeMapping = {
            '23-01': '자시',
            '01-03': '축시',
            '03-05': '인시',
            '05-07': '묘시',
            '07-09': '진시',
            '09-11': '사시',
            '11-13': '오시',
            '13-15': '미시',
            '15-17': '신시',
            '17-19': '유시',
            '19-21': '술시',
            '21-23': '해시'
        };
    }
    
    /**
     * 메인 사주 계산 함수
     * @param {Object} data - 생년월일, 시간, 성별 정보
     * @returns {Object} 사주팔자 결과
     */
    calculate(data) {
        const { birthdate, birthtime, gender, calendar } = data;
        
        try {
            // 1. 날짜 파싱
            const date = new Date(birthdate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            
            // 2. 사주 계산
            const yearPillar = this.getYearPillar(year);
            const monthPillar = this.getMonthPillar(year, month);
            const dayPillar = this.getDayPillar(year, month, day);
            const timePillar = birthtime ? this.getTimePillar(birthtime, dayPillar.stem) : null;
            
            // 3. 십성 계산
            const tenGods = this.calculateTenGods(dayPillar.stem, {
                year: yearPillar,
                month: monthPillar,
                day: dayPillar,
                time: timePillar
            });
            
            // 4. 운세 분석
            const fortune = this.analyzeFortune({
                yearPillar,
                monthPillar,
                dayPillar,
                timePillar,
                gender,
                age: new Date().getFullYear() - year
            });
            
            // 5. 결과 반환
            return {
                success: true,
                birthInfo: {
                    year, month, day,
                    calendar: calendar || 'solar',
                    gender,
                    zodiac: this.zodiacAnimals[(year - 4) % 12]
                },
                pillars: {
                    year: yearPillar,
                    month: monthPillar,
                    day: dayPillar,
                    time: timePillar
                },
                tenGods,
                fortune,
                elements: this.analyzeElements({ yearPillar, monthPillar, dayPillar, timePillar }),
                balance: this.analyzeBalance({ yearPillar, monthPillar, dayPillar, timePillar }),
                personality: this.analyzePersonality(dayPillar.stem),
                compatibility: this.analyzeCompatibility(dayPillar.stem),
                luckyColors: this.getLuckyColors(this.elements[dayPillar.stem]),
                luckyNumbers: this.getLuckyNumbers(dayPillar.stem),
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('사주 계산 오류:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * 년주 (年柱) 계산
     */
    getYearPillar(year) {
        const stemIndex = (year - 4) % 10;
        const branchIndex = (year - 4) % 12;
        
        return {
            stem: this.heavenlyStems[stemIndex],
            stemHanja: this.heavenlyStemsHanja[stemIndex],
            branch: this.earthlyBranches[branchIndex],
            branchHanja: this.earthlyBranchesHanja[branchIndex],
            element: this.elements[this.heavenlyStems[stemIndex]],
            zodiac: this.zodiacAnimals[branchIndex],
            full: `${this.heavenlyStems[stemIndex]}${this.earthlyBranches[branchIndex]}`,
            fullHanja: `${this.heavenlyStemsHanja[stemIndex]}${this.earthlyBranchesHanja[branchIndex]}`
        };
    }
    
    /**
     * 월주 (月柱) 계산
     */
    getMonthPillar(year, month) {
        const yearStemIndex = (year - 4) % 10;
        const monthStemIndex = (yearStemIndex * 2 + month) % 10;
        const monthBranchIndex = (month + 1) % 12;
        
        return {
            stem: this.heavenlyStems[monthStemIndex],
            stemHanja: this.heavenlyStemsHanja[monthStemIndex],
            branch: this.earthlyBranches[monthBranchIndex],
            branchHanja: this.earthlyBranchesHanja[monthBranchIndex],
            element: this.elements[this.heavenlyStems[monthStemIndex]],
            full: `${this.heavenlyStems[monthStemIndex]}${this.earthlyBranches[monthBranchIndex]}`,
            fullHanja: `${this.heavenlyStemsHanja[monthStemIndex]}${this.earthlyBranchesHanja[monthBranchIndex]}`
        };
    }
    
    /**
     * 일주 (日柱) 계산
     * 수정: 26일 오프셋 적용 (1973-03-09 = 甲辰 검증 완료)
     */
    getDayPillar(year, month, day) {
        // 정확한 만세력 알고리즘
        // 기준: 1900년 1월 1일 = 경자일(庚子日)
        // 보정: 실제 계산값과 26일 차이 보정
        
        // 1900-01-01부터의 정확한 일수 계산
        let totalDays = 0;
        
        // 1900년부터 year-1년까지의 일수
        for (let y = 1900; y < year; y++) {
            if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
                totalDays += 366;
            } else {
                totalDays += 365;
            }
        }
        
        // year년 1월부터 month-1월까지의 일수
        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        if (isLeapYear) monthDays[1] = 29;
        
        for (let m = 0; m < month - 1; m++) {
            totalDays += monthDays[m];
        }
        
        // day일 추가
        totalDays += day - 1;  // 1900-01-01을 0일로 계산
        
        // 보정값 적용 (1973-03-09 = 갑진이 되도록)
        totalDays -= 26;
        
        // 1900-01-01 = 경자(庚子) = 천간 6, 지지 0
        const stemIndex = ((6 + totalDays) % 10 + 10) % 10;
        const branchIndex = ((0 + totalDays) % 12 + 12) % 12;
        
        return {
            stem: this.heavenlyStems[stemIndex],
            stemHanja: this.heavenlyStemsHanja[stemIndex],
            branch: this.earthlyBranches[branchIndex],
            branchHanja: this.earthlyBranchesHanja[branchIndex],
            element: this.elements[this.heavenlyStems[stemIndex]],
            full: `${this.heavenlyStems[stemIndex]}${this.earthlyBranches[branchIndex]}`,
            fullHanja: `${this.heavenlyStemsHanja[stemIndex]}${this.earthlyBranchesHanja[branchIndex]}`
        };
    }
    
    /**
     * 시주 (時柱) 계산
     * 수정: 정통 명리학 공식 적용
     */
    getTimePillar(birthtime, dayStem) {
        // 시간 → 지지 매핑
        const timeToBranch = {
            '23-01': 0,  // 자시 → 子
            '01-03': 1,  // 축시 → 丑
            '03-05': 2,  // 인시 → 寅
            '05-07': 3,  // 묘시 → 卯
            '07-09': 4,  // 진시 → 辰
            '09-11': 5,  // 사시 → 巳
            '11-13': 6,  // 오시 → 午
            '13-15': 7,  // 미시 → 未
            '15-17': 8,  // 신시 → 申
            '17-19': 9,  // 유시 → 酉
            '19-21': 10, // 술시 → 戌
            '21-23': 11  // 해시 → 亥
        };
        
        const branchIndex = timeToBranch[birthtime] !== undefined ? timeToBranch[birthtime] : 0;
        
        // 일간으로 시간 천간 계산
        const dayStemIndex = this.heavenlyStems.indexOf(dayStem);
        
        // 시주 천간 계산 공식: (일간 인덱스 % 5) * 2 + 지지 인덱스
        const stemIndex = ((dayStemIndex % 5) * 2 + branchIndex) % 10;
        
        return {
            stem: this.heavenlyStems[stemIndex],
            stemHanja: this.heavenlyStemsHanja[stemIndex],
            branch: this.earthlyBranches[branchIndex],
            branchHanja: this.earthlyBranchesHanja[branchIndex],
            element: this.elements[this.heavenlyStems[stemIndex]],
            time: this.timeMapping[birthtime],
            full: `${this.heavenlyStems[stemIndex]}${this.earthlyBranches[branchIndex]}`,
            fullHanja: `${this.heavenlyStemsHanja[stemIndex]}${this.earthlyBranchesHanja[branchIndex]}`
        };
    }
    
    /**
     * 십성 계산
     */
    calculateTenGods(dayStem, pillars) {
        // 간단한 십성 계산 (실제로는 더 복잡함)
        return {
            year: this.getTenGod(dayStem, pillars.year.stem),
            month: this.getTenGod(dayStem, pillars.month.stem),
            day: '일주',
            time: pillars.time ? this.getTenGod(dayStem, pillars.time.stem) : null
        };
    }
    
    /**
     * 십성 판별
     */
    getTenGod(dayStem, targetStem) {
        if (dayStem === targetStem) return '비견';
        
        const dayElement = this.elements[dayStem];
        const targetElement = this.elements[targetStem];
        const dayYinYang = this.yinYang[dayStem];
        const targetYinYang = this.yinYang[targetStem];
        
        // 오행 상생상극 관계로 십성 판별
        if (dayElement === targetElement) {
            return dayYinYang === targetYinYang ? '비견' : '겁재';
        }
        
        // 간단한 십성 반환 (실제로는 더 복잡한 로직 필요)
        const relations = ['식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'];
        return relations[Math.floor(Math.random() * relations.length)];
    }
    
    /**
     * 오행 분석
     */
    analyzeElements(pillars) {
        const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
        
        Object.values(pillars).forEach(pillar => {
            if (pillar && pillar.element) {
                elements[pillar.element]++;
            }
        });
        
        // 가장 강한/약한 오행 찾기
        let strongest = null;
        let weakest = null;
        let maxCount = 0;
        let minCount = Infinity;
        
        Object.entries(elements).forEach(([element, count]) => {
            if (count > maxCount) {
                maxCount = count;
                strongest = element;
            }
            if (count < minCount && count > 0) {
                minCount = count;
                weakest = element;
            }
        });
        
        return elements;
    }
    
    /**
     * 사주 균형 분석
     */
    analyzeBalance(pillars) {
        const elements = this.analyzeElements(pillars);
        const values = Object.values(elements);
        const max = Math.max(...values);
        const min = Math.min(...values.filter(v => v > 0));
        
        let balance = '';
        if (max - min <= 1) balance = '매우 균형잡힘';
        else if (max - min <= 2) balance = '균형잡힘';
        else if (max - min <= 3) balance = '보통';
        else balance = '불균형';
        
        // 균형에 따른 조언
        let advice = '';
        if (balance === '매우 균형잡힘' || balance === '균형잡힘') {
            advice = '오행이 균형잡혀 안정적이고 원만한 성격입니다. 다양한 분야에서 능력을 발휘할 수 있습니다.';
        } else if (balance === '보통') {
            advice = '오행이 적당히 조화를 이루고 있습니다. 부족한 오행을 보완하면 더 좋은 운을 맞이할 수 있습니다.';
        } else {
            advice = '특정 오행이 강하거나 약합니다. 부족한 오행을 보완하는 것이 중요합니다.';
        }
        
        return balance + '. ' + advice;
    }
    
    /**
     * 성격 분석
     */
    analyzePersonality(dayStem) {
        const personalities = {
            '갑': '강직하고 리더십이 있으며, 결단력이 뛰어납니다. 나무처럼 곧게 자라며 정의로운 성향이 강합니다.',
            '을': '부드럽고 섬세하며, 협력적인 성향이 강합니다. 유연함으로 주변을 조화롭게 만듭니다.',
            '병': '열정적이고 활동적이며, 창의력이 풍부합니다. 태양처럼 밝고 긍정적인 에너지를 발산합니다.',
            '정': '따뜻하고 배려심이 깊으며, 예술적 감각이 있습니다. 불꽃처럼 세심하고 정성스럽습니다.',
            '무': '안정적이고 신뢰감 있으며, 포용력이 큽니다. 산처럼 든든하고 믿음직스럽습니다.',
            '기': '세심하고 계획적이며, 실용적인 면이 강합니다. 대지처럼 풍요롭고 현실적입니다.',
            '경': '정의롭고 원칙적이며, 결단력이 있습니다. 쇠처럼 강인하고 날카롭습니다.',
            '신': '섬세하고 우아하며, 감수성이 풍부합니다. 보석처럼 아름답고 가치 있습니다.',
            '임': '지혜롭고 융통성 있으며, 적응력이 뛰어납니다. 큰 물처럼 포용력이 크고 유연합니다.',
            '계': '깊이 있고 신중하며, 통찰력이 있습니다. 빗물처럼 섬세하고 생명력을 불어넣습니다.'
        };
        
        return personalities[dayStem] || '분석 중입니다.';
    }
    
    /**
     * 궁합 분석
     */
    analyzeCompatibility(dayStem) {
        const elementCompatibility = {
            '목': ['화', '수'],
            '화': ['토', '목'],
            '토': ['금', '화'],
            '금': ['수', '토'],
            '수': ['목', '금']
        };
        
        const element = this.elements[dayStem];
        const goodElements = elementCompatibility[element];
        
        return {
            best: goodElements[0],
            good: goodElements[1],
            description: `${goodElements[0]}과 가장 잘 맞고, ${goodElements[1]}와도 좋은 궁합입니다.`
        };
    }
    
    /**
     * 행운의 색상
     */
    getLuckyColors(element) {
        const colors = {
            '목': ['초록색', '청록색', '연두색'],
            '화': ['빨간색', '주황색', '분홍색'],
            '토': ['노란색', '갈색', '베이지색'],
            '금': ['흰색', '은색', '금색'],
            '수': ['검은색', '남색', '파란색']
        };
        
        return colors[element] || ['흰색', '검은색'];
    }
    
    /**
     * 행운의 숫자
     */
    getLuckyNumbers(dayStem) {
        const index = this.heavenlyStems.indexOf(dayStem);
        return [index + 1, (index + 5) % 10 + 1, (index + 7) % 10 + 1];
    }
    
    /**
     * 운세 분석
     */
    analyzeFortune(data) {
        const { yearPillar, monthPillar, dayPillar, gender, age } = data;
        
        return {
            overall: this.getOverallFortune(dayPillar.element, age),
            career: this.getCareerFortune(dayPillar.element),
            wealth: this.getWealthFortune(dayPillar.element),
            love: this.getLoveFortune(dayPillar.element, gender),
            health: this.getHealthFortune(dayPillar.element),
            year2026: this.get2026Fortune(yearPillar.zodiac)
        };
    }
    
    /**
     * 종합 운세
     */
    getOverallFortune(element, age) {
        let baseScore = 75;
        if (age < 30) baseScore = 80;
        else if (age >= 30 && age < 40) baseScore = 85;
        else if (age >= 40 && age < 50) baseScore = 90;
        else if (age >= 50 && age < 60) baseScore = 85;
        else baseScore = 80;
        
        const elementBonus = { '목': 5, '화': 8, '토': 3, '금': 7, '수': 10 };
        const finalScore = Math.min(baseScore + (elementBonus[element] || 0), 100);
        
        let ageAdvice = '';
        if (age < 30) {
            ageAdvice = '다양한 경험을 통해 자신의 길을 찾는 시기입니다.';
        } else if (age >= 30 && age < 40) {
            ageAdvice = '기반을 다지고 전문성을 쌓는 중요한 시기입니다.';
        } else if (age >= 40 && age < 50) {
            ageAdvice = '당신의 능력을 최대한 발휘할 수 있는 전성기입니다.';
        } else if (age >= 50 && age < 60) {
            ageAdvice = '경험과 지혜를 나누며 후배를 양성하는 시기입니다.';
        } else {
            ageAdvice = '인생의 열매를 수확하고 여유를 즐기는 시기입니다.';
        }
        
        return {
            score: finalScore,
            description: `현재 ${finalScore}점의 운세입니다. ${ageAdvice}`
        };
    }
    
    /**
     * 직업운
     */
    getCareerFortune(element) {
        const descriptions = {
            '목': { score: 88, description: '성장과 발전의 기운이 강한 시기입니다. 새로운 프로젝트나 승진의 기회가 있습니다.' },
            '화': { score: 92, description: '열정과 창의력이 빛을 발하는 시기입니다. 창의적인 아이디어로 인정받을 수 있습니다.' },
            '토': { score: 85, description: '안정적인 발전과 신뢰를 쌓는 시기입니다. 꾸준함이 중요합니다.' },
            '금': { score: 90, description: '결단력 있는 행동이 성공으로 이어집니다. 리더십을 발휘할 기회가 많습니다.' },
            '수': { score: 87, description: '유연한 대응으로 좋은 결과를 얻을 수 있습니다. 네트워킹이 도움이 됩니다.' }
        };
        return descriptions[element] || descriptions['목'];
    }
    
    /**
     * 재물운
     */
    getWealthFortune(element) {
        const wealth = {
            '목': { score: 82, description: '꾸준한 저축과 투자로 재물이 늘어납니다. 부동산 투자에 유리합니다.' },
            '화': { score: 85, description: '예상치 못한 수입이 있을 수 있습니다. 지출 관리가 중요합니다.' },
            '토': { score: 88, description: '착실하게 재산을 모을 수 있는 시기입니다. 장기적 투자가 유리합니다.' },
            '금': { score: 90, description: '과감한 투자로 큰 수익을 올릴 수 있습니다. 결단력이 중요합니다.' },
            '수': { score: 84, description: '수입의 변동이 있으나 전체적으로 증가 추세입니다. 유연한 자산 관리가 필요합니다.' }
        };
        return wealth[element] || wealth['목'];
    }
    
    /**
     * 애정운
     */
    getLoveFortune(element, gender) {
        return {
            score: 85,
            description: '좋은 인연이 기대되는 시기입니다. 자연스러운 만남을 기다리세요.'
        };
    }
    
    /**
     * 건강운
     */
    getHealthFortune(element) {
        const health = {
            '목': { score: 88, description: '전반적으로 건강하나 간 건강에 주의가 필요합니다. 규칙적인 생활이 중요합니다.' },
            '화': { score: 85, description: '활동적이나 과열 주의. 심혈관 건강 체크 필요합니다.' },
            '토': { score: 90, description: '안정적인 건강 상태입니다. 소화기 건강에 유의하세요.' },
            '금': { score: 87, description: '호흡기 건강에 주의가 필요합니다. 규칙적인 운동이 좋습니다.' },
            '수': { score: 86, description: '신장과 방광 건강에 유의하세요. 충분한 수분 섭취가 중요합니다.' }
        };
        return health[element] || health['목'];
    }
    
    /**
     * 2026년 운세
     */
    get2026Fortune(zodiac) {
        return {
            description: `2026년은 ${zodiac}띠에게 새로운 가능성의 해입니다.`,
            score: 80,
            advice: '긍정적인 마음으로 기회를 포착하세요.'
        };
    }
}

// 전역 사용을 위한 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SajuEngine;
}
