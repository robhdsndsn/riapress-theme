<?php
/**
 * Title: Call to action
 * Slug: riapress/cta
 * Categories: featured
 * Keywords: Call to action
 * Block Types: core/buttons
 */
?>
<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">
	<!-- wp:column -->
	<div class="wp-block-column">
		<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.2"}},"fontSize":"medium"} -->
		<p class="has-medium-font-size" style="line-height:1.2"><?php echo esc_html_x( 'Got any recommendations?', 'sample content for call to action', 'starter' ); ?>
		</p>
		<!-- /wp:paragraph -->

		<!-- wp:buttons -->
		<div class="wp-block-buttons">
			<!-- wp:button {"fontSize":"small"} -->
			<div class="wp-block-button has-custom-font-size has-small-font-size">
				<a class="wp-block-button__link wp-element-button">
				<?php echo esc_html_x( 'Get In Touch', 'sample content for call to action button', 'starter' ); ?>
				</a>
			</div>
			<!-- /wp:button -->
		</div>
		<!-- /wp:buttons -->
	</div>
	<!-- /wp:column -->
</div>
<!-- /wp:columns -->
