<?php
/**
 * Register Course Meta blocks.
 * Mirrors the pattern used in `rp-event-meta`.
 *
 * @package riapress
 */

new RP_Custom_Block(
	'rp-course-duration',
	'rp-course-meta/build/course-duration',
	'course-meta'
);

/**
 * Set JS translations for course meta blocks.
 */
function rp_course_meta_block_set_translations() {
	wp_set_script_translations(
		'rp-course-duration-editor-script',
		'course-meta',
		get_template_directory() . '/blocks/rp-course-meta/languages'
	);
}
add_action( 'init', 'rp_course_meta_block_set_translations' );
