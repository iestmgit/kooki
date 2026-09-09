let isClicking = false;
let clickInterval = null;
let currentTabId = null;

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
    if (tabs.length === 0) return;
    currentTabId = tabs[0].id;
    isClicking = true;

    // هر ۱ میکروثانیه (۱ میلیون بار در ثانیه) کلیک کن
    clickInterval = setInterval(() => {
      if (currentTabId) {
        // ارسال پیام به content.js برای اجرای کلیک
        chrome.tabs.sendMessage(currentTabId, { action: 'click' }).catch((error) => {
          // اگر تب بسته شده یا خطایی رخ داد، کلیک رو متوقف کن
          stopClicking();
        });
      }
    }, 0.001); // 0.001 میلی‌ثانیه = ۱ میکروثانیه
  });
}

function stopClicking() {
  if (clickInterval) {
    clearInterval(clickInterval);
    clickInterval = null;
  }
  isClicking = false;
  currentTabId = null;
  console.log('Auto-clicker stopped');
}
