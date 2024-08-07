// ../grammer/sentenceImprover.js

import OllamaService from '../services/ollamaService.js';

class SentenceImprover {
    constructor() {
        this.ollamaService = new OllamaService();
    }

    async improveSentence(text) {
        try {
            const improvedText = await this.ollamaService.query(
                'gemma2:2b',
                `Improve the following sentence: "${text}"`,
                { stream: false }
            );
            return improvedText;
        } catch (error) {
            console.error('Error improving sentence:', error);
            return text; // Return original text if there's an error
        }
    }
}

export default SentenceImprover;