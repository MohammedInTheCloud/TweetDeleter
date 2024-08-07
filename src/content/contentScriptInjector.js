// src/content/contentScriptInjector.js

import { LikeManager } from '../utils/likeManager.js';
import { TweetDeleter } from '../utils/tweetDeleter.js';
import { RequestInterceptor } from '../utils/requestInterceptor.js';
import { parseCookies, extractUserIdFromCookies } from '../utils/cookieUtils.js';
import * as storage from '../utils/storage.js';
import TextBoxDetector from '../grammer/textBoxDetector.js';

class ContentScriptInjector {
    static TARGET_URL = "https://x.com/i/api/1.1/jot/client_event.json";

    constructor() {
        this.tweetDeleter = new TweetDeleter();
        this.cachedRequestInfo = null;
        this.requestInterceptor = new RequestInterceptor(ContentScriptInjector.TARGET_URL, this.captureRequestInfo.bind(this));
    }

    init() {
        console.log('Content script injector loaded');
        this.requestInterceptor.init();
        this.setupEventListeners();
    }
    

    captureRequestInfo(xhr) {
        const requestInfo = this.extractRequestInfo(xhr);
        this.cachedRequestInfo = requestInfo;
        window.postMessage({
            type: 'REQUEST_INFO_CAPTURED',
            requestInfo: requestInfo
        }, '*');
    }

    extractRequestInfo(xhr) {
        return {
            url: xhr._url,
            method: xhr._method,
            authorization: xhr._requestHeaders['authorization'],
            'x-client-transaction-id': xhr._requestHeaders['x-client-transaction-id'],
            'x-client-uuid': xhr._requestHeaders['x-client-uuid'],
            cookies: document.cookie,
            timestamp: new Date().toISOString()
        };
    }

    async initializeManager(manager, options, username) {
        if (!this.cachedRequestInfo) {
            throw new Error('Request info not available. Please refresh the page and try again.');
        }

        await manager.initialize({
            authorization: this.cachedRequestInfo.authorization,
            clientTid: this.cachedRequestInfo['x-client-transaction-id'],
            clientUuid: this.cachedRequestInfo['x-client-uuid'],
            cookies: this.cachedRequestInfo.cookies,
            username: username
        });

        const cookies = parseCookies(this.cachedRequestInfo.cookies);
        manager.userId = extractUserIdFromCookies(cookies);
        manager.csrfToken = cookies['ct0'] || null;

        console.log(`${manager.constructor.name} state:`, {
            authorization: manager.authorization,
            clientTid: manager.clientTid,
            clientUuid: manager.clientUuid,
            userId: manager.userId,
            csrfToken: manager.csrfToken
        });

        return manager;
    }

    async startProcess(processType, options, username) {
        try {
            console.log(`${processType} options:`, options);
            console.log('Username:', username);

            let manager, result;
            if (processType === 'Deletion') {
                manager = await this.initializeManager(this.tweetDeleter, options, username);
                manager.setDeleteOptions(options);
                result = await manager.startDeletionProcess();
            } else if (processType === 'Unliking') {
                let likeManager = new LikeManager();
                manager = await this.initializeManager(likeManager, options, username);
                manager.setUnlikeOptions(options);
                result = await manager.startUnlikingProcess();
            }

            console.log(`${processType} process completed with result:`, result);
            window.postMessage({ type: `${processType.toUpperCase()}_COMPLETE`, result: result }, '*');
        } catch (error) {
            console.error(`Error in ${processType.toLowerCase()} process:`, error);
            window.postMessage({ type: `${processType.toUpperCase()}_ERROR`, error: error.message }, '*');
        }
    }

    setupEventListeners() {
        window.addEventListener('message', this.handleMessage.bind(this), false);
        window.postMessage({ type: 'INJECTOR_READY' }, '*');
    }

    handleMessage(event) {
        if (event.source != window) return;

        switch (event.data.type) {
            case 'START_DELETION':
                this.startProcess('Deletion', event.data.options, event.data.username);
                break;
            case 'START_UNLIKING':
                this.startProcess('Unliking', event.data.options, event.data.username);
                break;
            case 'SAVE_REQUEST_INFO':
                this.cachedRequestInfo = event.data.requestInfo;
                break;
            case 'GET_REQUEST_INFO':
                window.postMessage({
                    type: 'REQUEST_INFO_RESPONSE',
                    messageId: event.data.messageId,
                    requestInfo: this.cachedRequestInfo
                }, '*');
                break;
            case 'SAVE_USERNAME':
                // Implement if needed
                break;
            case 'GET_USERNAME':
                // Implement if needed
                window.postMessage({
                    type: 'USERNAME_RESPONSE',
                    messageId: event.data.messageId,
                    username: null  // Implement actual username retrieval if needed
                }, '*');
                break;
        }
    }
}

// Self-invoking function to maintain current behavior
(function () {
    const injector = new ContentScriptInjector();
    injector.init();
})();