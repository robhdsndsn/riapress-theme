<?php
/**
 * RIA Quote Block
 *
 * Displays a stylized quote with optional citation and author info.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-quote', 'ria-quote/build/', 'ria-quote' );
