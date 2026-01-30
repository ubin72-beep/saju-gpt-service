/**
 * Tojeong Premium Engine (토정비결 상세 프리미엄 분석 엔진)
 * Version: 2.0.0
 * Date: 2026-01-30
 * Price: ₩3,900
 * Features: 12개월 상세 운세, 사업운, 재물운, 건강운, 대인관계운
 */

class TojeongPremiumEngine {
    constructor() {
        this.fortuneCategories = {
            business: '사업운',
            wealth: '재물운',
            health: '건강운',
            relationship: '대인관계운',
            career: '직장운',
            study: '학업운'
        };

        // 12개월 운세 데이터베이스 (출생년도의 끝자리에 따라 분류)
        this.monthlyFortuneData = {
            0: [ // 0, 10, 20, ...
                {month: 1, score: 88, fortune: '매우 좋음', advice: '새해의 시작이 밝습니다. 목표를 세우고 적극적으로 추진하세요.'},
                {month: 2, score: 82, fortune: '좋음', advice: '인간관계가 활발해집니다. 소통에 힘쓰세요.'},
                {month: 3, score: 75, fortune: '보통', advice: '차분히 기다리는 자세가 필요합니다.'},
                {month: 4, score: 90, fortune: '매우 좋음', advice: '큰 기회가 찾아올 수 있습니다. 놓치지 마세요.'},
                {month: 5, score: 85, fortune: '좋음', advice: '재물운이 상승합니다. 투자 검토 가능.'},
                {month: 6, score: 70, fortune: '보통', advice: '안정을 추구하는 것이 좋습니다.'},
                {month: 7, score: 65, fortune: '주의', advice: '조급한 마음을 버리고 신중하게 행동하세요.'},
                {month: 8, score: 78, fortune: '좋음', advice: '꾸준함이 빛을 발하는 시기입니다.'},
                {month: 9, score: 92, fortune: '매우 좋음', advice: '성과를 거둘 수 있는 최적의 시기입니다.'},
                {month: 10, score: 80, fortune: '좋음', advice: '주변의 도움을 받을 수 있습니다.'},
                {month: 11, score: 73, fortune: '보통', advice: '마무리에 집중하는 것이 좋습니다.'},
                {month: 12, score: 88, fortune: '매우 좋음', advice: '한 해를 잘 마무리하고 새로운 해를 준비하세요.'}
            ],
            // 1-9까지 유사한 패턴으로 정의 (간단히 0번 패턴 변형)
        };

        // 나머지 번호들 초기화
        for (let i = 1; i <= 9; i++) {
            this.monthlyFortuneData[i] = this.monthlyFortuneData[0].map((item, index) => {
                return {
                    ...item,
                    score: Math.max(60, Math.min(95, item.score + (Math.random() * 10 - 5)))
                };
            });
        }
    }

    /**
     * 출생년도의 끝자리로 운세 그룹 결정
     */
    getFortuneGroup(birthYear) {
        return birthYear % 10;
    }

    /**
     * 12개월 종합 운세 생성
     */
    getMonthlyFortune(birthYear) {
        const group = this.getFortuneGroup(birthYear);
        const data = this.monthlyFortuneData[group];

        return data.map(item => {
            let color = '#fbbf24';
            if (item.score >= 85) color = '#10b981';
            else if (item.score >= 75) color = '#3b82f6';
            else if (item.score < 70) color = '#ef4444';

            return {
                ...item,
                color,
                recommendation: this.getMonthRecommendation(item.month, item.score)
            };
        });
    }

    /**
     * 월별 구체적 추천사항
     */
    getMonthRecommendation(month, score) {
        const recommendations = {
            high: [
                '새로운 도전을 시작하기 좋은 시기입니다.',
                '중요한 결정을 내리기에 적합합니다.',
                '목표 달성을 위해 적극적으로 나서세요.',
                '주변의 협력을 구하면 큰 성과를 거둘 수 있습니다.'
            ],
            medium: [
                '차분하게 현재에 집중하는 것이 좋습니다.',
                '계획을 다시 점검하고 보완하세요.',
                '인내심을 가지고 기다리면 좋은 결과가 올 것입니다.',
                '작은 성취에도 만족하며 꾸준히 나아가세요.'
            ],
            low: [
                '무리한 일은 피하고 안정을 추구하세요.',
                '건강과 휴식에 신경 쓰는 것이 중요합니다.',
                '큰 결정은 미루고 현상 유지에 집중하세요.',
                '지출을 줄이고 저축에 힘쓰세요.'
            ]
        };

        let level = 'medium';
        if (score >= 85) level = 'high';
        else if (score < 70) level = 'low';

        const list = recommendations[level];
        return list[month % list.length];
    }

    /**
     * 사업운 상세 분석
     */
    getBusinessFortune(birthYear) {
        const group = this.getFortuneGroup(birthYear);
        const baseScore = 70 + (group * 2);

        return {
            score: baseScore,
            period1: {
                title: '1분기 (1-3월)',
                score: baseScore + 10,
                advice: '새로운 사업 아이템을 구상하기 좋은 시기입니다. 시장 조사와 준비에 집중하세요.'
            },
            period2: {
                title: '2분기 (4-6월)',
                score: baseScore + 15,
                advice: '본격적으로 실행에 옮기기 좋습니다. 파트너십 구축이 중요합니다.'
            },
            period3: {
                title: '3분기 (7-9월)',
                score: baseScore + 5,
                advice: '안정기입니다. 내실을 다지고 기존 사업을 견고히 하세요.'
            },
            period4: {
                title: '4분기 (10-12월)',
                score: baseScore + 12,
                advice: '성과를 거두고 다음 해를 준비하는 시기입니다. 결산과 계획 수립에 집중하세요.'
            }
        };
    }

    /**
     * 재물운 상세 분석
     */
    getWealthFortune(birthYear) {
        const group = this.getFortuneGroup(birthYear);
        
        return {
            score: 75 + (group * 1.5),
            income: {
                salary: group % 2 === 0 ? '상승' : '안정',
                sideIncome: group >= 5 ? '증가 가능' : '유지',
                investment: group <= 4 ? '주의 필요' : '긍정적'
            },
            expenses: {
                fixed: '안정적',
                variable: group >= 6 ? '관리 필요' : '적정',
                emergency: group % 3 === 0 ? '대비 필요' : '양호'
            },
            advice: {
                saving: `월 수입의 ${20 + group}%를 저축하는 것을 추천합니다.`,
                investment: group >= 5 ? '안정적인 투자처를 고려하세요.' : '투자보다 저축에 집중하세요.',
                spending: '불필요한 지출을 줄이고 계획적인 소비를 실천하세요.'
            }
        };
    }

    /**
     * 건강운 상세 분석
     */
    getHealthFortune(birthYear) {
        const group = this.getFortuneGroup(birthYear);
        
        const concerns = [
            {area: '소화기', level: group <= 3 ? '주의' : '양호'},
            {area: '호흡기', level: group >= 4 && group <= 6 ? '관리 필요' : '양호'},
            {area: '근골격계', level: group >= 7 ? '주의' : '양호'},
            {area: '정신 건강', level: '관리 필요'}
        ];

        return {
            score: 80 - (group * 1),
            concerns,
            monthly: {
                spring: '환절기 건강 관리에 유의하세요. 규칙적인 운동이 중요합니다.',
                summer: '수분 섭취를 충분히 하고 과로를 피하세요.',
                fall: '면역력 강화에 신경 쓰세요. 충분한 휴식이 필요합니다.',
                winter: '보온에 신경 쓰고 실내 활동을 늘리세요.'
            },
            advice: [
                '규칙적인 수면 패턴을 유지하세요.',
                '주 3회 이상 30분 이상 운동을 권장합니다.',
                '균형 잡힌 식단을 유지하고 과식을 피하세요.',
                '스트레스 관리를 위해 취미 활동이나 명상을 실천하세요.'
            ]
        };
    }

    /**
     * 대인관계운 상세 분석
     */
    getRelationshipFortune(birthYear) {
        const group = this.getFortuneGroup(birthYear);
        
        return {
            score: 85 - (group * 0.5),
            family: {
                score: 90,
                advice: '가족과의 소통 시간을 늘리세요. 이해와 배려가 중요합니다.'
            },
            friends: {
                score: 80 + group,
                advice: group >= 5 ? '새로운 인연이 찾아올 수 있습니다.' : '기존 관계를 돈독히 하세요.'
            },
            work: {
                score: 75 + (group * 1.5),
                advice: '상사 및 동료와의 협력이 중요합니다. 적극적인 소통을 실천하세요.'
            },
            love: {
                score: 70 + (group * 2),
                advice: group % 2 === 0 ? '솔로라면 좋은 만남이 있을 수 있습니다.' : '기존 관계를 더욱 깊게 발전시키세요.'
            },
            advice: [
                '경청하는 자세를 가지세요.',
                '감사의 마음을 자주 표현하세요.',
                '갈등이 생기면 빠르게 해결하려 노력하세요.',
                '작은 약속도 소중히 여기고 지키세요.'
            ]
        };
    }

    /**
     * 길일/흉일 분석 (월별)
     */
    getLuckyDays(birthYear) {
        const group = this.getFortuneGroup(birthYear);
        const months = [];

        for (let month = 1; month <= 12; month++) {
            const luckyDays = [];
            const unluckyDays = [];

            // 길일 생성 (월마다 3-5일)
            for (let i = 0; i < 4; i++) {
                const day = (group + i * 7 + month * 3) % 28 + 1;
                luckyDays.push(day);
            }

            // 흉일 생성 (월마다 2-3일)
            for (let i = 0; i < 3; i++) {
                const day = (group * 2 + i * 9 + month * 2) % 28 + 1;
                unluckyDays.push(day);
            }

            months.push({
                month,
                luckyDays: luckyDays.sort((a, b) => a - b),
                unluckyDays: unluckyDays.sort((a, b) => a - b)
            });
        }

        return months;
    }

    /**
     * 종합 토정비결 분석
     */
    generateFullAnalysis(name, birthYear) {
        return {
            name,
            birthYear,
            fortuneGroup: this.getFortuneGroup(birthYear),
            monthlyFortune: this.getMonthlyFortune(birthYear),
            business: this.getBusinessFortune(birthYear),
            wealth: this.getWealthFortune(birthYear),
            health: this.getHealthFortune(birthYear),
            relationship: this.getRelationshipFortune(birthYear),
            luckyDays: this.getLuckyDays(birthYear),
            generatedAt: new Date().toLocaleString('ko-KR')
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TojeongPremiumEngine;
}
