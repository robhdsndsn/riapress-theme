<?php
/**
 * Courses Post Type Registration
 *
 * This file contains the RP_Courses_Post_Type class for registering
 * the "Courses" custom post type and associated taxonomies.
 *
 * @package riapress
 */
class RP_Courses_Post_Type {
	const NAME = 'course';

	/**
	 * Constructor.
	 * Registers the custom post type and its associated meta fields.
	 */
	public function __construct() {
		$this->register_post_type();
		$this->register_taxonomies();
		add_action( 'template_redirect', array( $this, 'disable_tax_archives' ), 1 );
	}

	/**
	 * Register the "Resources" custom post type.
	 */
	public function register_post_type(): void {
		require_once get_template_directory() . '/classes/class-custom-post-type.php';

		new Custom_Post_Type(
			self::NAME,
			'courses',
			'dashicons-welcome-learn-more',
			'Course',
			'Courses',
			array(
				'public'             => true,
				'publicly_queryable' => true,
				'has_archive'        => 'courses',
				'taxonomies'         => array(),
				'rewrite'            => array(
					'slug'       => 'courses',
					'with_front' => false,
				),
				'show_in_rest'       => true,
				'supports'           => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ),
			),
			array(
				'name' => 'Courses',
			)
		);
	}

	/**
	 * Register taxonomies for the Resources post type.
	 */
	public function register_taxonomies(): void {
		require_once get_template_directory() . '/classes/class-custom-taxonomy.php';

		// Register Designed Fortaxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'designed_for',
			'Designed For',
			'Designed For',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'designed-for',
					'with_front' => false,
				),
			)
		);

		// Register Course Topic taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'course_topic',
			'Course Topic',
			'Course Topics',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'course-topic',
					'with_front' => false,
				),
			)
		);

		// Register Course Skills taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'course_skills',
			'Course Skill',
			'Course Skills',
			array(
				'hierarchical'       => false,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'course-skills',
					'with_front' => false,
				),
			)
		);

		// Register CLRI Project taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'clri_project',
			'CLRI Project',
			'CLRI Projects',
			array(
				'hierarchical'       => true,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'clri-project',
					'with_front' => false,
				),
			)
		);

		// Register Experience Level taxonomy.
		new Custom_Taxonomy(
			self::NAME,
			'experience_level',
			'Experience Level',
			'Experience Levels',
			array(
				'hierarchical'       => true,
				'show_in_nav_menus'  => true,
				'show_admin_column'  => true,
				'show_ui'            => true,
				'show_in_quick_edit' => false,
				'public'             => true,
				'show_in_rest'       => true,
				'rewrite'            => array(
					'slug'       => 'experience-level',
					'with_front' => false,
				),
			)
		);

	}

	/**
	 * Disable archive pages for the custom taxonomies.
	 */
	public function disable_tax_archives() {
		if ( is_tax( array( 'clri_project', 'experience_level' ) ) ) {
			global $wp_query;
			$wp_query->set_404();
			status_header( 404 );
			nocache_headers();
			include( get_query_template( '404' ) );
			exit;
		}
	}
}

// Initialize the class to register the post type and taxonomies.
new RP_Courses_Post_Type();

/**
 * Register Course Meta
 */
require_once get_template_directory() . '/functions/client/courses/class-rp-courses-meta.php';
