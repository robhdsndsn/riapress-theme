<?php
/**
 * RIA Design System - CSS Output
 *
 * Generates CSS from theme.json + database overrides
 *
 * @package RIAPress
 * @since 4.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class RIA_Design_System_Output {

	/**
	 * Initialize output hooks
	 */
	public static function init() {
		add_action( 'wp_head', array( __CLASS__, 'output_custom_css' ), 1 );
		add_action( 'admin_head', array( __CLASS__, 'output_custom_css' ), 1 );
	}

	/**
	 * Output custom CSS in <head>
	 */
	public static function output_custom_css() {
		$css = self::generate_css();

		if ( empty( $css ) ) {
			return;
		}

		echo "\n<!-- RIA Design System Custom Styles -->\n";
		echo '<style id="riapress-custom-design-tokens">' . "\n";
		echo $css;
		echo '</style>' . "\n";
		echo "<!-- /RIA Design System Custom Styles -->\n\n";
	}

	/**
	 * Generate complete CSS from settings
	 *
	 * @return string CSS output
	 */
	public static function generate_css() {
		$css_parts = array();

		// Generate color CSS
		$color_css = self::generate_color_css();
		if ( ! empty( $color_css ) ) {
			$css_parts[] = $color_css;
		}

		// Future: Add typography CSS (Phase 2)
		// Future: Add spacing CSS (Phase 2)
		// Future: Add global styles CSS (Phase 3)

		if ( empty( $css_parts ) ) {
			return '';
		}

		return implode( "\n\n", $css_parts );
	}

	/**
	 * Generate CSS for color overrides
	 *
	 * @return string Color CSS
	 */
	private static function generate_color_css() {
		$overrides = RIA_Design_System_Settings::get_color_overrides();

		if ( empty( $overrides ) ) {
			return '';
		}

		$css = ":root {\n";
		$css .= "\t/* Color overrides from Design System */\n";

		foreach ( $overrides as $slug => $value ) {
			$css_var = self::slug_to_css_variable( $slug );
			$css .= "\t{$css_var}: {$value};\n";
		}

		$css .= '}';

		return $css;
	}

	/**
	 * Convert slug to CSS variable name
	 *
	 * @param string $slug Color slug
	 * @return string CSS variable name
	 */
	private static function slug_to_css_variable( $slug ) {
		// Check if slug is already a palette color (no numbers)
		if ( in_array( $slug, array( 'white', 'neutral', 'dark', 'navy', 'green' ), true ) ) {
			// Palette colors use --wp--preset--color--{slug}
			return "--wp--preset--color--{$slug}";
		}

		// Custom colors use --wp--custom--colors--{slug}
		return "--wp--custom--colors--{$slug}";
	}

	/**
	 * Get inline CSS for a specific color
	 *
	 * @param string $slug Color slug
	 * @param string $value Color value
	 * @return string CSS declaration
	 */
	public static function get_color_css( $slug, $value ) {
		$css_var = self::slug_to_css_variable( $slug );
		return "{$css_var}: {$value};";
	}

	/**
	 * Get CSS variable reference for a color slug
	 *
	 * @param string $slug Color slug
	 * @return string CSS variable reference (for use in other CSS)
	 */
	public static function get_color_var( $slug ) {
		$css_var = self::slug_to_css_variable( $slug );
		return "var({$css_var})";
	}

	/**
	 * Generate CSS for export
	 *
	 * Includes all settings, not just overrides
	 *
	 * @return string Complete CSS
	 */
	public static function generate_export_css() {
		$colors = RIA_Design_System_Settings::get_colors();

		if ( empty( $colors ) ) {
			return '';
		}

		$css = "/**\n";
		$css .= " * RIAPress Design System Export\n";
		$css .= " * Generated: " . current_time( 'mysql' ) . "\n";
		$css .= " */\n\n";

		$css .= ":root {\n";

		// Group by type
		$palette_colors = array();
		$custom_colors  = array();

		foreach ( $colors as $slug => $data ) {
			if ( $data['type'] === 'palette' ) {
				$palette_colors[ $slug ] = $data['value'];
			} else {
				$custom_colors[ $slug ] = $data['value'];
			}
		}

		// Output palette colors
		if ( ! empty( $palette_colors ) ) {
			$css .= "\t/* Palette Colors */\n";
			foreach ( $palette_colors as $slug => $value ) {
				$css_var = self::slug_to_css_variable( $slug );
				$css .= "\t{$css_var}: {$value};\n";
			}
			$css .= "\n";
		}

		// Output custom colors
		if ( ! empty( $custom_colors ) ) {
			$css .= "\t/* Custom Colors */\n";
			foreach ( $custom_colors as $slug => $value ) {
				$css_var = self::slug_to_css_variable( $slug );
				$css .= "\t{$css_var}: {$value};\n";
			}
		}

		$css .= "}\n";

		return $css;
	}

	/**
	 * Get computed value for a CSS variable
	 *
	 * Resolves nested var() references
	 *
	 * @param string $value CSS value (may be var() reference)
	 * @param int $depth Recursion depth limit
	 * @return string Resolved value
	 */
	public static function resolve_css_variable( $value, $depth = 0 ) {
		// Prevent infinite recursion
		if ( $depth > 10 ) {
			return $value;
		}

		// Check if value is a CSS variable reference
		if ( preg_match( '/^var\(--wp--custom--colors--([\w-]+)\)$/', $value, $matches ) ) {
			$referenced_slug = $matches[1];
			$colors          = RIA_Design_System_Settings::get_colors();

			if ( isset( $colors[ $referenced_slug ] ) ) {
				// Recursively resolve
				return self::resolve_css_variable( $colors[ $referenced_slug ]['value'], $depth + 1 );
			}
		}

		return $value;
	}
}

// Initialize
RIA_Design_System_Output::init();
