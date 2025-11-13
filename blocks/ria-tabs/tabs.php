<?php
/**
 * RIA Tabs Block (Molecule)
 *
 * Organize content in horizontal tabbed interface with smooth transitions.
 *
 * @package RIA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Register parent block (tabs container)
new RP_Custom_Block( 'ria-tabs', 'ria-tabs/build/', 'ria-tabs' );

// Register child block (individual tab item)
new RP_Custom_Block( 'ria-tab-item', 'ria-tabs/build/', 'ria-tab-item' );

/**
 * Enqueue frontend JavaScript for tabs functionality
 */
function ria_tabs_frontend_script() {
	// Only enqueue on frontend
	if ( is_admin() ) {
		return;
	}

	// Register and enqueue our frontend script
	wp_register_script(
		'ria-tabs-frontend',
		false, // No source file, using inline script
		array(), // No dependencies needed
		'1.0.0',
		true // Load in footer
	);

	wp_enqueue_script( 'ria-tabs-frontend' );

	wp_add_inline_script( 'ria-tabs-frontend', '
		(function() {
			function initTabs() {
				const tabContainers = document.querySelectorAll(".ria-tabs");

				tabContainers.forEach(function(container) {
					const nav = container.querySelector(".ria-tabs-nav");
					const content = container.querySelector(".ria-tabs-content");

					if (!nav || !content) return;

					// Move all tab buttons from content to nav
					const buttons = content.querySelectorAll(".ria-tab-button");
					buttons.forEach(function(button) {
						nav.appendChild(button);
					});

					// Now get references to moved elements
					const tabs = nav.querySelectorAll(".ria-tab-button");
					const panels = content.querySelectorAll(".ria-tab-panel");

					// Set initial state - first tab active if none are
					let hasActive = false;
					panels.forEach(function(panel) {
						if (panel.dataset.isActive === "true") {
							hasActive = true;
							panel.removeAttribute("hidden");
						} else {
							panel.setAttribute("hidden", "");
						}
					});

					if (!hasActive && panels.length > 0) {
						panels[0].dataset.isActive = "true";
						panels[0].classList.add("is-active");
						panels[0].removeAttribute("hidden");
						if (tabs[0]) {
							tabs[0].setAttribute("aria-selected", "true");
							tabs[0].classList.add("is-active");
						}
					}

					// Add click handlers to all tabs
					tabs.forEach(function(tab, index) {
						tab.addEventListener("click", function(e) {
							e.preventDefault();

							// Deactivate all tabs and panels
							tabs.forEach(function(t) {
								t.setAttribute("aria-selected", "false");
								t.classList.remove("is-active");
							});
							panels.forEach(function(p) {
								p.classList.remove("is-active");
								p.setAttribute("hidden", "");
							});

							// Activate clicked tab and corresponding panel
							tab.setAttribute("aria-selected", "true");
							tab.classList.add("is-active");

							const targetId = tab.getAttribute("aria-controls");
							const targetPanel = document.getElementById(targetId);
							if (targetPanel) {
								targetPanel.classList.add("is-active");
								targetPanel.removeAttribute("hidden");
							}
						});

						// Keyboard navigation
						tab.addEventListener("keydown", function(e) {
							let newIndex = index;

							if (e.key === "ArrowRight" || e.key === "ArrowDown") {
								e.preventDefault();
								newIndex = (index + 1) % tabs.length;
							} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
								e.preventDefault();
								newIndex = (index - 1 + tabs.length) % tabs.length;
							} else if (e.key === "Home") {
								e.preventDefault();
								newIndex = 0;
							} else if (e.key === "End") {
								e.preventDefault();
								newIndex = tabs.length - 1;
							} else {
								return;
							}

							tabs[newIndex].focus();
							tabs[newIndex].click();
						});
					});
				});
			}

			// Initialize when DOM is ready
			if (document.readyState === "loading") {
				document.addEventListener("DOMContentLoaded", initTabs);
			} else {
				// DOM already loaded
				initTabs();
			}
		})();
	' );
}
add_action( 'wp_enqueue_scripts', 'ria_tabs_frontend_script' );
