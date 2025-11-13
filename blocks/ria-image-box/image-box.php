<?php
/**
 * RIA Image Box Block
 *
 * An image container with overlay text and link functionality.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-image-box', 'ria-image-box/build/', 'ria-image-box' );
