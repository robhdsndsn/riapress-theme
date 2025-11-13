<?php
/**
 * Block: RIA Video
 *
 * @package RIAPress
 */

/**
 * Register RIA Video block
 */
function ria_register_video_block() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'ria_register_video_block' );
