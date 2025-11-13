<?php
/**
 * RIA Countdown Block
 *
 * Countdown timer to a specific date/time
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-countdown', 'ria-countdown/build/', 'ria-countdown' );

/**
 * Enqueue frontend JavaScript for countdown functionality
 */
function ria_countdown_frontend_script() {
	// Only enqueue on frontend
	if ( is_admin() ) {
		return;
	}

	// Register and enqueue our frontend script
	wp_register_script(
		'ria-countdown-frontend',
		false, // No source file, using inline script
		array(), // No dependencies needed
		'1.0.0',
		true // Load in footer
	);

	wp_enqueue_script( 'ria-countdown-frontend' );

	wp_add_inline_script( 'ria-countdown-frontend', '
		(function() {
			function initCountdowns() {
				const countdowns = document.querySelectorAll(".ria-countdown");

				countdowns.forEach(function(countdown) {
					const targetDate = new Date(countdown.dataset.targetDate).getTime();
					const expiredMessage = countdown.dataset.expiredMessage || "Event has ended";
					const daysEl = countdown.querySelector(".ria-countdown-days .ria-countdown-number");
					const hoursEl = countdown.querySelector(".ria-countdown-hours .ria-countdown-number");
					const minutesEl = countdown.querySelector(".ria-countdown-minutes .ria-countdown-number");
					const secondsEl = countdown.querySelector(".ria-countdown-seconds .ria-countdown-number");

					function updateCountdown() {
						const now = new Date().getTime();
						const difference = targetDate - now;

						if (difference <= 0) {
							countdown.innerHTML = "<div class=\"ria-countdown-expired\">" + expiredMessage + "</div>";
							clearInterval(interval);
							return;
						}

						const days = Math.floor(difference / (1000 * 60 * 60 * 24));
						const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
						const seconds = Math.floor((difference % (1000 * 60)) / 1000);

						if (daysEl) daysEl.textContent = days;
						if (hoursEl) hoursEl.textContent = hours;
						if (minutesEl) minutesEl.textContent = minutes;
						if (secondsEl) secondsEl.textContent = seconds;
					}

					// Update immediately
					updateCountdown();

					// Update every second
					const interval = setInterval(updateCountdown, 1000);
				});
			}

			// Initialize when DOM is ready
			if (document.readyState === "loading") {
				document.addEventListener("DOMContentLoaded", initCountdowns);
			} else {
				// DOM already loaded
				initCountdowns();
			}
		})();
	' );
}
add_action( 'wp_enqueue_scripts', 'ria_countdown_frontend_script' );
