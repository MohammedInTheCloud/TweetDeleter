document.addEventListener('DOMContentLoaded', function () {

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

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        // Send message to the content script of the active tab

        chrome.tabs.sendMessage(tabs[0].id, { type: 'START_DELETION', username: username });

    });

}

document.addEventListener('DOMContentLoaded', function () {

    const deleteButton = document.getElementById('deleteButton');

    const unlikeButton = document.getElementById('unlikeButton');



    if (deleteButton) {

        deleteButton.addEventListener('click', startDeletion);

    } else {

        console.error('Delete button not found');

    }



    if (unlikeButton) {

        unlikeButton.addEventListener('click', startUnliking);

    } else {

        console.error('Unlike button not found');

    }

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const statusElement = document.getElementById('status');
    const loadingElement = document.getElementById('loading');

    switch (message.type) {
        case 'UNLIKING_COMPLETE':
            showNotification(`Unliking process completed: ${message.result}`, 'success');
            if (statusElement) statusElement.textContent = 'Unliking completed';
            if (loadingElement) loadingElement.style.display = 'none';
            break;
        case 'UNLIKING_ERROR':
            showNotification(`Error in unliking process: ${message.error}`, 'error');
            if (statusElement) statusElement.textContent = 'Unliking failed';
            if (loadingElement) loadingElement.style.display = 'none';
            break;
    }
});

function startUnliking() {

    const usernameInput = document.getElementById('usernameInput');

    const username = usernameInput.value.trim();

    const statusElement = document.getElementById('status');

    const loadingElement = document.getElementById('loading');



    if (!username) {

        showNotification('Please enter your Twitter username', 'error');

        return;

    }



    if (statusElement) statusElement.textContent = 'Unliking in progress...';

    if (loadingElement) loadingElement.style.display = 'flex';



    console.log("Start Unliking for user:", username);



    // Get the current active tab

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        if (chrome.runtime.lastError) {

            console.error('Error querying tabs:', chrome.runtime.lastError);

            showNotification('Error starting unliking process', 'error');

            if (loadingElement) loadingElement.style.display = 'none';

            return;

        }



        if (tabs.length === 0) {

            console.error('No active tab found');

            showNotification('Error: No active tab found', 'error');

            if (loadingElement) loadingElement.style.display = 'none';

            return;

        }



        // Send message to the content script of the active tab

        chrome.tabs.sendMessage(tabs[0].id, { type: 'START_UNLIKING', username: username }, function (response) {

            if (chrome.runtime.lastError) {

                console.error('Error sending message:', chrome.runtime.lastError);

                showNotification('Error communicating with the page', 'error');

                if (loadingElement) loadingElement.style.display = 'none';

            } else if (response && response.error) {

                console.error('Error from content script:', response.error);

                showNotification(`Error: ${response.error}`, 'error');

                if (loadingElement) loadingElement.style.display = 'none';

            }

            // If no error, wait for the UNLIKING_COMPLETE or UNLIKING_ERROR message

        });

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
