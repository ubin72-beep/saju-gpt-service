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
     * 일간별 상세 직업 추천 (신규 함수)
     */
    getCareerRecommendations(dayMaster) {
        const stemElement = this.elements[dayMaster];
        const stemChar = this.getStemCharacteristics(dayMaster);
        
        // 일간별 맞춤 직업 추천
        const detailedCareers = this.getDetailedCareersByDayMaster(dayMaster);
        
        return {
            dayMaster: dayMaster,
            element: stemElement,
            title: stemChar.title,
            personality: stemChar.personality,
            keywords: stemChar.keywords,
            best: detailedCareers,
            strengths: stemChar.strengths,
            weaknesses: stemChar.weaknesses
        };
    }
    
    /**
     * 일간별 상세 직업 데이터 (10천간)
     */
    getDetailedCareersByDayMaster(dayMaster) {
        const careerData = {
            '甲': [
                { career: 'CEO/창업가', score: 95, reason: '타고난 리더십과 개척정신으로 새로운 사업을 시작하고 조직을 이끄는 능력이 탁월합니다.', field: '경영/비즈니스', traits: ['리더십', '추진력', '독립심'] },
                { career: '프로젝트 매니저', score: 92, reason: '강한 책임감과 조직력으로 대규모 프로젝트를 성공적으로 이끌 수 있습니다.', field: 'IT/관리', traits: ['조직력', '결단력', '책임감'] },
                { career: '변호사/법무사', score: 90, reason: '정직하고 원칙을 중시하는 성격으로 법률 분야에서 뛰어난 역량을 발휘합니다.', field: '법률', traits: ['정의감', '논리력', '원칙'] },
                { career: '건축가/토목 엔지니어', score: 88, reason: '큰 나무처럼 든든한 구조물을 설계하고 건설하는 일에 적합합니다.', field: '건설/건축', traits: ['구조적 사고', '안정성', '창의성'] },
                { career: '대학교수/연구원', score: 85, reason: '깊이 있는 연구와 후학 양성을 통해 사회에 기여하는 일에 보람을 느낍니다.', field: '교육/연구', traits: ['전문성', '책임감', '통찰력'] },
                { career: '임원/관리자', score: 83, reason: '조직의 방향을 제시하고 팀을 이끄는 관리 업무에 탁월한 능력을 보입니다.', field: '경영/관리', traits: ['리더십', '전략', '조직력'] }
            ],
            '乙': [
                { career: '디자이너/아트디렉터', score: 95, reason: '섬세한 감각과 예술적 감성으로 아름다운 작품을 창조합니다.', field: '예술/디자인', traits: ['감성', '창의성', '섬세함'] },
                { career: 'UX/UI 기획자', score: 92, reason: '사용자의 마음을 이해하고 유연하게 대응하는 능력이 뛰어납니다.', field: 'IT/기획', traits: ['공감능력', '유연성', '분석력'] },
                { career: '상담사/심리치료사', score: 90, reason: '타인의 감정을 섬세하게 이해하고 배려하는 능력이 탁월합니다.', field: '상담/심리', traits: ['공감능력', '배려', '인내심'] },
                { career: '패션 디자이너', score: 88, reason: '유연한 사고와 예술적 감각으로 트렌드를 선도합니다.', field: '패션/의류', traits: ['트렌드 감각', '창의성', '섬세함'] },
                { career: '원예가/조경사', score: 85, reason: '식물을 다루고 자연과 조화를 이루는 일에 천부적인 재능이 있습니다.', field: '농업/원예', traits: ['자연친화', '섬세함', '인내심'] },
                { career: '작가/카피라이터', score: 83, reason: '섬세한 감성을 글로 표현하는 능력이 뛰어납니다.', field: '문학/광고', traits: ['표현력', '감성', '창의성'] }
            ],
            '丙': [
                { career: '연예인/방송인', score: 95, reason: '태양처럼 밝은 에너지와 카리스마로 대중의 사랑을 받습니다.', field: '방송/연예', traits: ['카리스마', '표현력', '대중성'] },
                { career: '마케팅 디렉터', score: 92, reason: '열정적인 추진력과 창의성으로 시장을 선도하는 전략을 수립합니다.', field: '마케팅/광고', traits: ['창의성', '추진력', '전략'] },
                { career: '영업 관리자', score: 90, reason: '밝은 에너지와 설득력으로 높은 성과를 달성합니다.', field: '영업/세일즈', traits: ['설득력', '에너지', '친화력'] },
                { career: '이벤트 기획자', score: 88, reason: '활동적이고 창의적인 성격으로 성공적인 이벤트를 기획하고 실행합니다.', field: '기획/이벤트', traits: ['창의성', '추진력', '기획력'] },
                { career: '스타트업 대표', score: 85, reason: '열정과 도전정신으로 새로운 비즈니스를 시작하고 성장시킵니다.', field: '창업/경영', traits: ['도전정신', '열정', '추진력'] },
                { career: '영화감독/PD', score: 83, reason: '강한 창의성과 표현력으로 작품을 만들어냅니다.', field: '영상/제작', traits: ['창의성', '리더십', '표현력'] }
            ],
            '丁': [
                { career: '교사/강사', score: 95, reason: '따뜻한 마음으로 학생들을 가르치고 이끄는 일에 천직을 느낍니다.', field: '교육', traits: ['배려', '헌신', '인내심'] },
                { career: '간호사/의료인', score: 92, reason: '환자를 돌보고 치료하는 일에 깊은 보람을 느낍니다.', field: '의료/간호', traits: ['배려', '헌신', '섬세함'] },
                { career: '사회복지사', score: 90, reason: '약자를 돕고 사회에 기여하는 일에 정의감을 발휘합니다.', field: '복지/NGO', traits: ['정의감', '헌신', '공감능력'] },
                { career: '요리사/셰프', score: 88, reason: '음식을 통해 사람들에게 따뜻함과 행복을 선사합니다.', field: '요식/외식', traits: ['섬세함', '창의성', '정성'] },
                { career: '예술가/화가', score: 85, reason: '감성적이고 예술적인 표현을 통해 작품을 만들어냅니다.', field: '예술/미술', traits: ['감성', '예술성', '표현력'] },
                { career: '인테리어 디자이너', score: 83, reason: '따뜻하고 편안한 공간을 만드는 일에 재능이 있습니다.', field: '디자인/인테리어', traits: ['감성', '섬세함', '창의성'] }
            ],
            '戊': [
                { career: '부동산 전문가', score: 95, reason: '토지와 부동산에 대한 이해가 깊고 안정적인 투자 판단을 합니다.', field: '부동산', traits: ['안정성', '신뢰', '분석력'] },
                { career: '금융 애널리스트', score: 92, reason: '신중하고 실용적인 분석으로 안전한 투자 전략을 수립합니다.', field: '금융/투자', traits: ['분석력', '신중함', '안정성'] },
                { career: '회계사/세무사', score: 90, reason: '꼼꼼하고 정확한 업무 처리로 신뢰를 얻습니다.', field: '회계/세무', traits: ['정확성', '신뢰', '꼼꼼함'] },
                { career: '건설 현장 관리자', score: 88, reason: '든든하고 안정적인 구조물을 만드는 일에 적합합니다.', field: '건설/토목', traits: ['안정성', '책임감', '관리력'] },
                { career: '보험 설계사', score: 85, reason: '고객의 안정적인 미래를 설계하는 일에 보람을 느낍니다.', field: '보험/금융', traits: ['신뢰', '안정성', '설득력'] },
                { career: '농업 경영인', score: 83, reason: '땅과 자연을 활용한 안정적인 사업에 재능이 있습니다.', field: '농업/경영', traits: ['실용성', '인내심', '안정성'] }
            ],
            '己': [
                { career: '행정 공무원', score: 95, reason: '꼼꼼하고 성실한 업무 처리로 공공 서비스를 제공합니다.', field: '공무원/행정', traits: ['성실함', '꼼꼼함', '봉사정신'] },
                { career: '비서/사무관리자', score: 92, reason: '섬세한 배려와 지원으로 조직의 효율성을 높입니다.', field: '사무/지원', traits: ['배려', '꼼꼼함', '지원력'] },
                { career: '약사', score: 90, reason: '정확하고 세심하게 약을 조제하고 상담합니다.', field: '의료/약학', traits: ['정확성', '섬세함', '배려'] },
                { career: '영양사', score: 88, reason: '건강한 식단을 계획하고 관리하는 일에 재능이 있습니다.', field: '영양/식품', traits: ['꼼꼼함', '배려', '전문성'] },
                { career: '물류 관리자', score: 85, reason: '체계적이고 효율적인 물류 관리로 업무를 최적화합니다.', field: '물류/유통', traits: ['체계성', '꼼꼼함', '관리력'] },
                { career: '품질 관리 전문가', score: 83, reason: '세심한 점검과 관리로 최고의 품질을 유지합니다.', field: '제조/품질', traits: ['꼼꼼함', '정확성', '책임감'] }
            ],
            '庚': [
                { career: '판사/검사', score: 95, reason: '강한 정의감과 원칙으로 법을 집행하고 정의를 구현합니다.', field: '법조/사법', traits: ['정의감', '결단력', '원칙'] },
                { career: '경찰/군인', score: 92, reason: '강인한 의지와 책임감으로 국가와 국민을 지킵니다.', field: '공안/국방', traits: ['강인함', '책임감', '용기'] },
                { career: '외과 의사', score: 90, reason: '정확하고 과감한 수술로 생명을 살립니다.', field: '의료/외과', traits: ['결단력', '정확성', '용기'] },
                { career: '기계 엔지니어', score: 88, reason: '금속과 기계를 다루는 일에 천부적인 재능이 있습니다.', field: '공학/기계', traits: ['기술력', '정확성', '분석력'] },
                { career: '투자 전문가', score: 85, reason: '과감한 결단과 정확한 판단으로 높은 수익을 창출합니다.', field: '금융/투자', traits: ['결단력', '분석력', '과감함'] },
                { career: '스포츠 선수', score: 83, reason: '강인한 체력과 의지로 최고의 성과를 달성합니다.', field: '스포츠', traits: ['체력', '의지', '경쟁력'] }
            ],
            '辛': [
                { career: '보석 디자이너', score: 95, reason: '섬세한 감각과 예술성으로 아름다운 보석을 디자인합니다.', field: '보석/디자인', traits: ['섬세함', '예술성', '완벽주의'] },
                { career: '치과 의사', score: 92, reason: '정교하고 섬세한 시술로 환자의 건강을 책임집니다.', field: '의료/치과', traits: ['섬세함', '정확성', '완벽주의'] },
                { career: '품질 관리 총괄', score: 90, reason: '완벽주의적 성격으로 최고 수준의 품질을 유지합니다.', field: '제조/품질', traits: ['완벽주의', '분석력', '정확성'] },
                { career: 'IT 보안 전문가', score: 88, reason: '예리한 분석력으로 시스템의 취약점을 찾아 보완합니다.', field: 'IT/보안', traits: ['분석력', '예리함', '정확성'] },
                { career: '피아니스트/음악가', score: 85, reason: '섬세한 감각으로 아름다운 음악을 연주합니다.', field: '음악/공연', traits: ['섬세함', '예술성', '표현력'] },
                { career: '편집자/교정자', score: 83, reason: '완벽주의적 성격으로 세세한 오류까지 찾아냅니다.', field: '출판/편집', traits: ['꼼꼼함', '분석력', '완벽주의'] }
            ],
            '壬': [
                { career: '경영 컨설턴트', score: 95, reason: '깊은 통찰력과 전략적 사고로 기업의 문제를 해결합니다.', field: '컨설팅/경영', traits: ['통찰력', '전략', '유연성'] },
                { career: '외교관/통역사', score: 92, reason: '유연한 사고와 소통 능력으로 국제 관계를 이끕니다.', field: '외교/국제', traits: ['소통력', '유연성', '지혜'] },
                { career: '무역 전문가', score: 90, reason: '흐름을 읽고 국제 거래를 성공적으로 이끕니다.', field: '무역/유통', traits: ['전략', '소통력', '적응력'] },
                { career: '전략 기획자', score: 88, reason: '넓은 시야와 전략적 사고로 장기적인 비전을 제시합니다.', field: '기획/전략', traits: ['전략', '통찰력', '분석력'] },
                { career: '연구원/학자', score: 85, reason: '깊이 있는 연구와 탐구로 새로운 지식을 창출합니다.', field: '연구/학술', traits: ['탐구심', '지혜', '통찰력'] },
                { career: '여행 작가/가이드', score: 83, reason: '다양한 경험과 유연한 사고로 여행을 풍부하게 만듭니다.', field: '관광/여행', traits: ['유연성', '적응력', '표현력'] }
            ],
            '癸': [
                { career: '작가/소설가', score: 95, reason: '깊은 내면의 통찰과 창의성으로 감동적인 작품을 씁니다.', field: '문학/창작', traits: ['창의성', '통찰력', '감성'] },
                { career: 'UX 리서처', score: 92, reason: '사용자의 숨은 니즈를 발견하고 혁신적인 해결책을 제시합니다.', field: 'IT/리서치', traits: ['통찰력', '분석력', '창의성'] },
                { career: '심리상담사', score: 90, reason: '깊은 공감 능력으로 내담자의 마음을 이해하고 치유합니다.', field: '상담/심리', traits: ['공감능력', '통찰력', '인내심'] },
                { career: 'R&D 연구원', score: 88, reason: '혁신적인 아이디어와 창의적 사고로 신제품을 개발합니다.', field: '연구/개발', traits: ['창의성', '혁신', '탐구심'] },
                { career: '영상 편집자', score: 85, reason: '섬세한 감각으로 이야기를 영상에 담아냅니다.', field: '영상/편집', traits: ['감성', '섬세함', '창의성'] },
                { career: '점술가/역술인', score: 83, reason: '뛰어난 직관력으로 운명의 흐름을 읽어냅니다.', field: '역술/상담', traits: ['직관력', '통찰력', '감수성'] }
            ]
        };
        
        return careerData[dayMaster] || careerData['甲'];
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
