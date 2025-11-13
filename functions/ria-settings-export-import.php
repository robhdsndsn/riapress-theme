<?php
/**
 * RIA Settings Export/Import
 *
 * Export and import theme settings, design tokens, and configurations.
 *
 * @package RIAPress
 * @since 4.4.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * RIA Settings Export Import Class
 */
class RIA_Settings_Export_Import {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'wp_ajax_ria_export_settings', array( $this, 'ajax_export_settings' ) );
		add_action( 'wp_ajax_ria_import_settings', array( $this, 'ajax_import_settings' ) );
		add_action( 'wp_ajax_ria_download_backup', array( $this, 'ajax_download_backup' ) );
		add_action( 'admin_post_ria_download_export', array( $this, 'handle_download_export' ) );
	}

	/**
	 * Get all exportable settings
	 *
	 * @return array Settings data
	 */
	public static function get_exportable_settings() {
		return array(
			'theme_info' => array(
				'name'    => 'RIAPress',
				'version' => wp_get_theme()->get( 'Version' ),
				'exported_at' => current_time( 'mysql' ),
				'site_url' => get_site_url(),
			),
			'design_tokens' => get_option( 'riapress_design_tokens', array() ),
			'theme_overrides' => get_option( 'ria_theme_overrides', array() ),
			'custom_fonts' => get_option( 'ria_custom_fonts', array() ),
			'advanced_options' => get_option( 'ria_advanced_options', array() ),
			'performance_settings' => array(
				'lazy_load' => get_option( 'ria_lazy_load_images', true ),
				'minify_css' => get_option( 'ria_minify_css', false ),
				'minify_js' => get_option( 'ria_minify_js', false ),
			),
		);
	}

	/**
	 * Export settings as JSON
	 *
	 * @param array $settings Settings to export (optional, defaults to all)
	 * @return string JSON string
	 */
	public static function export_settings( $settings = null ) {
		if ( $settings === null ) {
			$settings = self::get_exportable_settings();
		}

		return wp_json_encode( $settings, JSON_PRETTY_PRINT );
	}

	/**
	 * Import settings from JSON
	 *
	 * @param string $json JSON string
	 * @param bool $create_backup Create backup before import
	 * @return array Result array with success/error
	 */
	public static function import_settings( $json, $create_backup = true ) {
		// Validate JSON
		$settings = json_decode( $json, true );

		if ( json_last_error() !== JSON_ERROR_NONE ) {
			return array(
				'success' => false,
				'message' => __( 'Invalid JSON format.', 'riapress' ),
			);
		}

		// Validate structure
		if ( ! isset( $settings['theme_info'] ) ) {
			return array(
				'success' => false,
				'message' => __( 'Invalid settings format.', 'riapress' ),
			);
		}

		// Create backup if requested
		if ( $create_backup ) {
			self::create_backup();
		}

		// Import settings
		$imported = array();

		if ( isset( $settings['design_tokens'] ) ) {
			update_option( 'riapress_design_tokens', $settings['design_tokens'] );
			$imported[] = 'design_tokens';
		}

		if ( isset( $settings['theme_overrides'] ) ) {
			update_option( 'ria_theme_overrides', $settings['theme_overrides'] );
			$imported[] = 'theme_overrides';
		}

		if ( isset( $settings['custom_fonts'] ) ) {
			update_option( 'ria_custom_fonts', $settings['custom_fonts'] );
			$imported[] = 'custom_fonts';
		}

		if ( isset( $settings['advanced_options'] ) ) {
			update_option( 'ria_advanced_options', $settings['advanced_options'] );
			$imported[] = 'advanced_options';
		}

		if ( isset( $settings['performance_settings'] ) ) {
			$perf = $settings['performance_settings'];
			if ( isset( $perf['lazy_load'] ) ) {
				update_option( 'ria_lazy_load_images', $perf['lazy_load'] );
			}
			if ( isset( $perf['minify_css'] ) ) {
				update_option( 'ria_minify_css', $perf['minify_css'] );
			}
			if ( isset( $perf['minify_js'] ) ) {
				update_option( 'ria_minify_js', $perf['minify_js'] );
			}
			$imported[] = 'performance_settings';
		}

		return array(
			'success' => true,
			'message' => sprintf(
				__( 'Successfully imported %d setting groups.', 'riapress' ),
				count( $imported )
			),
			'imported' => $imported,
		);
	}

	/**
	 * Create backup of current settings
	 *
	 * @return string Backup ID
	 */
	public static function create_backup() {
		$backup_id = 'backup_' . time();
		$settings = self::get_exportable_settings();

		$backups = get_option( 'riapress_settings_backups', array() );

		// Keep only last 5 backups
		if ( count( $backups ) >= 5 ) {
			array_shift( $backups );
		}

		$backups[ $backup_id ] = array(
			'created_at' => current_time( 'mysql' ),
			'settings' => $settings,
		);

		update_option( 'riapress_settings_backups', $backups );

		return $backup_id;
	}

	/**
	 * Get all backups
	 *
	 * @return array Backups
	 */
	public static function get_backups() {
		return get_option( 'riapress_settings_backups', array() );
	}

	/**
	 * Restore from backup
	 *
	 * @param string $backup_id Backup ID
	 * @return array Result array
	 */
	public static function restore_backup( $backup_id ) {
		$backups = self::get_backups();

		if ( ! isset( $backups[ $backup_id ] ) ) {
			return array(
				'success' => false,
				'message' => __( 'Backup not found.', 'riapress' ),
			);
		}

		$backup = $backups[ $backup_id ];
		$json = wp_json_encode( $backup['settings'] );

		return self::import_settings( $json, false );
	}

	/**
	 * Delete backup
	 *
	 * @param string $backup_id Backup ID
	 * @return bool Success
	 */
	public static function delete_backup( $backup_id ) {
		$backups = self::get_backups();

		if ( ! isset( $backups[ $backup_id ] ) ) {
			return false;
		}

		unset( $backups[ $backup_id ] );
		update_option( 'riapress_settings_backups', $backups );

		return true;
	}

	/**
	 * AJAX: Export settings
	 */
	public function ajax_export_settings() {
		check_ajax_referer( 'ria_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Insufficient permissions.', 'riapress' ) ) );
		}

		$settings = self::get_exportable_settings();
		$json = self::export_settings( $settings );

		wp_send_json_success( array(
			'json' => $json,
			'filename' => 'riapress-settings-' . date( 'Y-m-d-His' ) . '.json',
		) );
	}

	/**
	 * AJAX: Import settings
	 */
	public function ajax_import_settings() {
		check_ajax_referer( 'ria_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Insufficient permissions.', 'riapress' ) ) );
		}

		$json = isset( $_POST['json'] ) ? wp_unslash( $_POST['json'] ) : '';
		$create_backup = isset( $_POST['create_backup'] ) ? (bool) $_POST['create_backup'] : true;

		if ( empty( $json ) ) {
			wp_send_json_error( array( 'message' => __( 'No settings data provided.', 'riapress' ) ) );
		}

		$result = self::import_settings( $json, $create_backup );

		if ( $result['success'] ) {
			// Clear any caches
			RIA_Blocks_Manager::clear_cache();

			wp_send_json_success( $result );
		} else {
			wp_send_json_error( $result );
		}
	}

	/**
	 * AJAX: Download backup
	 */
	public function ajax_download_backup() {
		check_ajax_referer( 'ria_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Insufficient permissions.', 'riapress' ) ) );
		}

		$backup_id = isset( $_POST['backup_id'] ) ? sanitize_text_field( $_POST['backup_id'] ) : '';

		if ( empty( $backup_id ) ) {
			wp_send_json_error( array( 'message' => __( 'No backup ID provided.', 'riapress' ) ) );
		}

		$backups = self::get_backups();

		if ( ! isset( $backups[ $backup_id ] ) ) {
			wp_send_json_error( array( 'message' => __( 'Backup not found.', 'riapress' ) ) );
		}

		$json = wp_json_encode( $backups[ $backup_id ]['settings'], JSON_PRETTY_PRINT );

		wp_send_json_success( array(
			'json' => $json,
			'filename' => 'riapress-' . $backup_id . '.json',
		) );
	}

	/**
	 * Handle download export (actual file download)
	 */
	public function handle_download_export() {
		check_admin_referer( 'ria_download_export', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( __( 'Insufficient permissions.', 'riapress' ) );
		}

		$settings = self::get_exportable_settings();
		$json = self::export_settings( $settings );
		$filename = 'riapress-settings-' . date( 'Y-m-d-His' ) . '.json';

		// Send headers for download
		header( 'Content-Type: application/json' );
		header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
		header( 'Content-Length: ' . strlen( $json ) );
		header( 'Pragma: no-cache' );
		header( 'Expires: 0' );

		echo $json;
		exit;
	}
}

// Initialize
new RIA_Settings_Export_Import();
