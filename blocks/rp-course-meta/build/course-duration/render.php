<?php
/**
 * Render the course duration block
 *
 * @package course-meta
 * @since 1.0.0
 */

// Get global post object (same pattern as event-meta blocks).
global $post;

// If we don't have a post, bail early.
if ( ! $post ) {
	return '';
}

// Only render if this is a course post type.
if ( 'course' !== $post->post_type ) {
	return '';
}

// Get the course duration meta.
$duration = get_post_meta( $post->ID, '_rp_course_time', true );

// If there's no duration, don't render anything.
if ( empty( $duration ) ) {
	return '';
}

// Get the attributes.
$label      = isset( $attributes['label'] ) ? $attributes['label'] : _x( 'Duration:', 'Course Meta - Label default', 'course-meta' );
$show_label = array_key_exists( 'showLabel', $attributes ) ? (bool) $attributes['showLabel'] : true;

// Determine the label class.
$label_class = $show_label ? '' : 'screen-reader-text';

?>

<div <?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="wp-block-rp-course-duration">
		<span class="wp-block-rp-course-duration__label <?php echo esc_attr( $label_class ); ?>"><?php echo esc_html( $label ); ?></span>
		<span class="wp-block-rp-course-duration__value"><?php echo esc_html( $duration ); ?></span>
	</div>
</div>
