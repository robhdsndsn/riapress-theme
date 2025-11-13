<?php
/**
 * RIA Divider Block
 *
 * A content divider/separator with customizable styles.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-divider', 'ria-divider/build/', 'ria-divider' );
