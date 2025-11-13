<?php
/**
 * Tracking Support - All Google Analytics tracking code goes here, and any other miscellaneous tracking codes.
 *
 * @package RIAPress
 */


// define( 'WP_ENVIRONMENT_TYPE', 'production' ); needs to exist in wp-config.php for this to run

if ( defined( 'WP_ENVIRONMENT_TYPE' ) && WP_ENVIRONMENT_TYPE === 'production' ) {
	function google_tracking_head() {
		// tracking code that goes in the <head> of the site
		?>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8N86GYVW05"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-8N86GYVW05');
</script>
		<?php
	}

	add_action( 'wp_head', 'google_tracking_head' );
	function google_tracking_body_open() {
		// tracking code that goes in the first line of <body> of the site
		// do_action( 'z_body_open' ); will be in header.php

	}

	add_action( 'z_body_open', 'google_tracking_body_open' );
}

