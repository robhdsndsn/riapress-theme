<?php
/**
 * Enqueue scripts and styles.
 *
 * @file
 * @package rp
 */

/**
 * Enqueue scripts and styles for the site.
 */
function site_scripts() {
	global $wp_styles; // Call global $wp_styles variable to add conditional wrapper around ie stylesheet the WordPress way.

	// Enqueue the main stylesheet.
	$css_file_path = glob( get_template_directory() . '/assets/build/frontend.min.*.css' );
	if ( ! empty( $css_file_path ) ) {
		$css_file_uri = get_template_directory_uri() . '/assets/build/' . basename( $css_file_path[0] );
		wp_enqueue_style( 'index', $css_file_uri, array(), filemtime( $css_file_path[0] ), 'all' );
	}
	$js_file_path = glob( get_template_directory() . '/assets/build/frontend.min.*.js' );
	if ( ! empty( $js_file_path ) ) {
		$js_file_uri = get_template_directory_uri() . '/assets/build/' . basename( $js_file_path[0] );
		wp_enqueue_script( 'index', $js_file_uri, array(), filemtime( $js_file_path[0] ), true );
	}
	// Enqueue the main JavaScript file.
	$js_file_path = glob( get_template_directory() . '/assets/build/frontend.min.*.js' );
	$js_file_uri  = get_template_directory_uri() . '/assets/build/' . basename( $js_file_path[0] );
	wp_enqueue_script( 'index', $js_file_uri, array(), filemtime( $js_file_path[0] ), true );

	// Enqueue block animations CSS.
	wp_enqueue_style(
		'ria-block-animations',
		get_template_directory_uri() . '/assets/css/block-animations.css',
		array(),
		filemtime( get_template_directory() . '/assets/css/block-animations.css' ),
		'all'
	);

	// Enqueue block animations JS.
	wp_enqueue_script(
		'ria-block-animations',
		get_template_directory_uri() . '/assets/js/block-animations.js',
		array(),
		filemtime( get_template_directory() . '/assets/js/block-animations.js' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'site_scripts', 999 );


/**
 * Enqueue my script.
 */
function enqueue_my_script() {
	// Enqueue the editor scprits.
	wp_enqueue_script( 'my-editor-script', get_template_directory_uri() . '/assets/build/editor.js', array( 'wp-blocks', 'wp-dom-ready', 'wp-block-editor', 'wp-hooks', 'wp-element', 'wp-components', 'wp-i18n' ), '1.0', true );
}

add_action( 'admin_enqueue_scripts', 'enqueue_my_script' );
