<?php
/**
 * RIA Progress Bar Block
 *
 * A horizontal progress indicator with customizable styles.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-progress-bar', 'ria-progress-bar/build/', 'ria-progress-bar' );
