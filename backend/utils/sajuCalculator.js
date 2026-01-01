/**
 * 사주 계산 유틸리티
 * 전통 명리학 기반 사주팔자 계산
 */

// 천간 (天干)
const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// 지지 (地支)
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 오행 매핑
const ELEMENTS = {
  wood: ['갑', '을', '인', '묘'],
  fire: ['병', '정', '사', '오'],
  earth: ['무', '기', '진', '술', '축', '미'],
  metal: ['경', '신', '신', '유'],
  water: ['임', '계', '자', '해']
};

/**
 * 연주 (年柱) 계산
 * @param {number} year - 연도
 * @returns {object} - { heaven: string, earth: string }
 */
exports.getYearPillar = (year) => {
  // 1984년 = 갑자년 (천간 0, 지지 0)
  const baseYear = 1984;
  const yearDiff = year - baseYear;
  
  const heavenIndex = yearDiff % 10;
  const earthIndex = yearDiff % 12;
  
  return {
    heaven: HEAVENLY_STEMS[(heavenIndex + 10) % 10],
    earth: EARTHLY_BRANCHES[(earthIndex + 12) % 12]
  };
};

/**
 * 월주 (月柱) 계산
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @returns {object} - { heaven: string, earth: string }
 */
exports.getMonthPillar = (year, month) => {
  // 지지는 고정
  const earthIndex = (month + 1) % 12;
  const earth = EARTHLY_BRANCHES[earthIndex];
  
  // 천간은 연주의 천간에 따라 변동
  const yearPillar = this.getYearPillar(year);
  const yearHeavenIndex = HEAVENLY_STEMS.indexOf(yearPillar.heaven);
  
  // 월간 계산 (복잡한 명리학 공식)
  const heavenIndex = (yearHeavenIndex * 2 + month) % 10;
  const heaven = HEAVENLY_STEMS[heavenIndex];
  
  return { heaven, earth };
};

/**
 * 일주 (日柱) 계산
 * @param {number} year - 연도
 * @param {number} month - 월
 * @param {number} day - 일
 * @returns {object} - { heaven: string, earth: string }
 */
exports.getDayPillar = (year, month, day) => {
  // 기준일 (1900-01-01 = 갑자일)
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  
  const heavenIndex = diffDays % 10;
  const earthIndex = diffDays % 12;
  
  return {
    heaven: HEAVENLY_STEMS[(heavenIndex + 10) % 10],
    earth: EARTHLY_BRANCHES[(earthIndex + 12) % 12]
  };
};

/**
 * 시주 (時柱) 계산
 * @param {number} hour - 시간 (0-23)
 * @param {string} dayHeaven - 일간 천간
 * @returns {object} - { heaven: string, earth: string }
 */
exports.getHourPillar = (hour, dayHeaven) => {
  // 지지는 시간대로 고정
  const earthIndex = Math.floor((hour + 1) / 2) % 12;
  const earth = EARTHLY_BRANCHES[earthIndex];
  
  // 천간은 일간에 따라 변동
  const dayHeavenIndex = HEAVENLY_STEMS.indexOf(dayHeaven);
  const heavenIndex = (dayHeavenIndex * 2 + earthIndex) % 10;
  const heaven = HEAVENLY_STEMS[heavenIndex];
  
  return { heaven, earth };
};

/**
 * 오행 분석
 * @param {object} fourPillars - { yearPillar, monthPillar, dayPillar, hourPillar }
 * @returns {object} - { wood, fire, earth, metal, water }
 */
exports.analyzeElements = (fourPillars) => {
  const elements = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };
  
  // 각 기둥의 천간과 지지를 확인
  Object.values(fourPillars).forEach(pillar => {
    Object.keys(ELEMENTS).forEach(element => {
      if (ELEMENTS[element].includes(pillar.heaven)) {
        elements[element]++;
      }
      if (ELEMENTS[element].includes(pillar.earth)) {
        elements[element]++;
      }
    });
  });
  
  return elements;
};

/**
 * 사주팔자 전체 계산
 * @param {object} birthInfo - { year, month, day, hour }
 * @returns {object} - 사주 데이터
 */
exports.calculateSaju = (birthInfo) => {
  const { year, month, day, hour } = birthInfo;
  
  const yearPillar = this.getYearPillar(year);
  const monthPillar = this.getMonthPillar(year, month);
  const dayPillar = this.getDayPillar(year, month, day);
  const hourPillar = this.getHourPillar(hour, dayPillar.heaven);
  
  const fourPillars = { yearPillar, monthPillar, dayPillar, hourPillar };
  const elements = this.analyzeElements(fourPillars);
  
  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: dayPillar.heaven,  // 일간
    elements
  };
};

/**
 * 띠 계산
 * @param {number} year - 연도
 * @returns {string} - 띠 이름
 */
exports.getZodiac = (year) => {
  const zodiacs = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
  return zodiacs[year % 12];
};

/**
 * 나이 계산 (만 나이)
 * @param {number} birthYear - 출생 연도
 * @returns {number} - 만 나이
 */
exports.calculateAge = (birthYear) => {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};
