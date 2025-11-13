/**
 * RIA Person Profile - Frontend JavaScript
 * Handles scroll-triggered animations for person profile blocks
 */

(function() {
	'use strict';

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Icon paths from Lucide
	const iconPaths = {
		'mail': '<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>',
		'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
		'globe': '<circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path>',
		'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>'
	};

	/**
	 * Render an icon from the iconPaths object
	 */
	function renderIcon(iconName, size = 16) {
		const path = iconPaths[iconName] || iconPaths['mail'];
		return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
	}

	/**
	 * Initialize icons for a person profile block
	 */
	function initIcons(profileBlock) {
		const iconElements = profileBlock.querySelectorAll('[data-icon]');
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
	function initScrollAnimation(profileBlock) {
		const animationType = profileBlock.dataset.animation;
		const animationDuration = parseFloat(profileBlock.dataset.duration) || 0.6;
		const animationDelay = parseFloat(profileBlock.dataset.delay) || 0;

		// If no animation type or reduced motion, show immediately
		if (!animationType || animationType === 'none' || prefersReducedMotion) {
			profileBlock.style.opacity = '1';
			profileBlock.classList.remove('animate');
			return;
		}

		// Initially hidden (CSS sets opacity: 0 for blocks with data-animation)
		// Observer will reveal when scrolled into view
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Apply delay if specified
						setTimeout(() => {
							// Add animate class to trigger CSS transition
							profileBlock.classList.add('animate', animationType);
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

		observer.observe(profileBlock);
	}

	/**
	 * Initialize all person profile blocks on the page
	 */
	function initPersonProfiles() {
		const profileBlocks = document.querySelectorAll('.wp-block-ria-person-profile, .ria-person-profile');

		profileBlocks.forEach((profileBlock) => {
			// Check if already initialized
			if (profileBlock.dataset.initialized === 'true') {
				return;
			}

			// Mark as initialized
			profileBlock.dataset.initialized = 'true';

			// Initialize icons
			initIcons(profileBlock);

			// Initialize scroll animation
			initScrollAnimation(profileBlock);
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initPersonProfiles);
	} else {
		initPersonProfiles();
	}

	// Re-initialize on dynamic content load (for AJAX/infinite scroll)
	if (typeof window.MutationObserver !== 'undefined') {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) { // Element node
						if (node.matches('.wp-block-ria-person-profile, .ria-person-profile') ||
						    node.querySelector('.wp-block-ria-person-profile, .ria-person-profile')) {
							initPersonProfiles();
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
	window.RIAPersonProfile = {
		init: initPersonProfiles
	};
})();
