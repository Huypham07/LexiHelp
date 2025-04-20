console.log('Reading Ruler background script initialized');

// Set default values when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['rulerConfig'], (result) => {
    if (!result.rulerConfig) {
      chrome.storage.local.set({
        rulerConfig: {
          ruler: true,
          height: 20,
          opacity: 100,
          color: '#d9d9d9',
        }
      });
    }
  });
});

// Keep service worker alive in MV3
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "keepAlive") {
    port.onDisconnect.addListener(function() {
      // Reconnect or any other logic if needed
    });
  }
});