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