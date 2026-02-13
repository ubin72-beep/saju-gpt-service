/**
 * AI 사주 천년지기 - 사주팔자 계산 엔진
 * 정통 명리학 기반 사주 계산 JavaScript 라이브러리
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
     */
    getDayPillar(year, month, day) {
        // 만세력 기준일 (1900년 1월 1일 = 경자일)
        const baseDate = new Date(1900, 0, 1);
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
        
        const stemIndex = (diffDays + 6) % 10;
        const branchIndex = (diffDays + 0) % 12;
        
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
    /**
 * 시주 (時柱) 계산
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
        
        return {
            distribution: elements,
            strongest,
            weakest,
            balance: this.getElementBalance(elements)
        };
    }
    
    /**
     * 오행 균형 판단
     */
    getElementBalance(elements) {
        const values = Object.values(elements);
        const max = Math.max(...values);
        const min = Math.min(...values.filter(v => v > 0));
        
        if (max - min <= 1) return '매우 균형잡힘';
        if (max - min <= 2) return '균형잡힘';
        if (max - min <= 3) return '보통';
        return '불균형';
    }
    
    /**
     * 성격 분석
     */
    analyzePersonality(dayStem) {
        const personalities = {
            '갑': '강직하고 리더십이 있으며, 결단력이 뛰어납니다.',
            '을': '부드럽고 섬세하며, 협력적인 성향이 강합니다.',
            '병': '열정적이고 활동적이며, 창의력이 풍부합니다.',
            '정': '따뜻하고 배려심이 깊으며, 예술적 감각이 있습니다.',
            '무': '안정적이고 신뢰감 있으며, 포용력이 큽니다.',
            '기': '세심하고 계획적이며, 실용적인 면이 강합니다.',
            '경': '정의롭고 원칙적이며, 결단력이 있습니다.',
            '신': '섬세하고 우아하며, 감수성이 풍부합니다.',
            '임': '지혜롭고 융통성 있으며, 적응력이 뛰어납니다.',
            '계': '깊이 있고 신중하며, 통찰력이 있습니다.'
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
            year2026: this.get2026Fortune(dayPillar.zodiac)
        };
    }
    
    /**
     * 종합 운세
     */
    getOverallFortune(element, age) {
        const scores = { 목: 85, 화: 90, 토: 80, 금: 88, 수: 92 };
        return {
            score: scores[element] || 85,
            description: '전반적으로 좋은 운세가 예상됩니다. 긍정적인 마음가짐을 유지하세요.'
        };
    }
    
    /**
     * 직업운
     */
    getCareerFortune(element) {
        const descriptions = {
            '목': '새로운 프로젝트나 승진의 기회가 있습니다.',
            '화': '창의적인 아이디어로 인정받을 수 있습니다.',
            '토': '안정적인 발전과 신뢰를 쌓는 시기입니다.',
            '금': '결단력 있는 행동이 성공으로 이어집니다.',
            '수': '유연한 대응으로 좋은 결과를 얻을 수 있습니다.'
        };
        
        return {
            score: 85,
            description: descriptions[element]
        };
    }
    
    /**
     * 재물운
     */
    getWealthFortune(element) {
        return {
            score: 80,
            description: '꾸준한 저축과 투자로 재물이 늘어날 수 있습니다.'
        };
    }
    
    /**
     * 애정운
     */
    getLoveFortune(element, gender) {
        return {
            score: 88,
            description: '따뜻한 만남과 좋은 인연이 기대됩니다.'
        };
    }
    
    /**
     * 건강운
     */
    getHealthFortune(element) {
        return {
            score: 90,
            description: '전반적으로 건강한 상태입니다. 규칙적인 생활을 유지하세요.'
        };
    }
    
    /**
     * 2026년 병오년 운세
     */
    get2026Fortune(zodiac) {
        return {
            description: `2026년 병오년(말의 해)은 ${zodiac}띠에게 역동적인 변화의 시기입니다.`,
            advice: '새로운 도전을 두려워하지 말고, 긍정적인 마음으로 임하세요.'
        };
    }
}

// 전역 사용을 위한 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SajuEngine;
}
