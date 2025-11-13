<?php
/**
 * RIA Toast Container Block
 *
 * @package RIAPress
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Register the block using the RP_Custom_Block class
new RP_Custom_Block(
	'ria-toast',           // Block directory name
	'ria-toast/build/',    // Build path
	'ria-toast-container'  // Block name (matches block.json)
);
