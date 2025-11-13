/**
 * RIA Event Card - Frontend JavaScript
 * Handles scroll-triggered animations
 */

(function() {
	'use strict';

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Icon paths from Lucide
	const iconPaths = {
		'calendar': '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>',
		'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>',
		'monitor': '<rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line>',
		'shuffle': '<path d="m18 14 4 4-4 4"></path><path d="m18 2 4 4-4 4"></path><path d="M2 18h1.973a4 4 0 0 0 2.828-1.172l9.426-9.426a4 4 0 0 1 2.828-1.172H22"></path><path d="M2 6h1.972a4 4 0 0 1 2.829 1.172l9.425 9.426a4 4 0 0 0 2.829 1.172H22"></path>'
	};

	/**
	 * Render an icon from the iconPaths object
	 */
	function renderIcon(iconName, size = 16) {
		const path = iconPaths[iconName] || iconPaths['calendar'];
		return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
	}

	/**
	 * Initialize icons for an event card
	 */
	function initIcons(card) {
		const iconElements = card.querySelectorAll('[data-icon]');
		iconElements.forEach((iconEl) => {
			const iconName = iconEl.dataset.icon;
			if (iconName && !iconEl.querySelector('svg')) {
				const size = iconEl.classList.contains('icon') ? 20 : 16;
				iconEl.innerHTML = renderIcon(iconName, size);
			}
		});
	}

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
	 * Initialize all event card blocks on the page
	 */
	function initEventCards() {
		const blocks = document.querySelectorAll('.wp-block-ria-event-card, .ria-event-card');

		blocks.forEach((block) => {
			// Check if already initialized
			if (block.dataset.initialized === 'true') {
				return;
			}

			// Mark as initialized
			block.dataset.initialized = 'true';

			// Initialize icons
			initIcons(block);

			// Initialize scroll animation
			initScrollAnimation(block);
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initEventCards);
	} else {
		initEventCards();
	}

	// Re-initialize on dynamic content load (for AJAX/infinite scroll)
	if (typeof window.MutationObserver !== 'undefined') {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) { // Element node
						if (node.matches('.wp-block-ria-event-card, .ria-event-card') ||
						    node.querySelector('.wp-block-ria-event-card, .ria-event-card')) {
							initEventCards();
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
	window.RIAEventCard = {
		init: initEventCards
	};
})();
