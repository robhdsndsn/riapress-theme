<?php
/**
 * Renders the Multisite Language Switcher block.
 *
 * @param array $attributes Block attributes.
 * @return string Rendered block HTML.
 */

$font_size_class = isset( $attributes['fontSize'] ) && $attributes['fontSize']
	? 'has-' . sanitize_html_class( $attributes['fontSize'] ) . '-font-size'
	: '';

// Detect if in block editor (REST API context)
$is_editor_preview = defined( 'REST_REQUEST' ) && REST_REQUEST;

// Show plugin inactive message in editor only
if ( ! function_exists( 'the_msls' ) ) {
	if ( is_admin() || $is_editor_preview ) {
		echo '<div class="msls-language-switcher__notice ' . esc_attr( $font_size_class ) . '">' . esc_html_x( 'Multisite Language Switcher plugin not active.', 'Block - Multisite Language Switcher', 'multisite-language-switcher' ) . '</div>';
	}
	return;
}

if ( $is_editor_preview ) {
	echo '<div class="msls-language-switcher__placeholder ' . esc_attr( $font_size_class ) . '">' . _x( 'Language Switcher', 'Block - Multisite Language Switcher', 'multisite-language-switcher' ) . '</div>';

	return;
}

$intl_available = class_exists( 'Locale' ) && method_exists( 'Locale', 'getDisplayLanguage' );

// Capture MSLS output
ob_start();
the_msls();
$raw_output = ob_get_clean();

// Skip if there are no translation links
if ( substr_count( $raw_output, '<a ' ) === 0 ) {
	return;
}

// Replace inner text using title or text like 'fr_CA'
$enhanced_output = preg_replace_callback(
	'/<a\s+([^>]*?title=["\']([a-zA-Z\-_]+)["\'][^>]*)>([a-zA-Z\-_]+)<\/a>/',
	function ( $matches ) use ( $intl_available ) {
		$attr     = $matches[1];
		$locale   = $matches[2]; // e.g., fr_CA
		$raw_text = $matches[3];

		$lang_code = strtolower( strtok( str_replace( '-', '_', $locale ), '_' ) );

		$label = strtoupper( $locale ); // fallback
		if ( $intl_available && $lang_code ) {
			$label = ucfirst( Locale::getDisplayLanguage( $lang_code, $lang_code ) );
		}

		if ( ! preg_match( '/\blang=/', $attr ) ) {
			$attr .= ' lang="' . esc_attr( $lang_code ) . '"';
		}

		return '<a ' . $attr . '>' . esc_html( $label ) . '</a>';
	},
	$raw_output
);

// Output final enhanced switcher
echo '<div class="msls-language-switcher ' . esc_attr( $font_size_class ) . '" aria-label="' . esc_attr_x( 'Language Switcher', 'Block - Multisite Language Switcher', 'multisite-language-switcher' ) . '">';
echo $enhanced_output;
echo '</div>';
