// src/content/contentScriptInjector.js

import { TweetDeleter } from '../utils/tweetDeleter.js';
import * as storage from '../utils/storage.js';

(function () {
    console.log('Content script injector loaded');

    let tweetDeleter = new TweetDeleter();
    let cachedRequestInfo = null;

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    const originalFetch = window.fetch;

    const TARGET_URL = "https://x.com/i/api/1.1/jot/client_event.json";

    // Intercept XMLHttpRequest
    XMLHttpRequest.prototype.open = function () {
        this._url = arguments[1];
        this._method = arguments[0];
        this._requestHeaders = {};
        originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        this._requestHeaders[header.toLowerCase()] = value;
        originalXHRSetRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        if (this._url === TARGET_URL) {
            console.log('Intercepted XHR request to target URL');
            captureRequestInfo(this);
        }
        return originalXHRSend.apply(this, arguments);
    };

    // Intercept fetch
    window.fetch = function (input, init) {
        if (typeof input === 'string' && input === TARGET_URL) {
            console.log('Intercepted fetch request to target URL');
            captureRequestInfo({
                _url: input,
                _method: init?.method || 'GET',
                _requestHeaders: init?.headers || {}
            });
        }
        return originalFetch.apply(this, arguments);
    };

    function captureRequestInfo(xhr) {
        const requestInfo = extractRequestInfo(xhr);
        console.log('Captured request info:', requestInfo);
        cachedRequestInfo = requestInfo;
        window.postMessage({
            type: 'REQUEST_INFO_CAPTURED',
            requestInfo: requestInfo
        }, '*');
    }

    function extractRequestInfo(xhr) {
        const requestInfo = {
            url: xhr._url,
            method: xhr._method,
            authorization: xhr._requestHeaders['authorization'],
            'x-client-transaction-id': xhr._requestHeaders['x-client-transaction-id'],
            'x-client-uuid': xhr._requestHeaders['x-client-uuid'],
            cookies: document.cookie,
            timestamp: new Date().toISOString()
        };
        return requestInfo;
    }


    async function startDeletionProcess(options, username) {
        try {
            console.log('Deletion options:', options);
            console.log('Username:', username);

            if (!cachedRequestInfo) {
                throw new Error('Request info not available. Please refresh the page and try again.');
            }

            console.log('Using cached request info:', cachedRequestInfo);

            // Initialize TweetDeleter with the cached request info and username
            await tweetDeleter.initialize({
                authorization: cachedRequestInfo.authorization,
                clientTid: cachedRequestInfo['x-client-transaction-id'],
                clientUuid: cachedRequestInfo['x-client-uuid'],
                cookies: cachedRequestInfo.cookies,
                username: username
            });

            // Extract userId and csrfToken from cookies string
            const cookies = parseCookies(cachedRequestInfo.cookies);
            tweetDeleter.userId = extractUserIdFromCookies(cookies);
            tweetDeleter.csrfToken = cookies['ct0'] || null;

            // Set the delete options
            tweetDeleter.setDeleteOptions(options);

            // Log the TweetDeleter state for debugging
            console.log('TweetDeleter state before starting deletion:', {
                authorization: tweetDeleter.authorization,
                clientTid: tweetDeleter.clientTid,
                clientUuid: tweetDeleter.clientUuid,
                userId: tweetDeleter.userId,
                csrfToken: tweetDeleter.csrfToken
            });

            // Start the deletion process
            const result = await tweetDeleter.startDeletionProcess();

            // Send a message back with the result
            window.postMessage({ type: 'DELETION_COMPLETE', result: result }, '*');
        } catch (error) {
            console.error('Error in deletion process:', error);
            window.postMessage({ type: 'DELETION_ERROR', error: error.message }, '*');
        }
    }

    // Helper function to parse cookies
    function parseCookies(cookieString) {
        return cookieString.split(';').reduce((cookies, cookie) => {
            const parts = cookie.trim().split('=');
            if (parts.length === 2) {
                cookies[parts[0]] = parts[1];
            }
            return cookies;
        }, {});
    }

    // Helper function to extract userId from cookies
    function extractUserIdFromCookies(cookies) {
        if (cookies['twid']) {
            const twidParts = cookies['twid'].split('%3D');
            return twidParts.length > 1 ? twidParts[1] : null;
        }
        return null;
    }
    // Listen for messages
    window.addEventListener('message', function (event) {
        // We only accept messages from ourselves
        if (event.source != window) return;

        switch (event.data.type) {
            case 'START_DELETION':
                startDeletionProcess(event.data.options, event.data.username);
                break;
            case 'SAVE_REQUEST_INFO':
                cachedRequestInfo = event.data.requestInfo;
                break;
            case 'GET_REQUEST_INFO':
                window.postMessage({
                    type: 'REQUEST_INFO_RESPONSE',
                    messageId: event.data.messageId,
                    requestInfo: cachedRequestInfo
                }, '*');
                break;
            case 'SAVE_USERNAME':
                // You might want to save this somewhere if needed
                break;
            case 'GET_USERNAME':
                // You might want to get this from somewhere if needed
                window.postMessage({
                    type: 'USERNAME_RESPONSE',
                    messageId: event.data.messageId,
                    username: null  // or where you store the username
                }, '*');
                break;
        }
    }, false);

    // Notify that the injector is ready
    window.postMessage({ type: 'INJECTOR_READY' }, '*');

})();