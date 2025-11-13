/**
 * RIA Alert Block - Frontend JavaScript
 * Handles animations and dismissible functionality
 */

(function () {
	'use strict';

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/**
	 * Initialize alert animations
	 */
	function initAlertAnimations(alert) {
		if (alert.dataset.initialized === 'true') {
			return;
		}

		alert.dataset.initialized = 'true';

		const animation = alert.dataset.animation;
		const delay = parseFloat(alert.dataset.delay) || 0;

		// If no animation or reduced motion preferred, show immediately
		if (!animation || animation === 'none' || prefersReducedMotion) {
			alert.style.opacity = '1';
			alert.classList.remove('animate');
			return;
		}

		// Set up Intersection Observer for scroll-triggered animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setTimeout(() => {
							alert.classList.add('animate', animation);
						}, delay * 1000);
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -50px 0px',
			}
		);

		observer.observe(alert);
	}

	/**
	 * Initialize dismissible alerts
	 */
	function initDismissible(alert) {
		if (!alert.classList.contains('is-dismissible')) {
			return;
		}

		const dismissButton = alert.querySelector('.ria-alert-dismiss');
		if (!dismissButton) {
			return;
		}

		dismissButton.addEventListener('click', function () {
			// Fade out animation
			alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
			alert.style.opacity = '0';
			alert.style.transform = 'scale(0.95)';

			// Remove from DOM after animation
			setTimeout(() => {
				alert.remove();
			}, 300);
		});
	}

	/**
	 * Initialize all alerts on page
	 */
	function initAlerts() {
		const alerts = document.querySelectorAll('.wp-block-ria-notification, .ria-alert');

		alerts.forEach((alert) => {
			initAlertAnimations(alert);
			initDismissible(alert);
		});
	}

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initAlerts);
	} else {
		initAlerts();
	}

	// Watch for dynamically added alerts
	if (typeof window.MutationObserver !== 'undefined') {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						if (
							node.matches('.wp-block-ria-notification, .ria-alert') ||
							node.querySelector('.wp-block-ria-notification, .ria-alert')
						) {
							initAlerts();
						}
					}
				});
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// Expose global init function
	window.RIAAlert = {
		init: initAlerts,
	};
})();
