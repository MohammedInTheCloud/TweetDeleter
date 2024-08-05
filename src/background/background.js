// src/background/background.js

// The background script now has a minimal role, mainly for extension lifecycle management

// Add a listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tweet Deleter extension installed or updated');
});

// Optional: You can keep this listener if you want to log messages in the background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
});