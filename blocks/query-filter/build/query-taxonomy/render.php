<?php
if ( empty( $attributes['taxonomy'] ) ) {
    return;
}

$id = 'query-filter-' . wp_generate_uuid4();
$taxonomy = get_taxonomy( $attributes['taxonomy'] );

if ( empty( $block->context['query']['inherit'] ) ) {
    $query_id = $block->context['queryId'] ?? 0;
    $query_var = sprintf( 'query-%d-%s', $query_id, $attributes['taxonomy'] );
    $page_var = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
    $base_url = remove_query_arg( [ $query_var, $page_var ] );
} else {
    $query_var = sprintf( 'query-%s', $attributes['taxonomy'] );
    $page_var = 'page';
    $base_url = str_replace( '/page/' . get_query_var( 'paged' ), '', remove_query_arg( [ $query_var, $page_var ] ) );
}

$terms = get_terms( [
    'hide_empty' => true,
    'taxonomy' => $attributes['taxonomy'],
    'number' => 100,
] );

if ( is_wp_error( $terms ) || empty( $terms ) ) {
    return;
}

$selected_terms = isset( $_GET[$query_var] ) ? explode(',', sanitize_text_field( wp_unslash( $_GET[$query_var] ) ) ) : [];
?>

<div <?php echo get_block_wrapper_attributes( [ 'class' => 'wp-block-query-filter' ] ); ?> 
     data-wp-interactive="query-filter" 
     data-wp-context='{"selectedTerms":<?php echo wp_json_encode($selected_terms); ?>}'>
    
    <label class="wp-block-query-filter-taxonomy__label wp-block-query-filter__label<?php echo $attributes['showLabel'] ? '' : ' screen-reader-text' ?>" 
           for="<?php echo esc_attr( $id ); ?>">
        <?php echo esc_html( $attributes['label'] ?? $taxonomy->label ); ?>
    </label>

    <?php if ( $attributes['presentation'] === 'select' ) : ?>
        <select class="wp-block-query-filter-taxonomy__select wp-block-query-filter__select" 
                id="<?php echo esc_attr( $id ); ?>" 
                data-wp-on--change="actions.navigate">
            <option value="<?php echo esc_attr( $base_url ) ?>">
                <?php echo esc_html( $attributes['emptyLabel'] ?: __( 'All', 'query-filter' ) ); ?>
            </option>
            <?php foreach ( $terms as $term ) : ?>
                <option value="<?php echo esc_attr( add_query_arg( [ $query_var => $term->slug, $page_var => false ], $base_url ) ) ?>" 
                        <?php selected( in_array($term->slug, $selected_terms) ); ?>>
                    <?php echo esc_html( $term->name ); ?>
                </option>
            <?php endforeach; ?>
        </select>
    <?php else : ?>
        <form class="wp-block-query-filter-taxonomy__checkboxes" 
              action="<?php echo esc_url( $base_url ); ?>" 
              method="get"
              data-wp-on--submit="actions.updateTerms"
              data-wp-on--change="actions.updateTerms">
            <?php foreach ( $terms as $term ) : ?>
                <div class="wp-block-query-filter-taxonomy__checkbox-item">
                    <input type="checkbox" 
                           name="<?php echo esc_attr( $query_var ); ?>[]" 
                           id="<?php echo esc_attr( $id . '-' . $term->slug ); ?>" 
                           value="<?php echo esc_attr( $term->slug ); ?>"
                           <?php checked( in_array($term->slug, $selected_terms) ); ?> />
                    <label for="<?php echo esc_attr( $id . '-' . $term->slug ); ?>">
                        <?php echo esc_html( $term->name ); ?>
                    </label>
                </div>
            <?php endforeach; ?>
        </form>
    <?php endif; ?>
</div>
