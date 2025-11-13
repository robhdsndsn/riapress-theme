<?php
/**
 * RIA Header Block (Organism)
 *
 * Customizable site header with logo, navigation, and CTA area.
 * Includes sticky header, scroll effects, and mobile menu functionality.
 *
 * @package RIA
 */

// Register the block using RP_Custom_Block class
new RP_Custom_Block('ria-header', 'ria-header/build/', 'ria-header');

/**
 * Enqueue frontend JavaScript for sticky header and scroll effects
 */
function ria_header_frontend_scripts() {
	// Only enqueue on frontend, not in editor
	if ( is_admin() ) {
		return;
	}

	// Check if the header block is used on the page
	if ( ! has_block( 'ria/header' ) ) {
		return;
	}

	// Inline JavaScript for header functionality
	$inline_script = <<<'HEADERJS'
(function() {
	'use strict';

	// Wait for DOM to be ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initHeader);
	} else {
		initHeader();
	}

	function initHeader() {
		const headers = document.querySelectorAll('.ria-header .ria-header-inner');

		if (!headers.length) return;

		headers.forEach(function(header) {
			const isSticky = header.dataset.sticky === 'true' || header.classList.contains('is-sticky');
			const isTransparent = header.dataset.transparent === 'true' || header.classList.contains('is-transparent');
			const hasShadow = header.dataset.shadow === 'true' || header.classList.contains('has-shadow-on-scroll');

			// Add body class for sticky header spacing
			if (isSticky) {
				const headerHeight = header.offsetHeight;
				document.body.classList.add('has-sticky-header');
				document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
			}

			// Scroll handler for effects
			let ticking = false;

			function updateHeader() {
				const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				const isScrolled = scrollTop > 10;

				if (isScrolled) {
					header.classList.add('is-scrolled');
				} else {
					header.classList.remove('is-scrolled');
				}

				ticking = false;
			}

			function requestTick() {
				if (!ticking) {
					window.requestAnimationFrame(updateHeader);
					ticking = true;
				}
			}

			// Only add scroll listener if needed
			if (isTransparent || hasShadow) {
				window.addEventListener('scroll', requestTick, { passive: true });
				updateHeader(); // Initial check
			}

			// Mobile menu toggle
			const mobileToggle = header.querySelector('.mobile-menu-toggle');
			const navigation = header.querySelector('.header-navigation');

			if (mobileToggle && navigation) {
				mobileToggle.addEventListener('click', function() {
					const isOpen = navigation.classList.contains('is-open');

					if (isOpen) {
						navigation.classList.remove('is-open');
						mobileToggle.setAttribute('aria-expanded', 'false');
						mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
					} else {
						navigation.classList.add('is-open');
						mobileToggle.setAttribute('aria-expanded', 'true');
						mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
					}
				});
			}

			// Search toggle functionality (if implemented)
			const searchToggle = header.querySelector('.search-toggle');
			if (searchToggle) {
				searchToggle.addEventListener('click', function(e) {
					e.preventDefault();
					// Trigger WordPress search or custom search modal
					// This is a placeholder - implement based on your search solution
					console.log('Search clicked');
				});
			}

			// Close mobile menu when clicking outside
			document.addEventListener('click', function(e) {
				if (!header.contains(e.target) && navigation && navigation.classList.contains('is-open')) {
					navigation.classList.remove('is-open');
					if (mobileToggle) {
						mobileToggle.setAttribute('aria-expanded', 'false');
						mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
					}
				}
			});

			// Close mobile menu on escape key
			document.addEventListener('keydown', function(e) {
				if (e.key === 'Escape' && navigation && navigation.classList.contains('is-open')) {
					navigation.classList.remove('is-open');
					if (mobileToggle) {
						mobileToggle.setAttribute('aria-expanded', 'false');
						mobileToggle.focus();
					}
				}
			});

			// Handle window resize
			let resizeTimer;
			window.addEventListener('resize', function() {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					if (isSticky) {
						const headerHeight = header.offsetHeight;
						document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
					}

					// Close mobile menu on resize to desktop
					if (window.innerWidth > 768 && navigation && navigation.classList.contains('is-open')) {
						navigation.classList.remove('is-open');
						if (mobileToggle) {
							mobileToggle.setAttribute('aria-expanded', 'false');
						}
					}
				}, 250);
			});
		});
	}
})();
HEADERJS;

	wp_add_inline_script( 'ria-header-view-script', $inline_script );
}
add_action( 'wp_enqueue_scripts', 'ria_header_frontend_scripts' );

/**
 * Register the header script handle for inline script attachment
 */
function ria_header_register_script() {
	wp_register_script(
		'ria-header-view-script',
		'',
		array(),
		'1.0.0',
		true
	);
	wp_enqueue_script( 'ria-header-view-script' );
}
add_action( 'wp_enqueue_scripts', 'ria_header_register_script' );
