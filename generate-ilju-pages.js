// 60갑자 일주 페이지 자동 생성 스크립트
// Node.js 환경에서 실행: node generate-ilju-pages.js

const fs = require('fs');
const path = require('path');

// 60갑자 전체 데이터
const iljuData = require('./ilju/60gapja-data.json');

// 템플릿 HTML (을축일주 기반)
const templateHTML = fs.readFileSync('./ilju/eulchuk.html', 'utf8');

// 각 일주 페이지 생성
iljuData.ilju_list.forEach(ilju => {
  let html = templateHTML;
  
  // 기본 정보 치환
  html = html.replace(/을축일주 \(乙丑\)/g, `${ilju.name}일주 (${ilju.hanja})`);
  html = html.replace(/을축일주의/g, `${ilju.name}일주의`);
  html = html.replace(/<div class="ilju-emoji">🌱<\/div>/g, `<div class="ilju-emoji">${ilju.emoji}</div>`);
  html = html.replace(/<h1 class="ilju-name">을축일주<\/h1>/g, `<h1 class="ilju-name">${ilju.name}일주</h1>`);
  html = html.replace(/<div class="ilju-hanja">乙丑<\/div>/g, `<div class="ilju-hanja">${ilju.hanja}</div>`);
  
  // 설명 치환
  html = html.replace(/을축\(乙丑\)/g, `${ilju.name}(${ilju.hanja})`);
  html = html.replace(/섬세한 실무자/g, ilju.title);
  html = html.replace(/꼼꼼하고 섬세한 성격으로 실무 능력이 뛰어난 안정 추구형/g, ilju.description);
  
  // 성격 TOP 3 치환
  ilju.personalities.forEach((personality, index) => {
    const oldPersonality = [
      '섬세하고 꼼꼼한 완벽주의자',
      '성실하고 책임감이 강함',
      '조용하지만 내면이 깊음'
    ][index];
    
    if (oldPersonality) {
      html = html.replace(new RegExp(oldPersonality, 'g'), personality);
    }
  });
  
  // 유명인 치환
  ilju.celebrities.forEach((celebrity, index) => {
    const oldCelebrities = ['송혜교', '정우성', '손흥민'];
    if (oldCelebrities[index]) {
      html = html.replace(new RegExp(`<div class="name">${oldCelebrities[index]}</div>`, 'g'), `<div class="name">${celebrity}</div>`);
    }
  });
  
  // 일주백과 제목 치환
  html = html.replace(/을축일주란\?/g, `${ilju.name}일주란?`);
  html = html.replace(/을축일주 유명인/g, `${ilju.name}일주 유명인`);
  
  // 파일명 생성 (한글 → 영문)
  const fileNameMap = {
    '갑자': 'gapja', '을축': 'eulchuk', '병인': 'byeongin', '정묘': 'jeongmyo',
    '무진': 'mujin', '기사': 'gisa', '경오': 'gyeongoh', '신미': 'sinmi',
    '임신': 'imsin', '계유': 'gyeyou', '갑술': 'gapsul', '을해': 'eulhae',
    '병자': 'byeongja', '정축': 'jeongchuk', '무인': 'muin', '기묘': 'gimyo',
    '경진': 'gyeongjin', '신사': 'sinsa', '임오': 'imoh', '계미': 'gyemi',
    '갑신': 'gapsin', '을유': 'eulyou', '병술': 'byeongsul', '정해': 'jeonghae',
    '무자': 'muja', '기축': 'gichuk', '경인': 'gyeongin', '신묘': 'sinmyo',
    '임진': 'imjin', '계사': 'gyesa', '갑오': 'gapoh', '을미': 'eulmi',
    '병신': 'byeongsin', '정유': 'jeongyou', '무술': 'musul', '기해': 'gihae',
    '경자': 'gyeongja', '신축': 'sinchuk', '임인': 'imin', '계묘': 'gyemyo',
    '갑진': 'gapjin', '을사': 'eulsa', '병오': 'byeongoh', '정미': 'jeongmi',
    '무신': 'musin', '기유': 'giyou', '경술': 'gyeongsul', '신해': 'sinhae',
    '임자': 'imja', '계축': 'gyechuk', '갑인': 'gapin', '을묘': 'eulmyo',
    '병진': 'byeongjin', '정사': 'jeongsa', '무오': 'muoh', '기미': 'gimi',
    '경신': 'gyeongsin', '신유': 'sinyou', '임술': 'imsul', '계해': 'gyehae'
  };
  
  const fileName = fileNameMap[ilju.name] || ilju.name;
  const filePath = path.join(__dirname, 'ilju', `${fileName}.html`);
  
  // 파일 저장
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ ${ilju.name}일주 (${fileName}.html) 생성 완료!`);
});

console.log('\n🎉 60갑자 일주 페이지 전체 생성 완료!');
console.log('📂 위치: ilju/ 폴더');
console.log('✨ 총 60개 파일 생성됨');
