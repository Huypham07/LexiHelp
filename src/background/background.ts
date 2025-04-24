import browser from "webextension-polyfill";

export interface BaseMessage {
  action: string;
}

export interface TextMessage extends BaseMessage {
  text?: string;
}

export interface ToggleMessage extends BaseMessage {
  enabled: boolean;
}

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

  // add context menu for summarizing selected text
  browser.contextMenus.create({
    id: "quick-summary",
    title: "Quick Summary (Extractive)",
    contexts: ["selection"],
  });

  browser.contextMenus.create({
    id: "smart-summary",
    title: "Smart Summary (AI-powered)",
    contexts: ["selection"],
  });
};

browser.runtime.onInstalled.addListener(createContextMenus);

export const sendTextMessage = (tabId: number, message: TextMessage) => {
  browser.tabs.sendMessage(tabId, message).catch((error) => {
    throw error
  });
};

export const sendToggleMessage = (tabId: number, message: ToggleMessage) => {
  browser.tabs.sendMessage(tabId, message).catch((error) => {
    throw error
  });
};

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "readSelection" && info.selectionText && tab?.id !== undefined) {
    // Handle reading selected text
    const message: TextMessage = {
      action: "readSelection",
      text: info.selectionText,
    };
    sendTextMessage(tab.id, message);
  } else if (info.menuItemId === "readPage" && tab?.id !== undefined) {
    // Handle reading the entire page
    const message: TextMessage = {
      action: "readPage",
    };
    sendTextMessage(tab.id, message);
  } else if (
    (info.menuItemId === "quick-summary" || info.menuItemId === "smart-summary") &&
    info.selectionText &&
    tab?.id !== undefined
  ) {
    // Handle summarizing selected text
    const message: TextMessage = {
      action: info.menuItemId,
      text: info.selectionText,
    };
    sendTextMessage(tab.id, message);
  }
});

// auto enable/disable distraction when reload or open new tab
browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    browser.storage.local.get(["removeDistractions", "extensionEnabled"]).then((result) => {
      const message: ToggleMessage = {
        action: "setRemoveDistractions",
        enabled: (result.removeDistractions as boolean) && (result.extensionEnabled as boolean),
      };
      sendToggleMessage(tabId, message);
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
            const message: ToggleMessage = {
              action: "setRemoveDistractions",
              enabled: false,
            };
            sendToggleMessage(tab.id, message);
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
            const message: ToggleMessage = {
              action: "setRemoveDistractions",
              enabled: true,
            };
            sendToggleMessage(tab.id, message);
          }
        });
      }
    }
  }
});
