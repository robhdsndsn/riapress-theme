<?php
/**
 * RIA Design System - Admin Settings Page
 *
 * Provides a WordPress admin interface for customizing theme defaults.
 * Allows easy customization of colors, typography, spacing, etc. without editing code.
 *
 * @package RIAPress
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the admin settings page
 */
function ria_register_settings_page() {
    add_theme_page(
        'RIA Design System Settings',
        'RIA Design System',
        'manage_options',
        'ria-design-system',
        'ria_render_settings_page'
    );
}
add_action('admin_menu', 'ria_register_settings_page');

/**
 * Register settings and fields
 */
function ria_register_settings() {
    // Register settings
    register_setting('ria_theme_settings', 'ria_theme_overrides', array(
        'type' => 'array',
        'sanitize_callback' => 'ria_sanitize_theme_overrides',
        'default' => array()
    ));

    // Color Settings Section
    add_settings_section(
        'ria_colors_section',
        'Brand Colors',
        'ria_colors_section_callback',
        'ria-design-system'
    );

    // Typography Settings Section
    add_settings_section(
        'ria_typography_section',
        'Typography',
        'ria_typography_section_callback',
        'ria-design-system'
    );

    // Spacing Settings Section
    add_settings_section(
        'ria_spacing_section',
        'Spacing & Layout',
        'ria_spacing_section_callback',
        'ria-design-system'
    );

    // Add color fields
    $color_fields = array(
        'primary' => 'Primary Brand Color',
        'secondary' => 'Secondary Color',
        'success' => 'Success Color',
        'warning' => 'Warning Color',
        'error' => 'Error Color',
        'text' => 'Body Text Color',
        'background' => 'Background Color',
        'border' => 'Border Color',
    );

    foreach ($color_fields as $key => $label) {
        add_settings_field(
            "ria_color_{$key}",
            $label,
            'ria_color_field_callback',
            'ria-design-system',
            'ria_colors_section',
            array('key' => $key, 'label' => $label)
        );
    }

    // Add typography fields
    $heading_fields = array(
        'h1' => 'Heading 1 Size (px)',
        'h2' => 'Heading 2 Size (px)',
        'h3' => 'Heading 3 Size (px)',
        'h4' => 'Heading 4 Size (px)',
        'h5' => 'Heading 5 Size (px)',
        'h6' => 'Heading 6 Size (px)',
    );

    foreach ($heading_fields as $key => $label) {
        add_settings_field(
            "ria_heading_{$key}",
            $label,
            'ria_number_field_callback',
            'ria-design-system',
            'ria_typography_section',
            array('path' => "typography.headingSizes.{$key}", 'label' => $label)
        );
    }

    // Add spacing fields
    $spacing_fields = array(
        'small' => 'Small Spacing (px)',
        'medium' => 'Medium Spacing (px)',
        'large' => 'Large Spacing (px)',
        'xl' => 'Extra Large Spacing (px)',
    );

    foreach ($spacing_fields as $key => $label) {
        add_settings_field(
            "ria_spacing_{$key}",
            $label,
            'ria_number_field_callback',
            'ria-design-system',
            'ria_spacing_section',
            array('path' => "spacing.{$key}", 'label' => $label)
        );
    }
}
add_action('admin_init', 'ria_register_settings');

/**
 * Section callbacks
 */
function ria_colors_section_callback() {
    echo '<p>Customize your brand colors. These will be used as defaults across all RIA blocks.</p>';
}

function ria_typography_section_callback() {
    echo '<p>Set font sizes for headings and body text.</p>';
}

function ria_spacing_section_callback() {
    echo '<p>Define spacing values used for margins and padding.</p>';
}

/**
 * Color field callback
 */
function ria_color_field_callback($args) {
    $overrides = get_option('ria_theme_overrides', array());
    $key = $args['key'];
    $path = "colors.{$key}";

    // Get current value (override or default)
    $default = ria_get_theme_value($path);
    $value = ria_get_value_from_path($overrides, $path, $default);

    echo '<input type="text"
                 name="ria_theme_overrides[colors][' . esc_attr($key) . ']"
                 value="' . esc_attr($value) . '"
                 class="ria-color-picker"
                 data-default-color="' . esc_attr($default) . '" />';
    echo '<p class="description">Default: ' . esc_html($default) . '</p>';
}

/**
 * Number field callback
 */
function ria_number_field_callback($args) {
    $overrides = get_option('ria_theme_overrides', array());
    $path = $args['path'];

    // Get current value (override or default)
    $default = ria_get_theme_value($path);
    $value = ria_get_value_from_path($overrides, $path, $default);

    // Extract the keys for the name attribute
    $keys = explode('.', $path);
    $name = 'ria_theme_overrides';
    foreach ($keys as $key) {
        $name .= "[{$key}]";
    }

    echo '<input type="number"
                 name="' . esc_attr($name) . '"
                 value="' . esc_attr($value) . '"
                 min="0"
                 max="200"
                 step="1" />';
    echo '<p class="description">Default: ' . esc_html($default) . 'px</p>';
}

/**
 * Get a value from a nested array using dot notation
 */
function ria_get_value_from_path($array, $path, $default = null) {
    $keys = explode('.', $path);

    foreach ($keys as $key) {
        if (!isset($array[$key])) {
            return $default;
        }
        $array = $array[$key];
    }

    return $array;
}

/**
 * Sanitize theme overrides
 */
function ria_sanitize_theme_overrides($input) {
    $sanitized = array();

    // Sanitize colors
    if (isset($input['colors']) && is_array($input['colors'])) {
        $sanitized['colors'] = array();
        foreach ($input['colors'] as $key => $value) {
            // Validate hex color
            if (preg_match('/^#[a-f0-9]{6}$/i', $value) || $value === 'transparent') {
                $sanitized['colors'][$key] = sanitize_text_field($value);
            }
        }
    }

    // Sanitize typography
    if (isset($input['typography']['headingSizes']) && is_array($input['typography']['headingSizes'])) {
        $sanitized['typography']['headingSizes'] = array();
        foreach ($input['typography']['headingSizes'] as $key => $value) {
            $sanitized['typography']['headingSizes'][$key] = absint($value);
        }
    }

    // Sanitize spacing
    if (isset($input['spacing']) && is_array($input['spacing'])) {
        $sanitized['spacing'] = array();
        foreach ($input['spacing'] as $key => $value) {
            $sanitized['spacing'][$key] = absint($value);
        }
    }

    return $sanitized;
}

/**
 * Render the settings page
 */
function ria_render_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    // Save success message
    if (isset($_GET['settings-updated'])) {
        add_settings_error(
            'ria_messages',
            'ria_message',
            'Settings saved successfully. Refresh your page to see changes.',
            'updated'
        );
    }

    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <div class="ria-settings-intro">
            <p>Customize your brand standards and design tokens. These values will be used as defaults across all RIA custom blocks, but can still be overridden on a per-block basis.</p>
        </div>

        <?php settings_errors('ria_messages'); ?>

        <form method="post" action="options.php">
            <?php
            settings_fields('ria_theme_settings');
            do_settings_sections('ria-design-system');
            ?>

            <div class="ria-settings-actions">
                <?php submit_button('Save Settings', 'primary', 'submit', false); ?>
                <button type="button" class="button ria-reset-defaults" style="margin-left: 10px;">
                    Reset to Defaults
                </button>
            </div>
        </form>

        <div class="ria-settings-footer">
            <h3>How to Use</h3>
            <ul>
                <li><strong>Set Defaults:</strong> Change values here to set brand standards across all blocks.</li>
                <li><strong>Per-Block Override:</strong> Each block can still override these values in its settings panel.</li>
                <li><strong>Reset:</strong> Click "Reset to Defaults" to restore original theme values.</li>
                <li><strong>CSS Variables:</strong> Values are also available as CSS custom properties (e.g., <code>var(--ria-color-primary)</code>).</li>
            </ul>
        </div>
    </div>

    <style>
        .ria-settings-intro {
            background: #f9fafb;
            border-left: 4px solid #2563eb;
            padding: 16px;
            margin: 20px 0;
        }

        .ria-settings-actions {
            padding: 20px 0;
        }

        .ria-settings-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }

        .ria-settings-footer ul {
            list-style-type: disc;
            margin-left: 20px;
        }

        .ria-settings-footer li {
            margin-bottom: 8px;
        }

        .ria-settings-footer code {
            background: #f9fafb;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
    </style>
    <?php
}

/**
 * Enqueue admin scripts
 */
function ria_enqueue_admin_scripts($hook) {
    if ($hook !== 'appearance_page_ria-design-system') {
        return;
    }

    // Enqueue WordPress color picker
    wp_enqueue_style('wp-color-picker');
    wp_enqueue_script('wp-color-picker');

    // Custom admin script
    wp_add_inline_script('wp-color-picker', "
        jQuery(document).ready(function($) {
            // Initialize color pickers
            $('.ria-color-picker').wpColorPicker();

            // Reset to defaults
            $('.ria-reset-defaults').on('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to reset all values to defaults? This will remove all your customizations.')) {
                    // Clear all input values to use defaults
                    $('input[type=text], input[type=number]').val('');
                    // Submit form
                    $('form').submit();
                }
            });
        });
    ");
}
add_action('admin_enqueue_scripts', 'ria_enqueue_admin_scripts');

/**
 * Merge overrides with defaults
 * Modified version of ria_get_theme_config that respects overrides
 */
function ria_get_theme_config_with_overrides() {
    $defaults = ria_get_theme_config();
    $overrides = get_option('ria_theme_overrides', array());

    return array_replace_recursive($defaults, $overrides);
}

/**
 * Override the default theme config function to use overrides
 */
add_filter('ria_get_theme_config', function($config) {
    $overrides = get_option('ria_theme_overrides', array());
    return array_replace_recursive($config, $overrides);
});
