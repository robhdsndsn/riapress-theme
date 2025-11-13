<?php
/**
 * Title: Quick Links Section
 * Slug: riapress/quick-links
 * Categories: links
 * Keywords: links, navigation, menu, resources
 * Block Types: ria/link-list
 * Description: Display a list of important links
 */
?>
<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide">
	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/link-list {"title":"Member Resources","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/link-list {"title":"Important Links","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/link-list {"title":"Quick Access","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
