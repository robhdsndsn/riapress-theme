<?php
/**
 * RIA Feature Grid Block (Organism)
 *
 * Responsive grid container for displaying Icon Boxes, Number Boxes, or Cards
 * in a clean grid layout with configurable columns, gaps, and alignment.
 *
 * @package RIA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Register the block using RP_Custom_Block class
new RP_Custom_Block( 'ria-feature-grid', 'ria-feature-grid/build/', 'ria-feature-grid' );
