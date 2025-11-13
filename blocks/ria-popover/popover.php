<?php
/**
 * RIA Popover Block
 *
 * Display rich interactive content in floating card
 *
 * @package RIAPress
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Register the RIA Popover block
 */
new RP_Custom_Block(
	array( 'ria-popover' ),
	array( 'ria-popover/build/' ),
	'ria-popover'
);
