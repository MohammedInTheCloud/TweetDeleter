// src/utils/tooltipManager.js

class TooltipManager {
  constructor() {
    this.tooltips = new Map();
    this.customTooltip = null;
  }

  createOrUpdateTooltip(element, content) {
    if (typeof tippy !== 'undefined') {
      this.createOrUpdateTippyTooltip(element, content);
    } else {
      this.createOrUpdateCustomTooltip(element, content);
    }
  }

  createOrUpdateTippyTooltip(element, content) {
    if (this.tooltips.has(element)) {
      this.tooltips.get(element).setContent(content);
    } else {
      const tooltip = tippy(element, {
        content: content,
        theme: 'light',
        arrow: true,
        placement: 'top',
      });
      this.tooltips.set(element, tooltip);
    }
  }

  createOrUpdateCustomTooltip(element, content) {
    if (!this.customTooltip) {
      this.customTooltip = document.createElement('div');
      this.customTooltip.style.cssText = `
        position: absolute;
        background: white;
        color: black;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: none;
        z-index: 10000;
      `;
      document.body.appendChild(this.customTooltip);
    }

    element.addEventListener('mouseenter', () => {
      this.customTooltip.textContent = content;
      this.customTooltip.style.display = 'block';
      const rect = element.getBoundingClientRect();
      this.customTooltip.style.top = `${rect.top + window.scrollY - this.customTooltip.offsetHeight - 10}px`;
      this.customTooltip.style.left = `${rect.left + window.scrollX}px`;
    });

    element.addEventListener('mouseleave', () => {
      this.customTooltip.style.display = 'none';
    });
  }

  removeTooltip(element) {
    if (this.tooltips.has(element)) {
      this.tooltips.get(element).destroy();
      this.tooltips.delete(element);
    }
  }
}

export default TooltipManager;