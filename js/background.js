// background.js
chrome.runtime.onInstalled.addListener(() => {
  // 設定預設值
  chrome.storage.local.set({ enabled: true })
    .then(() => {
      console.log('BringShort Brainrot: 預設值已設定');
    })
    .catch((error) => {
      console.error('BringShort Brainrot: 設定預設值時發生錯誤:', error);
    });
});