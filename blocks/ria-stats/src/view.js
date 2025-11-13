/**
 * RIA Stats Group - Frontend JavaScript
 * Handles count-up animation and scroll-triggered animations
 */

(function() {
	'use strict';

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/**
	 * Parse a stat value to extract the number and suffix
	 * Handles formats like: "100", "250+", "98%", "$1.5M", "15K"
	 */
	function parseStatValue(valueText) {
		// Remove whitespace
		valueText = valueText.trim();

		// Extract prefix (like $, €, £)
		const prefixMatch = valueText.match(/^([^\d.,]+)/);
		const prefix = prefixMatch ? prefixMatch[1] : '';

		// Remove prefix for further processing
		let workingValue = prefix ? valueText.substring(prefix.length) : valueText;

		// Extract suffix (like +, %, K, M, B)
		const suffixMatch = workingValue.match(/([^\d.,]+)$/);
		const suffix = suffixMatch ? suffixMatch[1] : '';

		// Remove suffix to get just the number part
		let numberPart = suffix ? workingValue.substring(0, workingValue.length - suffix.length) : workingValue;

		// Parse the number (handle decimals and commas)
		const number = parseFloat(numberPart.replace(/,/g, ''));

		// Check if it has decimals
		const hasDecimals = numberPart.includes('.');
		const decimalPlaces = hasDecimals ? (numberPart.split('.')[1] || '').length : 0;

		return {
			number: isNaN(number) ? 0 : number,
			prefix,
			suffix,
			hasDecimals,
			decimalPlaces,
			original: valueText
		};
	}

	/**
	 * Format a number back to string with prefix/suffix
	 */
	function formatStatValue(value, parsed) {
		let formatted;

		if (parsed.hasDecimals) {
			formatted = value.toFixed(parsed.decimalPlaces);
		} else {
			formatted = Math.floor(value).toString();
		}

		// Add thousands separators if original had them
		if (parsed.original.includes(',')) {
			formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}

		return parsed.prefix + formatted + parsed.suffix;
	}

	/**
	 * Animate counting up from 0 to target value
	 */
	function animateCountUp(element, duration, delay) {
		// Get the target value from the element
		const valueElement = element.querySelector('.stat-value, .ria-stat-value');
		if (!valueElement) return;

		const originalText = valueElement.textContent;
		const parsed = parseStatValue(originalText);

		// If we couldn't parse a number, skip animation
		if (parsed.number === 0 && !originalText.includes('0')) {
			return;
		}

		// Store original for accessibility
		valueElement.setAttribute('aria-label', originalText);

		// Start animation after delay
		setTimeout(() => {
			const startTime = performance.now();
			const startValue = 0;
			const endValue = parsed.number;
			const durationMs = duration * 1000;

			function updateCount(currentTime) {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / durationMs, 1);

				// Easing function (ease-out cubic)
				const eased = 1 - Math.pow(1 - progress, 3);

				const currentValue = startValue + (endValue - startValue) * eased;
				valueElement.textContent = formatStatValue(currentValue, parsed);

				if (progress < 1) {
					requestAnimationFrame(updateCount);
				} else {
					// Ensure we end on the exact value
					valueElement.textContent = originalText;
				}
			}

			requestAnimationFrame(updateCount);
		}, delay * 1000);
	}

	/**
	 * Initialize count-up animation for a stats group
	 */
	function initCountUp(statsGroup) {
		// Check if count-up is enabled
		const countUpEnabled = statsGroup.dataset.countup === 'true';
		if (!countUpEnabled || prefersReducedMotion) {
			return;
		}

		const duration = parseFloat(statsGroup.dataset.countupDuration) || 2;
		const baseDelay = parseFloat(statsGroup.dataset.countupDelay) || 0.2;
		const staggerEnabled = statsGroup.dataset.stagger === 'true';
		const staggerDelay = parseFloat(statsGroup.dataset.staggerDelay) || 100;

		// Get all stat items
		const statItems = statsGroup.querySelectorAll('.wp-block-ria-stat, .stat-item');

		statItems.forEach((item, index) => {
			// Calculate delay with stagger if enabled
			const itemDelay = staggerEnabled
				? baseDelay + (index * staggerDelay / 1000)
				: baseDelay;

			animateCountUp(item, duration, itemDelay);
		});
	}

	/**
	 * Initialize scroll animation for a stats group
	 */
	function initScrollAnimation(statsGroup) {
		const animationType = statsGroup.dataset.animation;
		if (!animationType || animationType === 'none' || prefersReducedMotion) {
			return;
		}

		// Initially hide the element
		statsGroup.style.opacity = '0';

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Trigger animation
						statsGroup.style.opacity = '1';
						statsGroup.classList.add('animate', animationType);

						// Trigger count-up animation
						initCountUp(statsGroup);

						// Stop observing after animation
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -50px 0px'
			}
		);

		observer.observe(statsGroup);
	}

	/**
	 * Initialize stagger animation for stat items
	 */
	function initStaggerAnimation(statsGroup) {
		const staggerEnabled = statsGroup.dataset.stagger === 'true';
		const animationEnabled = statsGroup.dataset.animation && statsGroup.dataset.animation !== 'none';

		if (!staggerEnabled || !animationEnabled || prefersReducedMotion) {
			return;
		}

		const staggerDelay = parseFloat(statsGroup.dataset.staggerDelay) || 100;
		const statItems = statsGroup.querySelectorAll('.wp-block-ria-stat, .stat-item');

		statItems.forEach((item, index) => {
			const delay = index * staggerDelay;
			item.style.animationDelay = `${delay}ms`;
		});
	}

	/**
	 * Initialize all stats groups on the page
	 */
	function initStatsGroups() {
		const statsGroups = document.querySelectorAll('.wp-block-ria-stats-group, .ria-stats-group');

		statsGroups.forEach((statsGroup) => {
			// Check if already initialized
			if (statsGroup.dataset.initialized === 'true') {
				return;
			}

			// Mark as initialized
			statsGroup.dataset.initialized = 'true';

			// Initialize stagger animation
			initStaggerAnimation(statsGroup);

			// Initialize scroll animation (which will trigger count-up)
			initScrollAnimation(statsGroup);
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initStatsGroups);
	} else {
		initStatsGroups();
	}

	// Re-initialize on dynamic content load (for AJAX/infinite scroll)
	if (typeof window.MutationObserver !== 'undefined') {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) { // Element node
						if (node.matches('.wp-block-ria-stats-group, .ria-stats-group') ||
						    node.querySelector('.wp-block-ria-stats-group, .ria-stats-group')) {
							initStatsGroups();
						}
					}
				});
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}
})();
