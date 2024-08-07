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

// src/background/background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "queryOllama") {
    fetch('http://localhost:3000/query-ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.data),
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({ success: true, data: data });
    })
    .catch(error => {
      console.error('Error querying Ollama:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;  // Indicates that the response is sent asynchronously
  }
});

// Keep the existing installation listener
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tweet Deleter extension installed or updated');
});