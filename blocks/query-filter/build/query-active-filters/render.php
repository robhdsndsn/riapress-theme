<?php
/**
 * Server-side rendering of the `gregius/query-active-filters` block.
 *
 * @package gregius-query-filter
 */

if ( empty( $block->context['query'] ) ) {
	return '';
}

$content        = '';
$query_id       = $block->context['queryId'] ?? 0;
$prefix         = empty( $block->context['query']['inherit'] ) ? "query-{$query_id}-" : '';
$active_filters = array();

// Check for search keyword
$search_param = $prefix . 's';

if ( isset( $_GET[ $search_param ] ) && ! empty( $_GET[ $search_param ] ) ) {
	$search_value     = sanitize_text_field( urldecode( wp_unslash( $_GET[ $search_param ] ) ) );
	$active_filters[] = array(
		'type'  => 'keyword',
		'label' => __( 'Keyword:', 'gregius-query-filter' ) . ' ' . $search_value,
		'param' => $search_param,
		'value' => $search_value,
	);
}

// Check for taxonomy filters
foreach ( $_GET as $key => $value ) {
	if ( strpos( $key, $prefix ) === 0 ) {
		$tax_key  = str_replace( $prefix, '', $key );
		$taxonomy = get_taxonomy( $tax_key );

		if ( $taxonomy && $tax_key !== 's' ) {
			$value = sanitize_text_field( urldecode( wp_unslash( $value ) ) );
			$terms = explode( ',', $value );

			foreach ( $terms as $term_slug ) {
				$term = get_term_by( 'slug', $term_slug, $tax_key );
				if ( $term ) {
					$active_filters[] = array(
						'type'     => 'taxonomy',
						'taxonomy' => $tax_key,
						'label'    => $term->name,
						'param'    => $key,
						'value'    => $term_slug,
						'multiple' => count( $terms ) > 1,
					);
				}
			}
		}
	}
}

// Pass active filters to JavaScript via WP Interactivity API
if ( ! empty( $active_filters ) ) {
	wp_interactivity_state(
		'query-active-filters',
		array(
			'filters' => $active_filters,
			'queryId' => $query_id,
		)
	);

	// Get color attributes from block
	$filter_badge_text_color = isset( $attributes['filterBadgeTextColor'] ) ? $attributes['filterBadgeTextColor'] : '';
	$filter_badge_bg_color   = ( isset( $attributes['filterBadgeBgColor'] ) && $attributes['filterBadgeBgColor'] !== '' ) ? $attributes['filterBadgeBgColor'] : 'var(--wp--custom--colors--primary-50)';

	// Prepare inline style for filter-badge
	$filter_badge_style = '';
	if ( $filter_badge_text_color ) {
		$filter_badge_style .= 'color:' . esc_attr( $filter_badge_text_color ) . ';';
	}
	if ( $filter_badge_bg_color ) {
		$filter_badge_style .= 'background-color:' . esc_attr( $filter_badge_bg_color ) . ';';
	}
	$filter_badge_style_attr = $filter_badge_style ? ' style="' . esc_attr( $filter_badge_style ) . '"' : '';

	// Generate HTML for active filters with ARIA live region
	$filters_html  = '<div class="active-filters" aria-live="polite" aria-atomic="true">';
	$filters_html .= '<span class="screen-reader-text">' . esc_html__( 'Active filters:', 'gregius-query-filter' ) . '</span>';

	foreach ( $active_filters as $filter ) {
		$remove_url = remove_query_arg( $filter['param'] );
		if ( isset( $filter['multiple'] ) && $filter['multiple'] && isset( $filter['value'] ) ) {
			// For multi-term filters, we need to remove just this term
			$current_terms = explode( ',', urldecode( wp_unslash( $_GET[ $filter['param'] ] ) ) );
			$new_terms     = array_diff( $current_terms, array( $filter['value'] ) );

			if ( ! empty( $new_terms ) ) {
				$remove_url = add_query_arg( $filter['param'], implode( ',', $new_terms ) );
			}
		}
			   $filters_html .= sprintf(
				   '<span class="filter-badge %s"%s>%s <button type="button" class="remove" data-wp-on--click="actions.removeFilter" data-filter-param="%s" data-filter-value="%s" aria-label="%s" aria-hidden="false">×</button><noscript><a href="%s" class="remove" aria-label="%s">×</a></noscript></span>',
				   esc_attr( $filter['type'] ),
				   $filter_badge_style_attr,
				   esc_html( $filter['label'] ),
				   esc_attr( $filter['param'] ),
				   isset( $filter['value'] ) ? esc_attr( $filter['value'] ) : '',
				   sprintf( __( 'Remove filter: %s', 'gregius-query-filter' ), $filter['label'] ),
				   esc_url( $remove_url ),
				   sprintf( __( 'Remove filter: %s', 'gregius-query-filter' ), $filter['label'] )
			   );
	}

	$filters_html .= '</div>';        // Add container for active filters with interactivity attributes.
	$content       = sprintf(
		'<div %s data-wp-interactive="query-active-filters">%s%s</div>',
		get_block_wrapper_attributes(),
		$filters_html,
		$content
	);
}

echo $content;
