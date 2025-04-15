import browser from "webextension-polyfill";

const createContextMenus = () => {
  // add context menu for reading selected text
  browser.contextMenus.create({
    id: "readSelection",
    title: "Read Aloud with LexiHelp",
    contexts: ["selection"],
  });

  // add context menu for reading the entire page
  browser.contextMenus.create({
    id: "readPage",
    title: "Read Page Aloud with LexiHelp",
    contexts: ["page"],
  });
};

browser.runtime.onInstalled.addListener(createContextMenus);

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "readSelection" && info.selectionText && tab?.id !== undefined) {
    // Handle reading selected text
    browser.tabs.sendMessage(tab.id, {
      action: "readSelection",
      text: info.selectionText,
    });
    console.log("Selected text:", info.selectionText);
  } else if (info.menuItemId === "readPage" && tab?.id !== undefined) {
    // Handle reading the entire page
    browser.tabs.sendMessage(tab.id, {
      action: "readPage",
    });
    console.log("Reading the entire page content.");
  }
});

// auto enable/disable distraction when reload or open new tab
browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    browser.storage.local.get(["removeDistractions", "extensionEnabled"]).then((result) => {
      browser.tabs.sendMessage(tabId, {
        action: "setRemoveDistractions",
        enabled: (result.removeDistractions as boolean) && (result.extensionEnabled as boolean),
      });
    });
  }
});

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === "toggleExtension") {
    const result = await browser.storage.local.get(["removeDistractions", "extensionEnabled"]);
    const removeDistractions = result.removeDistractions as boolean;
    if (!message.enabled) {
      browser.contextMenus.removeAll();
      if (removeDistractions) {
        // Disable distraction-free mode
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          const tab = tabs[0];
          if (tab?.id) {
            browser.tabs.sendMessage(tab.id, {
              action: "setRemoveDistractions",
              enabled: false,
            });
          }
        });
      }
    } else {
      browser.contextMenus.removeAll().then(createContextMenus);
      if (removeDistractions) {
        // Enable distraction-free mode
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          const tab = tabs[0];
          if (tab?.id) {
            browser.tabs.sendMessage(tab.id, {
              action: "setRemoveDistractions",
              enabled: true,
            });
          }
        });
      }
    }
  }
});
