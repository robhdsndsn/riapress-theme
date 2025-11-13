<?php
/**
 * RIA Link List Block
 *
 * Displays a list of links with optional icons and descriptions.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-link-list', 'ria-link-list/build/', 'ria-link-list' );
