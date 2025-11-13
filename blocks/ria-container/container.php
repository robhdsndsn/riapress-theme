<?php
/**
 * RIA Container Block (Molecule)
 *
 * Flexible layout container with advanced styling controls inspired by GeneratePress.
 * Supports both flexbox and grid layouts with comprehensive spacing and alignment options.
 *
 * @package RIA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Register the block using RP_Custom_Block class
new RP_Custom_Block( 'ria-container', 'ria-container/build/', 'ria-container' );
