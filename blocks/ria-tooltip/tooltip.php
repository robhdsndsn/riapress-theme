<?php
/**
 * RIA Tooltip Block
 *
 * Display contextual information on hover or focus
 *
 * @package RIAPress
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Register the RIA Tooltip block
 */
new RP_Custom_Block(
	array( 'ria-tooltip' ),
	array( 'ria-tooltip/build/' ),
	'ria-tooltip'
);
