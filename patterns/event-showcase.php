<?php
/**
 * Title: Featured Events Showcase
 * Slug: riapress/event-showcase
 * Categories: events
 * Keywords: events, calendar, registration, upcoming
 * Block Types: ria/event-card
 * Description: Showcase upcoming events with registration details
 */
?>
<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide">
	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center"><?php echo esc_html_x( 'Upcoming Events', 'Pattern heading', 'riapress' ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:ria/event-card {"title":"Annual General Meeting","description":"Join us for our annual general meeting and networking reception","startDate":"2025-03-15","startTime":"18:00","endTime":"20:00","locationName":"Conference Centre","locationType":"in-person","layout":"featured","variant":"primary","isFeatured":true} /-->

	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/event-card {"title":"Workshop: Professional Development","description":"Skills training for emerging leaders","startDate":"2025-03-20","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/event-card {"title":"Webinar: Industry Trends","description":"Expert panel discussion on current trends","startDate":"2025-03-25","locationType":"virtual","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
