// src/utils/RequestInterceptor.js

export class RequestInterceptor {
    constructor(targetUrl, onRequestCaptured) {
        this.targetUrl = targetUrl;
        this.onRequestCaptured = onRequestCaptured;
        this.originalXHROpen = XMLHttpRequest.prototype.open;
        this.originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        this.originalXHRSend = XMLHttpRequest.prototype.send;
        this.originalFetch = window.fetch;
    }

    init() {
        this.interceptXHR();
        this.interceptFetch();
    }

    interceptXHR() {
        const self = this;
        XMLHttpRequest.prototype.open = function(...args) {
            this._url = args[1];
            this._method = args[0];
            this._requestHeaders = {};
            self.originalXHROpen.apply(this, args);
        };

        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            this._requestHeaders[header.toLowerCase()] = value;
            self.originalXHRSetRequestHeader.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            if (this._url === self.targetUrl) {
                console.log('Intercepted XHR request to target URL');
                self.onRequestCaptured(this);
            }
            return self.originalXHRSend.apply(this, arguments);
        };
    }

    interceptFetch() {
        const self = this;
        window.fetch = function(input, init) {
            if (typeof input === 'string' && input === self.targetUrl) {
                console.log('Intercepted fetch request to target URL');
                self.onRequestCaptured({
                    _url: input,
                    _method: init?.method || 'GET',
                    _requestHeaders: init?.headers || {}
                });
            }
            return self.originalFetch.apply(this, arguments);
        };
    }
}