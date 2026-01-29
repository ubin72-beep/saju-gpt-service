/**
 * 사주팔자 강화 엔진 (Enhanced Engine)
 * 60갑자 전체 데이터 + 상세 분석 기능
 */

class SajuEnhancedEngine {
    constructor() {
        this.stems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
        this.branches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
        this.elements = {
            '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토', '기': '토',
            '경': '금', '신': '금', '임': '수', '계': '수',
            '자': '수', '축': '토', '인': '목', '묘': '목', '진': '토', '사': '화',
            '오': '화', '미': '토', '신': '금', '유': '금', '술': '토', '해': '수'
        };
        
        // 60갑자 전체 리스트 생성
        this.sixtyGapja = this.generateSixtyGapja();
        
        // 상세 분석 데이터
        this.detailedData = this.initializeDetailedData();
    }
    
    /**
     * 60갑자 전체 리스트 생성
     */
    generateSixtyGapja() {
        const gapja = [];
        for (let i = 0; i < 60; i++) {
            const stem = this.stems[i % 10];
            const branch = this.branches[i % 12];
            gapja.push(`${stem}${branch}`);
        }
        return gapja;
    }
    
    /**
     * 일간(日干)별 핵심 특성
     */
    getStemCharacteristics(stem) {
        const characteristics = {
            '갑': {
                title: '개척자형 리더',
                element: '목',
                nature: '양목',
                keywords: ['리더십', '추진력', '독립심', '정직', '책임감'],
                strengths: ['강한 추진력', '타고난 리더십', '정직하고 직선적', '새로운 도전을 즐김'],
                weaknesses: ['독단적일 수 있음', '완고함', '인내심 부족', '타협 어려움'],
                personality: '큰 나무처럼 우뚝 서서 주변을 이끄는 타고난 리더입니다. 새로운 길을 개척하는 것을 좋아하며, 강한 책임감으로 맡은 일을 완수합니다.'
            },
            '을': {
                title: '섬세한 협조자',
                element: '목',
                nature: '음목',
                keywords: ['섬세함', '유연성', '협조성', '예술성', '배려'],
                strengths: ['섬세하고 세심함', '유연한 사고', '예술적 감각', '대인관계 좋음'],
                weaknesses: ['우유부단함', '결단력 부족', '감정 기복', '자존감 낮을 수 있음'],
                personality: '덩굴 식물처럼 유연하게 적응하며 성장합니다. 섬세한 감수성과 예술적 감각이 뛰어나며, 협력을 통해 목표를 달성합니다.'
            },
            '병': {
                title: '열정적인 리더',
                element: '화',
                nature: '양화',
                keywords: ['열정', '활동성', '카리스마', '창의성', '외향성'],
                strengths: ['강한 추진력', '밝은 에너지', '창의적 사고', '카리스마'],
                weaknesses: ['조급함', '감정 기복', '일관성 부족', '쉽게 흥분함'],
                personality: '태양처럼 밝고 열정적입니다. 주변을 밝게 만들며, 강한 에너지로 사람들을 이끕니다. 창의적이고 도전적인 일을 좋아합니다.'
            },
            '정': {
                title: '따뜻한 조력자',
                element: '화',
                nature: '음화',
                keywords: ['따뜻함', '배려', '감성', '헌신', '정의감'],
                strengths: ['따뜻한 마음', '섬세한 배려', '강한 정의감', '예술적 감각'],
                weaknesses: ['감정에 치우침', '우유부단함', '과도한 헌신', '상처 받기 쉬움'],
                personality: '촛불처럼 따뜻하게 주변을 밝힙니다. 타인에 대한 배려심이 깊고 정의감이 강합니다. 예술과 문화에 관심이 많습니다.'
            },
            '무': {
                title: '안정적인 중재자',
                element: '토',
                nature: '양토',
                keywords: ['안정', '포용', '신뢰', '실용성', '중재'],
                strengths: ['안정적', '포용력', '신뢰감', '실용적 사고'],
                weaknesses: ['변화 두려움', '고집', '느린 결정', '보수적'],
                personality: '산처럼 든든하고 안정적입니다. 포용력이 크고 신뢰할 수 있으며, 실용적인 해결책을 제시합니다. 중재자 역할을 잘합니다.'
            },
            '기': {
                title: '배려심 깊은 지원자',
                element: '토',
                nature: '음토',
                keywords: ['배려', '현실성', '꼼꼼함', '봉사', '근면'],
                strengths: ['섬세한 배려', '꼼꼼함', '봉사정신', '현실적 판단'],
                weaknesses: ['걱정 많음', '소극적', '자기 희생', '우유부단'],
                personality: '밭처럼 풍요롭고 배려심이 깊습니다. 타인을 돕는 것을 좋아하며, 꼼꼼하고 성실하게 일을 처리합니다.'
            },
            '경': {
                title: '결단력 있는 실행자',
                element: '금',
                nature: '양금',
                keywords: ['결단력', '정의', '원칙', '강인함', '추진력'],
                strengths: ['강한 결단력', '원칙주의', '추진력', '정의감'],
                weaknesses: ['융통성 부족', '엄격함', '감정 표현 서툼', '타협 어려움'],
                personality: '칼처럼 날카롭고 정확합니다. 강한 원칙과 정의감을 가지고 있으며, 결단력 있게 일을 추진합니다.'
            },
            '신': {
                title: '섬세한 완벽주의자',
                element: '금',
                nature: '음금',
                keywords: ['섬세함', '완벽주의', '예리함', '분석력', '미적 감각'],
                strengths: ['섬세한 감각', '분석력', '미적 감각', '정확성'],
                weaknesses: ['과도한 완벽주의', '비판적', '스트레스', '융통성 부족'],
                personality: '보석처럼 빛나는 섬세함을 가졌습니다. 완벽을 추구하며 분석력이 뛰어나고, 예술적 감각이 뛰어납니다.'
            },
            '임': {
                title: '지혜로운 전략가',
                element: '수',
                nature: '양수',
                keywords: ['지혜', '유연성', '전략', '통찰력', '적응력'],
                strengths: ['뛰어난 지혜', '유연한 사고', '적응력', '통찰력'],
                weaknesses: ['우유부단', '변덕', '계산적', '신뢰 문제'],
                personality: '큰 강물처럼 깊고 넓은 지혜를 가졌습니다. 상황에 맞게 유연하게 대처하며, 전략적 사고가 뛰어납니다.'
            },
            '계': {
                title: '조용한 혁신가',
                element: '수',
                nature: '음수',
                keywords: ['혁신', '직관', '감수성', '통찰', '창의성'],
                strengths: ['뛰어난 직관', '창의적 사고', '감수성', '통찰력'],
                weaknesses: ['불안정', '감정 기복', '현실성 부족', '우유부단'],
                personality: '이슬이나 빗물처럼 조용하지만 강한 힘을 가졌습니다. 직관력과 창의성이 뛰어나며, 혁신적인 아이디어를 제시합니다.'
            }
        };
        return characteristics[stem] || characteristics['갑'];
    }
    
    /**
     * 60갑자별 상세 분석
     */
    getGapjaDetails(gapja) {
        const stem = gapja[0];
        const branch = gapja[1];
        const stemChar = this.getStemCharacteristics(stem);
        const branchElement = this.elements[branch];
        
        return {
            name: gapja,
            stem: stem,
            branch: branch,
            stemElement: this.elements[stem],
            branchElement: branchElement,
            personality: stemChar,
            compatibility: this.calculateCompatibility(stem, branch),
            luckyElements: this.getLuckyElements(stem, branch),
            careers: this.generateCareers(stem, branch),
            wealth: this.generateWealthPattern(stem, branch),
            health: this.generateHealthAdvice(stem, branch)
        };
    }
    
    /**
     * 직업 추천 생성 (10가지)
     */
    generateCareers(stem, branch) {
        const stemElement = this.elements[stem];
        const branchElement = this.elements[branch];
        
        // 오행별 직업 매핑
        const careersByElement = {
            '목': [
                { job: '경영자(CEO)', score: 95, reason: '리더십과 추진력' },
                { job: '창업가', score: 93, reason: '개척 정신' },
                { job: '교육자', score: 90, reason: '성장과 발전 지향' },
                { job: '환경 전문가', score: 88, reason: '자연 친화적' },
                { job: '작가/저술가', score: 85, reason: '창의적 표현력' },
                { job: '디자이너', score: 83, reason: '창의성' },
                { job: '상담가', score: 80, reason: '성장 지원' },
                { job: '농업/원예', score: 78, reason: '자연과 교감' },
                { job: '의류/패션', score: 75, reason: '섬유 관련' },
                { job: '출판/미디어', score: 73, reason: '종이(목) 관련' }
            ],
            '화': [
                { job: 'IT 개발자', score: 95, reason: '혁신과 창조성' },
                { job: '마케터', score: 93, reason: '열정과 창의성' },
                { job: '연예인', score: 90, reason: '무대 위 빛남' },
                { job: '요리사/셰프', score: 88, reason: '불 다루는 직업' },
                { job: '에너지 전문가', score: 85, reason: '에너지 관련' },
                { job: '강사/강연가', score: 83, reason: '열정 전달' },
                { job: '광고 기획자', score: 80, reason: '창의적 기획' },
                { job: '전기/전자', score: 78, reason: '전기(불) 관련' },
                { job: '사진가', score: 75, reason: '빛 다루는 직업' },
                { job: '화장품/미용', score: 73, reason: '변화와 아름다움' }
            ],
            '토': [
                { job: '부동산 전문가', score: 95, reason: '토지 관련' },
                { job: '건축가', score: 93, reason: '건물 설계' },
                { job: '공무원', score: 90, reason: '안정적 직업' },
                { job: '농업/임업', score: 88, reason: '토지 활용' },
                { job: '도자기 공예', score: 85, reason: '흙 다루는 직업' },
                { job: '의사/약사', score: 83, reason: '치료와 안정' },
                { job: '회계사', score: 80, reason: '꼼꼼한 관리' },
                { job: '물류/유통', score: 78, reason: '저장과 이동' },
                { job: '인테리어', score: 75, reason: '공간 활용' },
                { job: '보험/금융', score: 73, reason: '안정성 중시' }
            ],
            '금': [
                { job: '은행원', score: 95, reason: '금융(金) 관련' },
                { job: '변호사', score: 93, reason: '정의와 원칙' },
                { job: '검사/판사', score: 90, reason: '법 집행' },
                { job: '경찰/군인', score: 88, reason: '칼(무기) 관련' },
                { job: '치과의사', score: 85, reason: '금속 도구 사용' },
                { job: '기계공학자', score: 83, reason: '금속 가공' },
                { job: '자동차 정비', score: 80, reason: '금속 기계' },
                { job: '보석 세공', score: 78, reason: '귀금속 다룸' },
                { job: 'IT 하드웨어', score: 75, reason: '금속 부품' },
                { job: '철강/금속', score: 73, reason: '금속 산업' }
            ],
            '수': [
                { job: '무역업', score: 95, reason: '유통과 흐름' },
                { job: '컨설턴트', score: 93, reason: '지혜와 전략' },
                { job: '수산업', score: 90, reason: '물 관련' },
                { job: '연구원', score: 88, reason: '깊은 탐구' },
                { job: '물류 전문가', score: 85, reason: '흐름 관리' },
                { job: '여행 가이드', score: 83, reason: '이동과 변화' },
                { job: '호텔/관광', score: 80, reason: '서비스업' },
                { job: '배관/수도', score: 78, reason: '물 다루는 직업' },
                { job: '청소/세탁', score: 75, reason: '물 사용' },
                { job: '음료/주류', score: 73, reason: '액체 관련' }
            ]
        };
        
        return careersByElement[stemElement] || careersByElement['목'];
    }
    
    /**
     * 월별 운세 생성 (12개월)
     */
    generateMonthlyFortune(gapja, year = 2026) {
        const stem = gapja[0];
        const branch = gapja[1];
        const stemElement = this.elements[stem];
        
        const months = [];
        const monthNames = ['정월', '이월', '삼월', '사월', '오월', '유월', 
                           '칠월', '팔월', '구월', '시월', '십일월', '십이월'];
        const monthBranches = ['인', '묘', '진', '사', '오', '미', '신', '유', '술', '해', '자', '축'];
        
        for (let i = 0; i < 12; i++) {
            const monthBranch = monthBranches[i];
            const monthElement = this.elements[monthBranch];
            const score = this.calculateMonthScore(stemElement, monthElement, i);
            
            months.push({
                month: i + 1,
                name: monthNames[i],
                branch: monthBranch,
                element: monthElement,
                score: score,
                fortune: this.getMonthFortuneDescription(score),
                keywords: this.getMonthKeywords(score, monthElement),
                advice: this.getMonthAdvice(score, monthElement),
                luckyDays: this.getLuckyDays(i + 1, monthElement),
                caution: this.getMonthCaution(score)
            });
        }
        
        return months;
    }
    
    /**
     * 월별 운세 점수 계산
     */
    calculateMonthScore(stemElement, monthElement, monthIndex) {
        let baseScore = 75;
        
        // 오행 상생/상극 관계
        const support = this.getElementSupport(stemElement, monthElement);
        if (support === 'strong_support') baseScore += 15;
        else if (support === 'support') baseScore += 10;
        else if (support === 'conflict') baseScore -= 10;
        else if (support === 'strong_conflict') baseScore -= 15;
        
        // 계절 보너스
        const seasonBonus = this.getSeasonBonus(stemElement, monthIndex);
        baseScore += seasonBonus;
        
        // 랜덤 변동 (-5 ~ +5)
        const random = Math.floor(Math.random() * 11) - 5;
        baseScore += random;
        
        return Math.max(50, Math.min(100, baseScore));
    }
    
    /**
     * 오행 상생/상극 관계 판단
     */
    getElementSupport(elem1, elem2) {
        const support = {
            '목': { support: '수', weak: '금' },
            '화': { support: '목', weak: '수' },
            '토': { support: '화', weak: '목' },
            '금': { support: '토', weak: '화' },
            '수': { support: '금', weak: '토' }
        };
        
        if (elem1 === elem2) return 'same';
        if (support[elem1].support === elem2) return 'strong_support';
        if (support[elem1].weak === elem2) return 'strong_conflict';
        
        // 상생 체인 확인
        const elem1Support = support[elem1].support;
        if (support[elem1Support] && support[elem1Support].support === elem2) return 'support';
        
        return 'neutral';
    }
    
    /**
     * 계절 보너스
     */
    getSeasonBonus(element, monthIndex) {
        const seasonMap = {
            '목': [3, 4], // 봄 (3-4월)
            '화': [5, 6], // 여름 (5-6월)
            '금': [8, 9], // 가을 (8-9월)
            '수': [11, 0] // 겨울 (11-12월)
        };
        
        if (seasonMap[element] && seasonMap[element].includes(monthIndex)) {
            return 10;
        }
        return 0;
    }
    
    /**
     * 월별 운세 설명
     */
    getMonthFortuneDescription(score) {
        if (score >= 90) return '매우 좋은 운세입니다. 적극적으로 도전하세요.';
        if (score >= 80) return '좋은 운세입니다. 새로운 기회를 잡으세요.';
        if (score >= 70) return '평범한 운세입니다. 꾸준히 노력하세요.';
        if (score >= 60) return '조심스러운 시기입니다. 신중하게 행동하세요.';
        return '어려운 시기입니다. 무리하지 말고 기다리세요.';
    }
    
    /**
     * 월별 키워드
     */
    getMonthKeywords(score, element) {
        const allKeywords = {
            '목': ['성장', '발전', '창업', '교육'],
            '화': ['열정', '성공', '인기', '활동'],
            '토': ['안정', '저축', '부동산', '건강'],
            '금': ['재물', '계약', '법적 처리', '정리'],
            '수': ['지혜', '학습', '여행', '변화']
        };
        
        const keywords = allKeywords[element] || ['발전', '노력', '성실'];
        
        if (score >= 85) {
            return ['🎯 기회', '💼 성공', ...keywords.slice(0, 2)];
        } else if (score >= 70) {
            return ['💪 노력', '📈 발전', ...keywords.slice(0, 2)];
        } else {
            return ['🧘 안정', '⚠️ 주의', ...keywords.slice(0, 2)];
        }
    }
    
    /**
     * 월별 조언
     */
    getMonthAdvice(score, element) {
        if (score >= 85) {
            return `이번 달은 ${element} 기운이 강한 좋은 시기입니다. 적극적으로 새로운 일을 시작하거나 중요한 결정을 내리기 좋습니다.`;
        } else if (score >= 70) {
            return `평범한 운세이지만 꾸준한 노력으로 좋은 결과를 얻을 수 있습니다. ${element} 관련 활동에 집중하세요.`;
        } else {
            return `조심스러운 시기입니다. 무리한 도전보다는 현상 유지와 재충전에 집중하세요. ${element} 관련 주의가 필요합니다.`;
        }
    }
    
    /**
     * 길일 계산
     */
    getLuckyDays(month, element) {
        // 간단한 길일 계산 (실제로는 더 복잡한 알고리즘 필요)
        const luckyDays = [];
        for (let i = 0; i < 5; i++) {
            const day = Math.floor(Math.random() * 28) + 1;
            if (!luckyDays.includes(day)) {
                luckyDays.push(day);
            }
        }
        return luckyDays.sort((a, b) => a - b);
    }
    
    /**
     * 월별 주의사항
     */
    getMonthCaution(score) {
        if (score < 65) {
            return ['건강 관리', '과소비 주의', '감정 관리', '무리한 투자 금물'];
        } else if (score < 75) {
            return ['적당한 휴식', '신중한 결정', '건강 체크'];
        } else {
            return ['과신 금물', '균형 유지'];
        }
    }
    
    /**
     * 재물운 패턴 생성
     */
    generateWealthPattern(stem, branch) {
        const element = this.elements[stem];
        const patterns = {
            '목': { type: '성장형', description: '젊을 때부터 꾸준히 성장' },
            '화': { type: '급상승형', description: '중년에 큰 재물 획득' },
            '토': { type: '안정형', description: '평생 안정적 재물 유지' },
            '금': { type: '축적형', description: '꾸준한 저축으로 재물 축적' },
            '수': { type: '유동형', description: '변동이 크나 기회 많음' }
        };
        
        return patterns[element] || patterns['목'];
    }
    
    /**
     * 건강 조언 생성
     */
    generateHealthAdvice(stem, branch) {
        const element = this.elements[stem];
        const healthAdvice = {
            '목': {
                weak: ['간', '담', '눈', '신경계'],
                strong: ['체력', '회복력'],
                exercise: ['조깅', '등산', '요가'],
                food: ['녹황색 채소', '과일', '견과류']
            },
            '화': {
                weak: ['심장', '혈액순환', '소장'],
                strong: ['활력', '면역력'],
                exercise: ['수영', '댄스', '구기종목'],
                food: ['붉은 채소', '토마토', '베리류']
            },
            '토': {
                weak: ['소화기', '위장', '비장'],
                strong: ['면역력', '체력'],
                exercise: ['걷기', '태극권', '필라테스'],
                food: ['곡물', '감자', '호박']
            },
            '금': {
                weak: ['폐', '대장', '피부', '호흡기'],
                strong: ['골격', '치아'],
                exercise: ['호흡법', '기공', '가벼운 웨이트'],
                food: ['흰색 식품', '배', '무', '도라지']
            },
            '수': {
                weak: ['신장', '방광', '생식기', '귀'],
                strong: ['두뇌', '신경계'],
                exercise: ['수영', '스트레칭', '명상'],
                food: ['검은콩', '해조류', '검은깨']
            }
        };
        
        return healthAdvice[element] || healthAdvice['목'];
    }
    
    /**
     * 궁합 계산
     */
    calculateCompatibility(stem, branch) {
        // 간단한 궁합 계산 (실제로는 더 복잡)
        const goodMatches = [];
        const badMatches = [];
        
        for (let i = 0; i < this.stems.length; i++) {
            for (let j = 0; j < this.branches.length; j++) {
                const targetStem = this.stems[i];
                const targetBranch = this.branches[j];
                const compatibility = this.checkCompatibility(stem, branch, targetStem, targetBranch);
                
                if (compatibility >= 85 && goodMatches.length < 5) {
                    goodMatches.push(`${targetStem}${targetBranch}`);
                } else if (compatibility <= 40 && badMatches.length < 3) {
                    badMatches.push(`${targetStem}${targetBranch}`);
                }
            }
        }
        
        return { good: goodMatches, bad: badMatches };
    }
    
    /**
     * 궁합 점수 확인
     */
    checkCompatibility(stem1, branch1, stem2, branch2) {
        let score = 70; // 기본 점수
        
        const elem1 = this.elements[stem1];
        const elem2 = this.elements[stem2];
        
        // 오행 상생 +20, 상극 -20
        const support = this.getElementSupport(elem1, elem2);
        if (support === 'strong_support' || support === 'support') score += 20;
        if (support === 'strong_conflict' || support === 'conflict') score -= 20;
        
        // 지지 합/충/형 관계
        if (this.isBranchHap(branch1, branch2)) score += 15;
        if (this.isBranchChung(branch1, branch2)) score -= 25;
        
        return Math.max(0, Math.min(100, score));
    }
    
    /**
     * 지지 합(合) 관계
     */
    isBranchHap(b1, b2) {
        const haps = [
            ['자', '축'], ['인', '해'], ['묘', '술'],
            ['진', '유'], ['사', '신'], ['오', '미']
        ];
        return haps.some(h => (h[0] === b1 && h[1] === b2) || (h[0] === b2 && h[1] === b1));
    }
    
    /**
     * 지지 충(冲) 관계
     */
    isBranchChung(b1, b2) {
        const chungs = [
            ['자', '오'], ['축', '미'], ['인', '신'],
            ['묘', '유'], ['진', '술'], ['사', '해']
        ];
        return chungs.some(c => (c[0] === b1 && c[1] === b2) || (c[0] === b2 && c[1] === b1));
    }
    
    /**
     * 행운의 오행 계산
     */
    getLuckyElements(stem, branch) {
        const element = this.elements[stem];
        const elementCycle = {
            '목': { lucky: '수', avoid: '금', color: '녹색/청색', number: [3, 8] },
            '화': { lucky: '목', avoid: '수', color: '빨강/자주', number: [2, 7] },
            '토': { lucky: '화', avoid: '목', color: '노랑/갈색', number: [5, 10] },
            '금': { lucky: '토', avoid: '화', color: '흰색/금색', number: [4, 9] },
            '수': { lucky: '금', avoid: '토', color: '검정/파랑', number: [1, 6] }
        };
        
        return elementCycle[element] || elementCycle['목'];
    }
    
    /**
     * 상세 데이터 초기화
     */
    initializeDetailedData() {
        const data = {};
        for (const gapja of this.sixtyGapja) {
            data[gapja] = this.getGapjaDetails(gapja);
        }
        return data;
    }
    
    /**
     * 통합 분석 실행
     */
    analyze(birthData) {
        const { year, month, day, time, gender } = birthData;
        const gapja = `${year.stem}${year.branch}`;
        const dayGapja = `${day.stem}${day.branch}`;
        
        return {
            basic: this.detailedData[dayGapja],
            monthly: this.generateMonthlyFortune(dayGapja, 2026),
            year2026: this.get2026Fortune(dayGapja),
            daeun: this.calculateDaeun(birthData),
            summary: this.generateSummary(dayGapja, gender)
        };
    }
    
    /**
     * 2026년 운세
     */
    get2026Fortune(gapja) {
        const stem = gapja[0];
        const element = this.elements[stem];
        
        // 2026년은 병오년 (火 기운이 강함)
        const score = this.calculate2026Score(element);
        
        return {
            score: score,
            description: `2026년 병오년은 ${element} 일간인 당신에게 ${score >= 80 ? '매우 좋은' : score >= 70 ? '좋은' : '보통의'} 해입니다.`,
            advice: score >= 80 ? 
                '적극적으로 새로운 도전을 시도하세요. 큰 성과를 거둘 수 있는 해입니다.' : 
                '꾸준히 노력하면 좋은 결과가 있을 것입니다. 조급해하지 마세요.'
        };
    }
    
    /**
     * 2026년 점수 계산
     */
    calculate2026Score(element) {
        // 병오년은 火 기운이 강함
        const fireRelation = {
            '목': 85, // 목생화 (목이 화를 생함) - 좋음
            '화': 90, // 같은 오행 - 매우 좋음
            '토': 80, // 화생토 (화를 받음) - 좋음
            '금': 65, // 화극금 (화가 금을 극함) - 보통
            '수': 60  // 수극화 (수와 화가 충돌) - 조금 어려움
        };
        
        return fireRelation[element] || 75;
    }
    
    /**
     * 대운 계산
     */
    calculateDaeun(birthData) {
        const { gender, year } = birthData;
        const daeunList = [];
        
        // 간단한 대운 계산 (실제로는 더 복잡)
        for (let age = 0; age < 100; age += 10) {
            const pillarIndex = Math.floor(age / 10);
            const stem = this.stems[pillarIndex % 10];
            const branch = this.branches[pillarIndex % 12];
            
            daeunList.push({
                ageRange: `${age}-${age + 9}`,
                pillar: `${stem}${branch}`,
                description: this.getDaeunDescription(age, stem, branch),
                luck: this.getDaeunLuck(age)
            });
        }
        
        return daeunList;
    }
    
    /**
     * 대운 설명
     */
    getDaeunDescription(age, stem, branch) {
        if (age < 10) return '배움의 시기, 기초를 다지는 기간';
        if (age < 20) return '성장과 도전의 시기';
        if (age < 30) return '본격적인 사회 진출과 발전';
        if (age < 40) return '능력을 발휘하고 성과를 거두는 시기';
        if (age < 50) return '전성기, 최고의 성과를 내는 시기';
        if (age < 60) return '성숙과 지혜의 시기';
        if (age < 70) return '안정과 수확의 시기';
        return '여유와 지혜로운 노년';
    }
    
    /**
     * 대운 운세 등급
     */
    getDaeunLuck(age) {
        if (age >= 40 && age < 50) return 'excellent';
        if (age >= 30 && age < 60) return 'good';
        if (age >= 20 && age < 70) return 'normal';
        return 'peaceful';
    }
    
    /**
     * 종합 요약 생성
     */
    generateSummary(gapja, gender) {
        const details = this.detailedData[gapja];
        return {
            title: `${gapja}일주 ${gender === 'male' ? '남성' : '여성'}`,
            personality: details.personality.title,
            keywords: details.personality.keywords,
            strengths: details.personality.strengths.slice(0, 3),
            weaknesses: details.personality.weaknesses.slice(0, 2),
            advice: `당신의 강점인 ${details.personality.strengths[0]}을(를) 활용하고, 
                    ${details.personality.weaknesses[0]}에 주의하세요.`
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SajuEnhancedEngine;
} else if (typeof window !== 'undefined') {
    window.SajuEnhancedEngine = SajuEnhancedEngine;
}
