<?php
/**
 * RIA Stat Block
 *
 * Individual stat item with value and label (child of stats-group).
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-stat', 'ria-stat/build/', 'ria-stat' );
