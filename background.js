let isClicking = false;
let clickInterval = null;
let currentTabId = null;

// دریافت وضعیت برای popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    sendResponse({ isClicking: isClicking });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "start-clicker") {
    if (isClicking) {
      stopClicking();
    } else {
      startClicking();
    }
  }
});

function startClicking() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.log('❌ تب فعالی پیدا نشد');
      return;
    }
    currentTabId = tabs[0].id;
    isClicking = true;
    console.log('✅ شروع کلیک‌های خودکار در تب:', currentTabId);

    clickInterval = setInterval(() => {
      if (currentTabId) {
        chrome.tabs.sendMessage(currentTabId, { action: 'click' }).catch(() => {
          console.log('⚠️ خطا در ارسال پیام، توقف کلیک‌ها');
          stopClicking();
        });
      }
    }, 0.001);
  });
}

function stopClicking() {
  if (clickInterval) {
    clearInterval(clickInterval);
    clickInterval = null;
  }
  isClicking = false;
  currentTabId = null;
  console.log('⏹️ کلیک‌های خودکار متوقف شد');
}
