<?php

/**
 * Custom Post Type Class
 *
 * This file contains the Custom_Post_Type class, which allows for dynamic registration of custom post types.
 * It includes customizable settings for slugs, labels, and additional arguments.
 *
 * @package starter
 * @since 1.0.0
 */
class Custom_Post_Type {

	/**
	 * Slug for the custom post type.
	 *
	 * @var string
	 */
	private $slug;

	/**
	 * Slug for the custom post type archive.
	 *
	 * @var string
	 */
	private $archive_slug;

	/**
	 * Menu icon for the post type.
	 *
	 * @var string
	 */
	private $menu_icon;

	/**
	 * Singular name for the post type.
	 *
	 * @var string
	 */
	private $singular;

	/**
	 * Plural name for the post type.
	 *
	 * @var string
	 */
	private $plural;

	/**
	 * Additional arguments for registering the post type.
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
	 * Custom_Post_Type constructor.
	 * Initializes the class with dynamic values for the custom post type.
	 *
	 * @param string $slug URL-friendly slug for the post type.
	 * @param string $archive_slug URL-friendly slug for the post type archive.
	 * @param string $menu_icon Icon for the post type in the admin menu.
	 * @param string $singular Singular name of the post type.
	 * @param string $plural Plural name of the post type.
	 * @param array $args Additional arguments to override defaults.
	 * @param array $labels Custom labels to override defaults.
	 */
	public function __construct(
		string $slug,
		string $archive_slug,
		string $menu_icon,
		string $singular,
		string $plural,
		array $args = array(),
		array $labels = array()
	) {
		$this->slug         = $slug ? $slug : sanitize_title( $singular );
		$this->archive_slug = $archive_slug ? $archive_slug : sanitize_title( $plural );
		$this->menu_icon    = $menu_icon;
		$this->singular     = $singular;
		$this->plural       = $plural;
		$this->args         = array_merge( $this->get_default_args(), $args );
		$this->labels       = is_array( $labels ) ? $labels : array();
		add_action( 'init', array( $this, 'register_post_type' ) );
	}

	/**
	 * Registers the custom post type with dynamic arguments.
	 *
	 * @return void
	 */
	public function register_post_type(): void {
		register_post_type( $this->slug, $this->args );
	}

	/**
	 * Generates the default arguments for the custom post type.
	 *
	 * @return array
	 */
	private function get_default_args(): array {
		return array(
			'label'               => $this->singular,
			'description'         => $this->singular . ' Description',
			'labels'              => $this->get_post_type_labels(),
			'supports'            => array(
				'title',
				'editor',
				'excerpt',
				'author',
				'thumbnail',
				'comments',
				'trackbacks',
				'revisions',
				'custom-fields'
			),
			'taxonomies'          => array( 'category', 'post_tag' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 5,
			'show_in_rest'        => true,
			'menu_icon'           => $this->menu_icon,
			'has_archive'         => $this->archive_slug,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'can_export'          => true,
			'capability_type'     => 'post',
			'rewrite'             => array(
				'slug'       => $this->archive_slug,
				'with_front' => false,
			),
		);
	}

	/**
	 * Generates dynamic labels for the custom post type.
	 *
	 * @return array
	 */
	private function get_post_type_labels(): array {
		$default_labels = array(
			'name'                  => $this->plural,
			'singular_name'         => $this->singular,
			'menu_name'             => $this->plural,
			'name_admin_bar'        => $this->singular,
			'archives'              => $this->singular . ' Archives',
			'attributes'            => $this->singular . ' Attributes',
			'parent_item_colon'     => 'Parent ' . $this->singular . ':',
			'all_items'             => 'All ' . $this->plural,
			'add_new'               => 'Add New',
			'add_new_item'          => 'Add New ' . $this->singular,
			'edit_item'             => 'Edit ' . $this->singular,
			'new_item'              => 'New ' . $this->singular,
			'view_item'             => 'View ' . $this->singular,
			'view_items'            => 'View ' . $this->plural,
			'search_items'          => 'Search ' . $this->singular,
			'not_found'             => 'No ' . $this->plural . ' found',
			'not_found_in_trash'    => 'No ' . $this->plural . ' found in Trash',
			'featured_image'        => 'Featured Image',
			'set_featured_image'    => 'Set featured image',
			'remove_featured_image' => 'Remove featured image',
			'use_featured_image'    => 'Use as featured image',
			'insert_into_item'      => 'Insert into ' . $this->singular,
			'uploaded_to_this_item' => 'Uploaded to this ' . $this->singular,
			'items_list'            => $this->plural . ' list',
			'items_list_navigation' => $this->plural . ' list navigation',
			'filter_items_list'     => 'Filter ' . $this->plural . ' list',
		);

		// Merge provided labels with defaults.
		return array_merge( $default_labels, (array) $this->labels );
	}
}
