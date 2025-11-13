<?php
/**
 * RIA Design System - Unified Admin Interface
 *
 * Provides a centralized admin panel for managing theme settings,
 * performance, hooks, typography, and design tokens.
 *
 * @package RIAPress
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
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
		add_action( 'admin_menu', [ $this, 'add_admin_menu' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
	}

	/**
	 * Add admin menu page
	 */
	public function add_admin_menu() {
		add_theme_page(
			__( 'RIA Design System', 'riapress' ),
			__( 'Design System', 'riapress' ),
			'manage_options',
			'ria-design-system',
			[ $this, 'render_admin_page' ]
		);
	}

	/**
	 * Enqueue admin assets
	 */
	public function enqueue_admin_assets( $hook ) {
		// Only load on our admin page
		if ( 'appearance_page_ria-design-system' !== $hook ) {
			return;
		}

		// Enqueue admin CSS
		wp_enqueue_style(
			'ria-design-system-admin',
			get_template_directory_uri() . '/assets/css/ria-design-system-admin.css',
			[],
			'1.0.0'
		);

		// Enqueue WordPress color picker
		wp_enqueue_style( 'wp-color-picker' );

		// Enqueue admin JavaScript
		wp_enqueue_script(
			'ria-design-system-admin',
			get_template_directory_uri() . '/assets/js/ria-design-system-admin.js',
			[ 'jquery', 'wp-color-picker' ],
			'1.0.0',
			true
		);

		// Localize script for AJAX
		wp_localize_script(
			'ria-design-system-admin',
			'riaAdmin',
			[
				'ajaxurl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'ria_design_system' ),
			]
		);
	}

	/**
	 * Render the admin page
	 */
	public function render_admin_page() {
		// Get active tab
		$active_tab = isset( $_GET['tab'] ) ? sanitize_key( $_GET['tab'] ) : 'overview';

		?>
		<div class="wrap ria-design-system-wrap">
			<h1><?php esc_html_e( 'RIA Design System', 'riapress' ); ?></h1>
			<p class="description">
				<?php esc_html_e( 'Unified interface for managing theme settings, performance, design tokens, and advanced features.', 'riapress' ); ?>
			</p>

			<!-- Tab Navigation -->
			<h2 class="nav-tab-wrapper">
				<a href="?page=ria-design-system&tab=overview" class="nav-tab <?php echo $active_tab === 'overview' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-admin-home"></span>
					<?php esc_html_e( 'Overview', 'riapress' ); ?>
				</a>
				<a href="?page=ria-design-system&tab=design-tokens" class="nav-tab <?php echo $active_tab === 'design-tokens' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-art"></span>
					<?php esc_html_e( 'Design Tokens', 'riapress' ); ?>
				</a>
				<a href="?page=ria-design-system&tab=performance" class="nav-tab <?php echo $active_tab === 'performance' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-performance"></span>
					<?php esc_html_e( 'Performance', 'riapress' ); ?>
				</a>
				<a href="?page=ria-design-system&tab=hooks" class="nav-tab <?php echo $active_tab === 'hooks' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-editor-code"></span>
					<?php esc_html_e( 'Hooks', 'riapress' ); ?>
				</a>
				<a href="?page=ria-design-system&tab=typography" class="nav-tab <?php echo $active_tab === 'typography' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-editor-textcolor"></span>
					<?php esc_html_e( 'Typography', 'riapress' ); ?>
				</a>
				<a href="?page=ria-design-system&tab=blocks" class="nav-tab <?php echo $active_tab === 'blocks' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-screenoptions"></span>
					<?php esc_html_e( 'Blocks', 'riapress' ); ?>
				</a>
				<a href="?page=ria-design-system&tab=export-import" class="nav-tab <?php echo $active_tab === 'export-import' ? 'nav-tab-active' : ''; ?>">
					<span class="dashicons dashicons-database-export"></span>
					<?php esc_html_e( 'Export/Import', 'riapress' ); ?>
				</a>
			</h2>

			<!-- Tab Content -->
			<div class="ria-tab-content">
				<?php
				switch ( $active_tab ) {
					case 'design-tokens':
						$this->render_design_tokens_tab();
						break;
					case 'performance':
						$this->render_performance_tab();
						break;
					case 'hooks':
						$this->render_hooks_tab();
						break;
					case 'typography':
						$this->render_typography_tab();
						break;
					case 'blocks':
						$this->render_blocks_tab();
						break;
					case 'export-import':
						$this->render_export_import_tab();
						break;
					default:
						$this->render_overview_tab();
				}
				?>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Overview Tab
	 */
	private function render_overview_tab() {
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e( 'Welcome to RIA Design System', 'riapress' ); ?></h2>
				<p><?php esc_html_e( 'A unified interface for managing your theme\'s design system, performance, and advanced features.', 'riapress' ); ?></p>
			</div>

			<div class="ria-settings-grid">
				<div class="ria-card">
					<h3><?php esc_html_e( 'Design Tokens', 'riapress' ); ?></h3>
					<p class="description"><?php esc_html_e( 'Manage colors, typography, spacing, and other design system tokens defined in theme.json.', 'riapress' ); ?></p>
					<p><a href="?page=ria-design-system&tab=design-tokens" class="button button-primary"><?php esc_html_e( 'Manage Design Tokens', 'riapress' ); ?></a></p>
				</div>

				<div class="ria-card">
					<h3><?php esc_html_e( 'Performance Monitoring', 'riapress' ); ?></h3>
					<p class="description"><?php esc_html_e( 'Track theme performance metrics, optimize assets, and improve page speed.', 'riapress' ); ?></p>
					<p><a href="?page=ria-design-system&tab=performance" class="button button-primary"><?php esc_html_e( 'View Performance', 'riapress' ); ?></a></p>
				</div>

				<div class="ria-card">
					<h3><?php esc_html_e( 'Hook System', 'riapress' ); ?></h3>
					<p class="description"><?php esc_html_e( 'Explore available theme hooks for custom development and extensions.', 'riapress' ); ?></p>
					<p><a href="?page=ria-design-system&tab=hooks" class="button button-primary"><?php esc_html_e( 'Browse Hooks', 'riapress' ); ?></a></p>
				</div>

				<div class="ria-card">
					<h3><?php esc_html_e( 'Typography Management', 'riapress' ); ?></h3>
					<p class="description"><?php esc_html_e( 'Upload custom fonts, manage Google Fonts, and optimize font loading.', 'riapress' ); ?></p>
					<p><a href="?page=ria-design-system&tab=typography" class="button button-primary"><?php esc_html_e( 'Manage Fonts', 'riapress' ); ?></a></p>
				</div>
			</div>

			<div class="ria-card">
				<h3><?php esc_html_e( 'System Information', 'riapress' ); ?></h3>
				<div class="ria-metrics">
					<div class="metric-row">
						<span class="metric-label"><?php esc_html_e( 'Theme Version', 'riapress' ); ?></span>
						<span class="metric-value"><?php echo esc_html( wp_get_theme()->get( 'Version' ) ); ?></span>
					</div>
					<div class="metric-row">
						<span class="metric-label"><?php esc_html_e( 'WordPress Version', 'riapress' ); ?></span>
						<span class="metric-value"><?php echo esc_html( get_bloginfo( 'version' ) ); ?></span>
					</div>
					<div class="metric-row">
						<span class="metric-label"><?php esc_html_e( 'PHP Version', 'riapress' ); ?></span>
						<span class="metric-value"><?php echo esc_html( PHP_VERSION ); ?></span>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Design Tokens Tab
	 */
	private function render_design_tokens_tab() {
		// Get colors from settings API
		$colors = RIA_Design_System_Settings::get_colors();
		$stats  = RIA_Design_System_Settings::get_customization_stats();

		// Separate palette and custom colors
		$palette_colors = array();
		$custom_colors  = array();

		foreach ( $colors as $slug => $data ) {
			if ( $data['type'] === 'palette' ) {
				$palette_colors[ $slug ] = $data;
			} else {
				$custom_colors[ $slug ] = $data;
			}
		}
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e( 'Design Tokens', 'riapress' ); ?></h2>
				<p><?php esc_html_e( 'Edit your theme\'s color palette. Changes are saved to the database and override theme.json defaults.', 'riapress' ); ?></p>

				<?php if ( $stats['has_customizations'] ) : ?>
					<div class="ria-notice ria-notice-info">
						<strong><?php esc_html_e( 'Active Customizations:', 'riapress' ); ?></strong>
						<?php
						printf(
							esc_html__( '%d colors have been customized.', 'riapress' ),
							$stats['colors_customized']
						);
						?>
					</div>
				<?php endif; ?>
			</div>

			<div class="ria-colors-editor">
				<!-- Palette Colors -->
				<div class="ria-card">
					<div class="ria-card-header">
						<h3><?php esc_html_e( 'Palette Colors', 'riapress' ); ?></h3>
						<p class="description"><?php esc_html_e( 'Main color palette used throughout the theme.', 'riapress' ); ?></p>
					</div>

					<div class="ria-color-grid">
						<?php foreach ( $palette_colors as $slug => $data ) : ?>
							<div class="ria-color-item <?php echo isset( $data['is_override'] ) ? 'is-customized' : ''; ?>">
								<div class="ria-color-preview" style="background-color: <?php echo esc_attr( RIA_Design_System_Output::resolve_css_variable( $data['value'] ) ); ?>"></div>
								<div class="ria-color-details">
									<label for="color-<?php echo esc_attr( $slug ); ?>">
										<strong><?php echo esc_html( $data['name'] ); ?></strong>
										<?php if ( isset( $data['is_override'] ) ) : ?>
											<span class="ria-badge">Customized</span>
										<?php endif; ?>
									</label>
									<div class="ria-color-controls">
										<input
											type="text"
											id="color-<?php echo esc_attr( $slug ); ?>"
											name="color-<?php echo esc_attr( $slug ); ?>"
											value="<?php echo esc_attr( RIA_Design_System_Output::resolve_css_variable( $data['value'] ) ); ?>"
											class="ria-color-picker"
											data-slug="<?php echo esc_attr( $slug ); ?>"
											data-default-value="<?php echo esc_attr( RIA_Design_System_Output::resolve_css_variable( $data['value'] ) ); ?>"
										/>
										<code class="ria-color-slug">--wp--preset--color--<?php echo esc_html( $slug ); ?></code>
									</div>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>

				<!-- Custom Colors -->
				<div class="ria-card">
					<div class="ria-card-header">
						<h3><?php esc_html_e( 'Custom Colors', 'riapress' ); ?></h3>
						<p class="description"><?php esc_html_e( 'CSS custom properties used for advanced color variations and design system tokens.', 'riapress' ); ?></p>
					</div>

					<div class="ria-color-grid">
						<?php foreach ( $custom_colors as $slug => $data ) : ?>
							<div class="ria-color-item <?php echo isset( $data['is_override'] ) ? 'is-customized' : ''; ?>">
								<div class="ria-color-preview" style="background-color: <?php echo esc_attr( RIA_Design_System_Output::resolve_css_variable( $data['value'] ) ); ?>"></div>
								<div class="ria-color-details">
									<label for="color-<?php echo esc_attr( $slug ); ?>">
										<strong><?php echo esc_html( $data['name'] ); ?></strong>
										<?php if ( isset( $data['is_override'] ) ) : ?>
											<span class="ria-badge">Customized</span>
										<?php endif; ?>
									</label>
									<div class="ria-color-controls">
										<input
											type="text"
											id="color-<?php echo esc_attr( $slug ); ?>"
											name="color-<?php echo esc_attr( $slug ); ?>"
											value="<?php echo esc_attr( RIA_Design_System_Output::resolve_css_variable( $data['value'] ) ); ?>"
											class="ria-color-picker"
											data-slug="<?php echo esc_attr( $slug ); ?>"
											data-default-value="<?php echo esc_attr( RIA_Design_System_Output::resolve_css_variable( $data['value'] ) ); ?>"
										/>
										<code class="ria-color-slug">--wp--custom--colors--<?php echo esc_html( $slug ); ?></code>
									</div>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>

				<!-- Actions -->
				<div class="ria-card">
					<div class="ria-actions-toolbar">
						<button type="button" id="ria-save-colors" class="button button-primary button-large">
							<span class="dashicons dashicons-saved"></span>
							<?php esc_html_e( 'Save All Changes', 'riapress' ); ?>
						</button>

						<button type="button" id="ria-reset-colors" class="button button-secondary">
							<span class="dashicons dashicons-image-rotate"></span>
							<?php esc_html_e( 'Reset to Defaults', 'riapress' ); ?>
						</button>

						<button type="button" id="ria-export-css" class="button">
							<span class="dashicons dashicons-download"></span>
							<?php esc_html_e( 'Export CSS', 'riapress' ); ?>
						</button>

						<div class="ria-save-status" style="display: none;"></div>
					</div>

					<div class="ria-help-text">
						<p>
							<strong><?php esc_html_e( 'Tip:', 'riapress' ); ?></strong>
							<?php esc_html_e( 'Click any color to edit it with the color picker. Your changes are stored in the database and will override theme.json defaults. Click "Reset to Defaults" to restore original colors from theme.json.', 'riapress' ); ?>
						</p>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Performance Tab
	 */
	private function render_performance_tab() {
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e( 'Performance Monitoring', 'riapress' ); ?></h2>
				<p><?php esc_html_e( 'Track and optimize your theme\'s performance.', 'riapress' ); ?></p>
			</div>

			<div class="ria-card">
				<h3><?php esc_html_e( 'Performance Status', 'riapress' ); ?></h3>
				<p class="description"><?php esc_html_e( 'RIAPress is built for performance with minimal CSS/JS and optimized delivery.', 'riapress' ); ?></p>

				<div class="recommendation-item recommendation-success">
					<span class="recommendation-icon">✓</span>
					<div class="recommendation-content">
						<h4><?php esc_html_e( 'Block-Based Theme', 'riapress' ); ?></h4>
						<p><?php esc_html_e( 'Using WordPress Full Site Editing for optimal performance.', 'riapress' ); ?></p>
					</div>
				</div>

				<div class="recommendation-item recommendation-success">
					<span class="recommendation-icon">✓</span>
					<div class="recommendation-content">
						<h4><?php esc_html_e( 'theme.json Configuration', 'riapress' ); ?></h4>
						<p><?php esc_html_e( 'Using modern theme.json for CSS variable management.', 'riapress' ); ?></p>
					</div>
				</div>

				<div class="recommendation-item recommendation-info">
					<span class="recommendation-icon">ℹ</span>
					<div class="recommendation-content">
						<h4><?php esc_html_e( 'Further Optimization', 'riapress' ); ?></h4>
						<p><?php esc_html_e( 'Consider using a caching plugin and CDN for even better performance.', 'riapress' ); ?></p>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Hooks Tab
	 */
	private function render_hooks_tab() {
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e( 'Theme Hooks Reference', 'riapress' ); ?></h2>
				<p><?php esc_html_e( 'RIAPress provides action hooks throughout the theme for custom development.', 'riapress' ); ?></p>
			</div>

			<div class="ria-card">
				<h3><?php esc_html_e( 'Available Hooks', 'riapress' ); ?></h3>
				<p class="description"><?php esc_html_e( 'Use these hooks in your child theme or custom plugin to extend theme functionality.', 'riapress' ); ?></p>

				<div class="hooks-list">
					<div class="hook-item">
						<code class="hook-name">riapress_before_header</code>
						<p><?php esc_html_e( 'Fires before the header template part.', 'riapress' ); ?></p>
					</div>
					<div class="hook-item">
						<code class="hook-name">riapress_after_header</code>
						<p><?php esc_html_e( 'Fires after the header template part.', 'riapress' ); ?></p>
					</div>
					<div class="hook-item">
						<code class="hook-name">riapress_before_content</code>
						<p><?php esc_html_e( 'Fires before the main content area.', 'riapress' ); ?></p>
					</div>
					<div class="hook-item">
						<code class="hook-name">riapress_after_content</code>
						<p><?php esc_html_e( 'Fires after the main content area.', 'riapress' ); ?></p>
					</div>
					<div class="hook-item">
						<code class="hook-name">riapress_before_footer</code>
						<p><?php esc_html_e( 'Fires before the footer template part.', 'riapress' ); ?></p>
					</div>
					<div class="hook-item">
						<code class="hook-name">riapress_after_footer</code>
						<p><?php esc_html_e( 'Fires after the footer template part.', 'riapress' ); ?></p>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Typography Tab
	 */
	private function render_typography_tab() {
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e( 'Typography Management', 'riapress' ); ?></h2>
				<p><?php esc_html_e( 'Manage fonts and typography settings.', 'riapress' ); ?></p>
			</div>

			<div class="ria-card">
				<h3><?php esc_html_e( 'Font Configuration', 'riapress' ); ?></h3>
				<p class="description"><?php esc_html_e( 'Fonts are configured in theme.json under settings.typography.fontFamilies.', 'riapress' ); ?></p>

				<div class="metric-info">
					<strong><?php esc_html_e( 'Current Configuration:', 'riapress' ); ?></strong> theme.json
				</div>

				<p style="margin-top: 20px;">
					<a href="<?php echo esc_url( admin_url( 'theme-editor.php?file=theme.json' ) ); ?>" class="button button-primary">
						<?php esc_html_e( 'Edit Font Settings', 'riapress' ); ?>
					</a>
				</p>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Blocks Tab
	 */
	private function render_blocks_tab() {
		$stats = RIA_Blocks_Manager::get_block_stats();
		$blocks_by_type = RIA_Blocks_Manager::get_blocks_by_type();
		$variant_blocks = RIA_Blocks_Manager::get_variant_blocks();
		$color_variants = RIA_Blocks_Manager::get_color_variants();

		// Handle search
		$search_query = isset( $_GET['s'] ) ? sanitize_text_field( $_GET['s'] ) : '';
		$filter_type = isset( $_GET['filter'] ) ? sanitize_text_field( $_GET['filter'] ) : 'all';

		if ( ! empty( $search_query ) ) {
			$blocks = RIA_Blocks_Manager::search_blocks( $search_query );
		} elseif ( $filter_type === 'variants' ) {
			$blocks = $variant_blocks;
		} elseif ( $filter_type !== 'all' ) {
			$blocks = $blocks_by_type[ $filter_type ] ?? array();
		} else {
			$blocks = RIA_Blocks_Manager::get_all_blocks();
		}
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e( 'Blocks Management', 'riapress' ); ?></h2>
				<p><?php esc_html_e( 'Manage all RIA custom blocks, color variants, and block categories.', 'riapress' ); ?></p>
			</div>

			<!-- Block Statistics -->
			<div class="ria-settings-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
				<div class="ria-card">
					<h3 style="margin:0;"><?php echo esc_html( $stats['total'] ); ?></h3>
					<p class="description" style="margin:5px 0 0;"><?php esc_html_e( 'Total Blocks', 'riapress' ); ?></p>
				</div>
				<div class="ria-card">
					<h3 style="margin:0;"><?php echo esc_html( $stats['ria_blocks'] ); ?></h3>
					<p class="description" style="margin:5px 0 0;"><?php esc_html_e( 'RIA Blocks', 'riapress' ); ?></p>
				</div>
				<div class="ria-card">
					<h3 style="margin:0;"><?php echo esc_html( $stats['with_variants'] ); ?></h3>
					<p class="description" style="margin:5px 0 0;"><?php esc_html_e( 'With Color Variants', 'riapress' ); ?></p>
				</div>
				<div class="ria-card">
					<h3 style="margin:0;"><?php echo esc_html( $stats['legacy'] ); ?></h3>
					<p class="description" style="margin:5px 0 0;"><?php esc_html_e( 'Legacy (RP)', 'riapress' ); ?></p>
				</div>
			</div>

			<!-- Atomic Design Breakdown -->
			<div class="ria-card" style="margin-top:20px;">
				<h3><?php esc_html_e( 'Atomic Design System', 'riapress' ); ?></h3>
				<div class="ria-metrics">
					<div class="metric-row">
						<span class="metric-label"><?php esc_html_e( 'Atoms', 'riapress' ); ?></span>
						<span class="metric-value"><?php echo esc_html( $stats['atoms'] ); ?></span>
					</div>
					<div class="metric-row">
						<span class="metric-label"><?php esc_html_e( 'Molecules', 'riapress' ); ?></span>
						<span class="metric-value"><?php echo esc_html( $stats['molecules'] ); ?></span>
					</div>
					<div class="metric-row">
						<span class="metric-label"><?php esc_html_e( 'Organisms', 'riapress' ); ?></span>
						<span class="metric-value"><?php echo esc_html( $stats['organisms'] ); ?></span>
					</div>
					<div class="metric-row">
						<span class="metric-label"><?php esc_html_e( 'Templates', 'riapress' ); ?></span>
						<span class="metric-value"><?php echo esc_html( $stats['templates'] ); ?></span>
					</div>
				</div>
			</div>

			<!-- Search and Filter -->
			<div class="ria-card" style="margin-top:20px;">
				<form method="get" action="">
					<input type="hidden" name="page" value="ria-design-system">
					<input type="hidden" name="tab" value="blocks">
					<div style="display:flex;gap:10px;align-items:center;">
						<input type="search" name="s" value="<?php echo esc_attr( $search_query ); ?>"
							placeholder="<?php esc_attr_e( 'Search blocks...', 'riapress' ); ?>"
							style="flex:1;">
						<select name="filter">
							<option value="all" <?php selected( $filter_type, 'all' ); ?>><?php esc_html_e( 'All Types', 'riapress' ); ?></option>
							<option value="atom" <?php selected( $filter_type, 'atom' ); ?>><?php esc_html_e( 'Atoms', 'riapress' ); ?></option>
							<option value="molecule" <?php selected( $filter_type, 'molecule' ); ?>><?php esc_html_e( 'Molecules', 'riapress' ); ?></option>
							<option value="organism" <?php selected( $filter_type, 'organism' ); ?>><?php esc_html_e( 'Organisms', 'riapress' ); ?></option>
							<option value="template" <?php selected( $filter_type, 'template' ); ?>><?php esc_html_e( 'Templates', 'riapress' ); ?></option>
							<option value="legacy" <?php selected( $filter_type, 'legacy' ); ?>><?php esc_html_e( 'Legacy', 'riapress' ); ?></option>
							<option value="variants" <?php selected( $filter_type, 'variants' ); ?>><?php esc_html_e( 'With Variants', 'riapress' ); ?></option>
						</select>
						<button type="submit" class="button"><?php esc_html_e( 'Filter', 'riapress' ); ?></button>
						<?php if ( ! empty( $search_query ) || $filter_type !== 'all' ) : ?>
							<a href="?page=ria-design-system&tab=blocks" class="button"><?php esc_html_e( 'Clear', 'riapress' ); ?></a>
						<?php endif; ?>
					</div>
				</form>
			</div>

			<!-- Blocks Table -->
			<div class="ria-card" style="margin-top:20px;">
				<h3><?php esc_html_e( 'Blocks List', 'riapress' ); ?> (<?php echo count( $blocks ); ?>)</h3>
				<table class="widefat striped">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Name', 'riapress' ); ?></th>
							<th><?php esc_html_e( 'Type', 'riapress' ); ?></th>
							<th><?php esc_html_e( 'Category', 'riapress' ); ?></th>
							<th><?php esc_html_e( 'Variant', 'riapress' ); ?></th>
							<th><?php esc_html_e( 'Attributes', 'riapress' ); ?></th>
							<th><?php esc_html_e( 'Version', 'riapress' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php if ( empty( $blocks ) ) : ?>
							<tr>
								<td colspan="6" style="text-align:center;padding:20px;">
									<?php esc_html_e( 'No blocks found matching your criteria.', 'riapress' ); ?>
								</td>
							</tr>
						<?php else : ?>
							<?php foreach ( $blocks as $block ) : ?>
								<tr>
									<td>
										<strong><?php echo esc_html( $block['title'] ); ?></strong><br>
										<code style="font-size:11px;color:#666;"><?php echo esc_html( $block['folder'] ); ?></code>
									</td>
									<td>
										<span class="dashicons dashicons-<?php
											echo $block['type'] === 'atom' ? 'marker' :
												( $block['type'] === 'molecule' ? 'admin-page' :
												( $block['type'] === 'organism' ? 'screenoptions' :
												( $block['type'] === 'template' ? 'layout' : 'archive' ) ) );
										?>" title="<?php echo esc_attr( ucfirst( $block['type'] ) ); ?>"></span>
										<?php echo esc_html( ucfirst( $block['type'] ) ); ?>
									</td>
									<td>
										<span class="dashicons dashicons-category"></span>
										<?php echo esc_html( $block['category'] ); ?>
									</td>
									<td>
										<?php if ( $block['has_variant'] ) : ?>
											<span style="display:inline-block;padding:2px 8px;background:#2271b1;color:#fff;border-radius:3px;font-size:11px;">
												<?php echo esc_html( $block['variant_default'] ); ?>
											</span>
										<?php else : ?>
											<span style="color:#999;">—</span>
										<?php endif; ?>
									</td>
									<td><?php echo esc_html( $block['attributes'] ); ?></td>
									<td><?php echo esc_html( $block['version'] ); ?></td>
								</tr>
							<?php endforeach; ?>
						<?php endif; ?>
					</tbody>
				</table>
			</div>

			<!-- Color Variants Reference -->
			<div class="ria-card" style="margin-top:20px;">
				<h3><?php esc_html_e( 'Color Variants System', 'riapress' ); ?></h3>
				<p class="description">
					<?php
					printf(
						esc_html__( '%d blocks currently support the color variant system. Available variants:', 'riapress' ),
						count( $variant_blocks )
					);
					?>
				</p>
				<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:15px;">
					<?php foreach ( $color_variants as $key => $variant ) : ?>
						<div style="padding:10px;border:1px solid #ddd;border-radius:4px;">
							<strong><?php echo esc_html( $variant['label'] ); ?></strong><br>
							<span style="font-size:11px;color:#666;"><?php echo esc_html( $variant['description'] ); ?></span>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render Export/Import Tab
	 */
	private function render_export_import_tab() {
		$backups = RIA_Settings_Export_Import::get_backups();
		?>
		<div class="ria-tab-panel">
			<div class="ria-tab-header">
				<h2><?php esc_html_e( 'Export & Import Settings', 'riapress' ); ?></h2>
				<p><?php esc_html_e( 'Backup, export, and import theme settings and configurations.', 'riapress' ); ?></p>
			</div>

			<!-- Export Section -->
			<div class="ria-card">
				<h3><?php esc_html_e( 'Export Settings', 'riapress' ); ?></h3>
				<p class="description">
					<?php esc_html_e( 'Download all theme settings as a JSON file. This includes design tokens, theme overrides, fonts, and performance settings.', 'riapress' ); ?>
				</p>
				<p style="margin-top:15px;">
					<button type="button" id="ria-export-settings" class="button button-primary">
						<span class="dashicons dashicons-download" style="margin-top:3px;"></span>
						<?php esc_html_e( 'Export Settings', 'riapress' ); ?>
					</button>
					<a href="<?php echo esc_url( admin_url( 'admin-post.php?action=ria_download_export&nonce=' . wp_create_nonce( 'ria_download_export' ) ) ); ?>"
					   class="button">
						<span class="dashicons dashicons-media-document" style="margin-top:3px;"></span>
						<?php esc_html_e( 'Direct Download', 'riapress' ); ?>
					</a>
				</p>
				<div id="ria-export-output" style="display:none;margin-top:15px;">
					<label>
						<strong><?php esc_html_e( 'Exported Settings:', 'riapress' ); ?></strong><br>
						<textarea id="ria-export-json" rows="10" style="width:100%;font-family:monospace;font-size:12px;" readonly></textarea>
					</label>
					<p>
						<button type="button" id="ria-copy-export" class="button">
							<?php esc_html_e( 'Copy to Clipboard', 'riapress' ); ?>
						</button>
					</p>
				</div>
			</div>

			<!-- Import Section -->
			<div class="ria-card" style="margin-top:20px;">
				<h3><?php esc_html_e( 'Import Settings', 'riapress' ); ?></h3>
				<p class="description">
					<?php esc_html_e( 'Import settings from a JSON file. A backup will be automatically created before import.', 'riapress' ); ?>
				</p>
				<div style="margin-top:15px;">
					<label>
						<input type="checkbox" id="ria-create-backup" checked>
						<?php esc_html_e( 'Create backup before import', 'riapress' ); ?>
					</label>
				</div>
				<div style="margin-top:15px;">
					<label>
						<strong><?php esc_html_e( 'Paste JSON or upload file:', 'riapress' ); ?></strong><br>
						<textarea id="ria-import-json" rows="10" style="width:100%;font-family:monospace;font-size:12px;"
							placeholder="<?php esc_attr_e( 'Paste exported JSON here...', 'riapress' ); ?>"></textarea>
					</label>
				</div>
				<p style="margin-top:10px;">
					<button type="button" id="ria-import-settings" class="button button-primary">
						<span class="dashicons dashicons-upload" style="margin-top:3px;"></span>
						<?php esc_html_e( 'Import Settings', 'riapress' ); ?>
					</button>
					<input type="file" id="ria-import-file" accept=".json" style="display:none;">
					<button type="button" id="ria-select-file" class="button">
						<span class="dashicons dashicons-media-document" style="margin-top:3px;"></span>
						<?php esc_html_e( 'Select File', 'riapress' ); ?>
					</button>
				</p>
				<div id="ria-import-result" style="display:none;margin-top:15px;"></div>
			</div>

			<!-- Backups Section -->
			<div class="ria-card" style="margin-top:20px;">
				<h3><?php esc_html_e( 'Automatic Backups', 'riapress' ); ?></h3>
				<p class="description">
					<?php
					printf(
						esc_html__( 'Backups are automatically created before imports. Last %d backups are kept.', 'riapress' ),
						5
					);
					?>
				</p>

				<?php if ( empty( $backups ) ) : ?>
					<p style="margin-top:15px;color:#999;">
						<?php esc_html_e( 'No backups available yet.', 'riapress' ); ?>
					</p>
				<?php else : ?>
					<table class="widefat striped" style="margin-top:15px;">
						<thead>
							<tr>
								<th><?php esc_html_e( 'Backup ID', 'riapress' ); ?></th>
								<th><?php esc_html_e( 'Created', 'riapress' ); ?></th>
								<th><?php esc_html_e( 'Actions', 'riapress' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php foreach ( array_reverse( $backups, true ) as $backup_id => $backup ) : ?>
								<tr>
									<td><code><?php echo esc_html( $backup_id ); ?></code></td>
									<td><?php echo esc_html( $backup['created_at'] ); ?></td>
									<td>
										<button type="button" class="button button-small ria-restore-backup" data-backup-id="<?php echo esc_attr( $backup_id ); ?>">
											<?php esc_html_e( 'Restore', 'riapress' ); ?>
										</button>
										<button type="button" class="button button-small ria-download-backup" data-backup-id="<?php echo esc_attr( $backup_id ); ?>">
											<?php esc_html_e( 'Download', 'riapress' ); ?>
										</button>
									</td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				<?php endif; ?>
			</div>

			<!-- What's Included -->
			<div class="ria-card" style="margin-top:20px;">
				<h3><?php esc_html_e( 'What\'s Included in Export?', 'riapress' ); ?></h3>
				<ul style="margin-left:20px;list-style:disc;">
					<li><?php esc_html_e( 'Design Tokens (colors, typography, spacing)', 'riapress' ); ?></li>
					<li><?php esc_html_e( 'Theme Overrides', 'riapress' ); ?></li>
					<li><?php esc_html_e( 'Custom Fonts', 'riapress' ); ?></li>
					<li><?php esc_html_e( 'Advanced Options', 'riapress' ); ?></li>
					<li><?php esc_html_e( 'Performance Settings', 'riapress' ); ?></li>
				</ul>
				<p style="margin-top:10px;"><strong><?php esc_html_e( 'Note:', 'riapress' ); ?></strong> <?php esc_html_e( 'Block content and posts are not included. Only theme configuration settings.', 'riapress' ); ?></p>
			</div>
		</div>
		<?php
	}
}

// Initialize the admin interface
new RIA_Design_System_Admin();
