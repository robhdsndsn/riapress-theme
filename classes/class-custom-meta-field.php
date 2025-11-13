<?php

/**
 * Class Custom_Meta_Field
 *
 * A reusable class to manage custom meta fields and meta boxes for any custom post types.
 *
 * @package starter
 * @since 1.0.4
 */
class Custom_Meta_Field {

	/**
	 * Post types to associate the meta fields with.
	 *
	 * @var array
	 */
	private $post_types;

	/**
	 * Meta fields configuration.
	 *
	 * @var array
	 */
	private $meta_fields;

	/**
	 * Class constructor.
	 *
	 * @param array|string $post_types The post type(s) for which the meta fields will be registered.
	 * @param array $meta_fields The meta fields configuration (key => config array).
	 */
	public function __construct( $post_types, array $meta_fields ) {
		$this->post_types  = (array) $post_types; // Cast to array to support single or multiple post types.
		$this->meta_fields = $meta_fields;

		// Register actions.
		add_action( 'init', array( $this, 'register_meta_fields' ) );
		add_action( 'save_post', array( $this, 'validate_required_fields' ), 1, 2 ); // Early save hook.
		add_action( 'save_post', array( $this, 'save_meta_fields' ), 10, 2 );         // Regular save hook.
	}

	/**
	 * Register custom meta fields for the specified post types.
	 */
	public function register_meta_fields() {
		foreach ( $this->meta_fields as $meta_key => $config ) {
			$type = isset( $config['type'] ) ? $config['type'] : 'string';

			$args = array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => $type,
				'sanitize_callback' => array( $this, 'get_sanitizer' ),
				'auth_callback'     => array( $this, 'has_permission' ),
			);

			if ( 'array' === $type ) {
				$args['show_in_rest'] = array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type' => 'integer',
						),
					),
				);
			}

			foreach ( $this->post_types as $post_type ) {
				register_post_meta( $post_type, $meta_key, $args );
			}
		}
	}

	/**
	 * Retrieve the appropriate sanitization function for the meta field.
	 *
	 * @param mixed $value The value of the meta field.
	 * @param string $meta_key The meta key to identify the field configuration.
	 *
	 * @return mixed           Sanitized value of the meta field.
	 */
	public function get_sanitizer( $value, $meta_key ) {
		// Get the sanitization function based on the meta field configuration.
		$config = $this->meta_fields[ $meta_key ] ?? null;
		if ( isset( $config['sanitize_callback'] ) && is_callable( $config['sanitize_callback'] ) ) {
			return call_user_func( $config['sanitize_callback'], $value );
		}

		// Default handling for arrays and integers.
		if ( 'array' === $config['type'] ) {
			return $this->sanitize_array( $value );
		} elseif ( 'integer' === $config['type'] ) {
			return intval( $value );
		}

		// Fallback for other types.
		return sanitize_text_field( $value );
	}

	/**
	 * Sanitize an array of integers.
	 *
	 * @param mixed $value The array of values to be sanitized.
	 *
	 * @return array       Sanitized array of integers.
	 */
	private function sanitize_array( $value ) {
		if ( is_array( $value ) ) {
			return array_map( 'intval', $value );
		}

		return array();
	}

	/**
	 * Sanitize relationship activity log entries.
	 *
	 * @param mixed $value The array of relationship entries to be sanitized.
	 *
	 * @return array       Sanitized array of relationship entries.
	 */
	private function sanitize_relationship_activity( $value ) {
		if ( is_array( $value ) ) {
			return array_map( function ( $entry ) {
				return array(
					'related_post_id' => isset( $entry['related_post_id'] ) ? intval( $entry['related_post_id'] ) : null,
					'timestamp'       => isset( $entry['timestamp'] ) ? sanitize_text_field( $entry['timestamp'] ) : '',
					'type'            => 'added',
				);
			}, $value );
		}

		return array();
	}

	/**
	 * Validate required fields before saving the post.
	 *
	 * @param int $post_id The ID of the post being saved.
	 * @param WP_Post $post The post object.
	 */
	public function validate_required_fields( $post_id, $post ) {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( wp_is_post_revision( $post_id ) || ! in_array( $post->post_type, $this->post_types, true ) ) {
			return;
		}

		foreach ( $this->meta_fields as $meta_key => $config ) {
			if ( ! empty( $config['required'] ) && empty( $_POST["{$meta_key}_field"] ) ) {
				remove_action( 'save_post', array( $this, 'save_meta_fields' ) ); // Prevent infinite loop.
				wp_die(
					__( 'Please complete all required fields.', 'starter' ),
					__( 'Error: Missing Required Fields', 'starter' ),
					array( 'back_link' => true )
				);
			}
		}
	}

	/**
	 * Save custom meta fields.
	 *
	 * @param int $post_id The ID of the current post.
	 */
	public function save_meta_fields( $post_id ) {
		foreach ( $this->meta_fields as $meta_key => $config ) {
			if ( ! isset( $_POST["{$meta_key}_nonce"] ) ||
			     ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST["{$meta_key}_nonce"] ) ), "save_{$meta_key}" ) ) {
				continue;
			}

			if ( isset( $_POST["{$meta_key}_field"] ) ) {
				if ( 'file' === $config['type'] ) {
					// Save the attachment ID for file fields.
					$meta_value = intval( $_POST["{$meta_key}_field"] );
				} elseif ( 'post_to_post' === $config['type'] ) {
					// Save the post ID for post_to_post fields.
					$meta_value = intval( $_POST["{$meta_key}_field"] );
				} else {
					// Handle other field types using the sanitize callback.
					$meta_value = call_user_func( $config['sanitize_callback'], wp_unslash( $_POST["{$meta_key}_field"] ) );
				}

				// Save or delete the meta value.
				if ( ! empty( $meta_value ) || $meta_value === 0 ) {
					update_post_meta( $post_id, $meta_key, $meta_value );
				} else {
					delete_post_meta( $post_id, $meta_key );
				}
			}
		}
	}

	/**
	 * Check if the current user has permission to edit posts.
	 *
	 * @return bool True if the user has permission, false otherwise.
	 */
	public function has_permission() {
		return current_user_can( 'edit_posts' );
	}
}
