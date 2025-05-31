// 常數定義
const YOUTUBE_HOSTNAME = 'www.youtube.com';
const SHORTS_PATH = '/shorts/';
const WATCH_PATH = '/watch?v=';

function redirectShorts() {
  // 使用 chrome.storage 確認是否啟用
  chrome.storage.local.get(['enabled']).then((result) => {
    const isEnabled = result.enabled !== false;

    if (!isEnabled) return;
    console.log(`vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv`);
    console.log(`BringShort Brainrot: >>>>>Redirecting<<<<<<`);
    console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
    const url = new URL(window.location.href);
    
    if (url.hostname !== YOUTUBE_HOSTNAME || !url.pathname.startsWith(SHORTS_PATH)) return;

    const videoId = url.pathname.split(SHORTS_PATH)[1].split('/')[0];
    const searchParams = url.searchParams.toString();
    const newUrl = `https://${YOUTUBE_HOSTNAME}${WATCH_PATH}${videoId}${searchParams ? `&${searchParams}` : ''}`;

    if (window.location.href === newUrl) return;

    console.log('BringShort Brainrot: 重定向中...');
    console.log(`從: ${window.location.href}`);
    console.log(`到: ${newUrl}`);

    history.replaceState(null, '', newUrl);
    window.location.replace(newUrl);
  }).catch((error) => {
    console.error('BringShort Brainrot: 存取 storage 時發生錯誤:', error);
  });
}

// 監聽 URL 變化
let lastUrl = window.location.href;
new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    redirectShorts();
  }
}).observe(document, { subtree: true, childList: true });

// 初始檢查
redirectShorts();