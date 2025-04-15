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

    // add context menu for changing color for selected text
    browser.contextMenus.create({
        id: "changeColor",
        title: "Change Color of Selected Text",
        contexts: ["selection"],
    });

    // add context menu for changing color for entire page
    browser.contextMenus.create({
        id: "changeColorPage",
        title: "Change Color of Page",
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