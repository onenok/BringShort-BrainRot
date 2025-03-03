// background.js

function redirectShorts(details) {
  // Use Promises for better handling
  chrome.storage.local.get(['enabled']).then((result) => {
    const isEnabled = result.enabled !== false; // Default to true

    if (isEnabled) {
      const url = new URL(details.url);

      if (url.hostname === 'www.youtube.com' && url.pathname.startsWith('/shorts/')) {
        const videoId = url.pathname.split('/shorts/')[1].split('/')[0];
        const searchParams = url.searchParams.toString();
        let newUrl = `https://www.youtube.com/watch?v=${videoId}`;

        if (searchParams) {
          newUrl += `&${searchParams}`;
        }

        // Prevent infinite redirect loops
        if (details.url !== newUrl) {
          chrome.tabs.update(details.tabId, { url: newUrl });
        }
      }
    }
  }).catch((error) => {
    console.error('Error accessing storage:', error);
  });
}

// Listen for initial page loads and reloads
chrome.webNavigation.onBeforeNavigate.addListener(redirectShorts, { 
  url: [{ hostEquals: 'www.youtube.com' }]
});

// Listen for URL changes within YouTube (SPA navigation)
chrome.webNavigation.onHistoryStateUpdated.addListener(redirectShorts, { 
  url: [{ hostEquals: 'www.youtube.com' }]
});
