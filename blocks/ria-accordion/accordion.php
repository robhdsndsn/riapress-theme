<?php
/**
 * RIA Accordion Block
 *
 * Collapsible content sections with parent/child pattern
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-accordion', 'ria-accordion/build/', 'ria-accordion' );
new RP_Custom_Block( 'ria-accordion-item', 'ria-accordion-item/build/', 'ria-accordion' );

/**
 * Enqueue frontend JavaScript for accordion functionality
 */
function ria_accordion_frontend_script() {
	// Only enqueue on frontend
	if ( is_admin() ) {
		return;
	}

	// Register and enqueue our frontend script
	wp_register_script(
		'ria-accordion-frontend',
		false, // No source file, using inline script
		array(), // No dependencies needed
		'1.0.0',
		true // Load in footer
	);

	wp_enqueue_script( 'ria-accordion-frontend' );

	wp_add_inline_script( 'ria-accordion-frontend', '
		(function() {
			function initAccordions() {
				const accordions = document.querySelectorAll(".ria-accordion");

				accordions.forEach(function(accordion) {
					const allowMultiple = accordion.dataset.allowMultiple === "true";
					const items = accordion.querySelectorAll(".ria-accordion-item");

					items.forEach(function(item) {
						const title = item.querySelector(".ria-accordion-item-title");
						const content = item.querySelector(".ria-accordion-item-content");
						const isOpen = item.dataset.isOpen === "true";

						// Set initial state
						if (isOpen) {
							item.classList.add("is-open");
						}

						// Remove any existing listeners to prevent duplicates
						const newTitle = title.cloneNode(true);
						title.parentNode.replaceChild(newTitle, title);

						newTitle.addEventListener("click", function() {
							const wasOpen = item.classList.contains("is-open");

							// If not allowing multiple open, close all items
							if (!allowMultiple && !wasOpen) {
								items.forEach(function(otherItem) {
									otherItem.classList.remove("is-open");
								});
							}

							// Toggle current item
							item.classList.toggle("is-open");
						});
					});
				});
			}

			// Initialize when DOM is ready
			if (document.readyState === "loading") {
				document.addEventListener("DOMContentLoaded", initAccordions);
			} else {
				// DOM already loaded
				initAccordions();
			}
		})();
	' );
}
add_action( 'wp_enqueue_scripts', 'ria_accordion_frontend_script' );
