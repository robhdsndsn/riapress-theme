<?php
/**
 * RIA Design System - Theme Configuration
 *
 * Centralized design tokens and default values for all RIA custom blocks.
 * This file defines brand standards that apply across all blocks by default,
 * while still allowing per-block customization.
 *
 * @package RIAPress
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get the complete RIA theme configuration
 *
 * @return array Complete theme configuration with all design tokens
 */
function ria_get_theme_config() {
    return array(
        'colors' => ria_get_color_palette(),
        'typography' => ria_get_typography_config(),
        'spacing' => ria_get_spacing_config(),
        'borders' => ria_get_border_config(),
        'shadows' => ria_get_shadow_config(),
        'buttons' => ria_get_button_config(),
    );
}

/**
 * Get the brand color palette
 *
 * @return array Color definitions with hex values
 */
function ria_get_color_palette() {
    return apply_filters('ria_color_palette', array(
        // Primary Brand Colors
        'primary'       => '#2563eb',  // Blue - main brand color
        'primaryDark'   => '#1d4ed8',  // Darker blue for hovers
        'primaryLight'  => '#eff6ff',  // Light blue for backgrounds

        // Secondary Colors
        'secondary'     => '#6b7280',  // Gray
        'secondaryDark' => '#4b5563',  // Dark gray for hovers

        // Semantic Colors
        'success'       => '#10b981',  // Green
        'warning'       => '#f59e0b',  // Orange
        'error'         => '#ef4444',  // Red
        'info'          => '#3b82f6',  // Blue

        // Neutral Colors
        'text'          => '#1f2937',  // Dark gray for body text
        'textLight'     => '#6b7280',  // Light gray for secondary text
        'background'    => '#ffffff',  // White
        'backgroundGray' => '#f9fafb', // Light gray background
        'border'        => '#e5e7eb',  // Border gray

        // Utility Colors
        'black'         => '#000000',
        'white'         => '#ffffff',
        'transparent'   => 'transparent',
    ));
}

/**
 * Get typography configuration
 *
 * @return array Font sizes, weights, and line heights
 */
function ria_get_typography_config() {
    return apply_filters('ria_typography_config', array(
        // Base Settings
        'baseFontSize'   => 16,      // px
        'baseLineHeight' => 1.6,

        // Heading Sizes (px)
        'headingSizes' => array(
            'h1' => 48,
            'h2' => 36,
            'h3' => 24,
            'h4' => 20,
            'h5' => 18,
            'h6' => 16,
        ),

        // Font Weights
        'fontWeights' => array(
            'light'   => 300,
            'normal'  => 400,
            'medium'  => 500,
            'semibold' => 600,
            'bold'    => 700,
        ),

        // Line Heights
        'lineHeights' => array(
            'tight'   => 1.2,
            'normal'  => 1.6,
            'relaxed' => 1.8,
        ),
    ));
}

/**
 * Get spacing configuration
 *
 * @return array Spacing values in pixels
 */
function ria_get_spacing_config() {
    return apply_filters('ria_spacing_config', array(
        'none'    => 0,
        'xs'      => 4,
        'small'   => 8,
        'medium'  => 16,
        'large'   => 24,
        'xl'      => 32,
        'xxl'     => 48,
        '3xl'     => 64,
        '4xl'     => 80,
    ));
}

/**
 * Get border configuration
 *
 * @return array Border radius and width values
 */
function ria_get_border_config() {
    return apply_filters('ria_border_config', array(
        // Border Radius (px)
        'radius' => array(
            'none'   => 0,
            'small'  => 4,
            'medium' => 8,
            'large'  => 16,
            'xl'     => 24,
            'full'   => 9999,
        ),

        // Border Widths (px)
        'width' => array(
            'none'   => 0,
            'thin'   => 1,
            'medium' => 2,
            'thick'  => 4,
        ),

        // Default Border
        'default' => array(
            'width' => 1,
            'color' => '#e5e7eb',
            'style' => 'solid',
            'radius' => 8,
        ),
    ));
}

/**
 * Get shadow configuration
 *
 * @return array Box shadow presets
 */
function ria_get_shadow_config() {
    return apply_filters('ria_shadow_config', array(
        'none'   => 'none',
        'small'  => '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'medium' => '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'large'  => '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'xlarge' => '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
    ));
}

/**
 * Get button configuration
 *
 * @return array Button style defaults
 */
function ria_get_button_config() {
    $colors = ria_get_color_palette();

    return apply_filters('ria_button_config', array(
        'styles' => array(
            'primary' => array(
                'background' => $colors['primary'],
                'color'      => $colors['white'],
                'border'     => $colors['primary'],
            ),
            'secondary' => array(
                'background' => $colors['secondary'],
                'color'      => $colors['white'],
                'border'     => $colors['secondary'],
            ),
            'outline' => array(
                'background' => 'transparent',
                'color'      => $colors['primary'],
                'border'     => $colors['primary'],
            ),
            'text' => array(
                'background' => 'transparent',
                'color'      => $colors['primary'],
                'border'     => 'transparent',
            ),
        ),

        // Default Button Settings
        'defaults' => array(
            'borderRadius' => 6,
            'borderWidth'  => 2,
            'paddingX'     => 24,  // 1.5rem
            'paddingY'     => 12,  // 0.75rem
            'fontSize'     => 16,
            'fontWeight'   => 500,
        ),
    ));
}

/**
 * Get a specific theme value by path
 *
 * Example: ria_get_theme_value('colors.primary') returns '#2563eb'
 *
 * @param string $path Dot-notation path to value (e.g., 'colors.primary')
 * @param mixed $default Default value if path not found
 * @return mixed The theme value or default
 */
function ria_get_theme_value($path, $default = null) {
    $config = ria_get_theme_config();
    $keys = explode('.', $path);

    foreach ($keys as $key) {
        if (!isset($config[$key])) {
            return $default;
        }
        $config = $config[$key];
    }

    return $config;
}

/**
 * Enqueue theme config for use in JavaScript
 *
 * Makes theme configuration available to Gutenberg blocks via wp.data
 */
function ria_enqueue_theme_config() {
    wp_localize_script(
        'wp-block-editor',
        'riaThemeConfig',
        ria_get_theme_config()
    );
}
add_action('enqueue_block_editor_assets', 'ria_enqueue_theme_config');

/**
 * Add CSS custom properties to editor
 *
 * Makes theme values available as CSS variables in the block editor
 */
function ria_add_editor_theme_styles() {
    $colors = ria_get_color_palette();
    $typography = ria_get_typography_config();
    $spacing = ria_get_spacing_config();
    $borders = ria_get_border_config();

    $css = ':root {';

    // Color Variables
    foreach ($colors as $name => $value) {
        $css .= "--ria-color-{$name}: {$value};";
    }

    // Typography Variables
    $css .= "--ria-font-size-base: {$typography['baseFontSize']}px;";
    foreach ($typography['headingSizes'] as $level => $size) {
        $css .= "--ria-font-size-{$level}: {$size}px;";
    }

    // Spacing Variables
    foreach ($spacing as $name => $value) {
        $css .= "--ria-spacing-{$name}: {$value}px;";
    }

    // Border Variables
    foreach ($borders['radius'] as $name => $value) {
        $css .= "--ria-radius-{$name}: {$value}px;";
    }

    $css .= '}';

    wp_add_inline_style('wp-edit-blocks', $css);
}
add_action('enqueue_block_editor_assets', 'ria_add_editor_theme_styles');

/**
 * Add CSS custom properties to frontend
 */
function ria_add_frontend_theme_styles() {
    $colors = ria_get_color_palette();
    $typography = ria_get_typography_config();
    $spacing = ria_get_spacing_config();
    $borders = ria_get_border_config();

    $css = ':root {';

    // Color Variables
    foreach ($colors as $name => $value) {
        $css .= "--ria-color-{$name}: {$value};";
    }

    // Typography Variables
    $css .= "--ria-font-size-base: {$typography['baseFontSize']}px;";
    foreach ($typography['headingSizes'] as $level => $size) {
        $css .= "--ria-font-size-{$level}: {$size}px;";
    }

    // Spacing Variables
    foreach ($spacing as $name => $value) {
        $css .= "--ria-spacing-{$name}: {$value}px;";
    }

    // Border Variables
    foreach ($borders['radius'] as $name => $value) {
        $css .= "--ria-radius-{$name}: {$value}px;";
    }

    $css .= '}';

    wp_add_inline_style('wp-block-library', $css);
}
add_action('wp_enqueue_scripts', 'ria_add_frontend_theme_styles');
