<?php
/**
 * Render callback for the RIA Badge block
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Extract attributes with defaults
$text = isset($attributes['text']) ? $attributes['text'] : 'Badge';
$variant = isset($attributes['variant']) ? $attributes['variant'] : 'neutral';
$size = isset($attributes['size']) ? $attributes['size'] : 'medium';
$outline_variant = isset($attributes['outlineVariant']) ? $attributes['outlineVariant'] : false;
$show_icon = isset($attributes['showIcon']) ? $attributes['showIcon'] : false;
$icon_name = isset($attributes['iconName']) ? $attributes['iconName'] : 'Tag';
$icon_position = isset($attributes['iconPosition']) ? $attributes['iconPosition'] : 'left';
$icon_size = isset($attributes['iconSize']) ? $attributes['iconSize'] : 16;
$show_dot = isset($attributes['showDot']) ? $attributes['showDot'] : false;
$data_source = isset($attributes['dataSource']) ? $attributes['dataSource'] : 'manual';
$taxonomy_slug = isset($attributes['taxonomySlug']) ? $attributes['taxonomySlug'] : 'category';
$url = isset($attributes['url']) ? $attributes['url'] : '';
$open_in_new_tab = isset($attributes['openInNewTab']) ? $attributes['openInNewTab'] : false;
$dismissible = isset($attributes['dismissible']) ? $attributes['dismissible'] : false;

// Build badge classes
$badge_classes = [
	'ria-badge',
	'ria-badge--' . esc_attr($variant),
	'ria-badge--' . esc_attr($size),
];

if ($outline_variant) {
	$badge_classes[] = 'ria-badge--outline';
}

if ($show_icon) {
	$badge_classes[] = 'ria-badge--icon-' . esc_attr($icon_position);
}

if ($show_dot) {
	$badge_classes[] = 'ria-badge--with-dot';
}

if ($dismissible) {
	$badge_classes[] = 'ria-badge--dismissible';
}

if ($url) {
	$badge_classes[] = 'ria-badge--linked';
}

$class_string = implode(' ', $badge_classes);

// Get display text
$display_text = $text;
if ($data_source === 'taxonomy') {
	// Get current post ID
	$post_id = get_the_ID();
	if ($post_id) {
		// Get taxonomy terms for this post
		$terms = get_the_terms($post_id, $taxonomy_slug);
		if ($terms && !is_wp_error($terms)) {
			// Get first term
			$term = array_shift($terms);
			$display_text = $term->name;

			// If no manual URL is set, use term link
			if (empty($url)) {
				$url = get_term_link($term);
			}
		}
	}
}

// Lucide icon SVG paths (same as JS)
$icon_library = [
	'Tag' => 'M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
	'Check' => 'M20 6 9 17l-5-5',
	'CheckCircle' => 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3',
	'X' => 'M18 6 6 18 M6 6l12 12',
	'XCircle' => 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M15 9l-6 6 M9 9l6 6',
	'AlertCircle' => 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 8v4 M12 16h.01',
	'Info' => 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01',
	'Star' => 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
	'Heart' => 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
	'Zap' => 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
	'Clock' => 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
	'Calendar' => 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
	'TrendingUp' => 'M22 7 13.5 15.5 8.5 10.5 2 17 M16 7h6v6',
	'TrendingDown' => 'M22 17l-8.5-8.5-5 5L2 7 M16 17h6v-6',
	'Award' => 'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M8.21 13.89 7 23l5-3 5 3-1.21-9.11',
	'Flag' => 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
	'Bookmark' => 'm19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
	'Shield' => 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
	'Lock' => 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
	'Unlock' => 'M7 11V7a5 5 0 0 1 9.9-1M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
	'Eye' => 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
	'EyeOff' => 'm17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M2 2l20 20',
	'Users' => 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
	'Bell' => 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
	'Mail' => 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
	'Plus' => 'M5 12h14 M12 5v14',
	'Minus' => 'M5 12h14',
];

// Render icon SVG
$icon_html = '';
if ($show_icon && isset($icon_library[$icon_name])) {
	$path_data = $icon_library[$icon_name];
	$paths = explode(' M', $path_data);
	$paths_html = '';
	foreach ($paths as $index => $d) {
		$full_d = ($index === 0 ? '' : 'M') . $d;
		$paths_html .= '<path d="' . esc_attr($full_d) . '"></path>';
	}

	$icon_html = sprintf(
		'<svg class="ria-badge__icon" width="%d" height="%d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">%s</svg>',
		$icon_size,
		$icon_size,
		$paths_html
	);
}

// Build badge content
$dot_html = $show_dot ? '<span class="ria-badge__dot"></span>' : '';
$text_html = '<span class="ria-badge__text">' . esc_html($display_text) . '</span>';
$dismiss_html = $dismissible ? '<button class="ria-badge__dismiss" aria-label="' . esc_attr__('Dismiss', 'ria-badge') . '"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="M6 6l12 12"></path></svg></button>' : '';

$content_parts = [$dot_html];

if ($show_icon && $icon_position === 'left') {
	$content_parts[] = $icon_html;
}

$content_parts[] = $text_html;

if ($show_icon && $icon_position === 'right') {
	$content_parts[] = $icon_html;
}

$content_parts[] = $dismiss_html;

$badge_content = implode('', $content_parts);

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes();

?>

<div <?php echo $wrapper_attributes; ?>>
	<?php if ($url): ?>
		<a href="<?php echo esc_url($url); ?>" class="<?php echo esc_attr($class_string); ?>"<?php if ($open_in_new_tab): ?> target="_blank" rel="noopener noreferrer"<?php endif; ?>>
			<?php echo $badge_content; ?>
		</a>
	<?php else: ?>
		<span class="<?php echo esc_attr($class_string); ?>">
			<?php echo $badge_content; ?>
		</span>
	<?php endif; ?>
</div>
