<?php
/**
 * RIA Resource Card Block
 *
 * Displays a resource card with image, title, description, and link.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-resource-card', 'ria-resource-card/build/', 'ria-resource-card' );
