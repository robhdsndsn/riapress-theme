<?php
/**
 * Class RP_EVENTS
 * Manages post type "event".
 *
 * @package rp
 */

/**
 * Manages creation for the "event" post type.
 */
class RP_EVENTS {

	// Post type constants.
	const SLUG_SINGULAR = 'event';
	const SLUG_PLURAL   = 'events';
	const QUERY_VAR     = 'event';

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_post_type' ), 0 );
		// add_action( 'pre_get_posts', array( $this, 'pre_get_posts' ) ); //TODO: disabled until we sort out new meta Reach Components
		// add_filter( 'rest_event_query', array( $this, 'rest_event_query' ) ); //TODO: disabled until we sort out new meta Reach Components
		add_action( 'init', array( $this, 'rp_create_event_taxonomies' ), 0 );
		add_action( 'init', array( $this, 'rp_create_event_tag_taxonomy' ), 0 );
	}

	/**
	 * Register Events Post Type
	 *
	 * @return void
	 */
	public function register_post_type() {
		require_once get_template_directory() . '/classes/class-custom-post-type.php';
		new Custom_Post_Type(
			self::SLUG_SINGULAR,
			self::SLUG_PLURAL,
			'dashicons-tickets',
			'Event',
			'Events',
		);
	}

	/**
	 * Custom Query for current and past events
	 *
	 * @param WP_Query $query The query object.
	 * @return void
	 */
	public function pre_get_posts( $query ) {
		if ( is_admin() || ! $query->is_main_query() ) {
			return;
		}

		if ( $query->is_post_type_archive( 'event' ) || ( $query->is_archive() && $query->get( 'post_type' ) === 'event' ) ) {
			$today = current_time( 'Y-m-d' );

			// Check for 'past-events' parameter in the URL.
			$show_past_events = isset( $_GET['past-events'] ) && $_GET['past-events'] == 'true';

			// Set the meta query based on whether we're showing past events or not.
			$meta_query = array(
				array(
					'key'     => '_rp_event_date_end',
					'value'   => $today,
					'compare' => $show_past_events ? '<' : '>=',
					'type'    => 'DATE',
				),
			);

			$query->set( 'meta_query', $meta_query );
			$query->set( 'meta_key', '_rp_event_date_end' );
			$query->set( 'orderby', 'meta_value' );
			$query->set( 'order', $show_past_events ? 'DESC' : 'ASC' );
		}
	}

	/**
	 * Custom REST API Query
	 *
	 * @param array $args The query arguments.
	 * @return array The modified query arguments.
	 */
	public function rest_event_query( $args ) {
		$today              = date( 'Y-m-d' );
		$args['meta_key']   = '_rp_event_date_end';
		$args['orderby']    = 'meta_value';
		$args['order']      = 'ASC';
		$args['meta_query'] = array(
			array(
				'key'     => '_rp_event_date_end',
				'value'   => $today,
				'compare' => '>=',
				'type'    => 'DATE',
			),
		);

		return $args;
	}

	/**
	 * Create Event Taxonomies
	 */
	public function rp_create_event_taxonomies() {
		// Add new "Event Categories" taxonomy to "event" post type.
		$labels = array(
			'name'              => _x( 'Event Categories', 'taxonomy general name', 'zp' ),
			'singular_name'     => _x( 'Event Category', 'taxonomy singular name', 'zp' ),
			'search_items'      => __( 'Search Event Categories', 'zp' ),
			'all_items'         => __( 'All Event Categories', 'zp' ),
			'parent_item'       => __( 'Parent Event Category', 'zp' ),
			'parent_item_colon' => __( 'Parent Event Category:', 'zp' ),
			'edit_item'         => __( 'Edit Event Category', 'zp' ),
			'update_item'       => __( 'Update Event Category', 'zp' ),
			'add_new_item'      => __( 'Add New Event Category', 'zp' ),
			'new_item_name'     => __( 'New Event Category Name', 'zp' ),
			'menu_name'         => __( 'Event Categories', 'zp' ),
		);

		$args = array(
			'hierarchical'      => true, // Like categories.
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'show_in_rest'      => true,
			'rewrite'           => array( 'slug' => 'events/category' ),
		);

		register_taxonomy( 'event_category', array( 'event' ), $args );
	}

	/**
	 * Create Event Tags Taxonomy
	 */
	public function rp_create_event_tag_taxonomy() {
		// Add new "Event Tags" taxonomy to "event" post type.
		$labels = array(
			'name'                       => _x( 'Event Tags', 'taxonomy general name', 'zp' ),
			'singular_name'              => _x( 'Event Tag', 'taxonomy singular name', 'zp' ),
			'search_items'               => __( 'Search Event Tags', 'zp' ),
			'popular_items'              => __( 'Popular Event Tags', 'zp' ),
			'all_items'                  => __( 'All Event Tags', 'zp' ),
			'parent_item'                => null,
			'parent_item_colon'          => null,
			'edit_item'                  => __( 'Edit Event Tag', 'zp' ),
			'update_item'                => __( 'Update Event Tag', 'zp' ),
			'add_new_item'               => __( 'Add New Event Tag', 'zp' ),
			'new_item_name'              => __( 'New Event Tag Name', 'zp' ),
			'separate_items_with_commas' => __( 'Separate event tags with commas', 'zp' ),
			'add_or_remove_items'        => __( 'Add or remove event tags', 'zp' ),
			'choose_from_most_used'      => __( 'Choose from the most used event tags', 'zp' ),
			'not_found'                  => __( 'No event tags found.', 'zp' ),
			'menu_name'                  => __( 'Event Tags', 'zp' ),
		);

		$args = array(
			'hierarchical'          => false,
			'labels'                => $labels,
			'show_ui'               => true,
			'show_admin_column'     => true,
			'update_count_callback' => '_update_post_term_count',
			'query_var'             => true,
			'show_in_rest'          => true,
			'rewrite'               => array( 'slug' => 'events/tag' ),
		);

		register_taxonomy( 'event_tag', array( 'event' ), $args );
	}
}

new RP_EVENTS();

/**
 * Register Event Meta
 */
require_once get_template_directory() . '/functions/client/events/class-rp-events-meta.php';
