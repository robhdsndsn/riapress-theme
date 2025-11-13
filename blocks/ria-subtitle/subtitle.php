<?php
/**
 * RIA Subtitle Block
 *
 * A subtitle or tagline text element with customizable styling.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-subtitle', 'ria-subtitle/build/', 'ria-subtitle' );
