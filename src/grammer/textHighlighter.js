class TextHighlighter {
    constructor() {
        this.highlightElements = new Map();
    }

    applyUnderline(inputElement, improvements) {
        // Clear previous highlights
        this.highlightElements.clear();

        // Remove any existing wrapper and highlight layer
        if (inputElement.parentNode.classList.contains('highlight-wrapper')) {
            inputElement.parentNode.replaceWith(inputElement);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'highlight-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        inputElement.parentNode.insertBefore(wrapper, inputElement);
        wrapper.appendChild(inputElement);

        const highlightLayer = document.createElement('div');
        highlightLayer.style.position = 'absolute';
        highlightLayer.style.top = '0';
        highlightLayer.style.left = '0';
        highlightLayer.style.pointerEvents = 'none';
        highlightLayer.style.width = '100%';
        highlightLayer.style.height = '100%';
        wrapper.appendChild(highlightLayer);

        // Create a mirror element to accurately calculate positions
        const mirror = document.createElement('div');
        mirror.style.visibility = 'hidden';
        mirror.style.position = 'absolute';
        mirror.style.top = '0';
        mirror.style.left = '0';
        mirror.style.whiteSpace = 'pre-wrap';
        mirror.style.wordWrap = 'break-word';
        mirror.style.fontSize = window.getComputedStyle(inputElement).fontSize;
        mirror.style.fontFamily = window.getComputedStyle(inputElement).fontFamily;
        mirror.style.lineHeight = window.getComputedStyle(inputElement).lineHeight;
        mirror.style.paddingTop = window.getComputedStyle(inputElement).paddingTop;
        mirror.style.paddingRight = window.getComputedStyle(inputElement).paddingRight;
        mirror.style.paddingBottom = window.getComputedStyle(inputElement).paddingBottom;
        mirror.style.paddingLeft = window.getComputedStyle(inputElement).paddingLeft;
        mirror.style.borderTop = window.getComputedStyle(inputElement).borderTop;
        mirror.style.borderRight = window.getComputedStyle(inputElement).borderRight;
        mirror.style.borderBottom = window.getComputedStyle(inputElement).borderBottom;
        mirror.style.borderLeft = window.getComputedStyle(inputElement).borderLeft;
        mirror.style.width = inputElement.offsetWidth + 'px';
        wrapper.appendChild(mirror);

        const text = inputElement.value || inputElement.textContent;
        mirror.textContent = text;

        improvements.forEach(imp => {
            if (imp.start < 0 || imp.end > text.length) {
                console.warn('Improvement out of bounds:', imp);
                return;
            }

            const highlight = document.createElement('span');
            highlight.style.position = 'absolute';
            highlight.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            highlight.style.borderBottom = '2px solid red';

            const range = document.createRange();
            const startNode = mirror.firstChild;
            const endNode = mirror.firstChild;
            range.setStart(startNode, imp.start);
            range.setEnd(endNode, imp.end);

            const rects = range.getClientRects();
            for (let i = 0; i < rects.length; i++) {
                const rect = rects[i];
                const highlightClone = highlight.cloneNode();
                highlightClone.style.left = `${rect.left - mirror.getBoundingClientRect().left}px`;
                highlightClone.style.top = `${rect.top - mirror.getBoundingClientRect().top}px`;
                highlightClone.style.width = `${rect.width}px`;
                highlightClone.style.height = `${rect.height}px`;
                highlightLayer.appendChild(highlightClone);

                // Store the highlight element (we'll use the first one for tooltips)
                if (i === 0) {
                    this.highlightElements.set(imp, highlightClone);
                }
            }
        });

        // Remove the mirror element
        wrapper.removeChild(mirror);
    }

    getHighlightElement(improvement) {
        return this.highlightElements.get(improvement);
    }
}

export default TextHighlighter;