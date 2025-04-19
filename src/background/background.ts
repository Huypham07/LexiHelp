// This file is used to set default values for the extension when it is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    fontSize: 16,
    letterSpacing: 1.0,
    lineHeight: 1.5,
    wordSpacing: 1.0,
    fontFamily: 'openDyslexic',
    extensionEnabled:true
  });
});