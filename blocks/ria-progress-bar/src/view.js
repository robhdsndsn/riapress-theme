/**
 * RIA Progress Bar - Frontend JavaScript
 * Handles scroll-triggered progress bar fill animations
 */

(function() {
	'use strict';

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/**
	 * Animate progress bar fill from 0 to target percentage
	 */
	function animateProgressBar(progressItem, duration, delay, easing) {
		const fillElement = progressItem.querySelector('.progress-fill');
		const targetPercentage = parseInt(progressItem.dataset.percentage || 0, 10);

		if (!fillElement || targetPercentage === 0) return;

		// Store original width for ARIA
		fillElement.setAttribute('aria-valuenow', targetPercentage);

		// Set initial state (0%)
		fillElement.style.width = '0%';

		// Start animation after delay
		setTimeout(() => {
			// Use CSS transition for smooth animation
			fillElement.style.transition = `width ${duration}s ${easing}`;
			fillElement.style.width = `${targetPercentage}%`;

			// Update ARIA live region for screen readers
			const liveRegion = document.createElement('div');
			liveRegion.setAttribute('aria-live', 'polite');
			liveRegion.setAttribute('aria-atomic', 'true');
			liveRegion.className = 'sr-only';
			liveRegion.textContent = `Progress: ${targetPercentage}%`;
			progressItem.appendChild(liveRegion);

			// Clean up live region after announcement
			setTimeout(() => {
				if (liveRegion.parentNode) {
					liveRegion.parentNode.removeChild(liveRegion);
				}
			}, 1000);
		}, delay * 1000);
	}

	/**
	 * Initialize progress bar animations for a container
	 */
	function initProgressBar(progressBar) {
		// Check if animation on scroll is enabled
		const animateOnScroll = progressBar.dataset.animateOnScroll === 'true';
		if (!animateOnScroll || prefersReducedMotion) {
			// If not animating on scroll, show bars at full width immediately
			const progressItems = progressBar.querySelectorAll('.ria-progress-item');
			progressItems.forEach(item => {
				const fillElement = item.querySelector('.progress-fill');
				const targetPercentage = parseInt(item.dataset.percentage || 0, 10);
				if (fillElement) {
					fillElement.style.width = `${targetPercentage}%`;
				}
			});
			return;
		}

		const duration = parseFloat(progressBar.dataset.progressDuration) || 1.5;
		const baseDelay = parseFloat(progressBar.dataset.progressDelay) || 0;
		const easing = progressBar.dataset.easing || 'ease-out';

		// Get all progress items
		const progressItems = progressBar.querySelectorAll('.ria-progress-item');

		progressItems.forEach((item, index) => {
			// Stagger animation for multiple bars (100ms delay between each)
			const itemDelay = baseDelay + (index * 0.1);
			animateProgressBar(item, duration, itemDelay, easing);
		});
	}

	/**
	 * Initialize scroll animation with Intersection Observer
	 */
	function initScrollAnimation(progressBar) {
		const animationType = progressBar.dataset.animation;
		const animateOnScroll = progressBar.dataset.animateOnScroll === 'true';

		// If container animation is enabled
		if (animationType && animationType !== 'none' && !prefersReducedMotion) {
			// Initially hide the element
			progressBar.style.opacity = '0';
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Trigger container animation if enabled
						if (animationType && animationType !== 'none' && !prefersReducedMotion) {
							progressBar.style.opacity = '1';
							progressBar.classList.add('animate', animationType);
						}

						// Trigger progress bar fill (animated or immediate)
						initProgressBar(progressBar);

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

		observer.observe(progressBar);
	}

	/**
	 * Apply striped pattern animation
	 */
	function applyStripedAnimation(progressBar) {
		// Striped pattern and animation are handled via CSS
		// This function is for any additional JavaScript-based enhancements
		const isStriped = progressBar.classList.contains('striped');
		const isAnimated = progressBar.classList.contains('animated');

		if (isStriped && isAnimated && !prefersReducedMotion) {
			// Add animation class to all progress fills
			const progressFills = progressBar.querySelectorAll('.progress-fill');
			progressFills.forEach(fill => {
				fill.classList.add('striped-animated');
			});
		}
	}

	/**
	 * Initialize all progress bars on the page
	 */
	function initProgressBars() {
		const progressBars = document.querySelectorAll('.wp-block-ria-progress-bar, .ria-progress-bar');

		progressBars.forEach((progressBar) => {
			// Check if already initialized
			if (progressBar.dataset.initialized === 'true') {
				return;
			}

			// Mark as initialized
			progressBar.dataset.initialized = 'true';

			// Apply striped animation if needed
			applyStripedAnimation(progressBar);

			// Initialize scroll animation (which will trigger progress fill)
			initScrollAnimation(progressBar);
		});
	}

	/**
	 * Easing functions for custom animations (if needed)
	 */
	const easingFunctions = {
		linear: t => t,
		easeIn: t => t * t,
		easeOut: t => t * (2 - t),
		easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
	};

	/**
	 * Custom progress animation using requestAnimationFrame
	 * (Alternative to CSS transition for more control)
	 */
	function customAnimateProgress(fillElement, targetPercentage, duration, easing) {
		const startTime = performance.now();
		const startWidth = 0;
		const endWidth = targetPercentage;
		const easingFunction = easingFunctions[easing] || easingFunctions.easeOut;

		function updateProgress(currentTime) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / (duration * 1000), 1);
			const eased = easingFunction(progress);
			const currentWidth = startWidth + (endWidth - startWidth) * eased;

			fillElement.style.width = `${currentWidth}%`;

			if (progress < 1) {
				requestAnimationFrame(updateProgress);
			} else {
				// Ensure we end on exact value
				fillElement.style.width = `${targetPercentage}%`;
			}
		}

		requestAnimationFrame(updateProgress);
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initProgressBars);
	} else {
		initProgressBars();
	}

	// Re-initialize on dynamic content load (for AJAX/infinite scroll)
	if (typeof window.MutationObserver !== 'undefined') {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) { // Element node
						if (node.matches('.wp-block-ria-progress-bar, .ria-progress-bar') ||
						    node.querySelector('.wp-block-ria-progress-bar, .ria-progress-bar')) {
							initProgressBars();
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

	// Expose API for manual initialization if needed
	window.RIAProgressBar = {
		init: initProgressBars,
		animateBar: animateProgressBar,
	};
})();
