<?php
/**
 * Block Animations System
 *
 * Adds animation classes and data attributes to blocks based on their animation settings.
 * Works with the RIAPress Block Animation System (block-animations.js + block-animations.css).
 *
 * @package RIA
 * @version 1.0.0
 * @author Rob Hudson
 * @date 2025-10-31
 */

/**
 * Add animation classes and data attributes to blocks
 *
 * @param string $block_content The block content.
 * @param array  $block The block data.
 * @return string Modified block content with animation attributes.
 */
function ria_add_block_animations( $block_content, $block ) {
	// Debug: Log all ria/hero blocks to see what we're getting
	if ( isset( $block['blockName'] ) && $block['blockName'] === 'ria/hero' ) {
		error_log( 'RIA Hero Block Found!' );
		error_log( 'Block attrs: ' . print_r( $block['attrs'], true ) );
	}

	// Check if block has animation attributes
	if ( ! isset( $block['attrs']['animationEnabled'] ) ) {
		if ( isset( $block['blockName'] ) && $block['blockName'] === 'ria/hero' ) {
			error_log( 'animationEnabled not set - skipping' );
		}
		return $block_content;
	}

	// Skip if animation is disabled
	if ( false === $block['attrs']['animationEnabled'] ) {
		error_log( 'Animation disabled - skipping' );
		return $block_content;
	}

	error_log( 'Adding animation to block: ' . $block['blockName'] );

	// Get animation attributes with defaults
	$animation_type = isset( $block['attrs']['animationType'] ) ? $block['attrs']['animationType'] : 'fadeInUp';
	$animation_duration = isset( $block['attrs']['animationDuration'] ) ? $block['attrs']['animationDuration'] : 0.6;
	$animation_delay = isset( $block['attrs']['animationDelay'] ) ? $block['attrs']['animationDelay'] : 0;
	$animation_easing = isset( $block['attrs']['animationEasing'] ) ? $block['attrs']['animationEasing'] : 'ease-out';
	$hover_animation = isset( $block['attrs']['hoverAnimation'] ) ? $block['attrs']['hoverAnimation'] : 'none';

	// Skip if no animation type or it's 'none'
	if ( 'none' === $animation_type || empty( $animation_type ) ) {
		return $block_content;
	}

	// Build data attributes string
	$data_attrs = sprintf(
		'data-animation="%s" data-animation-duration="%s" data-animation-delay="%s" data-animation-easing="%s"',
		esc_attr( $animation_type ),
		esc_attr( $animation_duration ),
		esc_attr( $animation_delay ),
		esc_attr( $animation_easing )
	);

	// Add hover animation attribute if set
	if ( 'none' !== $hover_animation && ! empty( $hover_animation ) ) {
		$data_attrs .= sprintf( ' data-hover-animation="%s"', esc_attr( $hover_animation ) );
	}

	// Use DOMDocument for reliable HTML manipulation
	$dom = new DOMDocument();
	// Suppress warnings for malformed HTML
	libxml_use_internal_errors( true );
	$dom->loadHTML( '<?xml encoding="UTF-8">' . $block_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	libxml_clear_errors();

	// Get the first element (should be the block wrapper)
	$first_element = $dom->getElementsByTagName( 'div' )->item( 0 );

	if ( $first_element ) {
		// Add ria-animate class
		$existing_class = $first_element->getAttribute( 'class' );
		$new_class = $existing_class ? $existing_class . ' ria-animate' : 'ria-animate';
		$first_element->setAttribute( 'class', $new_class );

		// Add data attributes
		$first_element->setAttribute( 'data-animation', $animation_type );
		$first_element->setAttribute( 'data-animation-duration', $animation_duration );
		$first_element->setAttribute( 'data-animation-delay', $animation_delay );
		$first_element->setAttribute( 'data-animation-easing', $animation_easing );

		if ( 'none' !== $hover_animation && ! empty( $hover_animation ) ) {
			$first_element->setAttribute( 'data-hover-animation', $hover_animation );
		}

		// Save the modified HTML
		$block_content = $dom->saveHTML();
		// Remove the XML encoding declaration
		$block_content = str_replace( '<?xml encoding="UTF-8">', '', $block_content );
	}

	return $block_content;
}

add_filter( 'render_block', 'ria_add_block_animations', 10, 2 );

/**
 * Add animation controls to block editor
 *
 * This function enqueues the JavaScript that adds animation controls to the block inspector.
 */
function ria_enqueue_block_animation_controls() {
	// Enqueue the animation controls script for the block editor
	wp_enqueue_script(
		'ria-animation-controls',
		get_template_directory_uri() . '/assets/js/animation-controls.js',
		array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-i18n', 'wp-block-editor' ),
		filemtime( get_template_directory() . '/assets/js/animation-controls.js' ),
		true
	);

	// Pass animation configuration to JavaScript
	wp_localize_script(
		'ria-animation-controls',
		'riaAnimationConfig',
		array(
			'animationTypes' => array(
				array( 'label' => __( 'None', 'ria' ), 'value' => 'none' ),
				array( 'label' => __( 'Fade In', 'ria' ), 'value' => 'fadeIn' ),
				array( 'label' => __( 'Fade In Up', 'ria' ), 'value' => 'fadeInUp' ),
				array( 'label' => __( 'Fade In Down', 'ria' ), 'value' => 'fadeInDown' ),
				array( 'label' => __( 'Fade In Left', 'ria' ), 'value' => 'fadeInLeft' ),
				array( 'label' => __( 'Fade In Right', 'ria' ), 'value' => 'fadeInRight' ),
				array( 'label' => __( 'Zoom In', 'ria' ), 'value' => 'zoomIn' ),
				array( 'label' => __( 'Zoom Out', 'ria' ), 'value' => 'zoomOut' ),
				array( 'label' => __( 'Slide In Up', 'ria' ), 'value' => 'slideInUp' ),
				array( 'label' => __( 'Slide In Left', 'ria' ), 'value' => 'slideInLeft' ),
				array( 'label' => __( 'Slide In Right', 'ria' ), 'value' => 'slideInRight' ),
			),
			'hoverAnimationTypes' => array(
				array( 'label' => __( 'None', 'ria' ), 'value' => 'none' ),
				array( 'label' => __( 'Lift', 'ria' ), 'value' => 'lift' ),
				array( 'label' => __( 'Grow', 'ria' ), 'value' => 'grow' ),
				array( 'label' => __( 'Shrink', 'ria' ), 'value' => 'shrink' ),
				array( 'label' => __( 'Glow', 'ria' ), 'value' => 'glow' ),
			),
			'easingTypes' => array(
				array( 'label' => __( 'Linear', 'ria' ), 'value' => 'linear' ),
				array( 'label' => __( 'Ease', 'ria' ), 'value' => 'ease' ),
				array( 'label' => __( 'Ease In', 'ria' ), 'value' => 'ease-in' ),
				array( 'label' => __( 'Ease Out', 'ria' ), 'value' => 'ease-out' ),
				array( 'label' => __( 'Ease In Out', 'ria' ), 'value' => 'ease-in-out' ),
			),
			'blocksWithAnimations' => array(
				'ria/hero',
				// Will add more blocks here as we implement them
			),
		)
	);
}

add_action( 'enqueue_block_editor_assets', 'ria_enqueue_block_animation_controls' );
