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
    editableDiv.textContent = inputElement.value || inputElement.textContent;
    console.log("Initial content set:", editableDiv.textContent);

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
    originalInput.value = editableDiv.textContent;
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

    const text = editableDiv.textContent;
    const highlightedFragments = [];
    let lastIndex = 0;

    improvements.forEach((imp, index) => {
      if (imp.start > lastIndex) {
        highlightedFragments.push(document.createTextNode(text.slice(lastIndex, imp.start)));
      }
      const span = document.createElement('span');
      span.className = 'highlight';
      span.dataset.index = index;
      span.style.backgroundColor = this.getHighlightColor(index);
      span.textContent = text.slice(imp.start, imp.end);
      highlightedFragments.push(span);
      lastIndex = imp.end;
    });

    if (lastIndex < text.length) {
      highlightedFragments.push(document.createTextNode(text.slice(lastIndex)));
    }

    editableDiv.innerHTML = '';
    highlightedFragments.forEach(fragment => editableDiv.appendChild(fragment));

    console.log("Highlights applied");
    return editableDiv;
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