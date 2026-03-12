/**
 * Fortune Calendar - Main Logic
 * 운세 캘린더 메인 로직
 */

// Global variables
let currentYear = 2026;
let currentMonth = 2; // 0-based (2 = March)
let selectedDate = null;

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    
    // Render calendar
    renderCalendar(currentYear, currentMonth);
    
    // Track page view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': 'Fortune Calendar',
            'page_location': window.location.href
        });
    }
});

/**
 * Render calendar for given year and month
 */
function renderCalendar(year, month) {
    // Update header
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', 
                       '7월', '8월', '9월', '10월', '11월', '12월'];
    document.getElementById('calendarMonth').textContent = `${year}년 ${monthNames[month]}`;
    
    // Get calendar days container
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Get today's date
    const today = new Date();
    const isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());
    const todayDate = today.getDate();
    
    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayNum = daysInPrevMonth - i;
        const dayElement = createDayElement(dayNum, year, month - 1, true);
        calendarDays.appendChild(dayElement);
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = (isCurrentMonth && day === todayDate);
        const dayElement = createDayElement(day, year, month, false, isToday);
        calendarDays.appendChild(dayElement);
    }
    
    // Add next month's leading days to fill the grid
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, year, month + 1, true);
        calendarDays.appendChild(dayElement);
    }
}

/**
 * Create a day element
 */
function createDayElement(day, year, month, isOtherMonth = false, isToday = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    // Add classes
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    if (isToday) {
        dayElement.classList.add('today');
    }
    
    // Determine day of week
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) {
        dayElement.classList.add('sunday');
    } else if (dayOfWeek === 6) {
        dayElement.classList.add('saturday');
    }
    
    // Add day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);
    
    // Add fortune preview emoji (only for current month)
    if (!isOtherMonth) {
        const fortunePreview = document.createElement('div');
        fortunePreview.className = 'day-fortune-preview';
        fortunePreview.textContent = getDailyFortuneEmoji(year, month, day);
        dayElement.appendChild(fortunePreview);
    }
    
    // Add click event
    if (!isOtherMonth) {
        dayElement.addEventListener('click', function() {
            showFortuneDetail(year, month, day);
        });
    }
    
    return dayElement;
}

/**
 * Get daily fortune emoji based on date
 */
function getDailyFortuneEmoji(year, month, day) {
    // Use date as seed for consistent emoji
    const seed = year * 10000 + (month + 1) * 100 + day;
    const emojis = ['🌟', '✨', '🎯', '🍀', '💎', '🌈', '⭐', '💫', '🔥', '🌸', '🎁', '🏆'];
    return emojis[seed % emojis.length];
}

/**
 * Navigate to previous month
 */
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
    
    // Track event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calendar_navigation', {
            'event_category': 'engagement',
            'event_label': 'previous_month'
        });
    }
}

/**
 * Navigate to next month
 */
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
    
    // Track event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calendar_navigation', {
            'event_category': 'engagement',
            'event_label': 'next_month'
        });
    }
}

/**
 * Show fortune detail for selected date
 */
function showFortuneDetail(year, month, day) {
    selectedDate = { year, month, day };
    
    // Generate fortune for the date
    const fortune = generateDailyFortune(year, month, day);
    
    // Update fortune detail card
    updateFortuneDetail(fortune);
    
    // Show fortune detail section
    document.getElementById('fortuneDetail').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Track event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_fortune', {
            'event_category': 'engagement',
            'event_label': `${year}-${month+1}-${day}`,
            'value': 1
        });
    }
}

/**
 * Update fortune detail card with generated fortune
 */
function updateFortuneDetail(fortune) {
    // Update date badge
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(fortune.year, fortune.month, fortune.day);
    const dayName = dayNames[date.getDay()];
    document.getElementById('fortuneDateBadge').textContent = 
        `${fortune.year}년 ${fortune.month + 1}월 ${fortune.day}일 (${dayName})`;
    
    // Update title
    const titles = ['오늘의 운세', '내일의 운세', '이날의 운세'];
    const today = new Date();
    const isToday = (fortune.year === today.getFullYear() && 
                    fortune.month === today.getMonth() && 
                    fortune.day === today.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = (fortune.year === tomorrow.getFullYear() && 
                       fortune.month === tomorrow.getMonth() && 
                       fortune.day === tomorrow.getDate());
    
    document.getElementById('fortuneTitle').textContent = isToday ? titles[0] : 
                                                          isTomorrow ? titles[1] : titles[2];
    
    // Update score stars
    document.querySelector('.score-stars').textContent = fortune.scoreStars;
    
    // Update fortune texts
    document.getElementById('fortuneOverview').textContent = fortune.overview;
    document.getElementById('fortuneMoney').textContent = fortune.money;
    document.getElementById('fortuneLove').textContent = fortune.love;
    document.getElementById('fortuneHealth').textContent = fortune.health;
    
    // Update lucky items
    document.getElementById('luckyNumber').textContent = fortune.luckyNumber;
    
    const luckyColorElement = document.getElementById('luckyColor');
    luckyColorElement.innerHTML = `
        <span class="color-dot" style="background: ${fortune.luckyColorCode};"></span>
        ${fortune.luckyColor}
    `;
    
    document.getElementById('luckyDirection').textContent = fortune.luckyDirection;
}

/**
 * Close fortune detail
 */
function closeFortune() {
    document.getElementById('fortuneDetail').style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedDate = null;
}

/**
 * Share fortune
 */
function shareFortune() {
    if (!selectedDate) return;
    
    const { year, month, day } = selectedDate;
    const shareText = `${year}년 ${month + 1}월 ${day}일 운세를 확인했어요! 🌟\n\nAI 사주 천년지기에서 나만의 운세를 확인해보세요!`;
    const shareUrl = `${window.location.origin}/fortune-calendar.html`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'AI 사주 천년지기 - 운세 캘린더',
            text: shareText,
            url: shareUrl
        })
        .then(() => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': 'Web Share API',
                    'content_type': 'fortune',
                    'item_id': `${year}-${month+1}-${day}`
                });
            }
        })
        .catch(err => console.log('Share cancelled', err));
    } else {
        // Fallback: Copy to clipboard
        const textArea = document.createElement('textarea');
        textArea.value = `${shareText}\n${shareUrl}`;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('공유 링크가 복사되었습니다! 📋');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': 'clipboard',
                    'content_type': 'fortune',
                    'item_id': `${year}-${month+1}-${day}`
                });
            }
        } catch (err) {
            console.error('Copy failed', err);
            alert('공유에 실패했습니다. 다시 시도해주세요.');
        }
        document.body.removeChild(textArea);
    }
}

/**
 * Save fortune to localStorage
 */
function saveFortune() {
    if (!selectedDate) return;
    
    const { year, month, day } = selectedDate;
    const fortune = generateDailyFortune(year, month, day);
    
    // Get saved fortunes from localStorage
    let savedFortunes = JSON.parse(localStorage.getItem('savedFortunes') || '[]');
    
    // Check if already saved
    const existingIndex = savedFortunes.findIndex(f => 
        f.year === year && f.month === month && f.day === day
    );
    
    if (existingIndex >= 0) {
        alert('이미 저장된 운세입니다! 📌');
        return;
    }
    
    // Add to saved fortunes
    savedFortunes.push({
        year,
        month,
        day,
        fortune,
        savedAt: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('savedFortunes', JSON.stringify(savedFortunes));
    
    alert('운세가 저장되었습니다! 📌\n\n마이페이지에서 저장된 운세를 확인할 수 있습니다.');
    
    // Track event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'save_fortune', {
            'event_category': 'engagement',
            'event_label': `${year}-${month+1}-${day}`,
            'value': 1
        });
    }
}

/**
 * Close fortune detail when clicking outside
 */
document.addEventListener('click', function(event) {
    const fortuneDetail = document.getElementById('fortuneDetail');
    if (fortuneDetail && 
        fortuneDetail.style.display === 'flex' && 
        event.target === fortuneDetail) {
        closeFortune();
    }
});

/**
 * Close fortune detail when pressing Escape key
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const fortuneDetail = document.getElementById('fortuneDetail');
        if (fortuneDetail && fortuneDetail.style.display === 'flex') {
            closeFortune();
        }
    }
});
