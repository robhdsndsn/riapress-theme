<?php
/**
 * Render.php.
 *
 * @package RP Post Related
 */

/**
 * Get related posts from the _rp_resource_related_resources meta field
 *
 * @param int $post_id Current post ID.
 * @return array Array of post IDs or empty array.
 */

// Check if function exists.
if ( ! function_exists( 'rp_get_meta_related_posts' ) ) {
	/**
	 * Get existing related posts
	 *
	 * @param int $post_id Current post ID.
	 * @return array Array of post IDs or empty array.
	 */
	function rp_get_meta_related_posts( $post_id ) {
		$related_posts = get_post_meta( $post_id, '_rp_resource_related_resources', true );
		if ( ! is_array( $related_posts ) ) {
			return array();
		}

		// Filter out invalid post IDs and ensure they are published.
		$valid_posts = array();
		foreach ( $related_posts as $related_post_id ) {
			if ( get_post_status( $related_post_id ) === 'publish' ) {
				$valid_posts[] = $related_post_id;
			}
		}

		return $valid_posts;
	}
}

/**
 * Get related posts using the priority algorithm
 *
 * @param array $attributes Block attributes.
 * @param int   $current_post_id Current post ID (if available).
 * @return WP_Query
 */
if ( ! function_exists( 'rp_get_related_posts_query' ) ) {
	/**
	 * Get related posts query based on attributes and current post ID
	 *
	 * @param array $attributes Block attributes.
	 * @param int   $current_post_id Current post ID (if available).
	 * @return WP_Query
	 */
	function rp_get_related_posts_query( $attributes, $current_post_id = null ) {
		// Validate and sanitize input parameters.
		$post_type      = isset( $attributes['postType'] ) ? sanitize_key( $attributes['postType'] ) : 'resource';
		$posts_per_page = isset( $attributes['numberOfPosts'] ) ? absint( $attributes['numberOfPosts'] ) : 3;
		
		// Ensure minimum and maximum limits.
		$posts_per_page = max( 1, min( 10, $posts_per_page ) );
		
		// Validate current post ID.
		if ( $current_post_id ) {
			$current_post_id = absint( $current_post_id );
			if ( $current_post_id <= 0 || get_post_status( $current_post_id ) !== 'publish' ) {
				$current_post_id = null;
			}
		}
		
		$post_ids      = array();
		$used_post_ids = array(); // Track used posts to prevent duplicates.
		
		// Add current post to exclusions to prevent self-reference.
		if ( $current_post_id ) {
			$used_post_ids[] = $current_post_id;
		}
		
		// Priority 1: Add manually selected posts in block (HIGHEST PRIORITY).
		// This should ALWAYS work regardless of algorithm setting.
		if ( isset( $attributes['selectedPosts'] ) && is_array( $attributes['selectedPosts'] ) && ! empty( $attributes['selectedPosts'] ) ) {
			foreach ( $attributes['selectedPosts'] as $selected_post_id ) {
				// Break if we already have enough posts.
				if ( count( $post_ids ) >= $posts_per_page ) {
					break;
				}
				
				// Validate and sanitize post ID.
				$selected_post_id = absint( $selected_post_id );
				
				// Check if valid, published, not already used, and not current post.
				if ( $selected_post_id > 0 && get_post_status( $selected_post_id ) === 'publish' && ! in_array( $selected_post_id, $used_post_ids, true ) ) {
					$post_ids[]      = $selected_post_id;
					$used_post_ids[] = $selected_post_id;
				}
			}
		}
		
		// Priority 2: Posts from selected taxonomies (in priority order).
		if ( count( $post_ids ) < $posts_per_page && $current_post_id ) {
			$remaining_slots = $posts_per_page - count( $post_ids );
			$taxonomy_posts  = rp_get_taxonomy_related_posts( $attributes, $current_post_id, $remaining_slots, $used_post_ids );
			
			if ( ! empty( $taxonomy_posts ) && is_array( $taxonomy_posts ) ) {
				foreach ( $taxonomy_posts as $taxonomy_post_id ) {
					// Break if we already have enough posts.
					if ( count( $post_ids ) >= $posts_per_page ) {
						break;
					}
					
					// Additional validation and duplicate check.
					$taxonomy_post_id = absint( $taxonomy_post_id );
					if ( $taxonomy_post_id > 0 && ! in_array( $taxonomy_post_id, $used_post_ids, true ) ) {
						$post_ids[]      = $taxonomy_post_id;
						$used_post_ids[] = $taxonomy_post_id;
					}
				}
			}
		}
		
		// Priority 3: Fallback to first taxonomy in hierarchy with deterministic selection.
		if ( count( $post_ids ) < $posts_per_page && $current_post_id ) {
			$remaining_slots          = $posts_per_page - count( $post_ids );
			$fallback_taxonomy_posts = rp_get_taxonomy_fallback_posts( $attributes, $current_post_id, $post_type, $remaining_slots, $used_post_ids );
			
			if ( ! empty( $fallback_taxonomy_posts ) && is_array( $fallback_taxonomy_posts ) ) {
				foreach ( $fallback_taxonomy_posts as $fallback_post_id ) {
					// Break if we already have enough posts.
					if ( count( $post_ids ) >= $posts_per_page ) {
						break;
					}
					
					// Additional validation and duplicate check.
					$fallback_post_id = absint( $fallback_post_id );
					if ( $fallback_post_id > 0 && ! in_array( $fallback_post_id, $used_post_ids, true ) ) {
						$post_ids[]      = $fallback_post_id;
						$used_post_ids[] = $fallback_post_id;
					}
				}
			}
		}
		
		// Priority 4: Fallback recent posts.
		if ( count( $post_ids ) < $posts_per_page ) {
			$remaining_slots = $posts_per_page - count( $post_ids );
			$fallback_posts  = rp_get_fallback_posts( $post_type, $remaining_slots, $used_post_ids, $current_post_id );
			
			if ( ! empty( $fallback_posts ) && is_array( $fallback_posts ) ) {
				foreach ( $fallback_posts as $fallback_post_id ) {
					// Break if we already have enough posts.
					if ( count( $post_ids ) >= $posts_per_page ) {
						break;
					}
					
					// Additional validation and duplicate check.
					$fallback_post_id = absint( $fallback_post_id );
					if ( $fallback_post_id > 0 && ! in_array( $fallback_post_id, $used_post_ids, true ) ) {
						$post_ids[]      = $fallback_post_id;
						$used_post_ids[] = $fallback_post_id;
					}
				}
			}
		}
		
		// Final validation: ensure we have valid posts and trim to requested number.
		// Ensure $post_ids is always an array.
		if ( ! is_array( $post_ids ) ) {
			$post_ids = array();
		}
		
		$post_ids = array_filter( $post_ids, function( $id ) {
			return absint( $id ) > 0 && get_post_status( $id ) === 'publish';
		});
		
		// Remove duplicates (extra safety).
		$post_ids = array_unique( $post_ids );
		
		// Trim to requested number.
		if ( count( $post_ids ) > $posts_per_page ) {
			$post_ids = array_slice( $post_ids, 0, $posts_per_page );
		}
		
		// Final fallback: if no posts found, use complete legacy query.
		if ( empty( $post_ids ) ) {
			$legacy_query = rp_get_legacy_posts_query( $attributes );
			
			// Validate that we got a proper WP_Query.
			if ( $legacy_query instanceof WP_Query && $legacy_query->have_posts() ) {
				return $legacy_query;
			} else {
				// Last resort: return empty query with proper structure.
				return new WP_Query( array( 'post_type' => $post_type, 'posts_per_page' => 0 ) );
			}
		}
		
		// Create query with specific post IDs.
		$args = array(
			'post_type'              => $post_type,
			'post__in'               => $post_ids,
			'posts_per_page'         => $posts_per_page,
			'post_status'            => 'publish',
			'orderby'                => 'post__in', // Maintain the order of selected posts.
			'no_found_rows'          => true, // Performance optimization.
			'update_post_meta_cache' => false, // Performance optimization if meta not needed.
		);

		$query = new WP_Query( $args );

		// Validate query result.
		if ( ! $query instanceof WP_Query ) {
			// Fallback to legacy query if something went wrong.
			return rp_get_legacy_posts_query( $attributes );
		}

		return $query;
	}
}

/**
 * Legacy query for backward compatibility
 *
 * @param array $attributes Block attributes.
 * @return WP_Query
 */
if ( ! function_exists( 'rp_get_legacy_posts_query' ) ) {
	/**
	 * Get legacy posts query based on attributes
	 *
	 * @param array $attributes Block attributes.
	 * @return WP_Query
	 */
	function rp_get_legacy_posts_query( $attributes ) {
		$post_type = isset( $attributes['postType'] ) ? $attributes['postType'] : 'resource';

		$args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $attributes['numberOfPosts'],
			'post_status'    => 'publish',
			'orderby'        => $attributes['orderBy'],
			'order'          => $attributes['order'],
		);

		if ( isset( $attributes['categories'] ) && ! empty( $attributes['categories'] ) ) {
			$args['category__in'] = array_column( $attributes['categories'], 'id' );
		}

		return new WP_Query( $args );
	}
}

/**
 * Get fallback posts to fill remaining slots
 *
 * @param string $post_type     Post type to query.
 * @param int    $count         Number of posts needed.
 * @param array  $exclude_ids   Post IDs to exclude.
 * @param int    $current_post_id Current post ID to exclude.
 * @return array Array of post IDs.
 */
if ( ! function_exists( 'rp_get_fallback_posts' ) ) {
	/**
	 * Get fallback posts to fill remaining slots
	 *
	 * @param string $post_type     Post type to query.
	 * @param int    $count         Number of posts needed.
	 * @param array  $exclude_ids   Post IDs to exclude.
	 * @param int    $current_post_id Current post ID to exclude.
	 * @return array Array of post IDs.
	 */
	function rp_get_fallback_posts( $post_type, $count, $exclude_ids = array(), $current_post_id = null ) {
		// Add current post to exclude list.
		if ( $current_post_id ) {
			$exclude_ids[] = $current_post_id;
		}
		
		$args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $count,
			'post_status'    => 'publish',
			'orderby'        => 'date',
			'order'          => 'DESC',
			'fields'         => 'ids', // Only get IDs.
		);
		
		// Exclude already selected posts.
		if ( ! empty( $exclude_ids ) ) {
			$args['post__not_in'] = $exclude_ids;
		}
		
		$fallback_query = new WP_Query( $args );
		
		return $fallback_query->posts;
	}
}

/**
 * Get legacy posts as IDs only (for mixing with manual selection)
 *
 * @param array $attributes Block attributes.
 * @param int   $count      Number of posts needed.
 * @param array $exclude_ids Post IDs to exclude.
 * @return array Array of post IDs.
 */
if ( ! function_exists( 'rp_get_legacy_posts_ids' ) ) {
	/**
	 * Get legacy posts as IDs only (for mixing with manual selection)
	 *
	 * @param array $attributes Block attributes.
	 * @param int   $count      Number of posts needed.
	 * @param array $exclude_ids Post IDs to exclude.
	 * @return array Array of post IDs.
	 */
	function rp_get_legacy_posts_ids( $attributes, $count, $exclude_ids = array() ) {
		$post_type = isset( $attributes['postType'] ) ? $attributes['postType'] : 'resource';
		
		$args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $count,
			'post_status'    => 'publish',
			'orderby'        => $attributes['orderBy'] ?? 'date',
			'order'          => $attributes['order'] ?? 'desc',
			'fields'         => 'ids', // Only get IDs.
		);

		if ( isset( $attributes['categories'] ) && ! empty( $attributes['categories'] ) ) {
			$args['category__in'] = array_column( $attributes['categories'], 'id' );
		}
		
		// Exclude already selected posts.
		if ( ! empty( $exclude_ids ) ) {
			$args['post__not_in'] = $exclude_ids;
		}
		
		$legacy_query = new WP_Query( $args );
		
		return $legacy_query->posts;
	}
}

/**
 * Get related posts from selected taxonomies in priority order
 *
 * @param array $attributes       Block attributes.
 * @param int   $current_post_id  Current post ID.
 * @param int   $count            Number of posts needed.
 * @param array $exclude_ids      Post IDs to exclude.
 * @return array Array of post IDs.
 */
if ( ! function_exists( 'rp_get_taxonomy_related_posts' ) ) {
	/**
	 * Get related posts from selected taxonomies in priority order
	 *
	 * @param array $attributes       Block attributes.
	 * @param int   $current_post_id  Current post ID.
	 * @param int   $count            Number of posts needed.
	 * @param array $exclude_ids      Post IDs to exclude.
	 * @return array Array of post IDs.
	 */
	function rp_get_taxonomy_related_posts( $attributes, $current_post_id, $count, $exclude_ids = array() ) {
		$selected_taxonomies = isset( $attributes['selectedTaxonomies'] ) ? $attributes['selectedTaxonomies'] : array();
		$post_type           = isset( $attributes['postType'] ) ? $attributes['postType'] : 'resource';
		$found_posts         = array();
		
		// If no taxonomies selected, return empty.
		if ( empty( $selected_taxonomies ) ) {
			return $found_posts;
		}
		
		// Try each taxonomy in priority order.
		foreach ( $selected_taxonomies as $taxonomy_slug ) {
			// Stop if we have enough posts.
			if ( count( $found_posts ) >= $count ) {
				break;
			}
			
			// Get terms for current post in this taxonomy (as slugs for easier comparison).
			// Use currentPostTaxonomies attribute if available, otherwise fallback to wp_get_post_terms.
			$current_terms = array();
			
			if ( isset( $attributes['currentPostTaxonomies'] ) && 
				 is_array( $attributes['currentPostTaxonomies'] ) && 
				 isset( $attributes['currentPostTaxonomies'][ $taxonomy_slug ] ) ) {
				// Use current editor state terms (these are term IDs, need to convert to slugs).
				$term_ids = $attributes['currentPostTaxonomies'][ $taxonomy_slug ];
				
				if ( is_array( $term_ids ) && ! empty( $term_ids ) ) {
					foreach ( $term_ids as $term_id ) {
						$term = get_term( $term_id, $taxonomy_slug );
						if ( $term && ! is_wp_error( $term ) ) {
							$current_terms[] = $term->slug;
						}
					}
				}
			} else {
				// Fallback to saved post terms.
				$current_terms = wp_get_post_terms( $current_post_id, $taxonomy_slug, array( 'fields' => 'slugs' ) );
			}
			
			if ( empty( $current_terms ) || is_wp_error( $current_terms ) ) {
				continue; // Skip if post has no terms in this taxonomy.
			}
			
			$remaining_slots = $count - count( $found_posts );
			
			// Strategy 1: Try to find posts with ALL current terms (most restrictive, highest relevance).
			$exact_match_posts = rp_find_posts_with_all_terms( $taxonomy_slug, $current_terms, $post_type, $remaining_slots, array_merge( $exclude_ids, array( $current_post_id ), $found_posts ) );
			
			if ( ! empty( $exact_match_posts ) ) {
				$found_posts = array_merge( $found_posts, $exact_match_posts );
				continue; // Move to next taxonomy if we found exact matches.
			}
			
			// Strategy 2: Find posts with ANY current terms, weighted by number of shared terms.
			$partial_match_posts = rp_find_posts_with_any_terms( $taxonomy_slug, $current_terms, $post_type, $remaining_slots, array_merge( $exclude_ids, array( $current_post_id ), $found_posts ) );
			
			if ( ! empty( $partial_match_posts ) ) {
				$found_posts = array_merge( $found_posts, $partial_match_posts );
			}
		}
		
		return $found_posts;
	}
}

/**
 * Find posts that have ALL of the specified terms in a taxonomy
 *
 * @param string $taxonomy_slug Taxonomy to search in.
 * @param array  $terms         Array of term slugs to match.
 * @param string $post_type     Post type to query.
 * @param int    $count         Number of posts needed.
 * @param array  $exclude_ids   Post IDs to exclude.
 * @return array Array of post IDs.
 */
if ( ! function_exists( 'rp_find_posts_with_all_terms' ) ) {
	/**
	 * Find posts that have ALL of the specified terms in a taxonomy
	 *
	 * @param string $taxonomy_slug Taxonomy to search in.
	 * @param array  $terms         Array of term slugs to match.
	 * @param string $post_type     Post type to query.
	 * @param int    $count         Number of posts needed.
	 * @param array  $exclude_ids   Post IDs to exclude.
	 * @return array Array of post IDs.
	 */
	function rp_find_posts_with_all_terms( $taxonomy_slug, $terms, $post_type, $count, $exclude_ids = array() ) {
		if ( count( $terms ) === 1 ) {
			// If only one term, fallback to ANY logic.
			return rp_find_posts_with_any_terms( $taxonomy_slug, $terms, $post_type, $count, $exclude_ids );
		}

		$args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $count,
			'post_status'    => 'publish',
			'post__not_in'   => $exclude_ids,
			'tax_query'      => array(
				'relation' => 'AND', // Must have ALL terms.
			),
			'orderby'        => 'title', // Deterministic ordering.
			'order'          => 'ASC',
		);

		// Add each term as a separate tax_query requirement.
		foreach ( $terms as $term_slug ) {
			$args['tax_query'][] = array(
				'taxonomy' => $taxonomy_slug,
				'field'    => 'slug',
				'terms'    => $term_slug,
			);
		}

		$query       = new WP_Query( $args );
		$found_posts = array();

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$found_posts[] = get_the_ID();
			}
			wp_reset_postdata();
		}

		return $found_posts;
	}
}

/**
 * Find posts that have ANY of the specified terms, weighted by number of shared terms
 *
 * @param string $taxonomy_slug Taxonomy to search in.
 * @param array  $terms         Array of term slugs to match.
 * @param string $post_type     Post type to query.
 * @param int    $count         Number of posts needed.
 * @param array  $exclude_ids   Post IDs to exclude.
 * @return array Array of post IDs.
 */
if ( ! function_exists( 'rp_find_posts_with_any_terms' ) ) {
	/**
	 * Find posts that have ANY of the specified terms, weighted by number of shared terms
	 *
	 * @param string $taxonomy_slug Taxonomy to search in.
	 * @param array  $terms         Array of term slugs to match.
	 * @param string $post_type     Post type to query.
	 * @param int    $count         Number of posts needed.
	 * @param array  $exclude_ids   Post IDs to exclude.
	 * @return array Array of post IDs.
	 */
	function rp_find_posts_with_any_terms( $taxonomy_slug, $terms, $post_type, $count, $exclude_ids = array() ) {
		$args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $count * 3, // Get more posts to allow for weighting.
			'post_status'    => 'publish',
			'post__not_in'   => $exclude_ids,
			'tax_query'      => array(
				array(
					'taxonomy' => $taxonomy_slug,
					'field'    => 'slug',
					'terms'    => $terms,
					'operator' => 'IN', // ANY of these terms.
				),
			),
			'orderby'        => 'title', // Deterministic ordering.
			'order'          => 'ASC',
		);

		$query             = new WP_Query( $args );
		$posts_with_scores = array();

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_id = get_the_ID();

				// Calculate how many terms this post shares with the current post.
				$post_terms   = wp_get_post_terms( $post_id, $taxonomy_slug, array( 'fields' => 'slugs' ) );
				$shared_terms = array_intersect( $terms, $post_terms );
				$score        = count( $shared_terms );

				$posts_with_scores[] = array(
					'id'    => $post_id,
					'score' => $score,
				);
			}
			wp_reset_postdata();
		}

		// Sort by score (descending) then by ID (for deterministic results).
		usort( $posts_with_scores, function( $a, $b ) {
			if ( $a['score'] === $b['score'] ) {
				return $a['id'] - $b['id']; // Deterministic tie-breaker.
			}
			return $b['score'] - $a['score']; // Higher scores first.
		});

		// Return only the post IDs, limited to requested count.
		$found_posts = array();
		for ( $i = 0; $i < min( $count, count( $posts_with_scores ) ); $i++ ) {
			$found_posts[] = $posts_with_scores[ $i ]['id'];
		}

		return $found_posts;
	}
}

/**
 * Get fallback posts from first priority taxonomy with deterministic selection
 *
 * @param array  $attributes      Block attributes.
 * @param int    $current_post_id Current post ID.
 * @param string $post_type       Post type to query.
 * @param int    $count           Number of posts needed.
 * @param array  $exclude_ids     Post IDs to exclude.
 * @return array Array of post IDs.
 */
if ( ! function_exists( 'rp_get_taxonomy_fallback_posts' ) ) {
	/**
	 * Get fallback posts from first priority taxonomy with deterministic selection
	 *
	 * @param array  $attributes      Block attributes.
	 * @param int    $current_post_id Current post ID.
	 * @param string $post_type       Post type to query.
	 * @param int    $count           Number of posts needed.
	 * @param array  $exclude_ids     Post IDs to exclude.
	 * @return array Array of post IDs.
	 */
	function rp_get_taxonomy_fallback_posts( $attributes, $current_post_id, $post_type, $count, $exclude_ids = array() ) {
		$selected_taxonomies = isset( $attributes['selectedTaxonomies'] ) ? $attributes['selectedTaxonomies'] : array();
		$found_posts         = array();

		// If no taxonomies selected, return empty.
		if ( empty( $selected_taxonomies ) ) {
			return $found_posts;
		}

		// Use the first taxonomy in hierarchy as fallback.
		$first_taxonomy = $selected_taxonomies[0];

		// Get posts from the first taxonomy, excluding current post.
		$args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $count,
			'post_status'    => 'publish',
			'post__not_in'   => array_merge( $exclude_ids, array( $current_post_id ) ),
			'tax_query'      => array(
				array(
					'taxonomy' => $first_taxonomy,
					'operator' => 'EXISTS', // Any posts that have terms in this taxonomy.
				),
			),
			'orderby'        => 'title', // Deterministic ordering.
			'order'          => 'ASC',
		);

		$query = new WP_Query( $args );

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$found_posts[] = get_the_ID();
			}
			wp_reset_postdata();
		}

		return $found_posts;
	}
}

// Get current post ID if we're in a post context.
$current_post_id = get_the_ID();

// Get posts using our new algorithm.
$related_posts = rp_get_related_posts_query( $attributes, $current_post_id );

// Set up display classes.
$columns_class = '';
if ( isset( $attributes['columns'] ) ) {
	$columns_class = 'has-' . $attributes['columns'] . '-columns';
}
?>

<div <?php echo get_block_wrapper_attributes( array( 'class' => $columns_class ) ); ?> style="gap: <?php echo esc_attr( $attributes['columnsGap'] ); ?>">
	<?php if ( $related_posts->have_posts() ) : ?>
		<?php while ( $related_posts->have_posts() ) : ?>
			<?php $related_posts->the_post(); ?>
			<?php
			$post_title = get_the_title();
			$post_title = $post_title ? $post_title : _x( '(No Title)', 'Block - Title', 'post-related' );
			$permalink  = get_permalink();
			$category   = wp_get_object_terms( get_the_ID(), 'category' );
			?>
			<div class="post-container" style="flex: 0 0 calc(100% / <?php echo esc_attr( $attributes['columns'] ); ?> - (<?php echo esc_attr( $attributes['columnsGap'] ); ?> / (<?php echo esc_attr( $attributes['columns'] ); ?> / (<?php echo esc_attr( $attributes['columns'] ); ?> - 1))))">
				<?php if ( $attributes['displayFeaturedImage'] && has_post_thumbnail() ) : ?>
					<div class="wp-block-rp-post-related--image-container">
						<?php echo get_the_post_thumbnail( null, RIAPRESS_IMAGE_SIZES::CARD ); ?>
					</div>
				<?php endif; ?>
				<div class="content-container">
					<?php if ( $attributes['displayMeta'] ) : ?>
						<div class="meta-container has-x-small-font-size">
							<div class="pill">
								<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
									<span class="screen-reader-text"><?php echo esc_html_x( 'Published on:', 'Post Related - Text', 'post-related' ); ?> </span>
									<?php echo esc_html( get_the_date() ); ?>
								</time>
							</div>
						</div>
					<?php endif; ?>
					<?php $heading_level = isset( $attributes['headingLevel'] ) ? $attributes['headingLevel'] : '3'; ?>
					<a href="<?php echo esc_url( $permalink ); ?>">
						<<?php echo 'h' . esc_attr( $heading_level ); ?> class="has-large-font-size"><?php echo esc_html( $post_title ); ?></<?php echo 'h' . esc_attr( $heading_level ); ?>>
					</a>
					<?php if ( $attributes['displayExcerpt'] && get_the_excerpt() ) : ?>
						<p><?php echo esc_html( get_the_excerpt() ); ?></p>
					<?php endif; ?>
				</div>
			</div>
		<?php endwhile; ?>
	<?php else : ?>
		<h2><?php echo esc_html_x( 'There are no related posts', 'Post Related', 'post-related' ); ?></h2>
	<?php endif; ?>
</div>

<?php wp_reset_postdata(); ?>
