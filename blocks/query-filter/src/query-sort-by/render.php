<?php
$sort_id = 'query-sort-by-' . wp_generate_uuid4();

if ( empty( $block->context['query']['inherit'] ) ) {
    $query_id = $block->context['queryId'] ?? 0;
    $orderby_var = sprintf( 'query-%d-orderby', $query_id );
    $order_var = sprintf( 'query-%d-order', $query_id );
    $page_var = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
    $base_url = remove_query_arg( [ $orderby_var, $order_var, $page_var ] );
} else {
    $orderby_var = 'orderby';
    $order_var = 'order';
    $page_var = 'page';
    $base_url = str_replace( '/page/' . get_query_var( 'paged' ), '', remove_query_arg( [ $orderby_var, $order_var, $page_var ] ) );
}

$current_orderby = wp_unslash( $_GET[ $orderby_var ] ?? 'date' );
$current_order = wp_unslash( $_GET[ $order_var ] ?? 'desc' );
$selected = $current_orderby . '-' . $current_order;

// Get label settings
$label = isset( $attributes['label'] ) ? $attributes['label'] : 'Sort by:';
$show_label = isset( $attributes['showLabel'] ) ? $attributes['showLabel'] : true;
$bold_label = isset( $attributes['boldLabel'] ) ? $attributes['boldLabel'] : false;

// Get base wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'wp-block-query-sort-by' ] );

// Extract border styles from wrapper attributes before removing them
$select_border_styles = '';
if ( preg_match('/style="([^"]*)"/', $wrapper_attributes, $style_matches) ) {
    $all_styles = $style_matches[1];
    // Extract only border-related styles including CSS custom properties
    if ( preg_match_all('/(border[^:]*:[^;]*;?|--wp--preset--color[^:]*:[^;]*;?|--wp-custom--colors[^:]*:[^;]*;?)/i', $all_styles, $border_matches) ) {
        $select_border_styles = implode( '', $border_matches[0] );
    }
}

// Extract border classes for select element
$select_border_classes = [];
if ( preg_match('/class="([^"]*)"/', $wrapper_attributes, $class_matches) ) {
    $all_classes = $class_matches[1];
    // Extract border color classes
    if ( preg_match_all('/has-[a-z0-9-]*-border-color/', $all_classes, $border_color_matches) ) {
        $select_border_classes = array_merge( $select_border_classes, $border_color_matches[0] );
    }
    // Extract general border color class
    if ( preg_match('/has-border-color/', $all_classes) ) {
        $select_border_classes[] = 'has-border-color';
    }
}

// Remove border-related styles AND border color classes from wrapper attributes
$wrapper_attributes = preg_replace('/border[^:]*:[^;]*;?/i', '', $wrapper_attributes);
$wrapper_attributes = preg_replace('/--wp--preset--color[^:]*:[^;]*;?/i', '', $wrapper_attributes);
$wrapper_attributes = preg_replace('/--wp-custom--colors[^:]*:[^;]*;?/i', '', $wrapper_attributes);
$wrapper_attributes = preg_replace('/has-[a-z0-9-]*-border-color/i', '', $wrapper_attributes);
$wrapper_attributes = preg_replace('/has-border-color/i', '', $wrapper_attributes);
$wrapper_attributes = preg_replace_callback('/style="([^"]*)"/', function($matches) {
    $style_content = trim($matches[1], '; ');
    return !empty($style_content) ? 'style="' . $style_content . '"' : '';
}, $wrapper_attributes);
$wrapper_attributes = preg_replace_callback('/class="([^"]*)"/', function($matches) {
    $classes = trim(preg_replace('/\s+/', ' ', $matches[1]));
    return 'class="' . $classes . '"';
}, $wrapper_attributes);

$font_size_class = '';
if ( preg_match('/has-[a-z-]+-font-size/', $wrapper_attributes, $matches) ) {
    $font_size_class = ' ' . $matches[0];
}

$label_classes = 'wp-block-query-filter-sort-by__label wp-block-query-filter__label' . $font_size_class;

// Add screen-reader-text class if label is hidden
if ( ! $show_label ) {
    $label_classes .= ' screen-reader-text';
}
?>
<div <?php echo $wrapper_attributes; ?> data-wp-interactive="query-filter" data-wp-context='<?php echo wp_json_encode( [
    'sortBy' => $current_orderby,
    'sortOrder' => $current_order,
] ); ?>'>
    <form action="<?php echo esc_url( $base_url ); ?>" method="get">
        <?php if ( $bold_label ) : ?>
            <label class="<?php echo esc_attr( $label_classes ); ?>" for="<?php echo esc_attr( $sort_id ); ?>">
                <strong>
                    <?php echo esc_html( $label ); ?>
                </strong>
            </label>
        <?php else : ?>
            <label class="<?php echo esc_attr( $label_classes ); ?>" for="<?php echo esc_attr( $sort_id ); ?>">
                <?php echo esc_html( $label ); ?>
            </label>
        <?php endif; ?> 
        <?php
        // Build select attributes with border styles and classes
        $select_attributes = [];
        $select_attributes[] = 'id="' . esc_attr( $sort_id ) . '"';
        $select_attributes[] = 'data-wp-on--change="actions.sortQuery"';
        
        if ( $select_border_styles ) {
            $select_attributes[] = 'style="' . esc_attr( $select_border_styles ) . '"';
        }
        
        if ( ! empty( $select_border_classes ) ) {
            $select_attributes[] = 'class="' . esc_attr( implode( ' ', $select_border_classes ) ) . '"';
        }
        ?>
        <select <?php echo implode( ' ', $select_attributes ); ?> >
            <option value="date-desc" <?php selected( $selected, 'date-desc' ); ?>>Newest - Oldest</option>
            <option value="date-asc" <?php selected( $selected, 'date-asc' ); ?>>Oldest - Newest</option>
            <option value="title-asc" <?php selected( $selected, 'title-asc' ); ?>>A - Z</option>
            <option value="title-desc" <?php selected( $selected, 'title-desc' ); ?>>Z - A</option>
        </select>
        <input type="hidden" name="<?php echo esc_attr( $orderby_var ); ?>" value="<?php echo esc_attr( $current_orderby ); ?>" />
        <input type="hidden" name="<?php echo esc_attr( $order_var ); ?>" value="<?php echo esc_attr( $current_order ); ?>" />
    </form>
</div>
