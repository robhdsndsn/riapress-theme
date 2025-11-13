<?php
/**
 * RIA Modal Block
 *
 * Creates a modal/popup with trigger button and customizable content.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-modal', 'ria-modal/build/', 'ria-modal' );
