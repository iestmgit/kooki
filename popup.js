// دریافت وضعیت از background
chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
  const statusDiv = document.getElementById('status');
  if (response && response.isClicking) {
    statusDiv.textContent = '▶️ در حال کلیک...';
    statusDiv.className = 'status on';
  } else {
    statusDiv.textContent = '⏸️ متوقف';
    statusDiv.className = 'status off';
  }
});

// به‌روزرسانی خودکار وضعیت هر ۱ ثانیه
setInterval(() => {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    const statusDiv = document.getElementById('status');
    if (response && response.isClicking) {
      statusDiv.textContent = '▶️ در حال کلیک...';
      statusDiv.className = 'status on';
    } else {
      statusDiv.textContent = '⏸️ متوقف';
      statusDiv.className = 'status off';
    }
  });
}, 1000);
