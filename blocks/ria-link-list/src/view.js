/**
 * RIA Link List - Frontend JavaScript
 * Handles scroll-triggered animations
 */

(function() {
	'use strict';

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/**
	 * Initialize scroll animation with Intersection Observer
	 */
	function initScrollAnimation(block) {
		const animationType = block.dataset.animation;
		const animationDuration = parseFloat(block.dataset.duration) || 0.6;
		const animationDelay = parseFloat(block.dataset.delay) || 0;

		// If no animation type or reduced motion, show immediately
		if (!animationType || animationType === 'none' || prefersReducedMotion) {
			block.style.opacity = '1';
			block.classList.remove('animate');
			return;
		}

		// Observer will reveal when scrolled into view
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Apply delay if specified
						setTimeout(() => {
							// Add animate class to trigger CSS transition
							block.classList.add('animate', animationType);
						}, animationDelay * 1000);

						// Stop observing after animation triggered
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -50px 0px'
			}
		);

		observer.observe(block);
	}

	/**
	 * Initialize all link list blocks on the page
	 */
	function initLinkLists() {
		const blocks = document.querySelectorAll('.wp-block-ria-link-list, .ria-link-list');

		blocks.forEach((block) => {
			// Check if already initialized
			if (block.dataset.initialized === 'true') {
				return;
			}

			// Mark as initialized
			block.dataset.initialized = 'true';

			// Initialize scroll animation
			initScrollAnimation(block);
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initLinkLists);
	} else {
		initLinkLists();
	}

	// Re-initialize on dynamic content load (for AJAX/infinite scroll)
	if (typeof window.MutationObserver !== 'undefined') {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) { // Element node
						if (node.matches('.wp-block-ria-link-list, .ria-link-list') ||
						    node.querySelector('.wp-block-ria-link-list, .ria-link-list')) {
							initLinkLists();
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
	window.RIALinkList = {
		init: initLinkLists
	};
})();
