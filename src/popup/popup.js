document.addEventListener('DOMContentLoaded', function() {
    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
        deleteButton.addEventListener('click', startDeletion);
    } else {
        console.error('Delete button not found');
    }
});

function startDeletion() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();
    
    if (!username) {
        showNotification('Please enter your Twitter username', 'error');
        return;
    }

    const statusElement = document.getElementById('status');
    const loadingElement = document.getElementById('loading');
    if (statusElement) statusElement.textContent = '';
    if (loadingElement) loadingElement.style.display = 'flex';
    console.log("Start Deletion for user:", username);
   
    // Get the current active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Send message to the content script of the active tab
        chrome.tabs.sendMessage(tabs[0].id, { type: 'START_DELETION', username: username });
    });
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const statusElement = document.getElementById('status');
    const loadingElement = document.getElementById('loading');
    if (message.type === 'DELETION_COMPLETE') {
        showNotification(`Deletion process completed: ${message.result}`, 'success');
        if (loadingElement) loadingElement.style.display = 'none';
    } else if (message.type === 'DELETION_ERROR') {
        showNotification(`Error in deletion process: ${message.error}`, 'error');
        if (loadingElement) loadingElement.style.display = 'none';
    }
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}