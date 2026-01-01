/**
 * 날짜 변환 유틸리티
 * 양력 ↔ 음력 변환 (간단한 근사식 사용)
 */

/**
 * 양력을 음력으로 변환 (근사식)
 * 실제 프로덕션에서는 정확한 음력 변환 라이브러리 사용 권장
 * 
 * @param {number} year - 양력 연도
 * @param {number} month - 양력 월 (1-12)
 * @param {number} day - 양력 일
 * @returns {object} - { year, month, day, isLeapMonth }
 */
exports.solarToLunar = (year, month, day) => {
  // 간단한 근사 계산 (약 18일 차이)
  // 실제로는 복잡한 천문학 계산 필요
  
  const solarDate = new Date(year, month - 1, day);
  const lunarDate = new Date(solarDate.getTime() - 18 * 24 * 60 * 60 * 1000);
  
  return {
    year: lunarDate.getFullYear(),
    month: lunarDate.getMonth() + 1,
    day: lunarDate.getDate(),
    isLeapMonth: false  // 윤달 계산은 별도 로직 필요
  };
};

/**
 * 음력을 양력으로 변환 (근사식)
 * 
 * @param {number} year - 음력 연도
 * @param {number} month - 음력 월 (1-12)
 * @param {number} day - 음력 일
 * @param {boolean} isLeapMonth - 윤달 여부
 * @returns {object} - { year, month, day }
 */
exports.lunarToSolar = (year, month, day, isLeapMonth = false) => {
  // 간단한 근사 계산
  const lunarDate = new Date(year, month - 1, day);
  const solarDate = new Date(lunarDate.getTime() + 18 * 24 * 60 * 60 * 1000);
  
  return {
    year: solarDate.getFullYear(),
    month: solarDate.getMonth() + 1,
    day: solarDate.getDate()
  };
};

/**
 * 시간을 시지(時支)로 변환
 * @param {number} hour - 시간 (0-23)
 * @returns {string} - 시지 이름
 */
exports.hourToTimeZodiac = (hour) => {
  const timeZodiacs = [
    { start: 23, end: 1, name: '자시(子時)' },    // 23:00-01:00
    { start: 1, end: 3, name: '축시(丑時)' },     // 01:00-03:00
    { start: 3, end: 5, name: '인시(寅時)' },     // 03:00-05:00
    { start: 5, end: 7, name: '묘시(卯時)' },     // 05:00-07:00
    { start: 7, end: 9, name: '진시(辰時)' },     // 07:00-09:00
    { start: 9, end: 11, name: '사시(巳時)' },    // 09:00-11:00
    { start: 11, end: 13, name: '오시(午時)' },   // 11:00-13:00
    { start: 13, end: 15, name: '미시(未時)' },   // 13:00-15:00
    { start: 15, end: 17, name: '신시(申時)' },   // 15:00-17:00
    { start: 17, end: 19, name: '유시(酉時)' },   // 17:00-19:00
    { start: 19, end: 21, name: '술시(戌時)' },   // 19:00-21:00
    { start: 21, end: 23, name: '해시(亥時)' }    // 21:00-23:00
  ];
  
  for (let zodiac of timeZodiacs) {
    if (zodiac.start === 23) {
      if (hour >= 23 || hour < 1) return zodiac.name;
    } else {
      if (hour >= zodiac.start && hour < zodiac.end) return zodiac.name;
    }
  }
  
  return '자시(子時)';
};

/**
 * 날짜 포맷팅
 * @param {Date} date - Date 객체
 * @param {string} format - 포맷 ('YYYY-MM-DD', 'YYYY년 MM월 DD일' 등)
 * @returns {string} - 포맷된 날짜 문자열
 */
exports.formatDate = (date, format = 'YYYY-MM-DD') => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
};

/**
 * 날짜 차이 계산 (일 단위)
 * @param {Date} date1 - 시작 날짜
 * @param {Date} date2 - 종료 날짜
 * @returns {number} - 일수 차이
 */
exports.getDaysDiff = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * 현재 나이 계산
 * @param {number} birthYear - 출생 연도
 * @param {number} birthMonth - 출생 월
 * @param {number} birthDay - 출생 일
 * @returns {object} - { korean: 한국 나이, international: 만 나이 }
 */
exports.calculateAge = (birthYear, birthMonth, birthDay) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  
  // 한국 나이 (태어나자마자 1세)
  const koreanAge = currentYear - birthYear + 1;
  
  // 만 나이
  let internationalAge = currentYear - birthYear;
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    internationalAge--;
  }
  
  return {
    korean: koreanAge,
    international: internationalAge
  };
};

/**
 * 윤년 확인
 * @param {number} year - 연도
 * @returns {boolean} - 윤년 여부
 */
exports.isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * 해당 월의 마지막 날짜
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @returns {number} - 마지막 날짜
 */
exports.getLastDayOfMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};
