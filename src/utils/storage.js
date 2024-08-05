// src/utils/storage.js

export function saveRequestInfo(requestInfo) {
  window.postMessage({ type: 'SAVE_REQUEST_INFO', requestInfo }, '*');
}

export function getRequestInfo() {
  return new Promise((resolve) => {
    const messageId = Date.now().toString();
    const listener = (event) => {
      if (event.data.type === 'REQUEST_INFO_RESPONSE' && event.data.messageId === messageId) {
        window.removeEventListener('message', listener);
        resolve(event.data.requestInfo);
      }
    };
    window.addEventListener('message', listener);
    window.postMessage({ type: 'GET_REQUEST_INFO', messageId }, '*');
  });
}

export function saveUsername(username) {
  return new Promise((resolve) => {
    const messageId = Date.now().toString();
    const listener = (event) => {
      if (event.data.type === 'USERNAME_SAVED' && event.data.messageId === messageId) {
        window.removeEventListener('message', listener);
        resolve(event.data.success);
      }
    };
    window.addEventListener('message', listener);
    window.postMessage({ type: 'SAVE_USERNAME', username, messageId }, '*');
  });
}

export function getUsername() {
  return new Promise((resolve) => {
    const messageId = Date.now().toString();
    const listener = (event) => {
      if (event.data.type === 'USERNAME_RESPONSE' && event.data.messageId === messageId) {
        window.removeEventListener('message', listener);
        resolve(event.data.username);
      }
    };
    window.addEventListener('message', listener);
    window.postMessage({ type: 'GET_USERNAME', messageId }, '*');
  });
}