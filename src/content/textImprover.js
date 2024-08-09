// src/content/textImprover.js

import TextBoxDetector from "../grammer/textBoxDetector.js";
import TextAnalyzer from "../grammer/textAnalyzer.js";
import TextHighlighter from "../grammer/textHighlighter.js";
import TooltipManager from "../utils/tooltipManager.js";

class TextImprover {
    constructor() {
        this.textBoxDetector = new TextBoxDetector();
        this.tooltipManager = new TooltipManager();
        this.textAnalyzer = new TextAnalyzer();
        this.textHighlighter = new TextHighlighter();
        console.log('TextImprover initialized');
    }

    init() {
        console.log("TextImprover initialization started");
        return this.textBoxDetector.init(this.handleImprovedText.bind(this));
    }

    handleImprovedText(originalText, improvedText) {
        console.log("Original text:", originalText);
        console.log("Improved text:", improvedText);
        const activeElement = this.textBoxDetector.activeElement;
        if (activeElement) {
            try {
                const improvements = this.textAnalyzer.parseImprovements(
                    originalText,
                    improvedText
                );
                console.log("Parsed improvements:", improvements);

                if (improvements.length > 0) {
                    // Apply highlights
                    const editableDiv = this.textHighlighter.applyHighlightsToInput(activeElement, improvements);

                    // Create tooltips for each improvement
                    improvements.forEach((improvement, index) => {
                        const tooltipContent = `Suggestion: ${improvement.suggested}`;
                        const highlightElement = editableDiv.querySelector(`.highlight:nth-child(${index + 1})`);
                        if (highlightElement) {
                            this.tooltipManager.createOrUpdateTooltip(
                                highlightElement,
                                tooltipContent
                            );
                            console.log(
                                `Tooltip created for improvement ${index}:`,
                                improvement
                            );
                        } else {
                            console.warn(
                                `Highlight element not found for improvement ${index}:`,
                                improvement
                            );
                        }
                    });
                } else {
                    console.log('No improvements to apply');
                }
            } catch (error) {
                console.error('Error in handleImprovedText:', error);
            }
        } else {
            console.warn('No active element to apply improvements to');
        }
    }
}

// Instantiate and initialize TextImprover
const textImprover = new TextImprover();
textImprover.init().catch((error) => {
    console.error("Error initializing TextImprover:", error);
});

export default TextImprover;