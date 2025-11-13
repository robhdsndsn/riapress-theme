<?php
/**
 * Class RP_Event_Meta
 *
 * Manages custom meta fields and meta boxes for the "event" post type.
 *
 * @package rp
 */

/**
 * Manages custom meta fields and meta boxes for the "event" post type.
 */
class RP_EVENTS_META {


	const TIME_START_META_KEY = '_rp_event_time_start';
	const TIME_END_META_KEY = '_rp_event_time_end';
	const DATE_START_META_KEY = '_rp_event_date_start';
	const DATE_END_META_KEY = '_rp_event_date_end';
	const DATETIME_START_META_KEY = '_rp_event_datetime_start';
	const DATETIME_END_META_KEY = '_rp_event_datetime_end';
	const ADDRESS_META_KEY = '_rp_event_address';
	const COST_META_KEY = '_rp_event_cost';
	const DRESS_META_KEY = '_rp_event_dress';
	const TICKET_URL_META_KEY = '_rp_event_ticket_url';
	const TICKET_URL_NEW_TAB_META_KEY = '_rp_event_ticket_url_new_tab';

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_meta_fields' ) );
	}

	/**
	 * Register custom meta fields.
	 */
	public function register_meta_fields() {
		$meta_fields = array(
			RP_EVENTS_META::TIME_START_META_KEY         => 'sanitize_text_field',
			RP_EVENTS_META::TIME_END_META_KEY           => 'sanitize_text_field',
			RP_EVENTS_META::DATE_START_META_KEY         => 'sanitize_text_field',
			RP_EVENTS_META::DATE_END_META_KEY           => 'sanitize_text_field',
			RP_EVENTS_META::DATETIME_START_META_KEY     => 'sanitize_text_field',
			RP_EVENTS_META::DATETIME_END_META_KEY       => 'sanitize_text_field',
			RP_EVENTS_META::ADDRESS_META_KEY            => 'sanitize_text_field',
			RP_EVENTS_META::COST_META_KEY               => 'sanitize_text_field',
			RP_EVENTS_META::DRESS_META_KEY              => 'sanitize_text_field',
			RP_EVENTS_META::TICKET_URL_META_KEY         => 'sanitize_text_field',
			RP_EVENTS_META::TICKET_URL_NEW_TAB_META_KEY => 'sanitize_text_field',
		);

		foreach ( $meta_fields as $meta_key => $sanitize_callback ) {
			register_post_meta(
				'event',
				$meta_key,
				array(
					'show_in_rest'      => true,
					'single'            => true,
					'type'              => 'string',
					'sanitize_callback' => $sanitize_callback,
					'auth_callback'     => function () {
						return current_user_can( 'edit_posts' );
					},
				),
				'event', // Add the post type parameter.
			);
		}
	}

}

// Initialize the class.
new RP_EVENTS_META();
