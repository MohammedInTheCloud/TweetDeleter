// ../grammer/textBoxDetector.js

import SentenceImprover from './sentenceImprover.js';
import { debounce } from '../utils/debounce.js';

class TextBoxDetector {
    constructor() {
        console.log('TextBoxDetector initialized');
        this.sentenceImprover = new SentenceImprover();
        this.debouncedImprove = debounce(this.improve.bind(this), 1000); // 1 second delay
    }

    init(callback) {
        console.log('Initializing TextBoxDetector with EventListener');
        
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.getAttribute('contenteditable') === 'true') {
                let text = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' ? e.target.value : e.target.textContent;
                console.log('Input detected:', text);

                // Call the debounced improve function
                this.debouncedImprove(text, callback);
            }
        });
    }

    async improve(text, callback) {
        console.log('Improve function called with text:', text);
        try {
            console.log('Sending text to SentenceImprover:', text);
            const improvedText = await this.sentenceImprover.improveSentence(text);
            console.log('Received improved text:', improvedText);
            callback(text, improvedText);
        } catch (error) {
            console.error('Error improving sentence:', error);
            callback(text, text);
        }
    }
}

export default TextBoxDetector;