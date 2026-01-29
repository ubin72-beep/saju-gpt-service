/**
 * 택일 프리미엄 엔진 (Premium Taekil Engine)
 * 이사/결혼 길일 상세 분석
 */

class TaekilPremiumEngine {
    constructor() {
        this.stems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
        this.branches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
        this.elements = {
            '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토', '기': '토',
            '경': '금', '신': '금', '임': '수', '계': '수',
            '자': '수', '축': '토', '인': '목', '묘': '목', '진': '토', '사': '화',
            '오': '화', '미': '토', '신': '금', '유': '금', '술': '토', '해': '수'
        };
        
        // 2026년 길일 데이터베이스
        this.luckyDates2026 = this.initialize2026LuckyDates();
    }
    
    /**
     * 2026년 길일 데이터베이스 초기화
     */
    initialize2026LuckyDates() {
        // 2026년 주요 길일 (음력 기준)
        return {
            // 이사 길일
            moving: [
                { solar: '2026-01-15', lunar: '음력 12월 26일', score: 95, type: '천덕일', reason: '하늘의 덕이 임하는 날' },
                { solar: '2026-02-10', lunar: '음력 1월 23일', score: 93, type: '월덕합일', reason: '길사에 매우 좋은 날' },
                { solar: '2026-03-15', lunar: '음력 1월 27일', score: 98, type: '귀인일', reason: '귀한 사람의 도움을 받는 길일' },
                { solar: '2026-04-20', lunar: '음력 3월 3일', score: 95, type: '천덕일', reason: '이사/입택에 최고의 길일' },
                { solar: '2026-05-08', lunar: '음력 3월 21일', score: 92, type: '월덕합', reason: '가정운이 상승하는 날' },
                { solar: '2026-06-12', lunar: '음력 4월 27일', score: 90, type: '천의일', reason: '건강과 평안을 가져오는 날' },
                { solar: '2026-07-22', lunar: '음력 6월 8일', score: 88, type: '성수일', reason: '집안이 번창하는 날' },
                { solar: '2026-08-18', lunar: '음력 7월 6일', score: 91, type: '귀인일', reason: '귀인의 도움으로 발전하는 날' },
                { solar: '2026-09-25', lunar: '음력 8월 14일', score: 94, type: '천덕일', reason: '안정과 발전의 길일' },
                { solar: '2026-10-30', lunar: '음력 9월 20일', score: 89, type: '월덕합', reason: '재물운이 좋은 날' }
            ],
            
            // 결혼 길일
            wedding: [
                { solar: '2026-03-15', lunar: '음력 1월 27일', score: 99, type: '황도일', reason: '결혼에 최고의 길일' },
                { solar: '2026-04-25', lunar: '음력 3월 8일', score: 97, type: '대덕일', reason: '부부금슬이 좋은 날' },
                { solar: '2026-05-08', lunar: '음력 3월 21일', score: 96, type: '월덕합', reason: '백년해로 길일' },
                { solar: '2026-06-20', lunar: '음력 5월 6일', score: 95, type: '천희일', reason: '경사스러운 날' },
                { solar: '2026-09-12', lunar: '음력 8월 1일', score: 94, type: '황도일', reason: '결혼 길일' },
                { solar: '2026-10-10', lunar: '음력 8월 29일', score: 98, type: '대길일', reason: '결혼에 매우 좋은 날' },
                { solar: '2026-11-08', lunar: '음력 9월 29일', score: 93, type: '월덕합', reason: '가정이 화목한 날' },
                { solar: '2026-12-12', lunar: '음력 11월 3일', score: 90, type: '천덕일', reason: '백년가약 길일' }
            ],
            
            // 피해야 할 흉일
            badDates: [
                { solar: '2026-01-20', lunar: '음력 1월 2일', type: '삼재일', reason: '액운이 따르는 날' },
                { solar: '2026-02-18', lunar: '음력 2월 1일', type: '월파일', reason: '가정 불화 우려' },
                { solar: '2026-03-25', lunar: '음력 2월 7일', type: '암귀일', reason: '숨은 어려움이 있는 날' },
                { solar: '2026-04-15', lunar: '음력 2월 28일', type: '충일', reason: '사고나 다툼 우려' },
                { solar: '2026-05-20', lunar: '음력 4월 4일', type: '파일', reason: '재물 손실 우려' },
                { solar: '2026-07-10', lunar: '음력 5월 26일', type: '귀문일', reason: '액운이 들어오는 날' }
            ]
        };
    }
    
    /**
     * 메인 분석 함수: 사주와 날짜 매칭
     */
    analyzeTaekil(sajuData, purpose = 'moving', targetMonth = null) {
        const { dayMaster, birthYear, birthMonth, birthDay } = sajuData;
        const dayElement = this.elements[dayMaster] || '목';
        
        // 길일 필터링
        let luckyDates = purpose === 'moving' 
            ? this.luckyDates2026.moving 
            : this.luckyDates2026.wedding;
        
        // 특정 월 필터링
        if (targetMonth) {
            luckyDates = luckyDates.filter(date => {
                const month = parseInt(date.solar.split('-')[1]);
                return month === targetMonth;
            });
        }
        
        // 각 날짜 상세 분석
        const analyzedDates = luckyDates.map(date => {
            return this.analyzeDate(date, dayMaster, dayElement, purpose);
        });
        
        // 점수순 정렬
        analyzedDates.sort((a, b) => b.finalScore - a.finalScore);
        
        // 피해야 할 날
        const badDates = this.analyzeBadDates(this.luckyDates2026.badDates, dayMaster);
        
        return {
            topDates: analyzedDates.slice(0, 5),
            allDates: analyzedDates,
            badDates: badDates.slice(0, 3),
            sajuAdvice: this.getSajuAdvice(dayMaster, dayElement, purpose),
            directionAdvice: this.getDirectionAdvice(dayElement, purpose),
            checklistAdvice: this.getChecklistAdvice(purpose)
        };
    }
    
    /**
     * 개별 날짜 상세 분석
     */
    analyzeDate(date, dayMaster, dayElement, purpose) {
        const baseScore = date.score;
        
        // 사주 궁합 점수 (±15점)
        const sajuBonus = this.calculateSajuCompatibility(date.solar, dayMaster);
        
        // 오행 조화 점수 (±10점)
        const elementBonus = this.calculateElementHarmony(date.solar, dayElement);
        
        const finalScore = Math.min(100, baseScore + sajuBonus + elementBonus);
        
        return {
            ...date,
            finalScore: finalScore,
            sajuMatch: sajuBonus >= 5 ? '매우 좋음' : sajuBonus >= 0 ? '좋음' : '보통',
            bestTimeSlots: this.getBestTimeSlots(date.solar, dayMaster, purpose),
            detailedReasons: this.getDetailedReasons(date, dayMaster, dayElement, purpose),
            cautions: this.getCautions(date.solar, purpose),
            preparation: this.getPreparation(date.solar, purpose),
            benefits: this.getBenefits(finalScore, purpose)
        };
    }
    
    /**
     * 사주 궁합 계산
     */
    calculateSajuCompatibility(dateString, dayMaster) {
        // 간단한 일간-날짜 궁합 계산
        const dateObj = new Date(dateString);
        const dayOfWeek = dateObj.getDay();
        
        // 일간별 유리한 요일
        const favorableDays = {
            '甲': [1, 4], // 목요일, 일요일
            '乙': [1, 4],
            '丙': [0, 3], // 수요일, 토요일
            '丁': [0, 3],
            '戊': [2, 5], // 화요일, 금요일
            '己': [2, 5],
            '庚': [4, 0], // 목요일, 일요일
            '辛': [4, 0],
            '壬': [1, 6], // 월요일, 토요일
            '癸': [1, 6]
        };
        
        const favorable = favorableDays[dayMaster] || [0, 3];
        return favorable.includes(dayOfWeek) ? 10 : 0;
    }
    
    /**
     * 오행 조화 계산
     */
    calculateElementHarmony(dateString, dayElement) {
        const month = parseInt(dateString.split('-')[1]);
        
        // 오행별 유리한 계절
        const favorableSeasons = {
            '목': [3, 4, 5], // 봄
            '화': [6, 7, 8], // 여름
            '토': [3, 6, 9, 12], // 환절기
            '금': [9, 10, 11], // 가을
            '수': [12, 1, 2] // 겨울
        };
        
        const favorable = favorableSeasons[dayElement] || [3, 4, 5];
        return favorable.includes(month) ? 10 : 0;
    }
    
    /**
     * 최적 시간대 추천
     */
    getBestTimeSlots(dateString, dayMaster, purpose) {
        // 일간별 길시(吉時)
        const timeSlots = [
            { time: '07:00-09:00', name: '辰時', activity: '집 청소, 짐 정리' },
            { time: '09:00-11:00', name: '巳時', activity: '이사 시작, 혼례 준비' },
            { time: '11:00-13:00', name: '午時', activity: '중요한 물건 옮기기' },
            { time: '13:00-15:00', name: '未時', activity: '가전제품 설치' },
            { time: '15:00-17:00', name: '申時', activity: '마무리 작업' }
        ];
        
        // 일간별 최적 시간 선정 (간단한 로직)
        const luckyHours = {
            '甲': [1, 3], // 巳時, 未時
            '乙': [1, 3],
            '丙': [0, 2], // 辰時, 午時
            '丁': [0, 2],
            '戊': [2, 4], // 午時, 申時
            '己': [2, 4],
            '庚': [1, 3],
            '辛': [1, 3],
            '壬': [0, 2],
            '癸': [0, 2]
        };
        
        const lucky = luckyHours[dayMaster] || [1, 3];
        
        return timeSlots.map((slot, index) => ({
            ...slot,
            rating: lucky.includes(index) ? 5 : 3,
            lucky: lucky.includes(index)
        }));
    }
    
    /**
     * 상세 이유 생성
     */
    getDetailedReasons(date, dayMaster, dayElement, purpose) {
        const reasons = [];
        
        // 기본 택일 이유
        reasons.push(`📅 **${date.type}**: ${date.reason}`);
        
        // 사주 맞춤 이유
        if (dayElement === '목') {
            reasons.push(`🌳 **목(木) 일간**: 봄철 이사가 성장과 발전을 가져옵니다`);
        } else if (dayElement === '화') {
            reasons.push(`🔥 **화(火) 일간**: 여름철 이사가 열정과 성공을 가져옵니다`);
        } else if (dayElement === '토') {
            reasons.push(`🏔️ **토(土) 일간**: 안정과 터전을 다지는 최고의 날`);
        } else if (dayElement === '금') {
            reasons.push(`⚙️ **금(金) 일간**: 가을철 이사가 재물운을 상승시킵니다`);
        } else if (dayElement === '수') {
            reasons.push(`💧 **수(水) 일간**: 겨울철 이사가 지혜와 통찰을 가져옵니다`);
        }
        
        // 목적별 이유
        if (purpose === 'moving') {
            reasons.push(`🏠 **입택**: 집안이 번창하고 가족 건강이 좋아집니다`);
            reasons.push(`💰 **재물운**: 3개월 내 금전운이 상승합니다`);
        } else {
            reasons.push(`💑 **혼례**: 백년해로하며 부부금슬이 매우 좋습니다`);
            reasons.push(`👶 **자손**: 귀한 자손을 얻게 됩니다`);
        }
        
        return reasons;
    }
    
    /**
     * 주의사항 생성
     */
    getCautions(dateString, purpose) {
        const cautions = [];
        
        if (purpose === 'moving') {
            cautions.push('⚠️ 이사 전날 집 청소와 소금물 닦기 필수');
            cautions.push('⚠️ 쌀, 된장, 소금을 먼저 들여놓으세요');
            cautions.push('⚠️ 첫 식사는 떡국이나 국수가 좋습니다');
        } else {
            cautions.push('⚠️ 예물 교환은 정오 전이 좋습니다');
            cautions.push('⚠️ 신부 화장은 밝은 색조로');
            cautions.push('⚠️ 하객 수는 홀수보다 짝수가 좋습니다');
        }
        
        return cautions;
    }
    
    /**
     * 준비사항 생성
     */
    getPreparation(dateString, purpose) {
        if (purpose === 'moving') {
            return {
                '1주일 전': ['이사 업체 예약', '전입신고 준비', '우편물 주소 변경'],
                '1일 전': ['집 청소', '소금물로 집안 닦기', '새 빗자루 준비'],
                '당일': ['쌀·된장·소금 먼저 들이기', '귀한 물건 직접 들고 가기', '첫 식사 준비'],
                '1주일 후': ['집들이 준비', '이웃 인사', '풍수 배치 점검']
            };
        } else {
            return {
                '3개월 전': ['예식장 예약', '청첩장 준비', '혼수 준비'],
                '1개월 전': ['식순 확정', '답례품 준비', '폐백 준비'],
                '1주일 전': ['리허설', '최종 확인', '신혼여행 준비'],
                '당일': ['예물 교환', '혼례 진행', '피로연']
            };
        }
    }
    
    /**
     * 혜택 생성
     */
    getBenefits(score, purpose) {
        const benefits = [];
        
        if (score >= 95) {
            benefits.push('⭐ 최상의 길일 - 모든 일이 순조롭게 진행됩니다');
            benefits.push('💰 재물운 대폭 상승 (6개월)');
            benefits.push('👨‍👩‍👧‍👦 가족 건강과 행복 보장');
        } else if (score >= 90) {
            benefits.push('⭐ 매우 좋은 길일 - 안정과 발전을 가져옵니다');
            benefits.push('💰 재물운 상승 (3개월)');
            benefits.push('👨‍👩‍👧‍👦 가족 화목');
        } else {
            benefits.push('⭐ 좋은 길일 - 무난하게 진행됩니다');
            benefits.push('💰 재물운 안정');
        }
        
        return benefits;
    }
    
    /**
     * 흉일 분석
     */
    analyzeBadDates(badDates, dayMaster) {
        return badDates.map(date => ({
            ...date,
            severity: '높음',
            alternativeAdvice: '이 날은 피하시고, 추천 길일 중에서 선택하세요'
        }));
    }
    
    /**
     * 사주 맞춤 조언
     */
    getSajuAdvice(dayMaster, dayElement, purpose) {
        const advice = [];
        
        // 일간별 조언
        if (dayMaster === '甲' || dayMaster === '乙') {
            advice.push('🌳 **목(木) 일간**: 봄철(3-5월) 이사가 가장 좋습니다');
            advice.push('📍 동쪽이나 동남쪽 방향의 집이 길합니다');
            advice.push('🎨 녹색, 청색 인테리어를 활용하세요');
        } else if (dayMaster === '丙' || dayMaster === '丁') {
            advice.push('🔥 **화(火) 일간**: 여름철(6-8월) 이사가 좋습니다');
            advice.push('📍 남쪽 방향의 집이 길합니다');
            advice.push('🎨 빨강, 보라색 인테리어를 활용하세요');
        } else if (dayMaster === '戊' || dayMaster === '己') {
            advice.push('🏔️ **토(土) 일간**: 환절기(3,6,9,12월) 이사가 좋습니다');
            advice.push('📍 중앙이나 남서쪽 방향이 길합니다');
            advice.push('🎨 노랑, 갈색 인테리어를 활용하세요');
        } else if (dayMaster === '庚' || dayMaster === '辛') {
            advice.push('⚙️ **금(金) 일간**: 가을철(9-11월) 이사가 좋습니다');
            advice.push('📍 서쪽이나 북서쪽 방향의 집이 길합니다');
            advice.push('🎨 흰색, 금색 인테리어를 활용하세요');
        } else {
            advice.push('💧 **수(水) 일간**: 겨울철(12-2월) 이사가 좋습니다');
            advice.push('📍 북쪽 방향의 집이 길합니다');
            advice.push('🎨 검정, 파랑 인테리어를 활용하세요');
        }
        
        return advice;
    }
    
    /**
     * 방향 풍수 조언
     */
    getDirectionAdvice(dayElement, purpose) {
        const directions = {
            '목': { best: '동쪽', avoid: '서쪽', color: '녹색/청색' },
            '화': { best: '남쪽', avoid: '북쪽', color: '빨강/보라' },
            '토': { best: '중앙/남서', avoid: '동쪽', color: '노랑/갈색' },
            '금': { best: '서쪽', avoid: '남쪽', color: '흰색/금색' },
            '수': { best: '북쪽', avoid: '중앙', color: '검정/파랑' }
        };
        
        const dir = directions[dayElement] || directions['목'];
        
        return {
            bestDirection: dir.best,
            avoidDirection: dir.avoid,
            luckyColor: dir.color,
            furnitureAdvice: [
                `침대는 ${dir.best} 방향에 배치하세요`,
                '책상은 벽을 등지고 문을 바라보게 놓으세요',
                '거울은 침대와 마주 보지 않게 하세요',
                `${dir.color} 계열의 소품을 활용하세요`
            ]
        };
    }
    
    /**
     * 체크리스트 조언
     */
    getChecklistAdvice(purpose) {
        if (purpose === 'moving') {
            return {
                '이사 전날': [
                    '✓ 집 청소 (특히 화장실과 부엌)',
                    '✓ 소금물로 집안 곳곳 닦기',
                    '✓ 새 빗자루와 쓰레받기 준비',
                    '✓ 쌀, 된장, 소금, 설탕 준비'
                ],
                '이사 당일': [
                    '✓ 쌀·된장·소금을 먼저 들여놓기',
                    '✓ 귀한 물건(도장, 통장)은 직접 들고 가기',
                    '✓ 현관부터 시작해서 안쪽으로 들여놓기',
                    '✓ 첫 식사는 떡국이나 국수로 (길게 사는 의미)'
                ],
                '이사 후 1주일': [
                    '✓ 집들이 준비 (떡, 과일, 음식)',
                    '✓ 이웃에게 인사 돌리기',
                    '✓ 전입신고 완료',
                    '✓ 방향별 풍수 배치 점검'
                ]
            };
        } else {
            return {
                '혼례 3개월 전': [
                    '✓ 예식장 예약',
                    '✓ 청첩장 제작',
                    '✓ 혼수 및 예물 준비',
                    '✓ 신혼집 계약'
                ],
                '혼례 1개월 전': [
                    '✓ 식순 확정',
                    '✓ 답례품 준비',
                    '✓ 폐백 준비',
                    '✓ 사회자 섭외'
                ],
                '혼례 당일': [
                    '✓ 예물 교환 (정오 전)',
                    '✓ 혼례 진행',
                    '✓ 폐백 올리기',
                    '✓ 피로연 진행'
                ]
            };
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaekilPremiumEngine;
} else if (typeof window !== 'undefined') {
    window.TaekilPremiumEngine = TaekilPremiumEngine;
}
