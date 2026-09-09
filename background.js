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
    if (tabs.length === 0) return;
    currentTabId = tabs[0].id;
    isClicking = true;

    clickInterval = setInterval(() => {
      if (currentTabId) {
        chrome.tabs.sendMessage(currentTabId, { action: 'click' }).catch(() => {
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
  console.log('Auto-clicker stopped');
}
