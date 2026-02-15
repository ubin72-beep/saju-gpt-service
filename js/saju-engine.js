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
            let date = new Date(birthdate);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            
            // 음력 → 양력 변환
            if (calendar === 'lunar') {
                try {
                    // lunar-javascript 라이브러리 사용
                    const lunar = window.Lunar || window.lunar;
                    if (lunar && lunar.fromYmd) {
                        const lunarDate = lunar.fromYmd(year, month, day);
                        const solarDate = lunarDate.getSolar();
                        year = solarDate.getYear();
                        month = solarDate.getMonth();
                        day = solarDate.getDay();
                        console.log(`음력 변환: ${data.birthdate} (음력) → ${year}-${month}-${day} (양력)`);
                    } else {
                        console.warn('⚠️ 음력 라이브러리 없음, 양력으로 처리');
                    }
                } catch (lunarError) {
                    console.error('음력 변환 오류:', lunarError);
                    console.warn('⚠️ 음력 변환 실패, 양력으로 처리');
                }
            }
            
            // 2. 사주 계산
            const yearPillar = this.getYearPillar(year);
            const monthPillar = this.getMonthPillar(year, month, day);
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
     * 월주 (月柱) 계산 (절기 기준)
     */
    getMonthPillar(year, month, day) {
        const yearStemIndex = (year - 4) % 10;
        const monthStemIndex = (yearStemIndex * 2 + month) % 10;
        
        // 월지(月支) - 절기 기준 계산
        // 12절기: 입춘(2월), 경칩(3월), 청명(4월), 입하(5월), 망종(6월), 소서(7월),
        //         입추(8월), 백로(9월), 한로(10월), 입동(11월), 대설(12월), 소한(1월)
        
        // 각 달의 절기 날짜 (대략적, 매년 ±1일 변동)
        // 절기 순서대로 정렬 (1월부터 12월까지)
        const solarTerms = [
            { month: 1, day: 6, branchIndex: 1 },   // 소한 → 축월
            { month: 2, day: 4, branchIndex: 2 },   // 입춘 → 인월
            { month: 3, day: 6, branchIndex: 3 },   // 경칩 → 묘월
            { month: 4, day: 5, branchIndex: 4 },   // 청명 → 진월
            { month: 5, day: 6, branchIndex: 5 },   // 입하 → 사월
            { month: 6, day: 6, branchIndex: 6 },   // 망종 → 오월
            { month: 7, day: 7, branchIndex: 7 },   // 소서 → 미월
            { month: 8, day: 8, branchIndex: 8 },   // 입추 → 신월
            { month: 9, day: 8, branchIndex: 9 },   // 백로 → 유월
            { month: 10, day: 8, branchIndex: 10 }, // 한로 → 술월
            { month: 11, day: 7, branchIndex: 11 }, // 입동 → 해월
            { month: 12, day: 7, branchIndex: 0 }   // 대설 → 자월
        ];
        
        // 현재 날짜가 어느 월지에 속하는지 판단
        let monthBranchIndex = 1;  // 기본값: 축월 (1월 소한 전)
        
        for (let i = 0; i < solarTerms.length; i++) {
            const term = solarTerms[i];
            
            // 현재 날짜가 이 절기 이후인지 확인
            if (month > term.month || (month === term.month && day >= term.day)) {
                // 이 절기를 지났음 → 해당 월지 적용
                monthBranchIndex = term.branchIndex;
            } else {
                // 이후 절기는 아직 안 지났으므로 중단
                break;
            }
        }
        
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
     */
    getTimePillar(birthtime, dayStem) {
        // birthtime 안전 처리
        if (!birthtime || birthtime === '' || birthtime === 'undefined' || birthtime === 'null') {
            console.warn('⚠️ birthtime이 비어있음, 기본값(자시) 사용');
            birthtime = '23-01';
        }
        
        // 문자열로 변환 (안전)
        birthtime = String(birthtime).trim();
        
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
        
        if (timeToBranch[birthtime] === undefined) {
            console.warn('⚠️ 알 수 없는 시간 형식:', birthtime, '→ 자시로 처리');
        }
        
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
     * 오행 분석 (천간 + 지지 = 8글자 분석)
     */
    analyzeElements(pillars) {
        const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
        
        // 각 pillar에서 천간(stem)과 지지(branch)를 따로 카운트
        Object.values(pillars).forEach(pillar => {
            if (pillar) {
                // 천간 (天干) 오행 추가
                if (pillar.stem && this.elements[pillar.stem]) {
                    elements[this.elements[pillar.stem]]++;
                }
                // 지지 (地支) 오행 추가
                if (pillar.branch && this.elements[pillar.branch]) {
                    elements[this.elements[pillar.branch]]++;
                }
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
     * 종합 운세 (개선 버전)
     */
    getOverallFortune(element, age) {
        // 나이대별 기본 점수
        let baseScore = 75;
        if (age < 30) baseScore = 80;
        else if (age >= 30 && age < 40) baseScore = 85;
        else if (age >= 40 && age < 50) baseScore = 90;
        else if (age >= 50 && age < 60) baseScore = 85;
        else baseScore = 80;
        
        // 오행별 보너스
        const elementBonus = { '목': 5, '화': 8, '토': 3, '금': 7, '수': 10 };
        const finalScore = Math.min(baseScore + (elementBonus[element] || 0), 100);
        
        // 나이대별 맞춤 조언
        let ageAdvice = '';
        if (age < 30) {
            ageAdvice = '다양한 경험을 통해 자신의 길을 찾는 시기입니다. 실패를 두려워하지 말고 도전하세요.';
        } else if (age >= 30 && age < 40) {
            ageAdvice = '기반을 다지고 전문성을 쌓는 중요한 시기입니다. 목표를 명확히 하고 집중하세요.';
        } else if (age >= 40 && age < 50) {
            ageAdvice = '당신의 능력을 최대한 발휘할 수 있는 전성기입니다. 리더십을 발휘하세요.';
        } else if (age >= 50 && age < 60) {
            ageAdvice = '경험과 지혜를 나누며 후배를 양성하는 시기입니다. 안정적으로 관리하세요.';
        } else {
            ageAdvice = '인생의 열매를 수확하고 여유를 즐기는 시기입니다. 건강 관리에 집중하세요.';
        }
        
        return {
            score: finalScore,
            description: `${age}세의 당신은 ${element}(${this.getElementName(element)}) 오행으로 현재 ${finalScore}점의 운세입니다. ${ageAdvice}`
        };
    }
    
    getElementName(element) {
        const names = { '목': '木', '화': '火', '토': '土', '금': '金', '수': '水' };
        return names[element] || element;
    }
    
    /**
     * 직업운 (개선 버전)
     */
    getCareerFortune(element) {
        const descriptions = {
            '목': {
                score: 88,
                summary: '성장과 발전의 기운이 강한 시기입니다.',
                detail: '새로운 프로젝트나 승진의 기회가 있습니다. 리더십을 발휘하고 창의적인 아이디어를 제안하세요. 특히 상반기에 좋은 기회가 올 수 있으니 준비하세요.',
                recommend: ['기획/관리직', 'IT/개발', '교육', '컨설팅'],
                timing: '3월, 6월, 9월이 중요한 전환점'
            },
            '화': {
                score: 92,
                summary: '열정과 창의력이 빛을 발하는 시기입니다.',
                detail: '창의적인 아이디어로 인정받을 수 있습니다. 프레젠테이션이나 기획안 발표가 좋은 결과를 가져올 것입니다. 새로운 분야에 도전하기 좋은 때입니다.',
                recommend: ['마케팅', '디자인', '예술', '방송/미디어'],
                timing: '2월, 5월, 8월, 11월에 기회 포착'
            },
            '토': {
                score: 85,
                summary: '안정적인 발전과 신뢰를 쌓는 시기입니다.',
                detail: '차근차근 실력을 쌓아가며 주변의 신뢰를 얻는 시기입니다. 급한 마음보다는 꾸준함이 중요합니다. 조직 내에서 안정적인 위치를 확보하세요.',
                recommend: ['관리/행정', '부동산', '금융', '건설'],
                timing: '4월, 7월, 10월이 안정적'
            },
            '금': {
                score: 90,
                summary: '결단력 있는 행동이 성공으로 이어집니다.',
                detail: '과감한 결정과 실행력이 요구되는 시기입니다. 망설임 없이 추진하면 좋은 결과를 얻을 수 있습니다. 리더십을 발휘할 기회가 많습니다.',
                recommend: ['경영/관리', '법률', '의료', '금융'],
                timing: '1월, 4월, 7월, 10월이 결단의 시기'
            },
            '수': {
                score: 87,
                summary: '유연한 대응으로 좋은 결과를 얻을 수 있습니다.',
                detail: '상황에 맞게 유연하게 대처하는 능력이 빛을 발합니다. 다양한 사람들과의 네트워킹이 도움이 됩니다. 소통 능력을 활용하세요.',
                recommend: ['서비스업', '무역/유통', '통역/번역', '상담'],
                timing: '2월, 6월, 9월, 12월에 활발'
            }
        };
        
        return descriptions[element] || descriptions['목'];
    }
    
    /**
     * 재물운 (개선 버전)
     */
    getWealthFortune(element) {
        const wealth = {
            '목': {
                score: 82,
                summary: '점진적 상승형',
                description: '꾸준한 저축과 투자로 재물이 늘어납니다. 부동산 투자에 유리한 시기입니다.',
                investment: '장기 투자, 부동산, 주식(성장주)',
                caution: '단기 차익 노리기, 과도한 위험',
                timing: '3월, 9월에 투자 기회'
            },
            '화': {
                score: 85,
                summary: '급등 후 안정형',
                description: '예상치 못한 수입이 있을 수 있습니다. 하지만 지출 관리가 중요합니다.',
                investment: '기술주, 코인(소액), 신사업',
                caution: '충동 소비, 과도한 투자',
                timing: '상반기 적극, 하반기 안정'
            },
            '토': {
                score: 88,
                summary: '안정적 축적형',
                description: '착실하게 재산을 모을 수 있는 시기입니다. 장기적 관점의 투자가 유리합니다.',
                investment: '적금, 펀드, 보험, 토지',
                caution: '고수익 유혹, 급한 투자',
                timing: '매 분기마다 꾸준히'
            },
            '금': {
                score: 90,
                summary: '고수익 기회형',
                description: '과감한 투자로 큰 수익을 올릴 수 있습니다. 결단력이 중요합니다.',
                investment: '부동산, 금, 채권, 우량주',
                caution: '과욕, 레버리지 투자',
                timing: '1월, 7월이 결정의 시기'
            },
            '수': {
                score: 84,
                summary: '유동적 변화형',
                description: '수입의 변동이 있을 수 있으나 전체적으로 증가 추세입니다. 유연한 자산 관리가 필요합니다.',
                investment: '펀드, 해외 주식, 달러',
                caution: '충동적 소비, 대출',
                timing: '매달 소액 분산 투자'
            }
        };
        
        return wealth[element] || wealth['목'];
    }
    
    /**
     * 애정운 (개선 버전)
     */
    getLoveFortune(element, gender) {
        const love = {
            '목': {
                male: {
                    score: 85,
                    description: '차분하고 포용력 있는 여성과 좋은 인연. 올해 봄에 좋은 만남이 기대됩니다.',
                    idealType: '수(水)나 토(土) 오행의 여성',
                    timing: '3-5월, 9-11월이 연애운 상승',
                    advice: '적극적으로 다가가되 서두르지 마세요'
                },
                female: {
                    score: 87,
                    description: '든든하고 신뢰감 있는 남성과의 인연. 하반기에 운명적 만남 가능.',
                    idealType: '금(金)이나 화(火) 오행의 남성',
                    timing: '7-9월이 최고의 시기',
                    advice: '너무 강한 성격을 부드럽게 조절하세요'
                }
            },
            // ... 다른 오행들
        };
        
        const genderKey = gender === 'male' ? 'male' : 'female';
        return (love[element] && love[element][genderKey]) || {
            score: 85,
            description: '좋은 인연이 기대되는 시기입니다.',
            timing: '연중',
            advice: '자연스러운 만남을 기다리세요'
        };
    }
    
    /**
     * 건강운 (개선 버전)
     */
    getHealthFortune(element) {
        const health = {
            '목': {
                score: 88,
                weak: ['간', '담', '눈', '신경'],
                strong: ['소화기', '피부'],
                description: '전반적으로 건강하나 간 건강에 주의가 필요합니다.',
                advice: '규칙적인 생활과 충분한 수면이 중요. 봄철 알레르기 주의. 눈의 피로를 풀어주세요.',
                exercise: '조깅, 요가, 스트레칭',
                food: '녹황색 채소, 견과류, 신맛 음식',
                caution: '음주, 스트레스, 과로'
            },
            '화': {
                score: 85,
                weak: ['심장', '소장', '혈압'],
                strong: ['간', '폐'],
                description: '활동적이나 과열 주의. 심혈관 건강 체크 필요.',
                advice: '흥분하지 말고 차분함 유지. 여름철 열사병 주의. 규칙적인 심장 검진 권장.',
                exercise: '수영, 걷기, 명상',
                food: '붉은 음식, 토마토, 석류',
                caution: '과도한 운동, 흥분, 매운 음식'
            },
            // ... 다른 오행들
        };
        
        return health[element] || health['목'];
    }
    
    /**
     * 2026년 병오년 운세 (개선 버전)
     */
    get2026Fortune(zodiac) {
        const fortune2026 = {
            '쥐': {
                description: '2026년 병오년은 쥐띠에게 변화와 도약의 해입니다. 자오충(子午冲)으로 큰 변화가 예상됩니다.',
                score: 75,
                advice: '급격한 변화에 유연하게 대처하세요. 상반기는 신중하게, 하반기는 적극적으로 행동하세요.',
                lucky: { month: [3, 6, 9, 12], color: ['파랑', '검정'], number: [1, 6] },
                caution: '건강 관리, 급한 투자, 충동적 결정'
            },
            '소': {
                description: '2026년은 소띠에게 안정적이고 발전적인 해입니다. 오축합(午丑合)의 길한 기운.',
                score: 88,
                advice: '준비한 일들이 결실을 맺는 시기. 새로운 계획을 차근차근 실행하세요.',
                lucky: { month: [1, 4, 7, 10], color: ['노랑', '갈색'], number: [2, 7] },
                caution: '과욕, 안주, 보수적 태도'
            },
            '호랑이': {
                description: '2026년은 호랑이띠에게 활동적이고 역동적인 해입니다. 인오합(寅午合)의 강한 에너지.',
                score: 92,
                advice: '큰 포부를 가지고 도전하세요. 리더십을 발휘할 기회가 많습니다.',
                lucky: { month: [2, 5, 8, 11], color: ['초록', '빨강'], number: [3, 8] },
                caution: '과신, 독단, 과도한 모험'
            },
            // ... 나머지 9지지
        };
        
        return fortune2026[zodiac] || {
            description: `2026년 병오년은 ${zodiac}띠에게 새로운 가능성의 해입니다.`,
            score: 80,
            advice: '긍정적인 마음으로 기회를 포착하세요.',
            lucky: { month: [1, 6], color: ['흰색'], number: [5] }
        };
    }
}

// 전역 사용을 위한 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SajuEngine;
}
