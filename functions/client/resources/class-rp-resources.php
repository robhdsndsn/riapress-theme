<?php

/**
 * Class RP_Resources_Post_Type
 *
 * A reusable class to register the "Resources" custom post type
 * and associated custom meta fields.
 */
class RP_Resources_Post_Type {

	const NAME                   = 'resource';
	const META_AUTHOR            = '_rp_resource_author';
	const META_RELATED_RESOURCES = '_rp_resource_related_resources';

	/**
	 * Constructor.
	 * Registers the custom post type and its associated meta fields.
	 */
	public function __construct() {
		$this->register_post_type();
		$this->register_taxonomies();
		$this->register_meta_fields();
		add_action( 'template_redirect', array( $this, 'disable_tax_archives' ), 1 );
	}

	/**
	 * Register the "Resources" custom post type.
	 */
	private function register_post_type(): void {
		require_once get_template_directory() . '/classes/class-custom-post-type.php';

		new Custom_Post_Type(
			self::NAME,
			'resources',
			'dashicons-format-chat',
			'Resource',
			'Resources',
			array(
				'public'             => true,
				'publicly_queryable' => true,
				'has_archive'        => 'resources',
				'taxonomies'         => array(),
				'rewrite'            => array(
					'slug'       => 'resource',
					'with_front' => false,
				),
			),
			array(
				'name' => 'Resources',
			)
		);
	}

	/**
	 * Register taxonomies for the Resources post type.
	 */
	private function register_taxonomies(): void {
		require_once get_template_directory() . '/classes/class-custom-taxonomy.php';

		// Register FLTCA Alignment taxonomy.
		new Custom_Taxonomy(
			array(
				self::NAME,
				RP_Courses_Post_Type::NAME,
			),
			'fltca-alignment',
			'FLTCA Alignment',
			'FLTCA Alignments',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'meta_box_cb'        => false,
				'has_archive'        => true,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'fltca-alignment',
					'with_front' => false,
				),
			)
		);

		// NEW TAXONOMIES

		// Register Page Type taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'page-type',
			'Page Type',
			'Page Types',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'meta_box_cb'        => false,
				'has_archive'        => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'page-type',
					'with_front' => false,
				),
			)
		);

		// Register Format taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'format',
			'format',
			'Formats',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'meta_box_cb'        => false,
				'has_archive'        => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'format',
					'with_front' => false,
				),
			)
		);

		// Register Topic taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'topic',
			'Topic',
			'Topics',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'meta_box_cb'        => false,
				'has_archive'        => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'topic',
					'with_front' => false,
				),
			)
		);

		// Register Primary Role taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'primary-role',
			'Primary Role',
			'Primary Roles',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'meta_box_cb'        => false,
				'has_archive'        => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'primary-role',
					'with_front' => false,
				),
			)
		);

		// Register CLRI Projects taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'clri-projects',
			'CLRI Project',
			'CLRI Projects',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'meta_box_cb'        => false,
				'has_archive'        => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'clri-projects',
					'with_front' => false,
				),
			)
		);

		// Register Possible CLRI Project Association taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'pos-clri-project-association',
			'Possible CLRI Project Association',
			'Possible CLRI Project Associations',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'meta_box_cb'        => false,
				'has_archive'        => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'possible-clri-project-association',
					'with_front' => false,
				),
			)
		);

		// Register CLRI Site taxonomy.
		new Custom_Taxonomy(
			array(
				self::NAME,
				RP_Courses_Post_Type::NAME,
			),
			'clri-site',
			'CLRI Site',
			'CLRI Sites',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'meta_box_cb'        => false,
				'has_archive'        => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'clri-site',
					'with_front' => false,
				),
			)
		);

	}

	/**
	 * Register meta fields for the resource post type.
	 */
	private function register_meta_fields(): void {
		require_once get_template_directory() . '/classes/class-custom-meta-field.php';

		$meta_fields = array(
			self::META_AUTHOR            => array(
				'label'             => __( 'Author', 'riapress' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
			self::META_RELATED_RESOURCES => array(
				'label'             => __( 'Related Resources', 'riapress' ),
				'type'              => 'array',
				'sanitize_callback' => function ( $value ) {
					if ( ! is_array( $value ) ) {
						return array();
					}
					return array_filter(
						$value,
						function ( $post_id ) {
							return get_post_type( $post_id ) === self::NAME;
						}
					);
				},
				'show_in_rest'      => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type' => 'integer',
						),
					),
				),
			),
		);

		new Custom_Meta_Field( self::NAME, $meta_fields );
	}

	/**
	 * Disable archive pages for the custom taxonomies.
	 */
	public function disable_tax_archives() {
		if ( is_tax( array( 'format', 'clri-projects', 'clri-site' ) ) ) {
			global $wp_query;
			$wp_query->set_404();
			status_header( 404 );
			nocache_headers();
			include( get_query_template( '404' ) );
			exit;
		}
	}

	/**
	 * Migrates data from ACF related_resources field to our custom meta field.
	 * Run this once after setting up the new field.
	 */
	public function migrate_related_resources_from_acf(): void {
		// Check if migration has already been run.
		if ( get_option( 'rp_related_resources_migration_complete' ) ) {
			error_log( 'Related resources migration has already been run.' );
			return;
		}

		$resources = get_posts(
			array(
				'post_type'      => self::NAME,
				'posts_per_page' => -1,
				'post_status'    => 'any',
			)
		);

		foreach ( $resources as $resource ) {
			$acf_value = get_field( 'related_resources', $resource->ID );
			if ( ! empty( $acf_value ) ) {
				$related_ids = array_map(
					function ( $post ) {
						return $post->ID;
					},
					$acf_value
				);
				update_post_meta( $resource->ID, self::META_RELATED_RESOURCES, $related_ids );
			}
		}

		// Mark migration as complete.
		update_option( 'rp_related_resources_migration_complete', true );
	}

	/**
	 * Migrates data from ACF author field to our custom meta field.
	 * Run this once after setting up the new field.
	 */
	public function migrate_author_from_acf(): void {
		// Check if migration has already been run.
		if ( get_option( 'rp_author_migration_complete' ) ) {
			error_log( 'Author migration has already been run.' );
			return;
		}

		$resources = get_posts(
			array(
				'post_type'      => self::NAME,
				'posts_per_page' => -1,
				'post_status'    => 'any',
			)
		);

		foreach ( $resources as $resource ) {
			$acf_value = get_field( 'author', $resource->ID );
			if ( ! empty( $acf_value ) ) {
				update_post_meta( $resource->ID, self::META_AUTHOR, $acf_value );
			}
		}

		// Mark migration as complete.
		update_option( 'rp_author_migration_complete', true );
	}
}

// Initialize the class to register the post type and meta fields.
new RP_Resources_Post_Type();

// TODO: Uncomment the following lines to run the migration functions.
// ( new RP_Resources_Post_Type() )->migrate_related_resources_from_acf(); // Remove this line after running once.
// ( new RP_Resources_Post_Type() )->migrate_author_from_acf(); // Remove this line after running once.
