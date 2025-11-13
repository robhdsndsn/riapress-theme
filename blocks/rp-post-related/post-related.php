<?php
/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 * @package riapress
 */

/**
 * Renders the latest posts block.
 */
function rp_post_related_block_init() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', 'rp_post_related_block_init' );

// function zp4_post_latest_block_set_translations() {
// wp_set_script_translations(
// 'zp4-post-latest-editor-script',
// 'post-latest',
// plugin_dir_path( __FILE__ ) . 'languages'
// );
// }

// add_action( 'init', 'zp4_post_latest_block_set_translations' );

// PHP side block translations.
// function zp4_post_latest_load_translations() {
// load_theme_textdomain( 'post-latest', get_template_directory() . '/blocks/zp4-post-latest/languages' );
// }

// add_action( 'after_setup_theme', 'zp4_post_latest_load_translations' );
