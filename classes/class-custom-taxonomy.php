<?php
/**
 * Class Custom_Taxonomy
 * Handles registering custom taxonomies for specified post types.
 *
 * @package starter
 */
class Custom_Taxonomy {

	/**
	 * Post types to associate the taxonomy with.
	 *
	 * @var array|string
	 */
	private $post_types;

	/**
	 * Slug for the taxonomy.
	 *
	 * @var string
	 */
	private $slug;

	/**
	 * Singular name for the taxonomy.
	 *
	 * @var string
	 */
	private $singular;

	/**
	 * Plural name for the taxonomy.
	 *
	 * @var string
	 */
	private $plural;

	/**
	 * Additional arguments for registering the taxonomy.
	 *
	 * @var array
	 */
	private $args;

	/**
	 * Custom labels to override default labels.
	 *
	 * @var array
	 */
	private $labels;

	/**
	 * Custom_Taxonomy constructor.
	 *
	 * @param array|string $post_types Post types to assign the taxonomy to.
	 * @param string       $slug URL-friendly slug for the taxonomy.
	 * @param string       $singular Singular name of the taxonomy.
	 * @param string       $plural Plural name of the taxonomy.
	 * @param array        $args Additional arguments to override defaults, including custom rewrite rules.
	 * @param array        $labels Custom labels to override defaults.
	 */
	public function __construct(
		$post_types,
		string $slug,
		string $singular,
		string $plural,
		array $args = array(),
		array $labels = array()
	) {
		$this->post_types = (array) $post_types;
		$this->slug       = $slug ? $slug : sanitize_title( $plural );
		$this->singular   = $singular;
		$this->plural     = $plural;
		$this->labels     = is_array( $labels ) ? $labels : array();

		// Merge provided arguments with the defaults.
		$this->args = array_merge( $this->get_default_args(), $args );

		// Ensure that rewrite settings are properly handled, with a default fallback.
		$this->args['rewrite'] = array_merge(
			array(
				'slug'       => $this->slug,
				'with_front' => true,
			), // Default rewrite rules.
			$args['rewrite'] ?? array() // Override with user-provided rewrite rules.
		);

		add_action( 'init', array( $this, 'register_taxonomy' ) );
	}

	/**
	 * Registers the taxonomy with dynamic arguments.
	 *
	 * @return void
	 */
	public function register_taxonomy(): void {
		register_taxonomy( $this->slug, $this->post_types, $this->args );
	}

	/**
	 * Generates the default arguments for the custom taxonomy.
	 *
	 * @return array
	 */
	private function get_default_args(): array {
		$default_labels = array(
			'name'          => $this->plural,
			'singular_name' => $this->singular,
			'menu_name'     => $this->plural,
			'all_items'     => 'All ' . $this->plural,
			'edit_item'     => 'Edit ' . $this->singular,
			'view_item'     => 'View ' . $this->singular,
			'update_item'   => 'Update ' . $this->singular,
			'add_new_item'  => 'Add New ' . $this->singular,
			'new_item_name' => 'New ' . $this->singular . ' Name',
			'search_items'  => 'Search ' . $this->plural,
			'parent_item'   => 'Parent ' . $this->singular,
			'not_found'     => 'No ' . $this->plural . ' found',
		);

		// Merge provided labels with defaults.
		$labels = array_merge( $default_labels, $this->labels );

		return array(
			'hierarchical'      => true, // Default to hierarchical like categories.
			'labels'            => $labels,
			'show_ui'           => true,
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => $this->slug ), // Default rewrite rules.
		);
	}
}
