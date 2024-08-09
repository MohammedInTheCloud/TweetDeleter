// src/grammer/textHighlighter.js

class TextHighlighter {
  constructor() {
    this.originalInputs = new Map();
    console.log("TextHighlighter initialized");
  }

  setupHighlighting(inputElement) {
    console.log("Setting up highlighting for:", inputElement);

    // Create and style the editable div
    const editableDiv = document.createElement("div");
    editableDiv.contentEditable = true;
    editableDiv.className = "editable-div";
    this.copyStyles(inputElement, editableDiv);

    // Set initial content
    editableDiv.innerHTML = this.escapeHtml(
      inputElement.value || inputElement.textContent
    );
    console.log("Initial content set:", editableDiv.innerHTML);

    // Insert editable div after the input element
    inputElement.insertAdjacentElement("afterend", editableDiv);

    // Store reference to original input and hide it
    this.originalInputs.set(editableDiv, inputElement);
    inputElement.style.display = "none";

    // Setup event listeners
    editableDiv.addEventListener("input", this.handleInput.bind(this));
    console.log("Event listeners set up");

    return editableDiv;
  }

  copyStyles(source, target) {
    const styles = window.getComputedStyle(source);
    for (const style of styles) {
      target.style[style] = styles.getPropertyValue(style);
    }
    // Ensure the div behaves like a text input
    target.style.whiteSpace = "pre-wrap";
    target.style.overflowWrap = "break-word";
    console.log("Styles copied from input to editable div");
  }

  handleInput(event) {
    const editableDiv = event.target;
    const originalInput = this.originalInputs.get(editableDiv);
    originalInput.value = editableDiv.innerText;
    console.log(
      "Input handled, original input value updated:",
      originalInput.value
    );
  }

  applyHighlightsToInput(inputElement, improvements) {
    console.log("Applying highlights to input:", inputElement);
    console.log("Improvements:", improvements);

    let editableDiv = this.originalInputs.has(inputElement.nextElementSibling)
      ? inputElement.nextElementSibling
      : this.setupHighlighting(inputElement);

    let html = this.escapeHtml(editableDiv.innerText);
    console.log("Original HTML:", html);

    const sortedImprovements = improvements.sort((a, b) => b.start - a.start);

    sortedImprovements.forEach((imp, index) => {
      const highlightColor = this.getHighlightColor(index);
      html =
        html.slice(0, imp.start) +
        `<span class="highlight" style="background-color: ${highlightColor};">` +
        html.slice(imp.start, imp.end) +
        "</span>" +
        html.slice(imp.end);
    });

    console.log("HTML with highlights:", html);

    // Preserve cursor position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const startNode = range.startContainer;

    editableDiv.innerHTML = html;

    // Restore cursor position
    this.restoreCursorPosition(editableDiv, startNode, startOffset);

    console.log("Highlights applied, cursor position restored");
    return editableDiv;
  }

  applyHighlightsToInput(inputElement, improvements) {
    console.log("Applying highlights to input:", inputElement);
    console.log("Improvements:", improvements);

    let editableDiv = this.originalInputs.has(inputElement.nextElementSibling)
      ? inputElement.nextElementSibling
      : this.setupHighlighting(inputElement);

    let html = this.escapeHtml(editableDiv.innerText);
    console.log("Original HTML:", html);

    const sortedImprovements = improvements.sort((a, b) => b.start - a.start);

    sortedImprovements.forEach((imp, index) => {
      const highlightColor = this.getHighlightColor(index);
      html =
        html.slice(0, imp.start) +
        `<span class="highlight" style="background-color: ${highlightColor};">` +
        html.slice(imp.start, imp.end) +
        "</span>" +
        html.slice(imp.end);
    });

    console.log("HTML with highlights:", html);

    // Preserve cursor position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const startNode = range.startContainer;

    editableDiv.innerHTML = html;

    // Restore cursor position
    this.restoreCursorPosition(editableDiv, startNode, startOffset);

    console.log("Highlights applied, cursor position restored");
    return editableDiv;
  }
  applyHighlights(editableDiv, improvements) {
    let html = this.escapeHtml(editableDiv.innerText);
    const sortedImprovements = improvements.sort((a, b) => b.start - a.start);

    sortedImprovements.forEach((imp, index) => {
      const highlightColor = this.getHighlightColor(index);
      html =
        html.slice(0, imp.start) +
        `<span class="highlight" style="background-color: ${highlightColor};">` +
        html.slice(imp.start, imp.end) +
        "</span>" +
        html.slice(imp.end);
    });

    // Preserve cursor position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const startNode = range.startContainer;

    editableDiv.innerHTML = html;

    // Restore cursor position
    this.restoreCursorPosition(editableDiv, startNode, startOffset);
  }

  restoreCursorPosition(editableDiv, startNode, startOffset) {
    const selection = window.getSelection();
    const range = document.createRange();

    let currentNode = editableDiv;
    let currentOffset = 0;

    const traverse = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.length + currentOffset >= startOffset) {
          range.setStart(node, startOffset - currentOffset);
          return true;
        }
        currentOffset += node.length;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (traverse(node.childNodes[i])) {
            return true;
          }
        }
      }
      return false;
    };

    traverse(currentNode);

    selection.removeAllRanges();
    selection.addRange(range);
    console.log('Cursor position restored');
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  getHighlightColor(index) {
    const colors = [
      "rgba(255, 0, 0, 0.2)", // Red
      "rgba(0, 255, 0, 0.2)", // Green
      "rgba(0, 0, 255, 0.2)", // Blue
      "rgba(255, 255, 0, 0.2)", // Yellow
      "rgba(255, 0, 255, 0.2)", // Magenta
      "rgba(0, 255, 255, 0.2)", // Cyan
    ];
    return colors[index % colors.length];
  }
}

export default TextHighlighter;
