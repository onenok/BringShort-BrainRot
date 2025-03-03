// popup.js
let isEnabled = false;
let gotEnabled = false;
chrome.storage.local.get(['enabled']).then((result) => {
  isEnabled = result.enabled !== false; // Default to true
  showHTML();
  gotEnabled = true;
}).catch((error) => {
  console.error('Error accessing storage:', error);
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (gotEnabled) {
      Main();
    }
  }, 100);
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

function showHTML() {
  const body = document.body;
  body.innerHTML = `
    <center>
    <!-- Extension Logo -->
    <img src="../img/64Bye_Short.png" alt="Bring Short Brainrot Logo" class="logo">
    <!-- Extension Name -->
    <h1 style="margin-bottom: 0.75rem">BringShort Brainrot</h1>
    <!-- Tagline or Description -->
    <p>BYE BYE Shorts</p>

    <!-- Toggle Switch -->
    <div class="switch-box">    
      <span class="switchLabel" style="margin-right: 0.5em;">Bye Bye Shorts</span>
      <label class="switch">
        <input type="checkbox" id="toggle"${isEnabled ? ' checked' : ''}>
        <span class="slider"></span>
      </label>  
    </div>
    <!-- Action Buttons -->
    <button class="m3-btn" id="link_website">Website</button>
    <button class="m3-btn m3-primary" style="margin-top: 0.3em;" id="link_donate">Donate</button>
    <button class="m3-btn" id="link_github">GitHub</button>
    <button class="m3-btn" style="margin-top: 0.3rem;" id="link_issues">Issues</button>
    <button class="m3-btn" id="link_discord">Discord</button>
    <button class="m3-btn" style="margin-top: 0.3em;" id="link_faq">FAQ</button>
    <button class="m3-btn" style="margin-top: 0.3em;" id="link_changelog">Change Log</button>

    <!-- Version Info -->
    <div id="ext">
      <span id="ext-version"></span>
    </div>
  </center>
  `;
}

function Main() {
  const toggle = document.getElementById('toggle');
  // Ensure the toggle element exists
  if (toggle) {
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
  else {
    console.error('Toggle element not found');
  }

  // Handle button clicks
  const links = {
    link_website: 'https://your-extension-website.com',
    link_donate: 'https://your-donation-page.com',
    link_github: 'https://github.com/onenok/BringShort-BrainRot',
    link_issues: 'https://github.com/onenok/BringShort-BrainRot/issues',
    link_discord: 'https://discord.gg/yEq5AA5qCW',
    link_faq: 'https://github.com/onenok/BringShort-BrainRot/discussions/categories/q-a',
    link_changelog: 'https://github.com/onenok/BringShort-BrainRot/commits/main/',
  };

  Object.keys(links).forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', () => {
        chrome.tabs.create({ url: links[id] });
      });
    }
  });

  // Version Info
  const version = chrome.runtime.getManifest().version;
  document.getElementById('ext-version').textContent = version;
}
