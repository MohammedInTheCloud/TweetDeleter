// ../grammer/textBoxDetector.js

import SentenceImprover from './sentenceImprover.js';
import { debounce } from '../utils/debounce.js';

class TextBoxDetector {
    constructor() {
        console.log('TextBoxDetector initialized');
        this.sentenceImprover = new SentenceImprover();
        this.debouncedImprove = debounce(this.improve.bind(this), 1000); // 1 second delay
        this.activeElement = null;
    }

    init(callback) {
        console.log('Initializing TextBoxDetector with EventListener');
        
        document.addEventListener('focus', this.handleFocus.bind(this), true);
        document.addEventListener('blur', this.handleBlur.bind(this), true);
        document.addEventListener('input', this.handleInput.bind(this));

        this.callback = callback;
    }

    handleFocus(e) {
        if (this.isValidTextBox(e.target)) {
            this.activeElement = e.target;
            console.log('Focus set on:', this.activeElement);
        }
    }

    handleBlur(e) {
        if (e.target === this.activeElement) {
            this.activeElement = null;
            console.log('Focus removed from input element');
        }
    }

    handleInput(e) {
        if (this.isValidTextBox(e.target)) {
            this.activeElement = e.target;
            let text = e.target.value || e.target.textContent;
            console.log('Input detected:', text);

            // Call the debounced improve function
            this.debouncedImprove(text);
        }
    }

    isValidTextBox(element) {
        return element.tagName === 'TEXTAREA' || 
               element.tagName === 'INPUT' || 
               element.getAttribute('contenteditable') === 'true';
    }

    async improve(text) {
        console.log('Improve function called with text:', text);
        if (this.activeElement) {
            try {
                console.log('Sending text to SentenceImprover:', text);
                const improvedText = await this.sentenceImprover.improveSentence(text);
                console.log('Received improved text:', improvedText);
                this.callback(text, improvedText);
            } catch (error) {
                console.error('Error improving sentence:', error);
                this.callback(text, text);
            }
        } else {
            console.warn('No active element to improve text for');
        }
    }
}

export default TextBoxDetector;