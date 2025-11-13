/**
 * RIA Accordion - Frontend JavaScript
 *
 * Handles accordion expand/collapse functionality, keyboard navigation,
 * focus management, smooth animations, and WCAG 2.1 AA accessibility.
 */

(function() {
	'use strict';

	/**
	 * Initialize all accordion blocks on the page
	 */
	function initAccordions() {
		const accordionBlocks = document.querySelectorAll('.wp-block-ria-accordion');

		accordionBlocks.forEach((block) => {
			const config = JSON.parse(block.dataset.accordionConfig || '{}');
			const items = block.querySelectorAll('.accordion-item');

			if (items.length === 0) {
				console.warn('RIA Accordion: No items found', block);
				return;
			}

			// Initialize each accordion item
			items.forEach((item, index) => {
				initAccordionItem(item, index, items, config, block);
			});

			// Apply stagger animation delays if enabled
			applyStaggerAnimation(block, items);
		});
	}

	/**
	 * Initialize individual accordion item
	 */
	function initAccordionItem(item, index, allItems, config, block) {
		const title = item.querySelector('.accordion-item-title');
		const content = item.querySelector('.accordion-item-content');
		const contentInner = content.querySelector('.accordion-content-inner');

		if (!title || !content || !contentInner) {
			console.warn('RIA Accordion: Missing required elements', item);
			return;
		}

		// Get configuration
		const animationSpeed = config.animationSpeed || 300;
		const smooth = config.smooth !== false;
		const allowMultipleOpen = config.allowMultipleOpen === true;
		const defaultOpen = parseInt(config.defaultOpen) || -1;

		// Set initial state
		const isOpen = item.dataset.isOpen === 'true' || index === defaultOpen;

		if (isOpen) {
			item.classList.add('is-open');
			content.style.maxHeight = contentInner.scrollHeight + 'px';
			title.setAttribute('aria-expanded', 'true');
			content.setAttribute('aria-hidden', 'false');
		} else {
			content.style.maxHeight = '0px';
			title.setAttribute('aria-expanded', 'false');
			content.setAttribute('aria-hidden', 'true');
		}

		// Add transition
		if (smooth) {
			content.style.transition = `max-height ${animationSpeed}ms ease-in-out`;
		}

		// Click handler
		title.addEventListener('click', (e) => {
			e.preventDefault();
			toggleItem(item, title, content, contentInner, allItems, config);
		});

		// Keyboard handlers
		title.addEventListener('keydown', (e) => {
			handleKeyboardNavigation(e, item, title, content, contentInner, allItems, config, index);
		});

		// Update max-height on window resize (for responsive content)
		const resizeObserver = new ResizeObserver(() => {
			if (item.classList.contains('is-open')) {
				content.style.maxHeight = contentInner.scrollHeight + 'px';
			}
		});
		resizeObserver.observe(contentInner);

		// Respect prefers-reduced-motion
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			content.style.transition = 'none';
		}
	}

	/**
	 * Toggle accordion item open/closed
	 */
	function toggleItem(item, title, content, contentInner, allItems, config) {
		const isOpen = item.classList.contains('is-open');
		const allowMultipleOpen = config.allowMultipleOpen === true;

		// If accordion type (single open), close all other items
		if (!allowMultipleOpen && !isOpen) {
			closeAllItems(allItems);
		}

		// Toggle current item
		if (isOpen) {
			closeItem(item, title, content);
		} else {
			openItem(item, title, content, contentInner);
		}

		// Emit custom event
		const eventName = isOpen ? 'riaAccordionClose' : 'riaAccordionOpen';
		item.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: { item, title, content }
		}));
	}

	/**
	 * Open accordion item
	 */
	function openItem(item, title, content, contentInner) {
		item.classList.add('is-open');
		title.setAttribute('aria-expanded', 'true');
		content.setAttribute('aria-hidden', 'false');

		// Set max-height to content height for smooth animation
		const contentHeight = contentInner.scrollHeight;
		content.style.maxHeight = contentHeight + 'px';

		// Focus management: keep focus on title
		title.focus();
	}

	/**
	 * Close accordion item
	 */
	function closeItem(item, title, content) {
		item.classList.remove('is-open');
		title.setAttribute('aria-expanded', 'false');
		content.setAttribute('aria-hidden', 'true');
		content.style.maxHeight = '0px';

		// Focus management: keep focus on title
		title.focus();
	}

	/**
	 * Close all accordion items
	 */
	function closeAllItems(items) {
		items.forEach((item) => {
			const title = item.querySelector('.accordion-item-title');
			const content = item.querySelector('.accordion-item-content');

			if (item.classList.contains('is-open')) {
				closeItem(item, title, content);
			}
		});
	}

	/**
	 * Handle keyboard navigation
	 */
	function handleKeyboardNavigation(e, item, title, content, contentInner, allItems, config, currentIndex) {
		const key = e.key;

		switch (key) {
			case 'Enter':
			case ' ': // Space
				e.preventDefault();
				toggleItem(item, title, content, contentInner, allItems, config);
				break;

			case 'ArrowDown':
				e.preventDefault();
				focusNextItem(allItems, currentIndex);
				break;

			case 'ArrowUp':
				e.preventDefault();
				focusPreviousItem(allItems, currentIndex);
				break;

			case 'Home':
				e.preventDefault();
				focusFirstItem(allItems);
				break;

			case 'End':
				e.preventDefault();
				focusLastItem(allItems);
				break;

			default:
				// No action for other keys
				break;
		}
	}

	/**
	 * Focus next accordion item
	 */
	function focusNextItem(items, currentIndex) {
		const nextIndex = currentIndex + 1;
		if (nextIndex < items.length) {
			const nextTitle = items[nextIndex].querySelector('.accordion-item-title');
			if (nextTitle) nextTitle.focus();
		}
	}

	/**
	 * Focus previous accordion item
	 */
	function focusPreviousItem(items, currentIndex) {
		const prevIndex = currentIndex - 1;
		if (prevIndex >= 0) {
			const prevTitle = items[prevIndex].querySelector('.accordion-item-title');
			if (prevTitle) prevTitle.focus();
		}
	}

	/**
	 * Focus first accordion item
	 */
	function focusFirstItem(items) {
		if (items.length > 0) {
			const firstTitle = items[0].querySelector('.accordion-item-title');
			if (firstTitle) firstTitle.focus();
		}
	}

	/**
	 * Focus last accordion item
	 */
	function focusLastItem(items) {
		if (items.length > 0) {
			const lastTitle = items[items.length - 1].querySelector('.accordion-item-title');
			if (lastTitle) lastTitle.focus();
		}
	}

	/**
	 * Apply stagger animation delays to items
	 */
	function applyStaggerAnimation(block, items) {
		const animationEnabled = block.dataset.animation && block.dataset.animation !== 'none';

		if (!animationEnabled) return;

		items.forEach((item, index) => {
			const baseDelay = parseInt(block.dataset.animationDelay) || 0;
			const staggerDelay = parseInt(item.dataset.animationDelay) || 0;
			const totalDelay = baseDelay + staggerDelay;

			if (totalDelay > 0) {
				item.style.animationDelay = `${totalDelay}ms`;
			}
		});
	}

	/**
	 * Public API for programmatic control
	 */
	window.RIAAccordion = {
		/**
		 * Open specific accordion item by index
		 */
		open: function(blockOrSelector, itemIndex) {
			const block = typeof blockOrSelector === 'string'
				? document.querySelector(blockOrSelector)
				: blockOrSelector;

			if (!block || !block.classList.contains('wp-block-ria-accordion')) {
				console.warn('RIA Accordion: Invalid block element', blockOrSelector);
				return;
			}

			const items = block.querySelectorAll('.accordion-item');
			if (itemIndex < 0 || itemIndex >= items.length) {
				console.warn('RIA Accordion: Invalid item index', itemIndex);
				return;
			}

			const item = items[itemIndex];
			const title = item.querySelector('.accordion-item-title');
			const content = item.querySelector('.accordion-item-content');
			const contentInner = content.querySelector('.accordion-content-inner');

			if (!item.classList.contains('is-open')) {
				openItem(item, title, content, contentInner);
			}
		},

		/**
		 * Close specific accordion item by index
		 */
		close: function(blockOrSelector, itemIndex) {
			const block = typeof blockOrSelector === 'string'
				? document.querySelector(blockOrSelector)
				: blockOrSelector;

			if (!block || !block.classList.contains('wp-block-ria-accordion')) {
				console.warn('RIA Accordion: Invalid block element', blockOrSelector);
				return;
			}

			const items = block.querySelectorAll('.accordion-item');
			if (itemIndex < 0 || itemIndex >= items.length) {
				console.warn('RIA Accordion: Invalid item index', itemIndex);
				return;
			}

			const item = items[itemIndex];
			const title = item.querySelector('.accordion-item-title');
			const content = item.querySelector('.accordion-item-content');

			if (item.classList.contains('is-open')) {
				closeItem(item, title, content);
			}
		},

		/**
		 * Toggle specific accordion item by index
		 */
		toggle: function(blockOrSelector, itemIndex) {
			const block = typeof blockOrSelector === 'string'
				? document.querySelector(blockOrSelector)
				: blockOrSelector;

			if (!block || !block.classList.contains('wp-block-ria-accordion')) {
				console.warn('RIA Accordion: Invalid block element', blockOrSelector);
				return;
			}

			const items = block.querySelectorAll('.accordion-item');
			if (itemIndex < 0 || itemIndex >= items.length) {
				console.warn('RIA Accordion: Invalid item index', itemIndex);
				return;
			}

			const item = items[itemIndex];
			const title = item.querySelector('.accordion-item-title');
			const content = item.querySelector('.accordion-item-content');
			const contentInner = content.querySelector('.accordion-content-inner');
			const config = JSON.parse(block.dataset.accordionConfig || '{}');

			toggleItem(item, title, content, contentInner, items, config);
		},

		/**
		 * Open all accordion items in a block (if toggle type)
		 */
		openAll: function(blockOrSelector) {
			const block = typeof blockOrSelector === 'string'
				? document.querySelector(blockOrSelector)
				: blockOrSelector;

			if (!block || !block.classList.contains('wp-block-ria-accordion')) {
				console.warn('RIA Accordion: Invalid block element', blockOrSelector);
				return;
			}

			const config = JSON.parse(block.dataset.accordionConfig || '{}');
			if (!config.allowMultipleOpen) {
				console.warn('RIA Accordion: Cannot open all items in accordion mode');
				return;
			}

			const items = block.querySelectorAll('.accordion-item');
			items.forEach((item) => {
				const title = item.querySelector('.accordion-item-title');
				const content = item.querySelector('.accordion-item-content');
				const contentInner = content.querySelector('.accordion-content-inner');

				if (!item.classList.contains('is-open')) {
					openItem(item, title, content, contentInner);
				}
			});
		},

		/**
		 * Close all accordion items in a block
		 */
		closeAll: function(blockOrSelector) {
			const block = typeof blockOrSelector === 'string'
				? document.querySelector(blockOrSelector)
				: blockOrSelector;

			if (!block || !block.classList.contains('wp-block-ria-accordion')) {
				console.warn('RIA Accordion: Invalid block element', blockOrSelector);
				return;
			}

			const items = block.querySelectorAll('.accordion-item');
			closeAllItems(items);
		},
	};

	/**
	 * Initialize on DOM ready
	 */
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initAccordions);
	} else {
		initAccordions();
	}

	/**
	 * Re-initialize if new accordions are added dynamically
	 */
	if (window.MutationObserver) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length) {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === 1 && node.classList && node.classList.contains('wp-block-ria-accordion')) {
							initAccordions();
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

})();
