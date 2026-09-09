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
        chrome.scripting.executeScript({
          target: { tabId: currentTabId },
          func: () => {
            // شبیه‌سازی کلیک چپ ماوس
            document.dispatchEvent(new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true,
              buttons: 1
            }));
          }
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
}
