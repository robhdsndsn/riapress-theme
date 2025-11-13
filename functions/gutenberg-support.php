<?php

/**
 * Theme Support for the Gutenberg Editor
 *
 * Adds support for various Gutenberg features to the theme.
 *
 * @return void
 */
function z_gutenberg_theme_support() {
	// Enables the editor styles.
	add_theme_support( 'editor-styles' );
	// Stylesheet for the backend gutenberg editor.
	add_editor_style( 'assets/build/editor.css' );
	// Makes embed responsive - YouTube.
	add_theme_support( 'responsive-embeds' );
}

add_action( 'after_setup_theme', 'z_gutenberg_theme_support' );

/**
 * Register RIA custom block category
 *
 * @param array $block_categories Array of block categories.
 * @return array Modified array of block categories.
 */
function riapress_register_block_category( $block_categories ) {
	// Check if 'ria' category already exists
	foreach ( $block_categories as $category ) {
		if ( 'ria' === $category['slug'] ) {
			return $block_categories;
		}
	}

	// Add RIA category at the beginning of the list
	array_unshift(
		$block_categories,
		array(
			'slug'  => 'ria',
			'title' => __( 'RIA Blocks', 'riapress' ),
			'icon'  => null,
		)
	);

	return $block_categories;
}
add_filter( 'block_categories_all', 'riapress_register_block_category', 10, 1 );

// This makes the url available in the wp.data.select('core').getSite().
register_setting(
	'general',
	'siteurl',
	array(
		'show_in_rest' => array(
			'name'   => 'url',
			'schema' => array(
				'format' => 'uri',
			),
		),
		'type'         => 'string',
		'description'  => __( 'Site URL.', 'zp' ),
	)
);

// Custom Theme Blocks.
require_once get_template_directory() . '/blocks/query-filter/query-filter.php';
require_once get_template_directory() . '/blocks/rp-accordions/accordions.php';
require_once get_template_directory() . '/blocks/rp-address/address.php';
require_once get_template_directory() . '/blocks/rp-copyright/copyright.php';
require_once get_template_directory() . '/blocks/rp-course-meta/course-meta.php';
require_once get_template_directory() . '/blocks/rp-post-related/post-related.php';
require_once get_template_directory() . '/blocks/rp-metrics/metrics.php';
require_once get_template_directory() . '/blocks/rp-multisite-language-switcher/multisite-language-switcher.php';
require_once get_template_directory() . '/blocks/rp-social-share/social-share.php';
require_once get_template_directory() . '/blocks/rp-offcanvas/offcanvas.php';
require_once get_template_directory() . '/blocks/rp-course-meta/course-meta.php';

// RIA Custom Blocks - Atoms
require_once get_template_directory() . '/blocks/ria-avatar/avatar.php';
require_once get_template_directory() . '/blocks/ria-badge/badge.php';
require_once get_template_directory() . '/blocks/ria-breadcrumb/breadcrumb.php';
require_once get_template_directory() . '/blocks/ria-button/button.php';
require_once get_template_directory() . '/blocks/ria-buttons/buttons.php';
require_once get_template_directory() . '/blocks/ria-divider/divider.php';
require_once get_template_directory() . '/blocks/ria-heading/heading.php';
require_once get_template_directory() . '/blocks/ria-icon/icon.php';
require_once get_template_directory() . '/blocks/ria-icon-group/icon-group.php';
require_once get_template_directory() . '/blocks/ria-image/image.php';
require_once get_template_directory() . '/blocks/ria-progress-bar/progress-bar.php';
require_once get_template_directory() . '/blocks/ria-rating/rating.php';
require_once get_template_directory() . '/blocks/ria-separator/separator.php';
require_once get_template_directory() . '/blocks/ria-shape/shape.php';
require_once get_template_directory() . '/blocks/ria-social-link/social-link.php';
require_once get_template_directory() . '/blocks/ria-spacer/spacer.php';
require_once get_template_directory() . '/blocks/ria-subtitle/subtitle.php';
require_once get_template_directory() . '/blocks/ria-tag/tag.php';
require_once get_template_directory() . '/blocks/ria-text/text.php';

// RIA Custom Blocks - Molecules
require_once get_template_directory() . '/blocks/ria-card/card.php';
require_once get_template_directory() . '/blocks/ria-image-box/image-box.php';
require_once get_template_directory() . '/blocks/ria-icon-box/icon-box.php';
require_once get_template_directory() . '/blocks/ria-stat-card/stat-card.php';
require_once get_template_directory() . '/blocks/ria-notification/notification.php';
require_once get_template_directory() . '/blocks/ria-accordion/accordion.php';
require_once get_template_directory() . '/blocks/ria-countdown/countdown.php';
require_once get_template_directory() . '/blocks/ria-tabs/tabs.php';
require_once get_template_directory() . '/blocks/ria-container/container.php';
require_once get_template_directory() . '/blocks/ria-profile-card/profile-card.php';
require_once get_template_directory() . '/blocks/ria-resource-card/resource-card.php';
require_once get_template_directory() . '/blocks/ria-event-card/event-card.php';
require_once get_template_directory() . '/blocks/ria-stats/stats.php';
require_once get_template_directory() . '/blocks/ria-stat/stat.php';
require_once get_template_directory() . '/blocks/ria-quote/quote.php';
require_once get_template_directory() . '/blocks/ria-link-list/link-list.php';
require_once get_template_directory() . '/blocks/ria-contact-info/contact-info.php';

// RIA Custom Blocks - Organisms
require_once get_template_directory() . '/blocks/ria-header/header.php';
require_once get_template_directory() . '/blocks/ria-hero/hero.php';
require_once get_template_directory() . '/blocks/ria-feature-grid/feature-grid.php';
require_once get_template_directory() . '/blocks/ria-cta-section/cta-section.php';
require_once get_template_directory() . '/blocks/ria-testimonial-slider/testimonial-slider.php';
require_once get_template_directory() . '/blocks/ria-team-section/team-section.php';
require_once get_template_directory() . '/blocks/ria-footer/footer.php';
require_once get_template_directory() . '/blocks/ria-query-loop/query-loop.php';

// RIA Custom Blocks - Specialized
require_once get_template_directory() . '/blocks/ria-modal/modal.php';
require_once get_template_directory() . '/blocks/ria-video/video.php';
require_once get_template_directory() . '/blocks/ria-toast/toast.php';
require_once get_template_directory() . '/blocks/ria-tooltip/tooltip.php';
require_once get_template_directory() . '/blocks/ria-popover/popover.php';
require_once get_template_directory() . '/blocks/ria-skeleton/skeleton.php';

/**
 * Allowed Blocks
 */
add_filter( 'allowed_block_types_all', 'z_allowed_block_types', 10, 2 );


/**
 * Filter the allowed block types.
 *
 * @param array  $allowed_blocks The array of allowed block types.
 * @param object $context        The context object.
 * @return array The modified array of allowed block types.
 */
function z_allowed_block_types( $allowed_blocks, $context ) {
	$allowed_blocks = array(
		'core/block', // Needed to enable user generated patterns.
		'core/button',
		'core/buttons',
		'core/column',
		'core/columns',
		'core/group',
		'core/heading',
		'core/html',
		'core/paragraph',
		'core/quote',

		// Needed for navigation.
		'core/navigation',
		'core/navigation-link',
		'core/navigation-submenu',
		'core/home-link',
		'core/page-list',
		'core/site-logo',
		'core/site-title',

		// Archive / Query blocks.
		'core/query',
		'core/query-pagination',
		'core/query-pagination-previous',
		'core/query-pagination-next',
		'core/query-no-results',
		'core/query-title',

		// Query Filter blocks.
		'gregius/query-active-filters',
		'gregius/query-clear',
		'gregius/query-keyword',
		'gregius/query-taxonomy',
		'gregius/query-sort-by',

		'core/post-author',
		'core/post-date',
		'core/post-excerpt',
		'core/post-featured-image',
		'core/post-template',
		'core/post-terms',
		'core/post-title',

		'core/term-description',
		'core/term-title',

		'core/cover',
		'core/embed',
		'core/image',
		'core/list',
		'core/list-item',
		'core/search',
		'core/shortcode',
		'core/social-link',
		'core/social-links',
		'core/table',

		// Custom blocks.
		'zp/accordions',
		'zp/accordion',
		'zp/address',
		'zp/group',
		'zp/multisite-language-switcher',
		'zp/offcanvas',
		'zp/post-featured',
		'zp/post-related',
		'zp/social-share',

		// RIA Custom Blocks - Atoms
		'ria/avatar',
		'ria/badge',
		'ria/breadcrumb',
		'ria/button',
		'ria/buttons',
		'ria/divider',
		'ria/heading',
		'ria/icon',
		'ria/icon-group',
		'ria/image',
		'ria/progress-bar',
		'ria/rating',
		'ria/separator',
		'ria/shape',
		'ria/social-link',
		'ria/spacer',
		'ria/subtitle',
		'ria/tag',
		'ria/text',

		// RIA Custom Blocks - Molecules
		'ria/accordion',
		'ria/accordion-item',
		'ria/card',
		'ria/contact-info',
		'ria/countdown',
		'ria/event-card',
		'ria/icon-box',
		'ria/image-box',
		'ria/link-list',
		'ria/notification',
		'ria/profile-card',
		'ria/quote',
		'ria/resource-card',
		'ria/stat-card',
		'ria/stats',
		'ria/stat',
		'ria/tabs',
		'ria/tab-item',
		'ria/container',

		// RIA Custom Blocks - Organisms
		'ria/header',
		'ria/hero',
		'ria/feature-grid',
		'ria/cta-section',
		'ria/testimonial-slider',
		'ria/team-section',
		'ria/footer',
		'ria/query-loop',

		// RIA Custom Blocks - Specialized
		'ria/modal',
		'ria/video',
		'ria/toast-container',
		'ria/tooltip',
		'ria/popover',
		'ria/skeleton',

		// plugins blocks.
		'gravityforms/form',
	);

	// Target blocks to all post type.
	$allowed_blocks_post_types = array(
		'core/image',
	);

	// Target blocks to template parts.
	$allowed_blocks_template_parts = array(
		'zp/copyright',
		'zp/course-duration',
	);

	// Post: post and page.
	if ( null !== $context->post && in_array( $context->post->post_type, array( 'page', 'post' ), true ) ) {
		$allowed_blocks = array_merge(
			$allowed_blocks,
			array(
				'zp/metric',
				'zp/metrics',
				'zp/post-meta',
			),
			$allowed_blocks_post_types
		);
	}

	// Post: course.
	if ( null !== $context->post && 'course' === $context->post->post_type ) {
		$allowed_blocks = array_merge(
			$allowed_blocks,
			array(
				'zp/course-duration',
			)
		);
	}

	// Template parts.
	if ( function_exists( 'get_current_screen' ) ) {
		$screen = get_current_screen();
		if ( $screen && 'site-editor' === $screen->base && $screen->is_block_editor ) {
			$template_part_allowed_blocks = array_merge( $allowed_blocks, $allowed_blocks_template_parts );
			return $template_part_allowed_blocks;
		}
	}

	return $allowed_blocks;
}

/*
 * Deregister Patterns
 */

add_action(
	'init',
	function () {
		remove_theme_support( 'core-block-patterns' );
	},
	9
);
