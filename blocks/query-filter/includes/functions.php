<?php
/**
 * Query filter helper functions.
 *
 * @package gregius-query-filter
 */

/**
 * Connect namespace methods to hooks and filters.
 *
 * @return void
 */
function bootstrap() : void {
	// Query hooks.
	add_filter( 'query_loop_block_query_vars', 'filter_query_loop_block_query_vars', 10, 3 );
	add_action( 'pre_get_posts', 'pre_get_posts_transpose_query_vars' );
	add_filter( 'block_type_metadata', 'filter_block_type_metadata', 10 );
	// Block hooks.
	add_filter( 'render_block_core/search', 'render_block_search', 10, 3 );
	add_filter( 'render_block_core/query', 'render_block_query', 10, 3 );
	add_filter( 'render_block_gregius/query-keyword', 'render_block_query_keyword', 10, 3 );
	add_filter( 'render_block_gregius/query-clear', 'render_block_query_clear', 10, 3 );
}

/**
 * Filters the arguments which will be passed to `WP_Query` for the Query Loop Block.
 *
 * @param array          $query Array containing parameters for <code>WP_Query</code> as parsed by the block context.
 * @param \WP_Block|null $block Block instance.
 * @param int|mixed      $page  Current query's page.
 * @return array Array containing parameters for <code>WP_Query</code> as parsed by the block context.
 */
function filter_query_loop_block_query_vars( $query, $block = null, $page = 1 ) {
	// Handle case when $query is not an array
	if ( ! is_array( $query ) ) {
		$query = [];
	}

	// Make sure we have a block context with queryId
	if ( is_object( $block ) && isset( $block->context['queryId'] ) ) {
		$query['query_id'] = $block->context['queryId'];
	}

	return $query;
}

/**
 * Fires after the query variable object is created, but before the actual query is run.
 *
 * @param  WP_Query $query The WP_Query instance (passed by reference).
 */
function pre_get_posts_transpose_query_vars( WP_Query $query ) : void {
	$query_id = $query->get( 'query_id', null );

	if ( ! $query->is_main_query() && is_null( $query_id ) ) {
		return;
	}

	$prefix = $query->is_main_query() ? 'query-' : "query-{$query_id}-";
	$tax_query = [];
	$valid_keys = [
		'post_type' => 'post',
		's' => '',
	];

	// Preserve valid params for later retrieval.
	foreach ( $valid_keys as $key => $default ) {
		$query->set(
			"query-filter-$key",
			$query->get( $key, $default )
		);
	}

	// Map get params to this query.
	foreach ( $_GET as $key => $value ) {
		if ( strpos( $key, $prefix ) === 0 ) {
			$key = str_replace( $prefix, '', $key );
			$value = sanitize_text_field( urldecode( wp_unslash( $value ) ) );

			// Handle taxonomies specifically.
			if ( get_taxonomy( $key ) ) {
				$tax_query['relation'] = 'AND';
				$terms = explode(',', $value);
				$tax_query[] = [
					'taxonomy' => $key,
					'terms' => $terms,
					'field' => 'slug',
				];
			} else {
				// Other options should map directly to query vars.
				$key = sanitize_key( $key );

				if ( ! in_array( $key, array_keys( $valid_keys ), true ) ) {
					continue;
				}

				$query->set( $key, $value );
			}
		}
	}

	if ( ! empty( $tax_query ) ) {
		$existing_query = $query->get( 'tax_query', [] );

		if ( ! empty( $existing_query ) ) {
			$tax_query = [
				'relation' => 'AND',
				[ $existing_query ],
				$tax_query,
			];
		}

		$query->set( 'tax_query', $tax_query );
	}

	// Handle order and orderby for sorting
	$orderby_key = $prefix . 'orderby';
	$order_key = $prefix . 'order';

	if ( isset( $_GET[ $orderby_key ] ) ) {
		$orderby = sanitize_key( wp_unslash( $_GET[ $orderby_key ] ) );
		// Only allow 'date' or 'title' for security
		if ( in_array( $orderby, [ 'date', 'title' ], true ) ) {
			$query->set( 'orderby', $orderby );
		}
	}
	if ( isset( $_GET[ $order_key ] ) ) {
		$order = strtoupper( sanitize_text_field( wp_unslash( $_GET[ $order_key ] ) ) );
		// Only allow 'ASC' or 'DESC'
		if ( in_array( $order, [ 'ASC', 'DESC' ], true ) ) {
			$query->set( 'order', $order );
		}
	}
}

/**
 * Filters the settings determined from the block type metadata.
 *
 * @param array $metadata Metadata provided for registering a block type.
 * @return array Array of metadata for registering a block type.
 */
function filter_block_type_metadata( array $metadata ) : array {
	// Add query context to search block.
	if ( $metadata['name'] === 'core/search' ) {
		$metadata['usesContext'] = array_merge( $metadata['usesContext'] ?? [], [ 'queryId', 'query' ] );
	}

	return $metadata;
}

/**
 * Filters the content of a single block.
 *
 * @param string    $block_content The block content.
 * @param array     $block         The full block, including name and attributes.
 * @param \WP_Block $instance      The block instance.
 * @return string The block content.
 */
function render_block_search( string $block_content, array $block, \WP_Block $instance ) : string {
	if ( empty( $instance->context['query'] ) ) {
		return $block_content;
	}

	wp_enqueue_script_module( 'query-filter-taxonomy-view-script-module' );

	$query_var = empty( $instance->context['query']['inherit'] )
		? sprintf( 'query-%d-s', $instance->context['queryId'] ?? 0 )
		: 's';

	$action = str_replace( '/page/'. get_query_var( 'paged', 1 ), '', add_query_arg( [ $query_var => '' ] ) );

	// Note sanitize_text_field trims whitespace from start/end of string causing unexpected behaviour.
	$value = wp_unslash( $_GET[ $query_var ] ?? '' );
	$value = urldecode( $value );
	$value = wp_check_invalid_utf8( $value );
	$value = wp_pre_kses_less_than( $value );
	$value = strip_tags( $value );

	wp_interactivity_state( 'query-filter', [
		'searchValue' => $value,
	] );

	$block_content = new WP_HTML_Tag_Processor( $block_content );
	$block_content->next_tag( [ 'tag_name' => 'form' ] );
	$block_content->set_attribute( 'action', $action );
	$block_content->set_attribute( 'data-wp-interactive', 'query-filter' );
	$block_content->set_attribute( 'data-wp-on--submit', 'actions.search' );
	$block_content->set_attribute( 'data-wp-context', '{searchValue:""}' );
	$block_content->next_tag( [ 'tag_name' => 'input', 'class_name' => 'wp-block-search__input' ] );
	$block_content->set_attribute( 'name', $query_var );
	$block_content->set_attribute( 'inputmode', 'search' );
	$block_content->set_attribute( 'value', $value );
	$block_content->set_attribute( 'data-wp-bind--value', 'state.searchValue' );
	$block_content->set_attribute( 'data-wp-on--input', 'actions.search' );

	return (string) $block_content;
}

/**
 * Add data attributes to the query block to describe the block query.
 *
 * @param string    $block_content Default query content.
 * @param array     $block         Parsed block.
 * @return string
 */
function render_block_query( $block_content, $block ) {
	$block_content = new WP_HTML_Tag_Processor( $block_content );
	$block_content->next_tag();

	// Always allow region updates on interactivity, use standard core region naming.
	$block_content->set_attribute( 'data-wp-router-region', 'query-' . ( $block['attrs']['queryId'] ?? 0 ) );

	return (string) $block_content;
}

/**
 * Filters the content of the query keyword block.
 *
 * @param string    $block_content The block content.
 * @param array     $block         The full block, including name and attributes.
 * @param \WP_Block $instance      The block instance.
 * @return string The block content.
 */
function render_block_query_keyword(string $block_content, array $block, \WP_Block $instance) : string {
	if (empty($instance->context['query'])) {
		return $block_content;
	}

	wp_enqueue_script_module('gregius-query-keyword-view-script-module');

	return $block_content;
}

/**
 * Filters the content of the query clear block.
 *
 * @param string    $block_content The block content.
 * @param array     $block         The full block, including name and attributes.
 * @param \WP_Block $instance      The block instance.
 * @return string The block content.
 */
function render_block_query_clear(string $block_content, array $block, \WP_Block $instance) : string {
	if (empty($instance->context['query'])) {
		return $block_content;
	}

	wp_enqueue_script_module('gregius-query-clear-view-script-module');

	return $block_content;
}



/**
 * Apply query filters to the WP_Query instance.
 *
 * @param WP_Query $query The WP_Query instance.
 * @return void
 */
function apply_query_filters( \WP_Query $query ): void {
	if ( ! is_post_type_archive() && ! is_home() && ! is_tax() && ! is_category() && ! is_tag() ) {
		return;
	}

	$prefix = $query->get( 's' ) ? '' : 'query-';

	$valid_keys = [
		'post_type' => 'post', // Default post type
		's' => '',
	];

	// Preserve valid params for later retrieval.
	foreach ( $valid_keys as $key => $default ) {
		$query->set(
			"query-filter-$key",
			$query->get( $key, $default )
		);
	}

	$tax_query = [];

	// Map get params to this query.
	foreach ( $_GET as $key => $value ) {
		if ( strpos( $key, $prefix ) === 0 ) {
			$key = str_replace( $prefix, '', $key );
			$value = sanitize_text_field( urldecode( wp_unslash( $value ) ) );

			// Handle taxonomies specifically.
			if ( get_taxonomy( $key ) ) {
				$tax_query['relation'] = 'AND';
				$terms = explode(',', $value);
				$tax_query[] = [
					'taxonomy' => $key,
					'terms' => $terms,
					'field' => 'slug',
				];
			} else {
				// Other options should map directly to query vars.
				$key = sanitize_key( $key );
				
				// Special handling for post_type to ensure it's always set
				if ($key === 'post_type' && empty($value)) {
					$value = 'post'; // Default to 'post' if empty
				}

				if ( ! in_array( $key, array_keys( $valid_keys ), true ) ) {
					continue;
				}

				$query->set( $key, $value );
			}
		}
	}

	if ( ! empty( $tax_query ) ) {
		$existing_query = $query->get( 'tax_query', [] );

		if ( ! empty( $existing_query ) ) {
			$tax_query = [
				'relation' => 'AND',
				[ $existing_query ],
				$tax_query,
			];
		}

		$query->set( 'tax_query', $tax_query );
	}
}
