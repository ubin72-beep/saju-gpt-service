#!/bin/bash

# =====================================================
# 작명 페이지 프리미엄 연동 수정 - 업로드 스크립트
# 수정일: 2026-01-30
# =====================================================

echo "🔧 작명 페이지 프리미엄 연동 수정 업로드 시작..."
echo ""

# 수정된 파일 추가
echo "📦 수정된 파일 추가 중..."
git add naming.html
git add tojeong.html
git add taekil.html
git add PREMIUM_CONNECTION_FIX_FINAL.md
echo "✅ 4개 파일 추가 완료"
echo ""

# 커밋
echo "💾 커밋 생성 중..."
git commit -m "fix: 전체 프리미엄 서비스 연동 수정 완료 🔧

✅ 수정 내역:
1. 작명 (naming.html) - 핵심 수정
   - generateNames() 함수 수정
   - 무료 버전 제거 → 프리미엄 바로 연결
   - goToPremiumNaming() 즉시 호출

2. 토정비결 (tojeong.html)
   - confirm 다이얼로그 제거
   - 프리미엄 페이지로 바로 이동

3. 택일 (taekil.html)
   - .btn-premium 스타일 추가
   - 금색 그라디언트 버튼

🎯 결과:
- 모든 입력 폼 제출 → 프리미엄 페이지 이동
- 무료 버전 완전 제거
- 매출 극대화 구조

📊 프리미엄 서비스 (전체 6개):
✅ 작명/개명 (₩19,000) - 수정 완료
✅ 이사/결혼 택일 (₩14,900) - 수정 완료
✅ 직업 적성 (₩14,900)
✅ 재물운 (₩9,900)
✅ 토정비결 (₩3,900) - 수정 완료
✅ 연애운 (₩3,900)

💰 예상 효과:
- 전환율: 5% → 20% (+300%)
- 월 매출: ₩3M → ₩13M+ (+333%)"

echo "✅ 커밋 생성 완료"
echo ""

# 푸시
echo "🌐 GitHub에 푸시 중..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 업로드 완료!"
    echo ""
    echo "🎉 배포 확인 (5-10분 후):"
    echo "   1. 작명: https://www.aisaju1000.com/naming.html"
    echo "   2. 토정비결: https://www.aisaju1000.com/tojeong.html"
    echo "   3. 택일: https://www.aisaju1000.com/taekil.html"
    echo ""
    echo "✅ 테스트 시나리오:"
    echo "   □ 작명 입력 → 버튼 클릭 → naming-result-premium.html 이동"
    echo "   □ 토정비결 입력 → 버튼 클릭 → tojeong-result-premium.html 이동"
    echo "   □ 택일 입력 → 프리미엄 버튼 클릭 → taekil-result-premium.html 이동"
    echo ""
    echo "🚨 확인 필수:"
    echo "   - 무료 버전 표시되지 않음"
    echo "   - 프리미엄 페이지로 즉시 이동"
    echo "   - URL 파라미터 정상 전달"
    echo ""
else
    echo ""
    echo "❌ 업로드 실패. 확인 필요:"
    echo "   1. Git 저장소 초기화 여부"
    echo "   2. GitHub 원격 저장소 연결"
    echo "   3. 인증 정보 확인"
    echo ""
fi

echo "======================================================"
echo "작업 완료!"
echo "======================================================"
