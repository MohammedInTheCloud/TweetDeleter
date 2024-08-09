// src/content/textImprover.js

import TextBoxDetector from '../grammer/textBoxDetector.js';
import TextAnalyzer from '../grammer/textAnalyzer.js';
import TextHighlighter from '../grammer/textHighlighter.js';
import TooltipManager from '../utils/tooltipManager.js';

class TextImprover {
    constructor() {
        this.textBoxDetector = new TextBoxDetector();
        this.tooltipManager = new TooltipManager();
        this.textAnalyzer = new TextAnalyzer();
        this.textHighlighter = new TextHighlighter();
        this.activeElement = null;
    }

    init() {
        console.log('TextImprover initialized');
        document.addEventListener('focus', this.handleFocus.bind(this), true);
        return this.textBoxDetector.init(this.handleImprovedText.bind(this));
    }

    handleFocus(event) {
        if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT' || event.target.getAttribute('contenteditable') === 'true') {
            this.activeElement = event.target;
        } else {
            this.activeElement = null;
        }
    }

    handleImprovedText(originalText, improvedText) {
        console.log('Original text:', originalText);
        console.log('Improved text:', improvedText);
        if (this.activeElement) {
            const improvements = this.textAnalyzer.parseImprovements(originalText, improvedText);
            // Apply underlining
            this.textHighlighter.applyUnderline(this.activeElement, improvements);
            // Create tooltips for each improvement
            improvements.forEach(improvement => {
                const tooltipContent = `Suggestion: ${improvement.suggested}`;
                const highlightElement = this.textHighlighter.getHighlightElement(improvement);
                if (highlightElement) {
                    this.tooltipManager.createOrUpdateTooltip(highlightElement, tooltipContent);
                } else {
                    console.warn('Highlight element not found for improvement:', improvement);
                }
            });
        }
    }
    parseImprovements(improvedText) {
        const regex = /<improved>(.*?)<\/improved>/g;
        const improvements = [];
        let match;
        while ((match = regex.exec(improvedText)) !== null) {
            improvements.push(match[1]);
        }
        return improvements.length > 0 ? improvements : [improvedText];
    }
}

// Instantiate and initialize TextImprover
const textImprover = new TextImprover();
textImprover.init().catch(error => {
    console.error('Error initializing TextImprover:', error);
});

export default TextImprover;