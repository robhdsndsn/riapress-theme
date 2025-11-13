<?php
/**
 * RIA Blocks Manager
 *
 * Scans and manages all RIA custom blocks, providing data for the admin interface.
 *
 * @package RIAPress
 * @since 4.4.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * RIA Blocks Manager Class
 */
class RIA_Blocks_Manager {

	/**
	 * Cached blocks data
	 *
	 * @var array|null
	 */
	private static $blocks_cache = null;

	/**
	 * Get all RIA blocks with metadata
	 *
	 * @param bool $force_refresh Force cache refresh
	 * @return array Array of block data
	 */
	public static function get_all_blocks( $force_refresh = false ) {
		if ( ! $force_refresh && self::$blocks_cache !== null ) {
			return self::$blocks_cache;
		}

		$blocks_dir = get_template_directory() . '/blocks';
		$blocks = array();

		if ( ! is_dir( $blocks_dir ) ) {
			return $blocks;
		}

		$block_folders = glob( $blocks_dir . '/*', GLOB_ONLYDIR );

		foreach ( $block_folders as $block_folder ) {
			$block_name = basename( $block_folder );
			$block_json_path = $block_folder . '/src/block.json';

			if ( ! file_exists( $block_json_path ) ) {
				continue;
			}

			$block_data = self::parse_block_json( $block_json_path, $block_name );
			if ( $block_data ) {
				$blocks[ $block_name ] = $block_data;
			}
		}

		// Sort blocks by name
		ksort( $blocks );

		self::$blocks_cache = $blocks;

		return $blocks;
	}

	/**
	 * Parse block.json file
	 *
	 * @param string $json_path Path to block.json
	 * @param string $block_name Block folder name
	 * @return array|false Block data or false on failure
	 */
	private static function parse_block_json( $json_path, $block_name ) {
		$json_content = file_get_contents( $json_path );
		if ( ! $json_content ) {
			return false;
		}

		$block_data = json_decode( $json_content, true );
		if ( ! $block_data ) {
			return false;
		}

		return array(
			'name'            => $block_data['name'] ?? '',
			'title'           => $block_data['title'] ?? $block_name,
			'category'        => $block_data['category'] ?? 'common',
			'icon'            => $block_data['icon'] ?? 'block-default',
			'description'     => $block_data['description'] ?? '',
			'keywords'        => $block_data['keywords'] ?? array(),
			'version'         => $block_data['version'] ?? '1.0.0',
			'api_version'     => $block_data['apiVersion'] ?? 2,
			'has_variant'     => self::has_variant_support( $block_data ),
			'variant_default' => self::get_variant_default( $block_data ),
			'attributes'      => count( $block_data['attributes'] ?? array() ),
			'folder'          => $block_name,
			'type'            => self::determine_block_type( $block_name, $block_data ),
		);
	}

	/**
	 * Check if block has variant support
	 *
	 * @param array $block_data Block.json data
	 * @return bool
	 */
	private static function has_variant_support( $block_data ) {
		$attributes = $block_data['attributes'] ?? array();
		return isset( $attributes['variant'] ) || isset( $attributes['colorVariant'] );
	}

	/**
	 * Get variant default value
	 *
	 * @param array $block_data Block.json data
	 * @return string
	 */
	private static function get_variant_default( $block_data ) {
		$attributes = $block_data['attributes'] ?? array();

		if ( isset( $attributes['variant']['default'] ) ) {
			return $attributes['variant']['default'];
		}

		if ( isset( $attributes['colorVariant']['default'] ) ) {
			return $attributes['colorVariant']['default'];
		}

		return 'neutral';
	}

	/**
	 * Determine block type (atom, molecule, organism, legacy)
	 *
	 * @param string $block_name Block folder name
	 * @param array  $block_data Block.json data
	 * @return string
	 */
	private static function determine_block_type( $block_name, $block_data ) {
		// Legacy RP blocks
		if ( strpos( $block_name, 'rp-' ) === 0 ) {
			return 'legacy';
		}

		// Check keywords for atomic design classification
		$keywords = $block_data['keywords'] ?? array();

		if ( in_array( 'atom', $keywords, true ) ) {
			return 'atom';
		}

		if ( in_array( 'molecule', $keywords, true ) ) {
			return 'molecule';
		}

		if ( in_array( 'organism', $keywords, true ) ) {
			return 'organism';
		}

		if ( in_array( 'template', $keywords, true ) ) {
			return 'template';
		}

		// Fallback: guess based on complexity
		$attr_count = count( $block_data['attributes'] ?? array() );

		if ( $attr_count <= 6 ) {
			return 'atom';
		} elseif ( $attr_count <= 12 ) {
			return 'molecule';
		} else {
			return 'organism';
		}
	}

	/**
	 * Get blocks grouped by type
	 *
	 * @return array Blocks grouped by type
	 */
	public static function get_blocks_by_type() {
		$all_blocks = self::get_all_blocks();

		$grouped = array(
			'atom'     => array(),
			'molecule' => array(),
			'organism' => array(),
			'template' => array(),
			'legacy'   => array(),
		);

		foreach ( $all_blocks as $block ) {
			$type = $block['type'];
			$grouped[ $type ][] = $block;
		}

		return $grouped;
	}

	/**
	 * Get blocks with variant support
	 *
	 * @return array Blocks with variant support
	 */
	public static function get_variant_blocks() {
		$all_blocks = self::get_all_blocks();

		return array_filter( $all_blocks, function( $block ) {
			return $block['has_variant'];
		});
	}

	/**
	 * Get block statistics
	 *
	 * @return array Block statistics
	 */
	public static function get_block_stats() {
		$all_blocks = self::get_all_blocks();
		$grouped = self::get_blocks_by_type();
		$variant_blocks = self::get_variant_blocks();

		return array(
			'total'              => count( $all_blocks ),
			'atoms'              => count( $grouped['atom'] ),
			'molecules'          => count( $grouped['molecule'] ),
			'organisms'          => count( $grouped['organism'] ),
			'templates'          => count( $grouped['template'] ),
			'legacy'             => count( $grouped['legacy'] ),
			'with_variants'      => count( $variant_blocks ),
			'without_variants'   => count( $all_blocks ) - count( $variant_blocks ),
			'ria_blocks'         => count( $all_blocks ) - count( $grouped['legacy'] ),
		);
	}

	/**
	 * Get blocks by category
	 *
	 * @return array Blocks grouped by category
	 */
	public static function get_blocks_by_category() {
		$all_blocks = self::get_all_blocks();
		$grouped = array();

		foreach ( $all_blocks as $block ) {
			$category = $block['category'];
			if ( ! isset( $grouped[ $category ] ) ) {
				$grouped[ $category ] = array();
			}
			$grouped[ $category ][] = $block;
		}

		return $grouped;
	}

	/**
	 * Search blocks
	 *
	 * @param string $query Search query
	 * @return array Matching blocks
	 */
	public static function search_blocks( $query ) {
		$all_blocks = self::get_all_blocks();
		$query = strtolower( $query );

		return array_filter( $all_blocks, function( $block ) use ( $query ) {
			$searchable = strtolower(
				$block['title'] . ' ' .
				$block['description'] . ' ' .
				implode( ' ', $block['keywords'] ) . ' ' .
				$block['folder']
			);

			return strpos( $searchable, $query ) !== false;
		});
	}

	/**
	 * Get color variant options
	 *
	 * @return array Available color variants
	 */
	public static function get_color_variants() {
		return array(
			'neutral' => array(
				'label' => __( 'Neutral', 'riapress' ),
				'description' => __( 'Gray tones for neutral content', 'riapress' ),
			),
			'primary' => array(
				'label' => __( 'Primary', 'riapress' ),
				'description' => __( 'Brand primary color', 'riapress' ),
			),
			'secondary' => array(
				'label' => __( 'Secondary', 'riapress' ),
				'description' => __( 'Brand secondary color', 'riapress' ),
			),
			'success' => array(
				'label' => __( 'Success', 'riapress' ),
				'description' => __( 'Green for positive actions', 'riapress' ),
			),
			'warning' => array(
				'label' => __( 'Warning', 'riapress' ),
				'description' => __( 'Yellow/orange for caution', 'riapress' ),
			),
			'error' => array(
				'label' => __( 'Error', 'riapress' ),
				'description' => __( 'Red for errors or danger', 'riapress' ),
			),
			'info' => array(
				'label' => __( 'Info', 'riapress' ),
				'description' => __( 'Blue for informational content', 'riapress' ),
			),
		);
	}

	/**
	 * Clear blocks cache
	 */
	public static function clear_cache() {
		self::$blocks_cache = null;
	}
}
