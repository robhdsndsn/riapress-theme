<?php
$id = 'query-filter-' . wp_generate_uuid4();

if ( empty( $block->context['query']['inherit'] ) ) {
    // Custom Query Type in Core Query Loop Parent BLock
    $query_id = $block->context['queryId'] ?? 0;
    $query_var = sprintf( 'query-%d-s', $query_id );
    $page_var = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
    $base_url = remove_query_arg( [ $query_var, $page_var ] );
} else {
    // Default Query Type in Core Query Loop Parent Block
    $query_var = 's';
    $page_var = 'page';
    $base_url = str_replace( '/page/' . get_query_var( 'paged' ), '', remove_query_arg( [ $query_var, $page_var ] ) );
}

$current_value = wp_unslash( $_GET[ $query_var ] ?? '' );
?>

<div <?php echo get_block_wrapper_attributes( [ 'class' => 'wp-block-query-filter' ] ); ?> data-wp-interactive="query-filter" data-wp-context='{"searchValue":"<?php echo esc_js( $current_value ); ?>"}'>
    <form action="<?php echo esc_url( $base_url ); ?>" method="get" data-wp-on--submit="actions.search">
        <?php if ( $attributes['showLabel'] ) : ?>
            <label class="wp-block-query-filter-keyword__label wp-block-query-filter__label" for="<?php echo esc_attr( $id ); ?>">
                <?php echo esc_html( $attributes['label'] ); ?>
            </label>
        <?php endif; ?>
        <input
            type="search"
            id="<?php echo esc_attr( $id ); ?>"
            class="wp-block-query-filter-keyword__input wp-block-query-filter__input"
            name="<?php echo esc_attr( $query_var ); ?>"
            value="<?php echo esc_attr( $current_value ); ?>"
            placeholder="<?php echo esc_attr( $attributes['placeholder'] ); ?>"
            data-wp-on--input="actions.search"
        />
    </form>
</div>