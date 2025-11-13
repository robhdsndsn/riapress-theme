/**
 * RIA Tooltip - Frontend JavaScript
 *
 * Handles tooltip positioning, show/hide logic, and accessibility
 */
(function() {
	'use strict';

	let activeTooltip = null;
	let showTimeout = null;
	let hideTimeout = null;

	/**
	 * Initialize all tooltips on the page
	 */
	function initTooltips() {
		const tooltipBlocks = document.querySelectorAll('.wp-block-ria-tooltip');

		tooltipBlocks.forEach((block) => {
			const trigger = block.querySelector('.tooltip-trigger');
			const content = block.querySelector('.tooltip-content');
			const config = JSON.parse(block.dataset.tooltipConfig || '{}');

			if (!trigger || !content) return;

			// Setup event listeners
			setupTriggerEvents(trigger, content, config);
		});
	}

	/**
	 * Setup event listeners on trigger element
	 */
	function setupTriggerEvents(trigger, content, config) {
		// Mouse enter - show tooltip
		trigger.addEventListener('mouseenter', () => {
			clearTimeout(hideTimeout);
			showTooltip(trigger, content, config);
		});

		// Mouse leave - hide tooltip
		trigger.addEventListener('mouseleave', () => {
			clearTimeout(showTimeout);
			hideTooltip(content);
		});

		// Focus - show tooltip
		trigger.addEventListener('focus', () => {
			clearTimeout(hideTimeout);
			showTooltip(trigger, content, config);
		}, true);

		// Blur - hide tooltip
		trigger.addEventListener('blur', () => {
			clearTimeout(showTimeout);
			hideTooltip(content);
		}, true);

		// Touch support
		trigger.addEventListener('touchstart', (e) => {
			if (content.classList.contains('visible')) {
				hideTooltip(content);
			} else {
				showTooltip(trigger, content, config);
			}
		}, { passive: true });
	}

	/**
	 * Show tooltip with delay
	 */
	function showTooltip(trigger, content, config) {
		const delay = config.delayDuration || 700;

		showTimeout = setTimeout(() => {
			// Hide any other active tooltip
			if (activeTooltip && activeTooltip !== content) {
				activeTooltip.classList.remove('visible');
				activeTooltip.style.opacity = '0';
			}

			// Position tooltip
			positionTooltip(trigger, content, config);

			// Show tooltip
			content.classList.add('visible');
			content.style.opacity = '1';
			content.setAttribute('aria-hidden', 'false');

			activeTooltip = content;
		}, delay);
	}

	/**
	 * Hide tooltip
	 */
	function hideTooltip(content) {
		hideTimeout = setTimeout(() => {
			content.classList.remove('visible');
			content.style.opacity = '0';
			content.setAttribute('aria-hidden', 'true');

			if (activeTooltip === content) {
				activeTooltip = null;
			}
		}, 100);
	}

	/**
	 * Position tooltip relative to trigger
	 */
	function positionTooltip(trigger, content, config) {
		const position = config.position || 'top';
		const align = config.align || 'center';
		const offset = config.sideOffset || 8;

		// Get trigger position
		const triggerRect = trigger.getBoundingClientRect();
		const contentRect = content.getBoundingClientRect();

		// Calculate position based on config
		let top, left;

		switch (position) {
			case 'top':
				top = triggerRect.top - contentRect.height - offset;
				left = calculateAlignPosition(triggerRect, contentRect, align, 'horizontal');
				break;

			case 'bottom':
				top = triggerRect.bottom + offset;
				left = calculateAlignPosition(triggerRect, contentRect, align, 'horizontal');
				break;

			case 'left':
				top = calculateAlignPosition(triggerRect, contentRect, align, 'vertical');
				left = triggerRect.left - contentRect.width - offset;
				break;

			case 'right':
				top = calculateAlignPosition(triggerRect, contentRect, align, 'vertical');
				left = triggerRect.right + offset;
				break;

			default:
				top = triggerRect.top - contentRect.height - offset;
				left = calculateAlignPosition(triggerRect, contentRect, align, 'horizontal');
		}

		// Ensure tooltip stays within viewport
		const adjusted = adjustForViewport(top, left, contentRect);
		top = adjusted.top;
		left = adjusted.left;

		// Apply position
		content.style.position = 'fixed';
		content.style.top = `${top}px`;
		content.style.left = `${left}px`;
		content.style.zIndex = '10000';
	}

	/**
	 * Calculate alignment position
	 */
	function calculateAlignPosition(triggerRect, contentRect, align, direction) {
		if (direction === 'horizontal') {
			switch (align) {
				case 'start':
					return triggerRect.left;
				case 'end':
					return triggerRect.right - contentRect.width;
				case 'center':
				default:
					return triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
			}
		} else {
			switch (align) {
				case 'start':
					return triggerRect.top;
				case 'end':
					return triggerRect.bottom - contentRect.height;
				case 'center':
				default:
					return triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
			}
		}
	}

	/**
	 * Adjust position to stay within viewport
	 */
	function adjustForViewport(top, left, contentRect) {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

		// Adjust horizontal
		if (left < 10) {
			left = 10;
		} else if (left + contentRect.width > viewportWidth - 10) {
			left = viewportWidth - contentRect.width - 10;
		}

		// Adjust vertical
		if (top < 10) {
			top = 10;
		} else if (top + contentRect.height > viewportHeight - 10) {
			top = viewportHeight - contentRect.height - 10;
		}

		return { top, left };
	}

	/**
	 * Close tooltip on Escape key
	 */
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && activeTooltip) {
			hideTooltip(activeTooltip);
		}
	});

	/**
	 * Public API
	 */
	window.RIATooltip = {
		show: function(blockOrSelector) {
			const block = typeof blockOrSelector === 'string'
				? document.querySelector(blockOrSelector)
				: blockOrSelector;

			if (!block || !block.classList.contains('wp-block-ria-tooltip')) {
				console.warn('RIA Tooltip: Invalid block element', blockOrSelector);
				return;
			}

			const trigger = block.querySelector('.tooltip-trigger');
			const content = block.querySelector('.tooltip-content');
			const config = JSON.parse(block.dataset.tooltipConfig || '{}');

			if (trigger && content) {
				showTooltip(trigger, content, config);
			}
		},

		hide: function() {
			if (activeTooltip) {
				hideTooltip(activeTooltip);
			}
		},

		getActive: function() {
			return activeTooltip;
		}
	};

	/**
	 * Initialize on DOM ready
	 */
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initTooltips);
	} else {
		initTooltips();
	}

	// Re-initialize if new tooltips are added dynamically
	if (window.MutationObserver) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length) {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === 1 && node.classList && node.classList.contains('wp-block-ria-tooltip')) {
							initTooltips();
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

})();
