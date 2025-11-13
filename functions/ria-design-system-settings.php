<?php
/**
 * RIA Design System - Settings API
 *
 * Hybrid approach: Load theme.json defaults, allow database overrides
 *
 * @package RIAPress
 * @since 4.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class RIA_Design_System_Settings {

	/**
	 * Option name for storing design token overrides
	 */
	const OPTION_TOKENS = 'riapress_design_tokens';

	/**
	 * Option name for storing global style overrides
	 */
	const OPTION_STYLES = 'riapress_global_styles';

	/**
	 * Cached theme.json data
	 */
	private static $theme_json_cache = null;

	/**
	 * Initialize settings API
	 */
	public static function init() {
		add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
		add_action( 'wp_ajax_ria_save_design_tokens', array( __CLASS__, 'ajax_save_design_tokens' ) );
		add_action( 'wp_ajax_ria_reset_design_tokens', array( __CLASS__, 'ajax_reset_design_tokens' ) );
	}

	/**
	 * Register WordPress settings
	 */
	public static function register_settings() {
		register_setting(
			'riapress_design_system',
			self::OPTION_TOKENS,
			array(
				'type'              => 'array',
				'description'       => 'RIAPress design token overrides',
				'sanitize_callback' => array( __CLASS__, 'sanitize_design_tokens' ),
				'default'           => array(),
			)
		);

		register_setting(
			'riapress_design_system',
			self::OPTION_STYLES,
			array(
				'type'              => 'array',
				'description'       => 'RIAPress global style overrides',
				'sanitize_callback' => array( __CLASS__, 'sanitize_global_styles' ),
				'default'           => array(),
			)
		);
	}

	/**
	 * Get theme.json data
	 *
	 * @return array Theme configuration
	 */
	public static function get_theme_json() {
		if ( self::$theme_json_cache !== null ) {
			return self::$theme_json_cache;
		}

		$theme_json_path = get_template_directory() . '/theme.json';

		if ( ! file_exists( $theme_json_path ) ) {
			return array();
		}

		$theme_json_content = file_get_contents( $theme_json_path );
		$theme_json         = json_decode( $theme_json_content, true );

		if ( json_last_error() !== JSON_ERROR_NONE ) {
			return array();
		}

		self::$theme_json_cache = $theme_json;
		return $theme_json;
	}

	/**
	 * Get default colors from theme.json
	 *
	 * @return array Array of colors with structure: slug => color value
	 */
	public static function get_default_colors() {
		$theme_json = self::get_theme_json();
		$colors     = array();

		// Get palette colors
		if ( isset( $theme_json['settings']['color']['palette'] ) ) {
			foreach ( $theme_json['settings']['color']['palette'] as $color ) {
				$colors[ $color['slug'] ] = array(
					'name'  => $color['name'],
					'value' => $color['color'],
					'type'  => 'palette',
				);
			}
		}

		// Get custom colors (CSS variables)
		if ( isset( $theme_json['settings']['custom']['colors'] ) ) {
			foreach ( $theme_json['settings']['custom']['colors'] as $slug => $value ) {
				$colors[ $slug ] = array(
					'name'  => self::slug_to_name( $slug ),
					'value' => $value,
					'type'  => 'custom',
				);
			}
		}

		return $colors;
	}

	/**
	 * Get color overrides from database
	 *
	 * @return array Array of color overrides
	 */
	public static function get_color_overrides() {
		$tokens = get_option( self::OPTION_TOKENS, array() );
		return isset( $tokens['colors'] ) ? $tokens['colors'] : array();
	}

	/**
	 * Get merged colors (defaults + overrides)
	 *
	 * @return array Merged color array
	 */
	public static function get_colors() {
		$defaults  = self::get_default_colors();
		$overrides = self::get_color_overrides();

		// Merge: overrides take precedence
		foreach ( $overrides as $slug => $value ) {
			if ( isset( $defaults[ $slug ] ) ) {
				$defaults[ $slug ]['value']       = $value;
				$defaults[ $slug ]['is_override'] = true;
			} else {
				// New custom color added by user
				$defaults[ $slug ] = array(
					'name'        => self::slug_to_name( $slug ),
					'value'       => $value,
					'type'        => 'custom',
					'is_override' => true,
					'is_new'      => true,
				);
			}
		}

		return $defaults;
	}

	/**
	 * Save design token overrides
	 *
	 * @param array $tokens Array of tokens to save
	 * @return bool Success status
	 */
	public static function save_design_tokens( $tokens ) {
		$sanitized = self::sanitize_design_tokens( $tokens );
		return update_option( self::OPTION_TOKENS, $sanitized );
	}

	/**
	 * Save color overrides
	 *
	 * @param array $colors Array of colors to save
	 * @return bool Success status
	 */
	public static function save_colors( $colors ) {
		$tokens           = get_option( self::OPTION_TOKENS, array() );
		$tokens['colors'] = $colors;
		return self::save_design_tokens( $tokens );
	}

	/**
	 * Reset all design tokens to theme.json defaults
	 *
	 * @return bool Success status
	 */
	public static function reset_design_tokens() {
		delete_option( self::OPTION_TOKENS );
		delete_option( self::OPTION_STYLES );
		self::$theme_json_cache = null; // Clear cache
		return true;
	}

	/**
	 * Reset colors to defaults
	 *
	 * @return bool Success status
	 */
	public static function reset_colors() {
		$tokens = get_option( self::OPTION_TOKENS, array() );
		unset( $tokens['colors'] );

		if ( empty( $tokens ) ) {
			return delete_option( self::OPTION_TOKENS );
		}

		return update_option( self::OPTION_TOKENS, $tokens );
	}

	/**
	 * AJAX handler: Save design tokens
	 */
	public static function ajax_save_design_tokens() {
		// Check nonce and capabilities
		check_ajax_referer( 'ria_design_system', 'nonce' );

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_send_json_error( array( 'message' => 'Insufficient permissions' ), 403 );
		}

		// Get and validate data
		$category = isset( $_POST['category'] ) ? sanitize_key( $_POST['category'] ) : '';
		$data     = isset( $_POST['data'] ) ? $_POST['data'] : array();

		if ( empty( $category ) || empty( $data ) ) {
			wp_send_json_error( array( 'message' => 'Invalid data' ), 400 );
		}

		// Save based on category
		switch ( $category ) {
			case 'colors':
				$success = self::save_colors( $data );
				break;

			default:
				wp_send_json_error( array( 'message' => 'Unknown category' ), 400 );
		}

		if ( $success ) {
			wp_send_json_success( array(
				'message' => 'Settings saved successfully',
				'data'    => self::get_colors(),
			) );
		} else {
			wp_send_json_error( array( 'message' => 'Failed to save settings' ), 500 );
		}
	}

	/**
	 * AJAX handler: Reset design tokens
	 */
	public static function ajax_reset_design_tokens() {
		check_ajax_referer( 'ria_design_system', 'nonce' );

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_send_json_error( array( 'message' => 'Insufficient permissions' ), 403 );
		}

		$category = isset( $_POST['category'] ) ? sanitize_key( $_POST['category'] ) : 'all';

		switch ( $category ) {
			case 'colors':
				$success = self::reset_colors();
				break;

			case 'all':
				$success = self::reset_design_tokens();
				break;

			default:
				wp_send_json_error( array( 'message' => 'Unknown category' ), 400 );
		}

		if ( $success ) {
			wp_send_json_success( array(
				'message' => 'Settings reset to defaults',
				'data'    => self::get_colors(),
			) );
		} else {
			wp_send_json_error( array( 'message' => 'Failed to reset settings' ), 500 );
		}
	}

	/**
	 * Sanitize design tokens
	 *
	 * @param array $tokens Tokens to sanitize
	 * @return array Sanitized tokens
	 */
	public static function sanitize_design_tokens( $tokens ) {
		if ( ! is_array( $tokens ) ) {
			return array();
		}

		$sanitized = array();

		// Sanitize colors
		if ( isset( $tokens['colors'] ) && is_array( $tokens['colors'] ) ) {
			foreach ( $tokens['colors'] as $slug => $value ) {
				$slug  = sanitize_key( $slug );
				$value = self::sanitize_color( $value );

				if ( ! empty( $slug ) && ! empty( $value ) ) {
					$sanitized['colors'][ $slug ] = $value;
				}
			}
		}

		return $sanitized;
	}

	/**
	 * Sanitize global styles
	 *
	 * @param array $styles Styles to sanitize
	 * @return array Sanitized styles
	 */
	public static function sanitize_global_styles( $styles ) {
		if ( ! is_array( $styles ) ) {
			return array();
		}

		// TODO: Implement when adding global styles in Phase 3
		return array();
	}

	/**
	 * Sanitize color value
	 *
	 * @param string $color Color value (hex, rgb, var())
	 * @return string Sanitized color
	 */
	private static function sanitize_color( $color ) {
		$color = trim( $color );

		// Allow CSS variables (var(--wp--custom--colors--primary-400))
		if ( preg_match( '/^var\(--[\w-]+\)$/', $color ) ) {
			return $color;
		}

		// Hex colors (#RRGGBB or #RGB)
		if ( preg_match( '/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color ) ) {
			return strtoupper( $color );
		}

		// RGB/RGBA colors
		if ( preg_match( '/^rgba?\([\d\s,\.]+\)$/', $color ) ) {
			return $color;
		}

		return '';
	}

	/**
	 * Convert slug to readable name
	 *
	 * @param string $slug Slug to convert
	 * @return string Readable name
	 */
	private static function slug_to_name( $slug ) {
		// Replace hyphens and underscores with spaces
		$name = str_replace( array( '-', '_' ), ' ', $slug );

		// Capitalize words
		$name = ucwords( $name );

		return $name;
	}

	/**
	 * Check if colors have been customized
	 *
	 * @return bool True if colors have overrides
	 */
	public static function has_color_overrides() {
		$overrides = self::get_color_overrides();
		return ! empty( $overrides );
	}

	/**
	 * Get customization stats
	 *
	 * @return array Stats about customizations
	 */
	public static function get_customization_stats() {
		$color_overrides = self::get_color_overrides();

		return array(
			'colors_customized' => count( $color_overrides ),
			'has_customizations' => ! empty( $color_overrides ),
		);
	}
}

// Initialize
RIA_Design_System_Settings::init();
