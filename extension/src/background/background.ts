import { RulerConfig } from "@/content/features/readingRuler";
import { applyColorCodingToTab, applyThemeToTab } from "@/content/features/theme";
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

export interface StyleMessage extends ToggleMessage {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  fontFamily: string;
}

export interface RulerMessage extends BaseMessage {
  config: RulerConfig;
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
    throw error;
  });
};

export const sendToggleMessage = (tabId: number, message: ToggleMessage) => {
  browser.tabs.sendMessage(tabId, message).catch((error) => {
    throw error;
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

browser.runtime.onMessage.addListener((message: BaseMessage) => {
  if (message.action === "fetchAllFeaturesEnabled") {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        fetchAllFeaturesEnabled(tabId);
      }
    });
  }
});

function fetchAllFeaturesEnabled(tabId) {
  browser.storage.local
    .get([
      "extensionEnabled",
      "fontSize",
      "letterSpacing",
      "fontFamily",
      "lineHeight",
      "wordSpacing",
      "ruler",
      "rulerHeight",
      "rulerOpacity",
      "rulerColor",
      "colorCodingEnabled",
    ])
    .then((result) => {
      const textStyleMessage: StyleMessage = {
        action: "setTextStyle",
        enabled: result.extensionEnabled as boolean,
        fontSize: result.fontSize as number,
        letterSpacing: result.letterSpacing as number,
        fontFamily: result.fontFamily as string,
        lineHeight: result.lineHeight as number,
        wordSpacing: result.wordSpacing as number,
      };

      applyThemeToTab(tabId, result.extensionEnabled as boolean).then(() => {
        applyColorCodingToTab(tabId, result.colorCodingEnabled as boolean);
      });

      const rulerMessage: RulerMessage = {
        action: "recreateRuler",
        config: {
          ruler: result.ruler as boolean,
          rulerHeight: result.rulerHeight as number,
          rulerOpacity: result.rulerOpacity as number,
          rulerColor: result.rulerColor as string,
        },
      };

      browser.tabs.sendMessage(tabId, textStyleMessage);

      browser.tabs.sendMessage(tabId, rulerMessage);
    });
}

// auto enable/disable distraction when reload or open new tab
browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    browser.storage.local.set({ removeDistractions: false });
    fetchAllFeaturesEnabled(tabId);
  }
});

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === "toggleExtension") {
    const result = await browser.storage.local.get([
      "removeDistractions",
      "extensionEnabled",
      "fontSize",
      "letterSpacing",
      "fontFamily",
      "lineHeight",
      "wordSpacing",
      "ruler",
      "rulerHeight",
      "rulerOpacity",
      "rulerColor",
    ]);
    const removeDistractions = result.removeDistractions as boolean;
    const rulerConfig: RulerConfig = {
      ruler: result.ruler as boolean,
      rulerHeight: result.rulerHeight as number,
      rulerOpacity: result.rulerOpacity as number,
      rulerColor: result.rulerColor as string,
    };
    if (!message.enabled) {
      browser.contextMenus.removeAll();
      if (removeDistractions) {
        // Disable distraction-free mode
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          const tabId = tabs[0]?.id;
          if (tabId) {
            const removeDistractionsMessage: ToggleMessage = {
              action: "setRemoveDistractions",
              enabled: false,
            };

            sendToggleMessage(tabId, removeDistractionsMessage);
          }
        });
      }

      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const tabId = tabs[0]?.id;
        if (tabId) {
          const textStyleMessage: StyleMessage = {
            action: "setTextStyle",
            enabled: result.extensionEnabled as boolean,
            fontSize: result.fontSize as number,
            letterSpacing: result.letterSpacing as number,
            fontFamily: result.fontFamily as string,
            lineHeight: result.lineHeight as number,
            wordSpacing: result.wordSpacing as number,
          };

          const rulerMessage: RulerMessage = {
            action: "updateRuler",
            config: { ...rulerConfig, ruler: false },
          };
          browser.tabs.sendMessage(tabId, rulerMessage);
          browser.tabs.sendMessage(tabId, textStyleMessage);
          applyThemeToTab(tabId, false);
        }
      });
    } else {
      browser.contextMenus.removeAll().then(createContextMenus);

      // Enable text style
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const tabId = tabs[0]?.id;
        if (tabId) {
          const message: ToggleMessage = {
            action: "setTextStyle",
            enabled: true,
          };
          sendToggleMessage(tabId, message);

          if (rulerConfig.ruler) {
            const rulerMessage: RulerMessage = {
              action: "recreateRuler",
              config: rulerConfig,
            };
            browser.tabs.sendMessage(tabId, rulerMessage);
          }
          applyThemeToTab(tabId, true);
        }
      });

      if (removeDistractions) {
        // Enable distraction-free mode
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          const tabId = tabs[0]?.id;
          if (tabId) {
            const message: ToggleMessage = {
              action: "setRemoveDistractions",
              enabled: removeDistractions,
            };
            sendToggleMessage(tabId, message);
          }
        });
      }
    }
  }
});

// Set default values when the extension is installed
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({
    ruler: false,
    rulerHeight: 25,
    rulerOpacity: 50,
    rulerColor: "#d9d9d9",
  });
});

// Keep service worker alive in MV3
browser.runtime.onConnect.addListener(function (port) {
  if (port.name === "keepAlive") {
    port.onDisconnect.addListener(function () {
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
    fontFamily: "openDyslexic",
    extensionEnabled: true,
  });
});
