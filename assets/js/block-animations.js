/**
 * RIAPress Block Animation System
 *
 * Unified animation engine for all RIA blocks.
 * Uses IntersectionObserver for scroll-triggered animations.
 * Zero dependencies, vanilla JavaScript.
 *
 * @version 1.0.0
 * @author Rob Hudson
 * @date 2025-10-31
 */

class RIABlockAnimations {
  constructor() {
    this.blocks = [];
    this.observer = null;
    this.prefersReducedMotion = false;

    this.init();
  }

  /**
   * Initialize the animation system
   */
  init() {
    // Check accessibility preference
    this.checkReducedMotion();

    // Find all animated blocks
    this.blocks = document.querySelectorAll('.ria-animate');

    if (this.blocks.length === 0) {
      return;
    }

    // Create observer
    this.createObserver();

    // Observe blocks
    this.observeBlocks();
  }

  /**
   * Check if user prefers reduced motion
   */
  checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mediaQuery.matches;

    // Listen for changes to motion preference
    mediaQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
    });
  }

  /**
   * Create IntersectionObserver instance
   */
  createObserver() {
    const options = {
      root: null, // Use viewport as root
      rootMargin: '0px 0px -100px 0px', // Trigger 100px before entering viewport
      threshold: 0.1 // Trigger when 10% of element is visible
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      options
    );
  }

  /**
   * Start observing all blocks
   */
  observeBlocks() {
    this.blocks.forEach(block => {
      this.observer.observe(block);
    });
  }

  /**
   * Handle intersection events
   * @param {IntersectionObserverEntry[]} entries
   * @param {IntersectionObserver} observer
   */
  handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateBlock(entry.target);
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }

  /**
   * Animate a block element
   * @param {HTMLElement} block
   */
  animateBlock(block) {
    // Skip animation if user prefers reduced motion
    if (this.prefersReducedMotion) {
      block.classList.add('ria-animate-complete');
      block.style.opacity = '1';
      return;
    }

    // Get animation configuration from data attributes
    const animation = block.getAttribute('data-animation') || 'fadeIn';
    const duration = block.getAttribute('data-animation-duration') || '0.6';
    const delay = block.getAttribute('data-animation-delay') || '0';
    const easing = block.getAttribute('data-animation-easing') || 'ease-out';

    // Apply animation styles
    block.style.animationDuration = `${duration}s`;
    block.style.animationDelay = `${delay}s`;
    block.style.animationTimingFunction = easing;

    // Add animation class
    block.classList.add(`ria-animate-${animation}`);

    // Mark as complete after animation finishes
    block.addEventListener('animationend', () => {
      block.classList.add('ria-animate-complete');
      block.style.opacity = '1';
    }, { once: true });
  }

  /**
   * Manually trigger animation for a specific block
   * Useful for programmatic animations
   * @param {HTMLElement|string} blockOrSelector
   */
  trigger(blockOrSelector) {
    const block = typeof blockOrSelector === 'string'
      ? document.querySelector(blockOrSelector)
      : blockOrSelector;

    if (block && block.classList.contains('ria-animate')) {
      this.animateBlock(block);
    }
  }

  /**
   * Reset animation on a block (allow re-triggering)
   * @param {HTMLElement|string} blockOrSelector
   */
  reset(blockOrSelector) {
    const block = typeof blockOrSelector === 'string'
      ? document.querySelector(blockOrSelector)
      : blockOrSelector;

    if (!block) return;

    // Remove animation classes
    const animationClasses = Array.from(block.classList)
      .filter(cls => cls.startsWith('ria-animate-'));

    animationClasses.forEach(cls => block.classList.remove(cls));
    block.classList.remove('ria-animate-complete');

    // Reset opacity
    block.style.opacity = '0';

    // Re-observe if observer exists
    if (this.observer) {
      this.observer.observe(block);
    }
  }

  /**
   * Destroy the animation system
   * Cleanup method for SPAs or dynamic content
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.blocks = [];
    this.observer = null;
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.riaBlockAnimations = new RIABlockAnimations();
  });
} else {
  // DOM already loaded
  window.riaBlockAnimations = new RIABlockAnimations();
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RIABlockAnimations;
}
