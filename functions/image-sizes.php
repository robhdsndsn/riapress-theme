<?php

/**
 * Class RIAPRESS_IMAGE_SIZES
 *
 * Custom Image Sizes for RIAPress
 */
class RIAPRESS_IMAGE_SIZES {
	// Blocks
	const MASTHEAD = 'masthead';
	const CARD = 'card';
	const POST_CARD = 'post_card';

	function __construct() {
		// Masthead Custom Sizes
		add_image_size( self::MASTHEAD, 1920, 800 );
		// Blocks
		add_image_size( self::CARD, 612, 342, array( 'top', 'center' ) );
		add_image_size( self::POST_CARD, 420, 210, array( 'top', 'center' ) );

		add_filter( 'image_size_names_choose', array( $this, 'image_size_names_choose' ), 10, 1 );

		// Add the admin menu page
		add_action( 'admin_menu', array( $this, 'register_image_sizes_menu_page' ) );
	}

	/**
	 * Adds custom image sizes to the Media Selector and core/block-editor store
	 *
	 * @param $sizes
	 *
	 * @return mixed
	 */
	function image_size_names_choose( $sizes ) {
		$sizes[ self::MASTHEAD ]  = 'Masthead';
		$sizes[ self::CARD ] = 'Card';
		$sizes[ self::POST_CARD ] = 'Post Card';

		return $sizes;
	}

	/**
	 * Register the Image Sizes admin menu page
	 */
	function register_image_sizes_menu_page() {
		add_submenu_page(
			'tools.php',
			'Image Sizes',
			'Image Sizes',
			'manage_options',
			'image-sizes',
			array( $this, 'display_image_sizes_page' )
		);
	}

	/**
	 * Display the Image Sizes page content
	 */
	function display_image_sizes_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Fetch registered image sizes
		$image_sizes = wp_get_registered_image_subsizes();
		?>
		<div class="wrap">
			<h1>Registered Image Sizes</h1>
			<table class="widefat fixed striped">
				<thead>
				<tr>
					<th scope="col">Image Size Name</th>
					<th scope="col">Width</th>
					<th scope="col">Height</th>
					<th scope="col">Crop</th>
				</tr>
				</thead>
				<tbody>
				<?php foreach ( $image_sizes as $size_name => $size_details ) : ?>
					<tr>
						<td><?php echo esc_html( $size_name ); ?></td>
						<td><?php echo esc_html( $size_details['width'] ); ?> px</td>
						<td><?php echo esc_html( $size_details['height'] ); ?> px</td>
						<td><?php echo $size_details['crop'] ? 'Yes' : 'No'; ?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
		</div>
		<style>
            .wrap h1 {
                margin-bottom: 20px;
            }

            .wrap table.widefat th, .wrap table.widefat td {
                padding: 10px;
                text-align: left;
            }

            .wrap table.widefat {
                margin-top: 20px;
                width: 100%;
            }
		</style>
		<?php
	}
}

new RIAPRESS_IMAGE_SIZES;
