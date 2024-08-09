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
    console.log("TextImprover initialized");
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
          const editableDiv = this.textHighlighter.applyHighlightsToInput(
            activeElement,
            improvements
          );

          // Create tooltips for each improvement
          improvements.forEach((improvement, index) => {
            const tooltipContent = `Suggestion: ${improvement.suggested}`;
            const highlightElement = editableDiv.querySelector(
              `.highlight[data-index="${index}"]`
            );
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
          console.log("No improvements to apply");
        }
      } catch (error) {
        console.error("Error in handleImprovedText:", error);
      }
    } else {
      console.warn("No active element to apply improvements to");
    }
  }
  findHighlightElement(editableDiv, start, end) {
    const highlightElements = editableDiv.querySelectorAll(".highlight");
    let currentOffset = 0;

    const findNodeAndOffset = (node, targetOffset) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (currentOffset + node.length > targetOffset) {
          return { node, offset: targetOffset - currentOffset };
        }
        currentOffset += node.length;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          const result = findNodeAndOffset(node.childNodes[i], targetOffset);
          if (result) return result;
        }
      }
      return null;
    };

    const startPosition = findNodeAndOffset(editableDiv, start);
    const endPosition = findNodeAndOffset(editableDiv, end);

    if (!startPosition || !endPosition) {
      console.warn(
        `Could not find appropriate nodes for range: ${start}-${end}`
      );
      return null;
    }

    const range = document.createRange();
    range.setStart(startPosition.node, startPosition.offset);
    range.setEnd(endPosition.node, endPosition.offset);

    for (const element of highlightElements) {
      if (range.intersectsNode(element)) {
        return element;
      }
    }

    return null;
  }
}

// Instantiate and initialize TextImprover
const textImprover = new TextImprover();
textImprover.init().catch((error) => {
  console.error("Error initializing TextImprover:", error);
});

export default TextImprover;
