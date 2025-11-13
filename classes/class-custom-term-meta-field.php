<?php
/**
 * Class Custom_Term_Meta_Field
 *
 * A reusable class to manage custom term meta fields and meta boxes for any taxonomy.
 *
 * @package starter
 * @since 1.0.0
 */
class Custom_Term_Meta_Field {

	private $taxonomies;
	private $meta_fields;

	public function __construct( $taxonomies, array $meta_fields ) {
		$this->taxonomies  = (array) $taxonomies;
		$this->meta_fields = $meta_fields;

		// Register actions for term meta.
		add_action( 'init', array( $this, 'register_term_meta' ) );

		// Add fields to the add and edit term pages.
		foreach ( $this->taxonomies as $taxonomy ) {
			add_action( "{$taxonomy}_add_form_fields", array( $this, 'add_term_meta_fields' ) );
			add_action( "{$taxonomy}_edit_form_fields", array( $this, 'edit_term_meta_fields' ), 10, 2 );
			add_action( "edited_{$taxonomy}", array( $this, 'save_term_meta_fields' ), 10, 2 );
			add_action( "create_{$taxonomy}", array( $this, 'save_term_meta_fields' ), 10, 2 );
			add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		}
	}

	public function register_term_meta() {
		foreach ( $this->meta_fields as $meta_key => $config ) {
			$type = $config['type'] ?? 'string';

			$args = array(
				'type'              => $type,
				'description'       => $config['description'] ?? '',
				'single'            => true,
				'sanitize_callback' => $config['sanitize_callback'] ?? null,
				'show_in_rest'      => true,
			);

			foreach ( $this->taxonomies as $taxonomy ) {
				register_term_meta( $taxonomy, $meta_key, $args );
			}
		}
	}

	public function add_term_meta_fields( $taxonomy ) {
		foreach ( $this->meta_fields as $meta_key => $config ) {
			echo '<div class="form-field">';
			echo '<label for="' . esc_attr( $meta_key ) . '">' . esc_html( $config['label'] ) . '</label>';
			$this->render_meta_field( $meta_key, '', $config );
			if ( isset( $config['description'] ) ) {
				echo '<p class="description">' . esc_html( $config['description'] ) . '</p>';
			}
			echo '</div>';
		}
	}

	public function edit_term_meta_fields( $term, $taxonomy ) {
		foreach ( $this->meta_fields as $meta_key => $config ) {
			$meta_value = get_term_meta( $term->term_id, $meta_key, true );

			echo '<tr class="form-field">';
			echo '<th scope="row" valign="top"><label for="' . esc_attr( $meta_key ) . '">' . esc_html( $config['label'] ) . '</label></th>';
			echo '<td>';
			$this->render_meta_field( $meta_key, $meta_value, $config );
			if ( isset( $config['description'] ) ) {
				echo '<p class="description">' . esc_html( $config['description'] ) . '</p>';
			}
			echo '</td>';
			echo '</tr>';
		}
	}

	public function save_term_meta_fields( $term_id ) {
		foreach ( $this->meta_fields as $meta_key => $config ) {
			if ( isset( $_POST[ $meta_key ] ) ) {
				$meta_value = isset( $config['sanitize_callback'] )
					? call_user_func( $config['sanitize_callback'], wp_unslash( $_POST[ $meta_key ] ) )
					: sanitize_text_field( wp_unslash( $_POST[ $meta_key ] ) );

				update_term_meta( $term_id, $meta_key, $meta_value );
			}
		}
	}

	private function render_meta_field( $meta_key, $meta_value, $config ) {
		switch ( $config['type'] ) {
			case 'text':
				echo '<input type="text" id="' . esc_attr( $meta_key ) . '" name="' . esc_attr( $meta_key ) . '" value="' . esc_attr( $meta_value ) . '" />';
				break;
			case 'textarea':
				echo '<textarea id="' . esc_attr( $meta_key ) . '" name="' . esc_attr( $meta_key ) . '">' . esc_textarea( $meta_value ) . '</textarea>';
				break;
			case 'checkbox':
				echo '<label>';
				echo '<input type="checkbox" id="' . esc_attr( $meta_key ) . '" name="' . esc_attr( $meta_key ) . '" value="1" ' . checked( $meta_value, 1, false ) . ' />';
				echo esc_html( $config['label'] );
				echo '</label>';
				break;
			case 'select':
				if ( isset( $config['options'] ) && is_array( $config['options'] ) ) {
					echo '<select id="' . esc_attr( $meta_key ) . '" name="' . esc_attr( $meta_key ) . '">';
					foreach ( $config['options'] as $value => $label ) {
						echo '<option value="' . esc_attr( $value ) . '" ' . selected( $meta_value, $value, false ) . '>' . esc_html( $label ) . '</option>';
					}
					echo '</select>';
				}
				break;
			case 'email':
				echo '<input type="email" id="' . esc_attr( $meta_key ) . '" name="' . esc_attr( $meta_key ) . '" value="' . esc_attr( $meta_value ) . '" />';
				break;
			case 'photo':
				$image_url = $meta_value ? wp_get_attachment_image_url( $meta_value, 'thumbnail' ) : '';
				echo '<div class="photo-field-wrapper">';
				echo '<img id="' . esc_attr( $meta_key ) . '_preview" src="' . esc_url( $image_url ) . '" style="max-width: 150px; max-height: 150px; display: ' . ( $image_url ? 'block' : 'none' ) . ';" />';
				echo '<input type="hidden" id="' . esc_attr( $meta_key ) . '" name="' . esc_attr( $meta_key ) . '" value="' . esc_attr( $meta_value ) . '" />';
				echo '<button type="button" class="button photo-upload-button" data-target="' . esc_attr( $meta_key ) . '">Select Photo</button>';
				echo '<button type="button" class="button photo-remove-button" data-target="' . esc_attr( $meta_key ) . '" style="display: ' . ( $meta_value ? 'inline-block' : 'none' ) . ';">Remove Photo</button>';
				echo '</div>';
				break;
			default:
				echo '<input type="text" id="' . esc_attr( $meta_key ) . '" name="' . esc_attr( $meta_key ) . '" value="' . esc_attr( $meta_value ) . '" />';
				break;
		}
	}

	function admin_enqueue_scripts(): void {
		wp_enqueue_media();
		wp_enqueue_script(
			'rp-custom-term-meta-field-script',
			get_stylesheet_directory_uri()  . '/classes/js/custom-term-meta-field.js',
			array(),
			'1.0.0',
			true
		);
	}
}