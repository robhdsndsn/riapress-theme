<?php

/*
 * Post Thumbnails
 */
function z_after_setup_theme() {
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'title-tag' );
}

add_action( 'after_setup_theme', 'z_after_setup_theme' );

/*
 * Site Editor Support
 */
// TODO: Hector: Continue exploring the extend of these two settings
add_theme_support( 'block-templates' );
add_theme_support( 'block-template-parts' );

/*
 * SVG Support
 */
// Allow SVG files to be uploaded to media library
function z_enable_svg_upload( $mime_types ) {
	$mime_types['svg'] = 'image/svg+xml';
	return $mime_types;
}
add_filter( 'upload_mimes', 'z_enable_svg_upload' );

// Fix SVG display issues in WordPress admin
function z_fix_svg_display() {
	echo '<style>
		.attachment-266x266, .thumbnail img {
			width: 100% !important;
			height: auto !important;
		}
	</style>';
}
add_action( 'admin_head', 'z_fix_svg_display' );

// Restrict SVG uploads to administrators only for security
function z_svg_sanitization( $file ) {
	if ( $file['type'] === 'image/svg+xml' ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			$file['error'] = __( 'Sorry, this file type is not permitted for security reasons.' );
		}
	}
	return $file;
}
add_filter( 'wp_handle_upload_prefilter', 'z_svg_sanitization' );

/*
 * Customize Excerpt - currently removing "Publish Date:" from the excerpt so that the resources archive doesn't show this, its a paragraph in the pattern which gets used as part of the auto-excerpt generation
 */
function z_get_the_excerpt( $excerpt ) {
// Remove "Publish Date:" from the excerpt
	$publish_date_string = _x( 'Publish Date:', 'Used before the date in the excerpt', 'riapress' );
    return trim( str_replace( $publish_date_string, '', $excerpt ) );
}
add_filter( 'get_the_excerpt', 'z_get_the_excerpt' );

/*
 * Disable Category, Tag, and Author Archives
 */
function z_disable_archives() {
	if ( is_category() || is_tag() || is_author() ) {
			global $wp_query;
			$wp_query->set_404();
			status_header( 404 );
			nocache_headers();
			include( get_query_template( '404' ) );
			exit;
		}
}

add_action( 'template_redirect', 'z_disable_archives', 1 );

/**
 * Add favicons to the theme
 */
function riapress_add_favicon() {
    echo '<link rel="icon" type="image/x-icon" href="' . get_template_directory_uri() . '/assets/images/favicons/favicon.ico">';
    echo '<link rel="icon" type="image/png" sizes="32x32" href="' . get_template_directory_uri() . '/assets/images/favicons/favicon-32x32.png">';
    echo '<link rel="icon" type="image/png" sizes="16x16" href="' . get_template_directory_uri() . '/assets/images/favicons/favicon-16x16.png">';
    echo '<link rel="apple-touch-icon" sizes="180x180" href="' . get_template_directory_uri() . '/assets/images/favicons/apple-touch-icon.png">';
}
add_action('wp_head', 'riapress_add_favicon');