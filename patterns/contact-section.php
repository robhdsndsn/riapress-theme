<?php
/**
 * Title: Contact Information Section
 * Slug: riapress/contact-section
 * Categories: contact
 * Keywords: contact, address, phone, email, location
 * Block Types: ria/contact-info
 * Description: Display organization contact information
 */
?>
<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide">
	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center"><?php echo esc_html_x( 'Get In Touch', 'Pattern heading', 'riapress' ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center"} -->
	<p class="has-text-align-center"><?php echo esc_html_x( 'Contact us for more information', 'Pattern description', 'riapress' ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/contact-info {"organizationName":"Main Office","address":"123 Main Street\nSuite 100","city":"Toronto","province":"ON","postalCode":"M5H 2N2","phone":"(416) 555-0100","email":"info@organization.ca","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:ria/contact-info {"organizationName":"Regional Office","address":"456 Oak Avenue","city":"Vancouver","province":"BC","postalCode":"V6B 1A1","phone":"(604) 555-0200","email":"west@organization.ca","layout":"card","variant":"default"} /-->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
