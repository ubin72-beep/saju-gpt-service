/**
 * Love Fortune Premium Engine (맞춤 연애운 프리미엄 분석 엔진)
 * Version: 2.0.0
 * Date: 2026-01-30
 * Price: ₩3,900
 * Features: 12개월 연애운 그래프, 이상형 분석, 궁합 분석, 연애 타이밍
 */

class LovePremiumEngine {
    constructor() {
        this.dayMasters = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
        this.elements = {
            '갑': '목', '을': '목',
            '병': '화', '정': '화',
            '무': '토', '기': '토',
            '경': '금', '신': '금',
            '임': '수', '계': '수'
        };
        this.loveTypes = {
            '갑': '리더십형', '을': '조력자형',
            '병': '열정형', '정': '섬세형',
            '무': '안정형', '기': '배려형',
            '경': '원칙형', '신': '감각형',
            '임': '자유형', '계': '직관형'
        };
    }

    /**
     * 12개월 연애운 그래프 데이터 생성
     */
    getMonthlyLoveFortune(dayMaster) {
        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        const baseScores = {
            '갑': [75, 68, 82, 88, 92, 78, 65, 72, 85, 90, 82, 76],
            '을': [70, 78, 85, 80, 72, 88, 92, 85, 78, 70, 75, 82],
            '병': [88, 85, 78, 72, 68, 75, 85, 90, 92, 88, 80, 85],
            '정': [72, 80, 88, 90, 85, 78, 72, 68, 75, 82, 88, 90],
            '무': [78, 75, 72, 78, 85, 90, 88, 82, 78, 75, 72, 78],
            '기': [82, 88, 90, 85, 78, 72, 75, 78, 82, 88, 90, 85],
            '경': [68, 72, 75, 82, 88, 92, 90, 85, 78, 72, 68, 75],
            '신': [90, 92, 88, 78, 72, 68, 72, 75, 82, 88, 92, 90],
            '임': [85, 78, 72, 68, 75, 82, 88, 92, 90, 85, 78, 72],
            '계': [72, 68, 75, 82, 90, 92, 88, 85, 78, 72, 68, 75]
        };

        const scores = baseScores[dayMaster] || baseScores['갑'];
        
        return months.map((month, index) => {
            const score = scores[index];
            let status = '보통';
            let advice = '';
            let color = '#fbbf24';

            if (score >= 85) {
                status = '매우 좋음';
                advice = '적극적으로 만남을 추진하세요.';
                color = '#10b981';
            } else if (score >= 75) {
                status = '좋음';
                advice = '좋은 인연을 만날 수 있습니다.';
                color = '#3b82f6';
            } else if (score >= 65) {
                status = '보통';
                advice = '차분하게 관계를 발전시키세요.';
                color = '#fbbf24';
            } else {
                status = '주의';
                advice = '서두르지 말고 신중하게 접근하세요.';
                color = '#ef4444';
            }

            return { month, score, status, advice, color };
        });
    }

    /**
     * 이상형 분석 (일간 기반)
     */
    getIdealTypeAnalysis(dayMaster, gender) {
        const idealTypes = {
            '갑': {
                male: {
                    personality: '부드럽고 배려심 많은 여성',
                    appearance: '차분하고 우아한 스타일',
                    compatibility: '을일간, 기일간 여성과 궁합이 좋음',
                    advice: '강한 리더십을 부드럽게 받아줄 수 있는 파트너가 이상적입니다.'
                },
                female: {
                    personality: '든든하고 리더십 있는 남성',
                    appearance: '카리스마 있고 믿음직한 외모',
                    compatibility: '병일간, 무일간 남성과 궁합이 좋음',
                    advice: '강한 자존심을 인정해주고 존중해주는 파트너가 필요합니다.'
                }
            },
            '을': {
                male: {
                    personality: '활발하고 긍정적인 여성',
                    appearance: '밝고 생기 있는 스타일',
                    compatibility: '병일간, 정일간 여성과 궁합이 좋음',
                    advice: '부드러운 성격을 이해하고 함께 성장할 수 있는 파트너가 이상적입니다.'
                },
                female: {
                    personality: '배려심 많고 섬세한 남성',
                    appearance: '부드럽고 지적인 외모',
                    compatibility: '갑일간, 무일간 남성과 궁합이 좋음',
                    advice: '섬세한 감성을 이해하고 존중해주는 파트너가 필요합니다.'
                }
            },
            '병': {
                male: {
                    personality: '차분하고 냉정한 여성',
                    appearance: '지적이고 세련된 스타일',
                    compatibility: '임일간, 계일간 여성과 궁합이 좋음',
                    advice: '열정적인 성격을 조절해줄 수 있는 이성적인 파트너가 이상적입니다.'
                },
                female: {
                    personality: '따뜻하고 포용력 있는 남성',
                    appearance: '듬직하고 안정감 있는 외모',
                    compatibility: '무일간, 기일간 남성과 궁합이 좋음',
                    advice: '강한 열정을 받아줄 수 있는 넉넉한 파트너가 필요합니다.'
                }
            },
            '정': {
                male: {
                    personality: '밝고 솔직한 여성',
                    appearance: '자연스럽고 편안한 스타일',
                    compatibility: '을일간, 기일간 여성과 궁합이 좋음',
                    advice: '섬세한 감성을 이해하고 함께 공감할 수 있는 파트너가 이상적입니다.'
                },
                female: {
                    personality: '섬세하고 감각적인 남성',
                    appearance: '세련되고 감각적인 외모',
                    compatibility: '갑일간, 경일간 남성과 궁합이 좋음',
                    advice: '예술적 감각을 공유하고 존중해주는 파트너가 필요합니다.'
                }
            },
            '무': {
                male: {
                    personality: '활발하고 사교적인 여성',
                    appearance: '화사하고 밝은 스타일',
                    compatibility: '병일간, 정일간 여성과 궁합이 좋음',
                    advice: '안정적인 성격과 균형을 맞출 수 있는 활동적인 파트너가 이상적입니다.'
                },
                female: {
                    personality: '든든하고 책임감 있는 남성',
                    appearance: '믿음직하고 안정적인 외모',
                    compatibility: '갑일간, 병일간 남성과 궁합이 좋음',
                    advice: '안정을 추구하는 성향을 이해하고 함께 만들어갈 수 있는 파트너가 필요합니다.'
                }
            },
            '기': {
                male: {
                    personality: '지적이고 논리적인 여성',
                    appearance: '단정하고 깔끔한 스타일',
                    compatibility: '갑일간, 경일간 여성과 궁합이 좋음',
                    advice: '세심한 배려를 알아주고 감사할 수 있는 파트너가 이상적입니다.'
                },
                female: {
                    personality: '따뜻하고 다정한 남성',
                    appearance: '부드럽고 온화한 외모',
                    compatibility: '병일간, 무일간 남성과 궁합이 좋음',
                    advice: '배려심을 인정하고 함께 행복을 나눌 수 있는 파트너가 필요합니다.'
                }
            },
            '경': {
                male: {
                    personality: '부드럽고 여성스러운 여성',
                    appearance: '우아하고 고급스러운 스타일',
                    compatibility: '을일간, 기일간 여성과 궁합이 좋음',
                    advice: '강한 원칙을 이해하고 존중해줄 수 있는 유연한 파트너가 이상적입니다.'
                },
                female: {
                    personality: '원칙 있고 정직한 남성',
                    appearance: '깔끔하고 단정한 외모',
                    compatibility: '갑일간, 무일간 남성과 궁합이 좋음',
                    advice: '원칙과 기준을 공유하고 함께 지켜갈 수 있는 파트너가 필요합니다.'
                }
            },
            '신': {
                male: {
                    personality: '감각적이고 예술적인 여성',
                    appearance: '트렌디하고 감각적인 스타일',
                    compatibility: '정일간, 기일간 여성과 궁합이 좋음',
                    advice: '빠른 변화와 감각을 함께 즐길 수 있는 파트너가 이상적입니다.'
                },
                female: {
                    personality: '감각적이고 센스 있는 남성',
                    appearance: '세련되고 스타일리시한 외모',
                    compatibility: '을일간, 정일간 남성과 궁합이 좋음',
                    advice: '감각과 취향을 공유하고 함께 즐길 수 있는 파트너가 필요합니다.'
                }
            },
            '임': {
                male: {
                    personality: '차분하고 안정적인 여성',
                    appearance: '편안하고 자연스러운 스타일',
                    compatibility: '무일간, 기일간 여성과 궁합이 좋음',
                    advice: '자유로운 성격을 이해하고 함께 모험할 수 있는 파트너가 이상적입니다.'
                },
                female: {
                    personality: '자유롭고 개방적인 남성',
                    appearance: '편안하고 활동적인 외모',
                    compatibility: '병일간, 갑일간 남성과 궁합이 좋음',
                    advice: '자유와 독립을 존중하면서도 함께할 수 있는 파트너가 필요합니다.'
                }
            },
            '계': {
                male: {
                    personality: '밝고 긍정적인 여성',
                    appearance: '생기 있고 활발한 스타일',
                    compatibility: '병일간, 무일간 여성과 궁합이 좋음',
                    advice: '직관적인 판단을 신뢰하고 함께 흐름을 탈 수 있는 파트너가 이상적입니다.'
                },
                female: {
                    personality: '직관적이고 통찰력 있는 남성',
                    appearance: '지적이고 카리스마 있는 외모',
                    compatibility: '갑일간, 을일간 남성과 궁합이 좋음',
                    advice: '깊이 있는 대화와 정신적 교감을 나눌 수 있는 파트너가 필요합니다.'
                }
            }
        };

        const data = idealTypes[dayMaster] || idealTypes['갑'];
        return gender === 'male' ? data.male : data.female;
    }

    /**
     * 연애 타이밍 분석 (2026년 기준)
     */
    getLoveTiming(dayMaster) {
        const timings = {
            '갑': [
                { period: '2월 중순 ~ 3월 말', reason: '인성운 상승, 매력 증가', probability: 92 },
                { period: '5월 초 ~ 6월 중순', reason: '식상운 발현, 표현력 극대화', probability: 88 },
                { period: '9월 초 ~ 10월 말', reason: '재성운 강화, 인연운 최고조', probability: 90 }
            ],
            '을': [
                { period: '3월 초 ~ 4월 중순', reason: '비견운 상승, 자신감 증가', probability: 85 },
                { period: '6월 말 ~ 8월 초', reason: '식상운 최고조, 소통 원활', probability: 92 },
                { period: '10월 중순 ~ 11월 말', reason: '재성운 강화, 결실 시기', probability: 88 }
            ],
            '병': [
                { period: '1월 초 ~ 2월 말', reason: '인수운 발현, 카리스마 증가', probability: 90 },
                { period: '4월 초 ~ 5월 중순', reason: '비견운 상승, 적극성 발휘', probability: 85 },
                { period: '8월 말 ~ 10월 초', reason: '재성운 극대화, 성과 시기', probability: 92 }
            ],
            '정': [
                { period: '2월 초 ~ 3월 중순', reason: '식상운 발현, 감성 풍부', probability: 88 },
                { period: '5월 말 ~ 7월 초', reason: '재성운 상승, 인연 확대', probability: 90 },
                { period: '9월 중순 ~ 11월 초', reason: '관성운 강화, 안정화 시기', probability: 85 }
            ],
            '무': [
                { period: '1월 중순 ~ 3월 초', reason: '인성운 상승, 내면 성장', probability: 85 },
                { period: '4월 말 ~ 6월 중순', reason: '비견운 발현, 자신감 증가', probability: 88 },
                { period: '8월 초 ~ 9월 말', reason: '재성운 극대화, 결실 시기', probability: 92 }
            ],
            '기': [
                { period: '2월 말 ~ 4월 중순', reason: '식상운 발현, 표현력 증가', probability: 90 },
                { period: '6월 초 ~ 7월 말', reason: '재성운 상승, 매력 발산', probability: 92 },
                { period: '10월 초 ~ 11월 중순', reason: '관성운 강화, 안정화', probability: 88 }
            ],
            '경': [
                { period: '1월 말 ~ 3월 중순', reason: '인성운 상승, 지혜 증가', probability: 88 },
                { period: '5월 초 ~ 6월 말', reason: '비견운 발현, 결단력 상승', probability: 85 },
                { period: '8월 중순 ~ 10월 초', reason: '재성운 극대화, 성과 시기', probability: 92 }
            ],
            '신': [
                { period: '2월 초 ~ 3월 말', reason: '식상운 발현, 감각 예민', probability: 92 },
                { period: '5월 중순 ~ 7월 초', reason: '재성운 상승, 기회 확대', probability: 90 },
                { period: '9월 말 ~ 11월 중순', reason: '관성운 강화, 관계 안정', probability: 88 }
            ],
            '임': [
                { period: '1월 초 ~ 2월 중순', reason: '인성운 상승, 직관력 증가', probability: 90 },
                { period: '4월 말 ~ 6월 초', reason: '비견운 발현, 자유로움 극대화', probability: 85 },
                { period: '8월 초 ~ 9월 중순', reason: '재성운 강화, 인연 확대', probability: 92 }
            ],
            '계': [
                { period: '2월 중순 ~ 4월 초', reason: '식상운 발현, 감성 풍부', probability: 88 },
                { period: '6월 말 ~ 8월 중순', reason: '재성운 상승, 매력 최고조', probability: 92 },
                { period: '10월 말 ~ 12월 초', reason: '관성운 강화, 결실 시기', probability: 90 }
            ]
        };

        return timings[dayMaster] || timings['갑'];
    }

    /**
     * 연애 스타일 분석
     */
    getLoveStyle(dayMaster) {
        const styles = {
            '갑': {
                type: '리더십형 연애',
                strength: ['결단력', '책임감', '주도성', '보호 본능'],
                weakness: ['고집', '권위적', '타협 부족'],
                advice: '상대방의 의견을 경청하고 존중하는 자세가 필요합니다.',
                compatibility_score: 85
            },
            '을': {
                type: '조력자형 연애',
                strength: ['배려심', '유연성', '공감 능력', '헌신'],
                weakness: ['우유부단', '의존성', '자기주장 부족'],
                advice: '자신의 의견을 분명히 표현하는 연습이 필요합니다.',
                compatibility_score: 88
            },
            '병': {
                type: '열정형 연애',
                strength: ['열정', '활력', '긍정성', '솔직함'],
                weakness: ['급함', '감정 기복', '인내심 부족'],
                advice: '차분하게 상대방의 속도를 맞춰주는 여유가 필요합니다.',
                compatibility_score: 82
            },
            '정': {
                type: '섬세형 연애',
                strength: ['감성', '섬세함', '예술성', '깊이'],
                weakness: ['예민함', '걱정', '과도한 분석'],
                advice: '때로는 감정에 솔직하게 반응하는 용기가 필요합니다.',
                compatibility_score: 90
            },
            '무': {
                type: '안정형 연애',
                strength: ['안정성', '신뢰', '포용력', '현실성'],
                weakness: ['변화 거부', '보수성', '둔감함'],
                advice: '새로운 경험에 열린 마음을 갖는 것이 관계 발전에 도움됩니다.',
                compatibility_score: 88
            },
            '기': {
                type: '배려형 연애',
                strength: ['세심함', '희생', '이해심', '인내'],
                weakness: ['자기희생', '과도한 배려', '표현 부족'],
                advice: '자신의 욕구도 중요하게 여기고 표현하는 것이 필요합니다.',
                compatibility_score: 92
            },
            '경': {
                type: '원칙형 연애',
                strength: ['정직', '원칙', '확고함', '결단력'],
                weakness: ['융통성 부족', '엄격함', '냉정함'],
                advice: '때로는 규칙보다 감정을 우선하는 유연성이 필요합니다.',
                compatibility_score: 80
            },
            '신': {
                type: '감각형 연애',
                strength: ['감각', '센스', '매력', '변화'],
                weakness: ['변덕', '피상적', '지속력 부족'],
                advice: '깊이 있는 관계를 위한 인내와 노력이 필요합니다.',
                compatibility_score: 85
            },
            '임': {
                type: '자유형 연애',
                strength: ['자유로움', '개방성', '모험', '직관'],
                weakness: ['불안정', '책임 회피', '변덕'],
                advice: '관계에서의 책임감과 안정성을 키우는 것이 필요합니다.',
                compatibility_score: 78
            },
            '계': {
                type: '직관형 연애',
                strength: ['직관', '통찰력', '감수성', '깊이'],
                weakness: ['불안정', '변화 추구', '몽상적'],
                advice: '현실적인 기반 위에서 관계를 발전시키는 것이 중요합니다.',
                compatibility_score: 82
            }
        };

        return styles[dayMaster] || styles['갑'];
    }

    /**
     * 종합 연애운 분석
     */
    generateFullAnalysis(name, birthDate, gender, dayMaster) {
        return {
            name,
            birthDate,
            gender,
            dayMaster,
            element: this.elements[dayMaster],
            loveType: this.loveTypes[dayMaster],
            monthlyFortune: this.getMonthlyLoveFortune(dayMaster),
            idealType: this.getIdealTypeAnalysis(dayMaster, gender),
            timing: this.getLoveTiming(dayMaster),
            style: this.getLoveStyle(dayMaster),
            generatedAt: new Date().toLocaleString('ko-KR')
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LovePremiumEngine;
}
