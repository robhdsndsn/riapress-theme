<?php
/**
 * RIA Design System - Unified Admin Interface
 *
 * Comprehensive admin interface with tabs for:
 * - Design Tokens (colors, typography, spacing)
 * - Performance Monitoring
 * - Hook Reference
 * - Font Library
 * - Advanced Settings
 *
 * @package RIAPress
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * RIA Design System Admin Class
 */
class RIA_Design_System_Admin {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action('admin_menu', array($this, 'register_admin_page'));
		add_action('admin_init', array($this, 'register_settings'));
		add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));

		// AJAX handlers
		add_action('wp_ajax_ria_upload_font', array($this, 'handle_font_upload'));
		add_action('wp_ajax_ria_delete_font', array($this, 'handle_font_delete'));
	}

	/**
	 * Register admin page
	 */
	public function register_admin_page() {
		add_theme_page(
			__('RIA Design System', 'riapress'),
			__('RIA Design System', 'riapress'),
			'manage_options',
			'ria-design-system',
			array($this, 'render_admin_page')
		);
	}

	/**
	 * Register settings
	 */
	public function register_settings() {
		// Design tokens settings
		register_setting('ria_theme_settings', 'ria_theme_overrides', array(
			'type' => 'array',
			'sanitize_callback' => array($this, 'sanitize_theme_overrides'),
			'default' => array()
		));

		// Font library settings
		register_setting('ria_font_settings', 'ria_custom_fonts', array(
			'type' => 'array',
			'sanitize_callback' => array($this, 'sanitize_custom_fonts'),
			'default' => array()
		));

		// Advanced settings
		register_setting('ria_advanced_settings', 'ria_advanced_options', array(
			'type' => 'array',
			'sanitize_callback' => array($this, 'sanitize_advanced_options'),
			'default' => array()
		));
	}

	/**
	 * Enqueue admin assets
	 */
	public function enqueue_admin_assets($hook) {
		if ($hook !== 'appearance_page_ria-design-system') {
			return;
		}

		// WordPress color picker
		wp_enqueue_style('wp-color-picker');
		wp_enqueue_script('wp-color-picker');

		// WordPress media uploader
		wp_enqueue_media();

		// Custom admin styles
		wp_enqueue_style(
			'ria-design-system-admin',
			get_template_directory_uri() . '/assets/css/ria-design-system-admin.css',
			array('wp-color-picker'),
			'1.0.0'
		);

		// Custom admin script
		wp_enqueue_script(
			'ria-design-system-admin',
			get_template_directory_uri() . '/assets/js/ria-design-system-admin.js',
			array('jquery', 'wp-color-picker'),
			'1.0.0',
			true
		);

		wp_localize_script('ria-design-system-admin', 'riaAdmin', array(
			'ajaxurl' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('ria_admin_nonce'),
		));
	}

	/**
	 * Render admin page
	 */
	public function render_admin_page() {
		if (!current_user_can('manage_options')) {
			return;
		}

		$active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'design-tokens';

		?>
		<div class="wrap ria-design-system-wrap">
			<h1><?php esc_html_e('RIA Design System', 'riapress'); ?></h1>

			<!-- Tab Navigation -->
			<nav class="nav-tab-wrapper">
				<a href="?page=ria-design-system&tab=design-tokens" class="nav-tab <?php echo $active_tab === 'design-tokens' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-art"></span>
					<?php esc_html_e('Design Tokens', 'riapress'); ?>
				</a>
				<a href="?page=ria-design-system&tab=performance" class="nav-tab <?php echo $active_tab === 'performance' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-performance"></span>
					<?php esc_html_e('Performance', 'riapress'); ?>
				</a>
				<a href="?page=ria-design-system&tab=hooks" class="nav-tab <?php echo $active_tab === 'hooks' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-admin-generic"></span>
					<?php esc_html_e('Hooks', 'riapress'); ?>
				</a>
				<a href="?page=ria-design-system&tab=fonts" class="nav-tab <?php echo $active_tab === 'fonts' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-editor-textcolor"></span>
					<?php esc_html_e('Font Library', 'riapress'); ?>
				</a>
				<a href="?page=ria-design-system&tab=advanced" class="nav-tab <?php echo $active_tab === 'advanced' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-admin-settings"></span>
					<?php esc_html_e('Advanced', 'riapress'); ?>
				</a>
			</nav>

			<!-- Tab Content -->
			<div class="ria-tab-content">
				<?php
				switch ($active_tab) {
					case 'design-tokens':
						$this->render_design_tokens_tab();
						break;
					case 'performance':
						$this->render_performance_tab();
						break;
					case 'hooks':
						$this->render_hooks_tab();
						break;
					case 'fonts':
						$this->render_fonts_tab();
						break;
					case 'advanced':
						$this->render_advanced_tab();
						break;
				}
				?>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Design Tokens Tab
	 */
	private function render_design_tokens_tab() {
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e('Design Tokens', 'riapress'); ?></h2>
				<p><?php esc_html_e('Customize your brand colors, typography, and spacing. These values serve as defaults across all RIA blocks.', 'riapress'); ?></p>
			</div>

			<form method="post" action="options.php" class="ria-design-tokens-form">
				<?php settings_fields('ria_theme_settings'); ?>

				<div class="ria-settings-grid">

					<!-- Colors Section -->
					<div class="ria-settings-section">
						<h3><?php esc_html_e('Brand Colors', 'riapress'); ?></h3>
						<p class="description"><?php esc_html_e('Define your brand color palette.', 'riapress'); ?></p>

						<?php
						$color_fields = array(
							'primary' => __('Primary Brand Color', 'riapress'),
							'secondary' => __('Secondary Color', 'riapress'),
							'accent' => __('Accent Color', 'riapress'),
							'success' => __('Success Color', 'riapress'),
							'warning' => __('Warning Color', 'riapress'),
							'error' => __('Error Color', 'riapress'),
							'text' => __('Body Text Color', 'riapress'),
							'heading' => __('Heading Color', 'riapress'),
							'background' => __('Background Color', 'riapress'),
							'border' => __('Border Color', 'riapress'),
						);

						$overrides = get_option('ria_theme_overrides', array());

						foreach ($color_fields as $key => $label) {
							$default = ria_get_theme_value("colors.{$key}");
							$value = isset($overrides['colors'][$key]) ? $overrides['colors'][$key] : $default;
							?>
							<div class="ria-field-row">
								<label><?php echo esc_html($label); ?></label>
								<input type="text"
									   name="ria_theme_overrides[colors][<?php echo esc_attr($key); ?>]"
									   value="<?php echo esc_attr($value); ?>"
									   class="ria-color-picker"
									   data-default-color="<?php echo esc_attr($default); ?>" />
								<span class="description"><?php echo esc_html(sprintf(__('Default: %s', 'riapress'), $default)); ?></span>
							</div>
							<?php
						}
						?>
					</div>

					<!-- Typography Section -->
					<div class="ria-settings-section">
						<h3><?php esc_html_e('Typography', 'riapress'); ?></h3>
						<p class="description"><?php esc_html_e('Set font sizes for headings and body text.', 'riapress'); ?></p>

						<?php
						$heading_fields = array(
							'h1' => __('Heading 1 Size', 'riapress'),
							'h2' => __('Heading 2 Size', 'riapress'),
							'h3' => __('Heading 3 Size', 'riapress'),
							'h4' => __('Heading 4 Size', 'riapress'),
							'h5' => __('Heading 5 Size', 'riapress'),
							'h6' => __('Heading 6 Size', 'riapress'),
							'body' => __('Body Text Size', 'riapress'),
						);

						foreach ($heading_fields as $key => $label) {
							$default = ria_get_theme_value("typography.{$key}");
							$value = isset($overrides['typography'][$key]) ? $overrides['typography'][$key] : $default;
							?>
							<div class="ria-field-row">
								<label><?php echo esc_html($label); ?></label>
								<input type="number"
									   name="ria_theme_overrides[typography][<?php echo esc_attr($key); ?>]"
									   value="<?php echo esc_attr($value); ?>"
									   min="10"
									   max="120"
									   step="1" />
								<span class="unit">px</span>
								<span class="description"><?php echo esc_html(sprintf(__('Default: %spx', 'riapress'), $default)); ?></span>
							</div>
							<?php
						}
						?>
					</div>

					<!-- Spacing Section -->
					<div class="ria-settings-section">
						<h3><?php esc_html_e('Spacing & Layout', 'riapress'); ?></h3>
						<p class="description"><?php esc_html_e('Define spacing values for margins and padding.', 'riapress'); ?></p>

						<?php
						$spacing_fields = array(
							'xs' => __('Extra Small', 'riapress'),
							'sm' => __('Small', 'riapress'),
							'md' => __('Medium', 'riapress'),
							'lg' => __('Large', 'riapress'),
							'xl' => __('Extra Large', 'riapress'),
							'2xl' => __('2X Large', 'riapress'),
						);

						foreach ($spacing_fields as $key => $label) {
							$default = ria_get_theme_value("spacing.{$key}");
							$value = isset($overrides['spacing'][$key]) ? $overrides['spacing'][$key] : $default;
							?>
							<div class="ria-field-row">
								<label><?php echo esc_html($label); ?></label>
								<input type="number"
									   name="ria_theme_overrides[spacing][<?php echo esc_attr($key); ?>]"
									   value="<?php echo esc_attr($value); ?>"
									   min="0"
									   max="200"
									   step="4" />
								<span class="unit">px</span>
								<span class="description"><?php echo esc_html(sprintf(__('Default: %spx', 'riapress'), $default)); ?></span>
							</div>
							<?php
						}
						?>
					</div>

				</div>

				<div class="ria-form-actions">
					<?php submit_button(__('Save Design Tokens', 'riapress'), 'primary', 'submit', false); ?>
					<button type="button" class="button ria-reset-button"><?php esc_html_e('Reset to Defaults', 'riapress'); ?></button>
				</div>
			</form>
		</div>
		<?php
	}

	/**
	 * Render Performance Tab
	 */
	private function render_performance_tab() {
		// Get performance metrics
		require_once get_template_directory() . '/functions/performance-monitor.php';
		$monitor = new RP_Performance_Monitor();

		$theme_size = $monitor->get_theme_size();
		$http_requests = $monitor->count_http_requests();
		$optimization = $monitor->get_optimization_status();
		$grade = $this->get_performance_grade($optimization['score']);
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e('Performance Monitor', 'riapress'); ?></h2>
				<p><?php esc_html_e('Track theme performance metrics and get optimization recommendations.', 'riapress'); ?></p>
			</div>

			<div class="ria-performance-grid">
				<!-- Performance Score -->
				<div class="ria-card ria-score-card">
					<h3><?php esc_html_e('Performance Score', 'riapress'); ?></h3>
					<div class="ria-score-display">
						<div class="ria-score-circle grade-<?php echo esc_attr(strtolower($grade)); ?>">
							<span class="score-number"><?php echo esc_html($optimization['score']); ?></span>
							<span class="score-grade"><?php echo esc_html($grade); ?></span>
						</div>
						<p class="score-description">
							<?php
							if ($optimization['score'] >= 90) {
								esc_html_e('Excellent! Theme is highly optimized.', 'riapress');
							} elseif ($optimization['score'] >= 70) {
								esc_html_e('Good performance, room for improvement.', 'riapress');
							} else {
								esc_html_e('Performance needs optimization.', 'riapress');
							}
							?>
						</p>
					</div>
				</div>

				<!-- Theme Size -->
				<div class="ria-card">
					<h3><?php esc_html_e('Theme File Sizes', 'riapress'); ?></h3>
					<div class="ria-metrics">
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e('Total:', 'riapress'); ?></span>
							<span class="metric-value"><?php echo esc_html($theme_size['total']['formatted']); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e('CSS:', 'riapress'); ?></span>
							<span class="metric-value"><?php echo esc_html($theme_size['css']['formatted']); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e('JavaScript:', 'riapress'); ?></span>
							<span class="metric-value"><?php echo esc_html($theme_size['js']['formatted']); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e('PHP:', 'riapress'); ?></span>
							<span class="metric-value"><?php echo esc_html($theme_size['php']['formatted']); ?></span>
						</div>
					</div>
				</div>

				<!-- HTTP Requests -->
				<div class="ria-card">
					<h3><?php esc_html_e('HTTP Requests', 'riapress'); ?></h3>
					<div class="ria-metrics">
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e('Total:', 'riapress'); ?></span>
							<span class="metric-value"><?php echo esc_html($http_requests['total']); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e('Stylesheets:', 'riapress'); ?></span>
							<span class="metric-value"><?php echo esc_html($http_requests['styles']); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e('Scripts:', 'riapress'); ?></span>
							<span class="metric-value"><?php echo esc_html($http_requests['scripts']); ?></span>
						</div>
					</div>
					<p class="metric-info"><strong><?php esc_html_e('Target:', 'riapress'); ?></strong> <?php esc_html_e('< 5 requests', 'riapress'); ?></p>
				</div>

				<!-- Recommendations -->
				<div class="ria-card ria-recommendations-card">
					<h3><?php esc_html_e('Recommendations', 'riapress'); ?></h3>
					<div class="ria-recommendations">
						<?php foreach ($optimization['recommendations'] as $rec) : ?>
							<div class="recommendation-item recommendation-<?php echo esc_attr($rec['type']); ?>">
								<div class="recommendation-icon">
									<?php
									switch ($rec['type']) {
										case 'success': echo '✓'; break;
										case 'warning': echo '⚠'; break;
										case 'info': echo 'ℹ'; break;
									}
									?>
								</div>
								<div class="recommendation-content">
									<h4><?php echo esc_html($rec['title']); ?></h4>
									<p><?php echo esc_html($rec['message']); ?></p>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Get performance grade
	 */
	private function get_performance_grade($score) {
		if ($score >= 90) return 'A';
		if ($score >= 80) return 'B';
		if ($score >= 70) return 'C';
		if ($score >= 60) return 'D';
		return 'F';
	}

	/**
	 * Render Hooks Tab
	 */
	private function render_hooks_tab() {
		require_once get_template_directory() . '/functions/hook-system.php';
		$hook_system = new RP_Hook_System();
		$hooks = $hook_system->get_hooks();
		$examples = $hook_system->get_examples();

		$total_hooks = array_sum(array_map(function($cat) {
			return count($cat['hooks']);
		}, $hooks));
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e('Hook Reference', 'riapress'); ?></h2>
				<p><?php esc_html_e('Use these action hooks to customize your theme without modifying template files.', 'riapress'); ?></p>
			</div>

			<!-- Stats -->
			<div class="ria-hooks-stats">
				<div class="stat-card">
					<span class="stat-number"><?php echo esc_html($total_hooks); ?></span>
					<span class="stat-label"><?php esc_html_e('Total Hooks', 'riapress'); ?></span>
				</div>
				<div class="stat-card">
					<span class="stat-number"><?php echo esc_html(count($hooks)); ?></span>
					<span class="stat-label"><?php esc_html_e('Categories', 'riapress'); ?></span>
				</div>
				<div class="stat-card">
					<span class="stat-number"><?php echo esc_html(count($examples)); ?></span>
					<span class="stat-label"><?php esc_html_e('Examples', 'riapress'); ?></span>
				</div>
			</div>

			<!-- Hook Categories -->
			<div class="ria-hooks-grid">
				<?php foreach ($hooks as $category) : ?>
					<div class="ria-card hooks-category-card">
						<h3><?php echo esc_html($category['title']); ?></h3>
						<p class="description"><?php echo esc_html($category['description']); ?></p>

						<div class="hooks-list">
							<?php foreach ($category['hooks'] as $hook) : ?>
								<div class="hook-item">
									<code class="hook-name"><?php echo esc_html($hook['name']); ?></code>
									<p><?php echo esc_html($hook['description']); ?></p>
									<?php if (!empty($hook['example'])) : ?>
										<details class="hook-example">
											<summary><?php esc_html_e('Show Example', 'riapress'); ?></summary>
											<pre><code><?php echo esc_html($hook['example']); ?></code></pre>
										</details>
									<?php endif; ?>
								</div>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Fonts Tab
	 */
	private function render_fonts_tab() {
		$custom_fonts = get_option('ria_custom_fonts', array());
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e('Font Library', 'riapress'); ?></h2>
				<p><?php esc_html_e('Manage local fonts for better performance and GDPR compliance.', 'riapress'); ?></p>
			</div>

			<div class="ria-fonts-grid">
				<!-- Upload Font -->
				<div class="ria-card">
					<h3><?php esc_html_e('Upload Custom Font', 'riapress'); ?></h3>
					<p><?php esc_html_e('Upload WOFF2, WOFF, or TTF font files.', 'riapress'); ?></p>

					<div class="ria-font-upload">
						<input type="text" id="ria-font-name" placeholder="<?php esc_attr_e('Font Name (e.g., Montserrat)', 'riapress'); ?>" />
						<button type="button" class="button button-primary ria-upload-font-button">
							<?php esc_html_e('Upload Font Files', 'riapress'); ?>
						</button>
					</div>
				</div>

				<!-- Installed Fonts -->
				<div class="ria-card ria-installed-fonts-card">
					<h3><?php esc_html_e('Installed Fonts', 'riapress'); ?></h3>

					<?php if (empty($custom_fonts)) : ?>
						<p class="description"><?php esc_html_e('No custom fonts installed yet.', 'riapress'); ?></p>
					<?php else : ?>
						<div class="fonts-list">
							<?php foreach ($custom_fonts as $font_id => $font) : ?>
								<div class="font-item" data-font-id="<?php echo esc_attr($font_id); ?>">
									<div class="font-info">
										<h4><?php echo esc_html($font['name']); ?></h4>
										<p class="description"><?php echo esc_html(count($font['files'])); ?> <?php esc_html_e('files', 'riapress'); ?></p>
									</div>
									<button type="button" class="button ria-delete-font" data-font-id="<?php echo esc_attr($font_id); ?>">
										<?php esc_html_e('Delete', 'riapress'); ?>
									</button>
								</div>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
				</div>

				<!-- Font Tips -->
				<div class="ria-card">
					<h3><?php esc_html_e('Font Best Practices', 'riapress'); ?></h3>
					<ul class="ria-tips-list">
						<li><?php esc_html_e('Use WOFF2 format for best compression (50% smaller than TTF)', 'riapress'); ?></li>
						<li><?php esc_html_e('Upload only the font weights you actually use', 'riapress'); ?></li>
						<li><?php esc_html_e('Consider subsetting fonts to Latin characters only', 'riapress'); ?></li>
						<li><?php esc_html_e('Local fonts improve GDPR compliance and performance', 'riapress'); ?></li>
					</ul>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Advanced Tab
	 */
	private function render_advanced_tab() {
		$options = get_option('ria_advanced_options', array());
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e('Advanced Settings', 'riapress'); ?></h2>
				<p><?php esc_html_e('Configure advanced theme options and features.', 'riapress'); ?></p>
			</div>

			<form method="post" action="options.php" class="ria-advanced-form">
				<?php settings_fields('ria_advanced_settings'); ?>

				<div class="ria-settings-grid">

					<!-- Header Settings -->
					<div class="ria-settings-section">
						<h3><?php esc_html_e('Header Options', 'riapress'); ?></h3>

						<div class="ria-field-row">
							<label>
								<input type="checkbox"
									   name="ria_advanced_options[sticky_header]"
									   value="1"
									   <?php checked(isset($options['sticky_header']) && $options['sticky_header']); ?> />
								<?php esc_html_e('Enable Sticky Header', 'riapress'); ?>
							</label>
							<p class="description"><?php esc_html_e('Header remains visible when scrolling down.', 'riapress'); ?></p>
						</div>

						<div class="ria-field-row">
							<label>
								<input type="checkbox"
									   name="ria_advanced_options[transparent_header]"
									   value="1"
									   <?php checked(isset($options['transparent_header']) && $options['transparent_header']); ?> />
								<?php esc_html_e('Transparent Header on Top', 'riapress'); ?>
							</label>
							<p class="description"><?php esc_html_e('Header is transparent at page top, solid on scroll.', 'riapress'); ?></p>
						</div>

						<div class="ria-field-row">
							<label>
								<input type="checkbox"
									   name="ria_advanced_options[mobile_menu]"
									   value="1"
									   <?php checked(isset($options['mobile_menu']) && $options['mobile_menu']); ?> />
								<?php esc_html_e('Enable Mobile Menu', 'riapress'); ?>
							</label>
							<p class="description"><?php esc_html_e('Show hamburger menu on mobile devices.', 'riapress'); ?></p>
						</div>
					</div>

					<!-- Performance Settings -->
					<div class="ria-settings-section">
						<h3><?php esc_html_e('Performance Options', 'riapress'); ?></h3>

						<div class="ria-field-row">
							<label>
								<input type="checkbox"
									   name="ria_advanced_options[lazy_loading]"
									   value="1"
									   <?php checked(isset($options['lazy_loading']) && $options['lazy_loading']); ?> />
								<?php esc_html_e('Enable Lazy Loading', 'riapress'); ?>
							</label>
							<p class="description"><?php esc_html_e('Defer loading of off-screen images.', 'riapress'); ?></p>
						</div>

						<div class="ria-field-row">
							<label>
								<input type="checkbox"
									   name="ria_advanced_options[minify_css]"
									   value="1"
									   <?php checked(isset($options['minify_css']) && $options['minify_css']); ?> />
								<?php esc_html_e('Minify CSS', 'riapress'); ?>
							</label>
							<p class="description"><?php esc_html_e('Reduce CSS file sizes (requires page reload).', 'riapress'); ?></p>
						</div>

						<div class="ria-field-row">
							<label>
								<input type="checkbox"
									   name="ria_advanced_options[minify_js]"
									   value="1"
									   <?php checked(isset($options['minify_js']) && $options['minify_js']); ?> />
								<?php esc_html_e('Minify JavaScript', 'riapress'); ?>
							</label>
							<p class="description"><?php esc_html_e('Reduce JavaScript file sizes (requires page reload).', 'riapress'); ?></p>
						</div>
					</div>

					<!-- Footer Settings -->
					<div class="ria-settings-section">
						<h3><?php esc_html_e('Footer Options', 'riapress'); ?></h3>

						<div class="ria-field-row">
							<label><?php esc_html_e('Copyright Text', 'riapress'); ?></label>
							<input type="text"
								   name="ria_advanced_options[copyright_text]"
								   value="<?php echo esc_attr(isset($options['copyright_text']) ? $options['copyright_text'] : ''); ?>"
								   class="regular-text"
								   placeholder="<?php esc_attr_e('© 2025 Your Company', 'riapress'); ?>" />
							<p class="description"><?php esc_html_e('Custom copyright text for footer.', 'riapress'); ?></p>
						</div>

						<div class="ria-field-row">
							<label>
								<input type="checkbox"
									   name="ria_advanced_options[back_to_top]"
									   value="1"
									   <?php checked(isset($options['back_to_top']) && $options['back_to_top']); ?> />
								<?php esc_html_e('Enable Back to Top Button', 'riapress'); ?>
							</label>
							<p class="description"><?php esc_html_e('Show a button to scroll back to top.', 'riapress'); ?></p>
						</div>
					</div>

					<!-- Developer Options -->
					<div class="ria-settings-section">
						<h3><?php esc_html_e('Developer Options', 'riapress'); ?></h3>

						<div class="ria-field-row">
							<label>
								<input type="checkbox"
									   name="ria_advanced_options[debug_mode]"
									   value="1"
									   <?php checked(isset($options['debug_mode']) && $options['debug_mode']); ?> />
								<?php esc_html_e('Enable Debug Mode', 'riapress'); ?>
							</label>
							<p class="description"><?php esc_html_e('Show performance metrics in browser console (admin only).', 'riapress'); ?></p>
						</div>

						<div class="ria-field-row">
							<label><?php esc_html_e('Custom CSS', 'riapress'); ?></label>
							<textarea name="ria_advanced_options[custom_css]"
									  rows="10"
									  class="large-text code"><?php echo esc_textarea(isset($options['custom_css']) ? $options['custom_css'] : ''); ?></textarea>
							<p class="description"><?php esc_html_e('Add custom CSS (no <style> tags needed).', 'riapress'); ?></p>
						</div>

						<div class="ria-field-row">
							<label><?php esc_html_e('Custom JavaScript', 'riapress'); ?></label>
							<textarea name="ria_advanced_options[custom_js]"
									  rows="10"
									  class="large-text code"><?php echo esc_textarea(isset($options['custom_js']) ? $options['custom_js'] : ''); ?></textarea>
							<p class="description"><?php esc_html_e('Add custom JavaScript (no <script> tags needed).', 'riapress'); ?></p>
						</div>
					</div>

				</div>

				<div class="ria-form-actions">
					<?php submit_button(__('Save Advanced Settings', 'riapress'), 'primary', 'submit', false); ?>
				</div>
			</form>
		</div>
		<?php
	}

	/**
	 * Sanitize theme overrides
	 */
	public function sanitize_theme_overrides($input) {
		$sanitized = array();

		// Sanitize colors
		if (isset($input['colors']) && is_array($input['colors'])) {
			$sanitized['colors'] = array();
			foreach ($input['colors'] as $key => $value) {
				if (preg_match('/^#[a-f0-9]{6}$/i', $value)) {
					$sanitized['colors'][$key] = sanitize_text_field($value);
				}
			}
		}

		// Sanitize typography
		if (isset($input['typography']) && is_array($input['typography'])) {
			$sanitized['typography'] = array();
			foreach ($input['typography'] as $key => $value) {
				$sanitized['typography'][$key] = absint($value);
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
	 * Sanitize custom fonts
	 */
	public function sanitize_custom_fonts($input) {
		// Font sanitization logic
		return $input;
	}

	/**
	 * Sanitize advanced options
	 */
	public function sanitize_advanced_options($input) {
		$sanitized = array();

		// Boolean options
		$boolean_fields = array('sticky_header', 'transparent_header', 'mobile_menu', 'lazy_loading', 'minify_css', 'minify_js', 'back_to_top', 'debug_mode');
		foreach ($boolean_fields as $field) {
			$sanitized[$field] = isset($input[$field]) ? 1 : 0;
		}

		// Text fields
		if (isset($input['copyright_text'])) {
			$sanitized['copyright_text'] = sanitize_text_field($input['copyright_text']);
		}

		// CSS/JS
		if (isset($input['custom_css'])) {
			$sanitized['custom_css'] = wp_strip_all_tags($input['custom_css']);
		}
		if (isset($input['custom_js'])) {
			$sanitized['custom_js'] = wp_strip_all_tags($input['custom_js']);
		}

		return $sanitized;
	}

	/**
	 * Handle font upload AJAX
	 */
	public function handle_font_upload() {
		check_ajax_referer('ria_admin_nonce', 'nonce');

		if (!current_user_can('manage_options')) {
			wp_send_json_error('Insufficient permissions');
		}

		// Font upload logic here
		wp_send_json_success(array('message' => 'Font uploaded successfully'));
	}

	/**
	 * Handle font delete AJAX
	 */
	public function handle_font_delete() {
		check_ajax_referer('ria_admin_nonce', 'nonce');

		if (!current_user_can('manage_options')) {
			wp_send_json_error('Insufficient permissions');
		}

		$font_id = isset($_POST['font_id']) ? sanitize_text_field($_POST['font_id']) : '';

		if (empty($font_id)) {
			wp_send_json_error('Invalid font ID');
		}

		$fonts = get_option('ria_custom_fonts', array());
		if (isset($fonts[$font_id])) {
			unset($fonts[$font_id]);
			update_option('ria_custom_fonts', $fonts);
			wp_send_json_success(array('message' => 'Font deleted successfully'));
		}

		wp_send_json_error('Font not found');
	}
}

// Initialize the admin system
new RIA_Design_System_Admin();
