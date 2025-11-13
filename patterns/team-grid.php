<?php
/**
 * Title: Team Member Grid
 * Slug: riapress/team-grid
 * Categories: team
 * Keywords: team, staff, people, members, profile
 * Block Types: ria/person-profile
 * Description: A grid layout showcasing team members with photos and details
 */
?>
<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide">
	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center"><?php echo esc_html_x( 'Meet Our Team', 'Pattern heading', 'riapress' ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center"} -->
	<p class="has-text-align-center"><?php echo esc_html_x( 'Dedicated professionals committed to excellence', 'Pattern description', 'riapress' ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/person-profile {"name":"Jane Smith","title":"Executive Director","bio":"Leading our organization with vision and expertise","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/person-profile {"name":"John Doe","title":"Program Manager","bio":"Coordinating programs and community initiatives","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/person-profile {"name":"Sarah Johnson","title":"Communications Lead","bio":"Managing stakeholder engagement and communications","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
