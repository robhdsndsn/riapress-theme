<?php
/**
 * RIA Shape Block
 *
 * Add decorative SVG shapes and dividers.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-shape', 'ria-shape/build/', 'ria-shape' );
