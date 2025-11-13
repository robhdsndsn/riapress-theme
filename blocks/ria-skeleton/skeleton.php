<?php
/**
 * RIA Skeleton Loader Block
 *
 * Skeleton loader placeholder for content that is loading or being prototyped.
 * Supports multiple skeleton types: text, image, avatar, button, and card.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-skeleton', 'ria-skeleton/build/', 'ria-skeleton' );
