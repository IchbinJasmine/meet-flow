// timezone-converter.js

/**
 * 步驟 1：取得使用者目前的本地時區
 * 透過瀏覽器內建 API 自動偵測，例如台灣會回傳 'Asia/Taipei'
 */
export function getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * 步驟 2：將後端傳來的 UTC 時間轉換為使用者的本地時間格式
 * @param {string} utcDateString - 來自資料庫的 UTC 時間字串 (例如 '2026-03-25T06:00:00Z')
 * @param {string} targetTimezone - 目標時區 (預設抓取使用者的本地時區)
 * @returns {string} 易讀的本地時間字串
 */
export function convertUtcToLocal(utcDateString, targetTimezone = getUserTimezone()) {
    // 將 UTC 字串轉換為 Date 物件
    const date = new Date(utcDateString);

    // 步驟 3：使用 Intl.DateTimeFormat 進行本地化格式化
    return new Intl.DateTimeFormat('zh-TW', {
        timeZone: targetTimezone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // MeetFlow 系統預設使用 24 小時制避免 AM/PM 混淆
    }).format(date);
}

// ==========================================
// 測試區塊 (你可以在終端機用 node timezone-converter.js 跑跑看)
// ==========================================

// 假設 MeetFlow 資料庫存了一個跨國會議時間：UTC 早上 6 點
const meetingTimeUTC = '2026-03-25T06:00:00Z'; 

console.log(`🌍 偵測到的使用者時區: ${getUserTimezone()}`);
// 如果你在台灣執行，這行會印出台灣時間 (下午 2 點)
console.log(`📅 會議時間 (本地): ${convertUtcToLocal(meetingTimeUTC)}`);

// 如果你要顯示給位在紐約的外部客戶看：
console.log(`🗽 紐約客戶看到的會議時間: ${convertUtcToLocal(meetingTimeUTC, 'America/New_York')}`);