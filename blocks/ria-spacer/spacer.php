<?php
/**
 * RIA Spacer Block
 *
 * A simple vertical spacing block with customizable height.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-spacer', 'ria-spacer/build/', 'ria-spacer' );
