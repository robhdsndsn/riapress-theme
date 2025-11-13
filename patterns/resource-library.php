<?php
/**
 * Title: Resource Library Grid
 * Slug: riapress/resource-library
 * Categories: resources
 * Keywords: resources, downloads, documents, library, publications
 * Block Types: ria/resource-card
 * Description: Display a collection of downloadable resources
 */
?>
<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide">
	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center"><?php echo esc_html_x( 'Resource Library', 'Pattern heading', 'riapress' ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center"} -->
	<p class="has-text-align-center"><?php echo esc_html_x( 'Download reports, guides, and publications', 'Pattern description', 'riapress' ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/resource-card {"title":"Annual Report 2024","description":"Comprehensive overview of our activities and impact","resourceType":"report","layout":"card","variant":"default","showDownloadButton":true} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/resource-card {"title":"Best Practices Guide","description":"Essential guidelines for practitioners","resourceType":"guide","layout":"card","variant":"default","showDownloadButton":true} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/resource-card {"title":"Policy Brief: Industry Standards","description":"Analysis and recommendations","resourceType":"policy","layout":"card","variant":"default","showDownloadButton":true} /-->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->

	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/resource-card {"title":"Training Materials","description":"Workshop handouts and slides","resourceType":"presentation","layout":"card","variant":"default","showDownloadButton":true} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/resource-card {"title":"Data Dashboard","description":"Interactive data visualization","resourceType":"tool","layout":"card","variant":"default","showDownloadButton":true} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/resource-card {"title":"Member Newsletter","description":"Latest news and updates","resourceType":"article","layout":"card","variant":"default","showDownloadButton":true} /-->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
