/**
 * RIA Resource Card - Frontend JavaScript
 * Handles scroll-triggered animations
 */

(function() {
	'use strict';

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Icon paths from Lucide
	const iconPaths = {
		'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
		'table': '<path d="M12 3v18"></path><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path>',
		'presentation': '<path d="M2 3h20"></path><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path><path d="m7 21 5-5 5 5"></path>',
		'archive': '<rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path>',
		'video': '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect>',
		'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',
		'calendar': '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>',
		'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
		'hard-drive': '<line x1="22" x2="2" y1="12" y2="12"></line><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><path d="M6 16h.01"></path><line x1="10" x2="10.01" y1="16" y2="16"></line>'
	};

	/**
	 * Render an icon from the iconPaths object
	 */
	function renderIcon(iconName, size = 16) {
		const path = iconPaths[iconName] || iconPaths['file-text'];
		return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
	}

	/**
	 * Initialize icons for a resource card
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
	 * Initialize all resource card blocks on the page
	 */
	function initResourceCards() {
		const blocks = document.querySelectorAll('.wp-block-ria-resource-card, .ria-resource-card');

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
		document.addEventListener('DOMContentLoaded', initResourceCards);
	} else {
		initResourceCards();
	}

	// Re-initialize on dynamic content load (for AJAX/infinite scroll)
	if (typeof window.MutationObserver !== 'undefined') {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) { // Element node
						if (node.matches('.wp-block-ria-resource-card, .ria-resource-card') ||
						    node.querySelector('.wp-block-ria-resource-card, .ria-resource-card')) {
							initResourceCards();
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
	window.RIAResourceCard = {
		init: initResourceCards
	};
})();
