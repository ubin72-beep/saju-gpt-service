/**
 * AI Chatbot Upgrade - Saju Data Integration
 * 사주 데이터 자동 연동 및 개인화된 답변 시스템
 */

// RESTful API Base URL
const API_BASE_URL = window.location.origin;

/**
 * Get or create session ID
 */
function getSessionId() {
    let sessionId = localStorage.getItem('chat_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chat_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Save Saju data to database
 */
async function saveSajuData(sajuData) {
    try {
        const sessionId = getSessionId();
        
        const data = {
            session_id: sessionId,
            user_id: sajuData.userId || null,
            name: sajuData.name,
            birth_date: sajuData.birthDate,
            birth_time: sajuData.birthTime,
            is_lunar: sajuData.isLunar,
            gender: sajuData.gender,
            year_pillar: sajuData.yearPillar || '',
            month_pillar: sajuData.monthPillar || '',
            day_pillar: sajuData.dayPillar || '',
            hour_pillar: sajuData.hourPillar || '',
            daymaster: sajuData.daymaster || '',
            elements: JSON.stringify(sajuData.elements || {}),
            personality: sajuData.personality || '',
            fortune_summary: sajuData.fortuneSummary || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        const response = await fetch(`${API_BASE_URL}/tables/user_saju_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save Saju data');
        }
        
        const result = await response.json();
        localStorage.setItem('saju_data_id', result.id);
        
        console.log('✅ Saju data saved:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Error saving Saju data:', error);
        // Fallback to localStorage
        localStorage.setItem('saju_data_backup', JSON.stringify(sajuData));
        return null;
    }
}

/**
 * Load Saju data from database
 */
async function loadSajuData() {
    try {
        const sessionId = getSessionId();
        const sajuDataId = localStorage.getItem('saju_data_id');
        
        // Try to load by ID first
        if (sajuDataId) {
            const response = await fetch(`${API_BASE_URL}/tables/user_saju_data/${sajuDataId}`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Saju data loaded by ID:', data);
                return parseSajuData(data);
            }
        }
        
        // Otherwise, search by session ID
        const searchResponse = await fetch(
            `${API_BASE_URL}/tables/user_saju_data?search=${sessionId}&limit=1`
        );
        
        if (searchResponse.ok) {
            const result = await searchResponse.json();
            if (result.data && result.data.length > 0) {
                const data = result.data[0];
                localStorage.setItem('saju_data_id', data.id);
                console.log('✅ Saju data loaded by session:', data);
                return parseSajuData(data);
            }
        }
        
        // Fallback to localStorage
        const backupData = localStorage.getItem('saju_data_backup');
        if (backupData) {
            console.log('⚠️ Using backup Saju data from localStorage');
            return JSON.parse(backupData);
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Error loading Saju data:', error);
        
        // Fallback to localStorage
        const backupData = localStorage.getItem('saju_data_backup');
        if (backupData) {
            return JSON.parse(backupData);
        }
        
        return null;
    }
}

/**
 * Parse database Saju data to application format
 */
function parseSajuData(dbData) {
    return {
        id: dbData.id,
        userId: dbData.user_id,
        sessionId: dbData.session_id,
        name: dbData.name,
        birthDate: dbData.birth_date,
        birthTime: dbData.birth_time,
        isLunar: dbData.is_lunar,
        gender: dbData.gender,
        yearPillar: dbData.year_pillar,
        monthPillar: dbData.month_pillar,
        dayPillar: dbData.day_pillar,
        hourPillar: dbData.hour_pillar,
        daymaster: dbData.daymaster,
        elements: dbData.elements ? JSON.parse(dbData.elements) : {},
        personality: dbData.personality,
        fortuneSummary: dbData.fortune_summary,
        createdAt: dbData.created_at,
        updatedAt: dbData.updated_at
    };
}

/**
 * Save chat message to history
 */
async function saveChatMessage(userMessage, aiResponse, sajuDataId = null) {
    try {
        const sessionId = getSessionId();
        
        // Get current sequence number
        const historyResponse = await fetch(
            `${API_BASE_URL}/tables/chat_history?search=${sessionId}&sort=-sequence&limit=1`
        );
        
        let sequence = 1;
        if (historyResponse.ok) {
            const history = await historyResponse.json();
            if (history.data && history.data.length > 0) {
                sequence = history.data[0].sequence + 1;
            }
        }
        
        const data = {
            saju_data_id: sajuDataId || localStorage.getItem('saju_data_id') || '',
            session_id: sessionId,
            user_message: userMessage,
            ai_response: aiResponse,
            sequence: sequence,
            created_at: new Date().toISOString()
        };
        
        const response = await fetch(`${API_BASE_URL}/tables/chat_history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save chat message');
        }
        
        const result = await response.json();
        console.log('✅ Chat message saved:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Error saving chat message:', error);
        // Fallback to localStorage
        let chatHistory = JSON.parse(localStorage.getItem('chat_history_backup') || '[]');
        chatHistory.push({
            userMessage,
            aiResponse,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('chat_history_backup', JSON.stringify(chatHistory));
        return null;
    }
}

/**
 * Load chat history from database
 */
async function loadChatHistory() {
    try {
        const sessionId = getSessionId();
        
        const response = await fetch(
            `${API_BASE_URL}/tables/chat_history?search=${sessionId}&sort=sequence&limit=50`
        );
        
        if (!response.ok) {
            throw new Error('Failed to load chat history');
        }
        
        const result = await response.json();
        console.log(`✅ Loaded ${result.data.length} chat messages`);
        
        return result.data.map(msg => ({
            id: msg.id,
            userMessage: msg.user_message,
            aiResponse: msg.ai_response,
            sequence: msg.sequence,
            timestamp: msg.created_at
        }));
        
    } catch (error) {
        console.error('❌ Error loading chat history:', error);
        
        // Fallback to localStorage
        const backupHistory = localStorage.getItem('chat_history_backup');
        if (backupHistory) {
            return JSON.parse(backupHistory);
        }
        
        return [];
    }
}

/**
 * Generate personalized AI prompt based on Saju data
 */
function generatePersonalizedPrompt(userQuestion, sajuData) {
    if (!sajuData) {
        return userQuestion;
    }
    
    const sajuContext = `
[사용자 사주 정보]
- 이름: ${sajuData.name}
- 생년월일: ${sajuData.birthDate} ${sajuData.birthTime} (${sajuData.isLunar ? '음력' : '양력'})
- 성별: ${sajuData.gender === 'male' ? '남성' : '여성'}
- 사주팔자: ${sajuData.yearPillar || ''} ${sajuData.monthPillar || ''} ${sajuData.dayPillar || ''} ${sajuData.hourPillar || ''}
- 일간: ${sajuData.daymaster || ''}
${sajuData.personality ? `- 성격: ${sajuData.personality}` : ''}
${sajuData.fortuneSummary ? `- 운세 요약: ${sajuData.fortuneSummary}` : ''}

[사용자 질문]
${userQuestion}

위 사주팔자 정보를 바탕으로 전문 명리학자처럼 상세하고 개인화된 답변을 제공해주세요.
`;
    
    return sajuContext;
}

/**
 * Display Saju info in chat UI
 */
function displaySajuInfo(sajuData) {
    if (!sajuData) return;
    
    const sajuInfoHTML = `
    <div class="saju-info-card" style="
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1));
        border: 2px solid rgba(139, 92, 246, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
            <i class="fas fa-user-circle" style="font-size: 1.5rem; color: #8B5CF6;"></i>
            <h3 style="margin: 0; color: #8B5CF6; font-size: 1.2rem;">저장된 사주 정보</h3>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div>
                <div style="font-size: 0.85rem; color: #6B7280; margin-bottom: 5px;">이름</div>
                <div style="font-weight: 600; color: #1F2937;">${sajuData.name || '-'}</div>
            </div>
            
            <div>
                <div style="font-size: 0.85rem; color: #6B7280; margin-bottom: 5px;">생년월일</div>
                <div style="font-weight: 600; color: #1F2937;">${sajuData.birthDate || '-'} ${sajuData.birthTime || ''}</div>
            </div>
            
            <div>
                <div style="font-size: 0.85rem; color: #6B7280; margin-bottom: 5px;">사주팔자</div>
                <div style="font-weight: 600; color: #1F2937; font-family: 'Noto Serif KR', serif;">
                    ${sajuData.yearPillar || '-'} 
                    ${sajuData.monthPillar || '-'} 
                    ${sajuData.dayPillar || '-'} 
                    ${sajuData.hourPillar || '-'}
                </div>
            </div>
            
            ${sajuData.daymaster ? `
            <div>
                <div style="font-size: 0.85rem; color: #6B7280; margin-bottom: 5px;">일간</div>
                <div style="font-weight: 600; color: #8B5CF6; font-family: 'Noto Serif KR', serif;">
                    ${sajuData.daymaster}
                </div>
            </div>
            ` : ''}
        </div>
        
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(139, 92, 246, 0.2);">
            <div style="font-size: 0.85rem; color: #6B7280;">
                <i class="fas fa-check-circle" style="color: #10B981;"></i>
                AI가 당신의 사주 정보를 기억하고 개인화된 답변을 제공합니다
            </div>
        </div>
    </div>
    `;
    
    return sajuInfoHTML;
}

/**
 * Check if user has Saju data and prompt to enter if not
 */
async function checkAndPromptSajuData() {
    const sajuData = await loadSajuData();
    
    if (!sajuData) {
        // Show prompt to enter Saju data
        const promptHTML = `
        <div class="saju-prompt" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        ">
            <div style="font-size: 2rem; margin-bottom: 15px;">🔮</div>
            <h3 style="margin: 0 0 10px 0; font-size: 1.3rem;">사주 정보를 입력하시겠어요?</h3>
            <p style="margin: 0 0 20px 0; opacity: 0.9;">
                사주팔자 정보를 입력하시면 더욱 정확하고 개인화된 답변을 받으실 수 있습니다.
            </p>
            <button onclick="goToSajuInput()" style="
                background: white;
                color: #764ba2;
                border: none;
                padding: 12px 30px;
                border-radius: 50px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)';" 
               onmouseout="this.style.transform=''; this.style.boxShadow='';">
                <i class="fas fa-edit"></i> 사주 정보 입력하기
            </button>
            <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                <i class="fas fa-info-circle"></i> 건너뛰고 일반 상담도 가능합니다
            </div>
        </div>
        `;
        
        return promptHTML;
    }
    
    return displaySajuInfo(sajuData);
}

/**
 * Redirect to Saju input page
 */
function goToSajuInput() {
    // Save return URL
    localStorage.setItem('return_to_chat', 'true');
    window.location.href = 'index.html#saju-form';
}

/**
 * Export functions for external use
 */
if (typeof window !== 'undefined') {
    window.SajuChatIntegration = {
        saveSajuData,
        loadSajuData,
        saveChatMessage,
        loadChatHistory,
        generatePersonalizedPrompt,
        displaySajuInfo,
        checkAndPromptSajuData,
        getSessionId
    };
}
