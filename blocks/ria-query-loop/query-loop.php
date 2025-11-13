<?php
/**
 * RIA Query Loop Block (Organism)
 *
 * Display dynamic post content with custom queries and layouts.
 * Server-side rendered block for dynamic content.
 *
 * @package RIA
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render callback for RIA Query Loop block
 *
 * @param array $attributes Block attributes.
 * @return string HTML output.
 */
function ria_query_loop_render_callback( $attributes ) {
	// Extract attributes with defaults
	$post_type           = $attributes['postType'] ?? 'post';
	$posts_per_page      = $attributes['postsPerPage'] ?? 6;
	$orderby             = $attributes['orderBy'] ?? 'date';
	$order               = $attributes['order'] ?? 'DESC';
	$columns             = $attributes['columns'] ?? 3;
	$gap                 = $attributes['gap'] ?? 24;
	$show_featured_image = $attributes['showFeaturedImage'] ?? true;
	$show_title          = $attributes['showTitle'] ?? true;
	$show_excerpt        = $attributes['showExcerpt'] ?? true;
	$show_read_more      = $attributes['showReadMore'] ?? true;
	$exclude_current     = $attributes['excludeCurrentPost'] ?? false;
	$categories          = $attributes['categories'] ?? array();

	// Build query arguments
	$args = array(
		'post_type'      => $post_type,
		'posts_per_page' => $posts_per_page,
		'orderby'        => $orderby,
		'order'          => $order,
		'post_status'    => 'publish',
	);

	// Exclude current post if on singular view
	if ( $exclude_current && is_singular() ) {
		$args['post__not_in'] = array( get_the_ID() );
	}

	// Add category filter if specified
	if ( ! empty( $categories ) ) {
		$args['category__in'] = $categories;
	}

	// Execute query
	$query = new WP_Query( $args );

	// Return early if no posts found
	if ( ! $query->have_posts() ) {
		wp_reset_postdata();
		return '<div class="ria-query-loop"><p>' . esc_html__( 'No posts found.', 'ria' ) . '</p></div>';
	}

	// Start output buffering
	ob_start();
	?>
	<div class="ria-query-loop" style="--query-gap: <?php echo esc_attr( $gap ); ?>px;">
		<div class="ria-query-loop-grid" style="grid-template-columns: repeat(<?php echo esc_attr( $columns ); ?>, 1fr); gap: <?php echo esc_attr( $gap ); ?>px;">
			<?php while ( $query->have_posts() ) : $query->the_post(); ?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( 'ria-query-loop-item' ); ?>>
					<?php if ( $show_featured_image && has_post_thumbnail() ) : ?>
						<div class="ria-query-loop-image">
							<a href="<?php the_permalink(); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Read more about %s', 'ria' ), get_the_title() ) ); ?>">
								<?php the_post_thumbnail( 'medium', array( 'class' => 'ria-query-loop-thumbnail' ) ); ?>
							</a>
						</div>
					<?php endif; ?>

					<div class="ria-query-loop-content">
						<?php if ( $show_title ) : ?>
							<h3 class="ria-query-loop-title">
								<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
							</h3>
						<?php endif; ?>

						<?php if ( $show_excerpt ) : ?>
							<div class="ria-query-loop-excerpt">
								<?php the_excerpt(); ?>
							</div>
						<?php endif; ?>

						<?php if ( $show_read_more ) : ?>
							<a href="<?php the_permalink(); ?>" class="ria-query-loop-read-more" aria-label="<?php echo esc_attr( sprintf( __( 'Read more about %s', 'ria' ), get_the_title() ) ); ?>">
								<?php esc_html_e( 'Read More', 'ria' ); ?> &rarr;
							</a>
						<?php endif; ?>
					</div>
				</article>
			<?php endwhile; ?>
		</div>
	</div>
	<?php

	// Reset post data
	wp_reset_postdata();

	// Return buffered output
	return ob_get_clean();
}

// Register block with render callback
// Note: Using register_block_type directly because RP_Custom_Block doesn't support render callbacks
add_action(
	'init',
	function () {
		register_block_type(
			get_template_directory() . '/blocks/ria-query-loop/build/',
			array(
				'render_callback' => 'ria_query_loop_render_callback',
			)
		);
	}
);
