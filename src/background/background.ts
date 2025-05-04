import browser from "webextension-polyfill"

browser.runtime.onInstalled.addListener(() => {
    // add context menu for reading selected text
    browser.contextMenus.create({
        id: "readSelectedText",
        title: "Read Aloud with LexiHelp",
        contexts: ["selection"],
    });

    // add context menu for reading the entire page
    browser.contextMenus.create({
        id: "readPage",
        title: "Read Page Aloud with LexiHelp",
        contexts: ["page"],
    });
})

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'readSelection' && info.selectionText && tab?.id !== undefined) {
        // Handle reading selected text
        browser.tabs.sendMessage(tab.id, {
            action: 'readSelection',
            text: info.selectionText,
        });
        console.log('Selected text:', info.selectionText);
    } else if (info.menuItemId === 'readPage' && tab?.id !== undefined) {
        // Handle reading the entire page
        browser.tabs.sendMessage(tab.id, {
            action: 'readPage',
        });
        console.log('Reading the entire page content.');
    }
});

// Set default values when the extension is installed
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get(['rulerConfig']).then((result) => {
    if (!result.rulerConfig) {
      browser.storage.local.set({
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
browser.runtime.onConnect.addListener(function(port) {
  if (port.name === "keepAlive") {
    port.onDisconnect.addListener(function() {
      // Reconnect or any other logic if needed
    });
  }
});

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({
    fontSize: 16,
    letterSpacing: 1.0,
    lineHeight: 1.5,
    wordSpacing: 1.0,
    fontFamily: 'openDyslexic',
    extensionEnabled:true
  });
});