<?php
if ( empty( $block->context['query']['inherit'] ) ) {
    $query_id = $block->context['queryId'] ?? 0;
    $page_var = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
    $base_url = remove_query_arg( $page_var );
} else {
    $page_var = 'page';
    $base_url = str_replace( '/page/' . get_query_var( 'paged' ), '', remove_query_arg( $page_var ) );
}

// Initialize state based on current URL parameters
$has_search = isset( $_GET['s'] );
$query_prefix = $has_search ? '' : 'query-';
$has_active_filters = false;

foreach ( $_GET as $key => $value ) {
    if ( ( strpos( $key, $query_prefix ) === 0 || $key === 's' ) && ! empty( $value ) ) {
        $has_active_filters = true;
        break;
    }
}
?>

<div
    <?php echo get_block_wrapper_attributes([ 'data-wp-interactive' => 'query-filter', 'data-wp-init' => 'callbacks.init', 'data-wp-on--statechange' => 'callbacks.stateChange', 'data-wp-context' => '{"hasActiveFilters":' . ( $has_active_filters ? 'true' : 'false' ) . '}' ]); ?>
>
    <?php
    $button_style = '';
    if ( ! empty( $attributes['isBold'] ) ) {
        $button_style .= 'font-weight: bold;';
    }
    if ( ! empty( $attributes['isItalic'] ) ) {
        $button_style .= 'font-style: italic;';
    }
    if ( ! empty( $attributes['isUnderline'] ) ) {
        $button_style .= 'text-decoration: underline;';
    }
    ?>
    <button
        type="button"
        class="wp-block-query-filter-clear__button"
        data-wp-on--click="actions.clearFilters"
        data-wp-bind--disabled="!state.hasActiveFilters"
        <?php if ( $button_style ) : ?>style="<?php echo esc_attr( $button_style ); ?>"<?php endif; ?>
    >
        <?php echo esc_html( $attributes['label'] ); ?>
    </button>
</div>