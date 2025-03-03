// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');

  // Ensure the toggle element exists
  if (toggle) {
    // Load the saved toggle state
    chrome.storage.local.get(['enabled']).then((result) => {
      const isEnabled = result.enabled !== false; // Default to true
      toggle.checked = isEnabled;
    }).catch((error) => {
      console.error('Error accessing storage:', error);
    });

    // Save the toggle state when it changes
    toggle.addEventListener('change', () => {
      const isEnabled = toggle.checked;
      chrome.storage.local.set({ enabled: isEnabled })
        .then(() => {
          // Refresh YouTube tabs after the setting is saved
          refreshYouTubeTabs();
        })
        .catch((error) => {
          console.error('Error saving to storage:', error);
        });
    });
  }

  // Handle button clicks
  const links = {
    link_website: 'https://your-extension-website.com',
    link_donate: 'https://your-donation-page.com',
    link_github: 'https://github.com/your-repo',
    link_help: 'https://your-extension-website.com/help',
    link_faq: 'https://your-extension-website.com/faq',
    link_changelog: 'https://your-extension-website.com/changelog',
  };

  Object.keys(links).forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', () => {
        chrome.tabs.create({ url: links[id] });
      });
    }
  });
});

// Function to refresh all YouTube tabs
function refreshYouTubeTabs() {
  chrome.tabs.query({ url: '*://*.youtube.com/*' })
    .then((tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
      });
    })
    .catch((error) => {
      console.error('Error reloading YouTube tabs:', error);
    });
}
