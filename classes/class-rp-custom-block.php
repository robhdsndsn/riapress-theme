<?php
/**
 * Custom_Block Class
 *
 * This class handles the registration of multiple WordPress blocks, including their JavaScript and PHP translations.
 * Each block can have a unique path within a shared or separate build directory, offering flexibility in organizing
 * blocks and their translation files.
 *
 * @package riapress
 */

class RP_Custom_Block {
    /**
     * Array of block names to register.
     *
     * @var array
     */
    private $block_names;

    /**
     * Array of paths for each block within the build directory.
     *
     * @var array
     */
    private $paths;

    /**
     * Text domain for translations.
     *
     * @var string
     */
    private $domain;

    /**
     * Constructor to initialize class properties.
     *
     * @param array|string $block_names Array of block names or a single block name.
     * @param array|string $paths       Array of paths or a single path for the block(s).
     * @param string       $domain      Text domain for translations.
     */
    public function __construct( $block_names, $paths, $domain ) {
        $this->block_names = (array) $block_names; // Cast to array to support single or multiple blocks.
        $this->paths = (array) $paths; // Cast to array for consistent handling.
        $this->domain = $domain;

        // Initialize the blocks by setting up actions.
        $this->initialize_blocks();
    }

    /**
     * Initialize block registration and translations.
     */
    private function initialize_blocks() {
        add_action( 'init', [ $this, 'register_blocks' ] );
        add_action( 'init', [ $this, 'load_js_translations' ] );
        add_action( 'after_setup_theme', [ $this, 'load_php_translations' ] );
    }

    /**
     * Register each block specified in $block_names with its respective path.
     */
    public function register_blocks() {
        foreach ( $this->block_names as $index => $block_name ) {
            // Use provided custom path for each block if available.
            $path = isset( $this->paths[ $index ] ) ? $this->paths[ $index ] : "build/$block_name";
            register_block_type( get_template_directory() . "/blocks/{$path}" );
        }
    }

    /**
     * Load JS string translations for each block.
     */
	public function load_js_translations() {
		foreach ( $this->block_names as $index => $block_name ) {
			// Define the path to the languages directory
			$languages_dir = get_template_directory() . "/blocks/{$this->paths[ $index ]}/languages";

			// Check if the directory exists before proceeding
			if ( is_dir( $languages_dir ) ) {
				// Load translations for the editor script
				wp_set_script_translations(
					"{$block_name}-editor-script",
					$this->domain,
					$languages_dir
				);
			}
		}
	}

    /**
     * Load PHP string translations.
     */
    public function load_php_translations() {
        // Loads translations from the language directory of the first block.
        load_theme_textdomain( $this->domain, get_template_directory() . "/blocks/{$this->paths[0]}/languages" );
    }
}
