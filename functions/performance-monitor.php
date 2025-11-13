<?php
/**
 * Performance Monitoring System
 *
 * Tracks theme performance metrics including file sizes, HTTP requests,
 * and provides optimization recommendations.
 *
 * @package RIAPress
 * @since 1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Performance Monitor Class
 */
class RP_Performance_Monitor {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		add_action( 'wp_footer', array( $this, 'track_frontend_metrics' ), 999 );
	}

	/**
	 * Add admin menu page
	 */
	public function add_admin_menu() {
		add_theme_page(
			__( 'Performance Monitor', 'riapress' ),
			__( 'Performance', 'riapress' ),
			'manage_options',
			'riapress-performance',
			array( $this, 'render_admin_page' )
		);
	}

	/**
	 * Enqueue admin assets
	 */
	public function enqueue_admin_assets( $hook ) {
		if ( 'appearance_page_riapress-performance' !== $hook ) {
			return;
		}

		wp_enqueue_style(
			'riapress-performance-admin',
			get_template_directory_uri() . '/assets/css/performance-admin.css',
			array(),
			'1.0.0'
		);
	}

	/**
	 * Get theme file size
	 *
	 * @return array File sizes in bytes and formatted
	 */
	public function get_theme_size() {
		$theme_dir = get_template_directory();
		$total_size = 0;
		$css_size = 0;
		$js_size = 0;
		$php_size = 0;

		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( $theme_dir, RecursiveDirectoryIterator::SKIP_DOTS )
		);

		foreach ( $iterator as $file ) {
			if ( $file->isFile() ) {
				$size = $file->getSize();
				$total_size += $size;

				$extension = strtolower( pathinfo( $file->getFilename(), PATHINFO_EXTENSION ) );

				switch ( $extension ) {
					case 'css':
						$css_size += $size;
						break;
					case 'js':
						$js_size += $size;
						break;
					case 'php':
						$php_size += $size;
						break;
				}
			}
		}

		return array(
			'total' => array(
				'bytes' => $total_size,
				'formatted' => size_format( $total_size ),
			),
			'css' => array(
				'bytes' => $css_size,
				'formatted' => size_format( $css_size ),
			),
			'js' => array(
				'bytes' => $js_size,
				'formatted' => size_format( $js_size ),
			),
			'php' => array(
				'bytes' => $php_size,
				'formatted' => size_format( $php_size ),
			),
		);
	}

	/**
	 * Count HTTP requests on homepage
	 *
	 * @return array HTTP request counts
	 */
	public function count_http_requests() {
		global $wp_scripts, $wp_styles;

		$scripts_count = ! empty( $wp_scripts->queue ) ? count( $wp_scripts->queue ) : 0;
		$styles_count = ! empty( $wp_styles->queue ) ? count( $wp_styles->queue ) : 0;

		return array(
			'scripts' => $scripts_count,
			'styles' => $styles_count,
			'total' => $scripts_count + $styles_count,
		);
	}

	/**
	 * Get optimization status
	 *
	 * @return array Optimization recommendations
	 */
	public function get_optimization_status() {
		$theme_size = $this->get_theme_size();
		$http_requests = $this->count_http_requests();

		$recommendations = array();
		$score = 100;

		// Check theme size (target: <15kb for core theme files, excluding blocks)
		$core_size_kb = ( $theme_size['php']['bytes'] + $theme_size['css']['bytes'] + $theme_size['js']['bytes'] ) / 1024;

		if ( $core_size_kb > 50 ) {
			$recommendations[] = array(
				'type' => 'warning',
				'title' => __( 'Theme Size', 'riapress' ),
				'message' => sprintf(
					/* translators: %s: file size */
					__( 'Core theme files are %s. Consider minifying CSS and JavaScript.', 'riapress' ),
					size_format( $core_size_kb * 1024 )
				),
			);
			$score -= 15;
		} elseif ( $core_size_kb > 30 ) {
			$recommendations[] = array(
				'type' => 'info',
				'title' => __( 'Theme Size', 'riapress' ),
				'message' => sprintf(
					/* translators: %s: file size */
					__( 'Core theme files are %s. Good, but can be optimized further.', 'riapress' ),
					size_format( $core_size_kb * 1024 )
				),
			);
			$score -= 5;
		} else {
			$recommendations[] = array(
				'type' => 'success',
				'title' => __( 'Theme Size', 'riapress' ),
				'message' => sprintf(
					/* translators: %s: file size */
					__( 'Core theme files are %s. Excellent!', 'riapress' ),
					size_format( $core_size_kb * 1024 )
				),
			);
		}

		// Check HTTP requests (target: <5 for critical resources)
		if ( $http_requests['total'] > 10 ) {
			$recommendations[] = array(
				'type' => 'warning',
				'title' => __( 'HTTP Requests', 'riapress' ),
				'message' => sprintf(
					/* translators: %d: number of requests */
					__( '%d HTTP requests detected. Consider combining CSS/JS files.', 'riapress' ),
					$http_requests['total']
				),
			);
			$score -= 20;
		} elseif ( $http_requests['total'] > 5 ) {
			$recommendations[] = array(
				'type' => 'info',
				'title' => __( 'HTTP Requests', 'riapress' ),
				'message' => sprintf(
					/* translators: %d: number of requests */
					__( '%d HTTP requests. Good, but can be reduced.', 'riapress' ),
					$http_requests['total']
				),
			);
			$score -= 10;
		} else {
			$recommendations[] = array(
				'type' => 'success',
				'title' => __( 'HTTP Requests', 'riapress' ),
				'message' => sprintf(
					/* translators: %d: number of requests */
					__( '%d HTTP requests. Excellent optimization!', 'riapress' ),
					$http_requests['total']
				),
			);
		}

		// Check if lazy loading is enabled
		if ( ! function_exists( 'wp_lazy_loading_enabled' ) || ! wp_lazy_loading_enabled( 'img', 'wp_get_attachment_image' ) ) {
			$recommendations[] = array(
				'type' => 'info',
				'title' => __( 'Lazy Loading', 'riapress' ),
				'message' => __( 'Enable lazy loading for images to improve initial page load.', 'riapress' ),
			);
			$score -= 10;
		}

		// Check if using local fonts
		$theme_json_path = get_template_directory() . '/theme.json';
		if ( file_exists( $theme_json_path ) ) {
			$theme_json = json_decode( file_get_contents( $theme_json_path ), true );

			if ( isset( $theme_json['settings']['typography']['fontFamilies'] ) ) {
				$has_remote_fonts = false;
				foreach ( $theme_json['settings']['typography']['fontFamilies'] as $font ) {
					if ( isset( $font['fontFamily'] ) && strpos( $font['fontFamily'], 'fonts.googleapis.com' ) !== false ) {
						$has_remote_fonts = true;
						break;
					}
				}

				if ( $has_remote_fonts ) {
					$recommendations[] = array(
						'type' => 'warning',
						'title' => __( 'Remote Fonts', 'riapress' ),
						'message' => __( 'Using Google Fonts from CDN. Switch to local fonts for better performance and GDPR compliance.', 'riapress' ),
					);
					$score -= 15;
				} else {
					$recommendations[] = array(
						'type' => 'success',
						'title' => __( 'Local Fonts', 'riapress' ),
						'message' => __( 'Using local fonts. Great for performance and GDPR!', 'riapress' ),
					);
				}
			}
		}

		return array(
			'score' => max( 0, $score ),
			'recommendations' => $recommendations,
		);
	}

	/**
	 * Get performance grade based on score
	 *
	 * @param int $score Performance score (0-100).
	 * @return string Grade (A, B, C, D, F)
	 */
	private function get_performance_grade( $score ) {
		if ( $score >= 90 ) {
			return 'A';
		} elseif ( $score >= 80 ) {
			return 'B';
		} elseif ( $score >= 70 ) {
			return 'C';
		} elseif ( $score >= 60 ) {
			return 'D';
		} else {
			return 'F';
		}
	}

	/**
	 * Track frontend metrics
	 */
	public function track_frontend_metrics() {
		if ( ! current_user_can( 'manage_options' ) || is_admin() ) {
			return;
		}

		// Output performance timing script
		?>
		<script>
		if (window.performance && window.performance.timing) {
			window.addEventListener('load', function() {
				var timing = window.performance.timing;
				var loadTime = timing.loadEventEnd - timing.navigationStart;
				var domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

				console.log('⚡ RIAPress Performance:');
				console.log('  Page Load Time: ' + (loadTime / 1000).toFixed(2) + 's');
				console.log('  DOM Ready: ' + (domReady / 1000).toFixed(2) + 's');
				console.log('  First Paint: ' + (timing.responseStart - timing.navigationStart) + 'ms');
			});
		}
		</script>
		<?php
	}

	/**
	 * Render admin page
	 */
	public function render_admin_page() {
		$theme_size = $this->get_theme_size();
		$http_requests = $this->count_http_requests();
		$optimization = $this->get_optimization_status();
		$grade = $this->get_performance_grade( $optimization['score'] );
		?>
		<div class="wrap riapress-performance-wrap">
			<h1><?php esc_html_e( 'RIAPress Performance Monitor', 'riapress' ); ?></h1>

			<div class="riapress-performance-grid">

				<!-- Performance Score Card -->
				<div class="riapress-card riapress-score-card">
					<h2><?php esc_html_e( 'Performance Score', 'riapress' ); ?></h2>
					<div class="riapress-score-display">
						<div class="riapress-score-circle grade-<?php echo esc_attr( strtolower( $grade ) ); ?>">
							<span class="score-number"><?php echo esc_html( $optimization['score'] ); ?></span>
							<span class="score-grade"><?php echo esc_html( $grade ); ?></span>
						</div>
						<p class="score-description">
							<?php
							if ( $optimization['score'] >= 90 ) {
								esc_html_e( 'Excellent! Your theme is highly optimized.', 'riapress' );
							} elseif ( $optimization['score'] >= 70 ) {
								esc_html_e( 'Good performance, but room for improvement.', 'riapress' );
							} else {
								esc_html_e( 'Performance needs optimization.', 'riapress' );
							}
							?>
						</p>
					</div>
				</div>

				<!-- Theme Size Card -->
				<div class="riapress-card">
					<h2><?php esc_html_e( 'Theme File Sizes', 'riapress' ); ?></h2>
					<div class="riapress-metrics">
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e( 'Total Theme Size:', 'riapress' ); ?></span>
							<span class="metric-value"><?php echo esc_html( $theme_size['total']['formatted'] ); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e( 'CSS Files:', 'riapress' ); ?></span>
							<span class="metric-value"><?php echo esc_html( $theme_size['css']['formatted'] ); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e( 'JavaScript Files:', 'riapress' ); ?></span>
							<span class="metric-value"><?php echo esc_html( $theme_size['js']['formatted'] ); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e( 'PHP Files:', 'riapress' ); ?></span>
							<span class="metric-value"><?php echo esc_html( $theme_size['php']['formatted'] ); ?></span>
						</div>
					</div>
				</div>

				<!-- HTTP Requests Card -->
				<div class="riapress-card">
					<h2><?php esc_html_e( 'HTTP Requests', 'riapress' ); ?></h2>
					<div class="riapress-metrics">
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e( 'Total Requests:', 'riapress' ); ?></span>
							<span class="metric-value"><?php echo esc_html( $http_requests['total'] ); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e( 'Stylesheets:', 'riapress' ); ?></span>
							<span class="metric-value"><?php echo esc_html( $http_requests['styles'] ); ?></span>
						</div>
						<div class="metric-row">
							<span class="metric-label"><?php esc_html_e( 'Scripts:', 'riapress' ); ?></span>
							<span class="metric-value"><?php echo esc_html( $http_requests['scripts'] ); ?></span>
						</div>
						<div class="metric-info">
							<p><strong><?php esc_html_e( 'Target:', 'riapress' ); ?></strong> <?php esc_html_e( '< 5 requests for optimal performance', 'riapress' ); ?></p>
						</div>
					</div>
				</div>

				<!-- Recommendations Card -->
				<div class="riapress-card riapress-recommendations-card">
					<h2><?php esc_html_e( 'Optimization Recommendations', 'riapress' ); ?></h2>
					<div class="riapress-recommendations">
						<?php foreach ( $optimization['recommendations'] as $recommendation ) : ?>
							<div class="recommendation-item recommendation-<?php echo esc_attr( $recommendation['type'] ); ?>">
								<div class="recommendation-icon">
									<?php
									switch ( $recommendation['type'] ) {
										case 'success':
											echo '✓';
											break;
										case 'warning':
											echo '⚠';
											break;
										case 'info':
											echo 'ℹ';
											break;
									}
									?>
								</div>
								<div class="recommendation-content">
									<h4><?php echo esc_html( $recommendation['title'] ); ?></h4>
									<p><?php echo esc_html( $recommendation['message'] ); ?></p>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>

				<!-- Performance Targets Card -->
				<div class="riapress-card riapress-targets-card">
					<h2><?php esc_html_e( 'Performance Targets', 'riapress' ); ?></h2>
					<div class="riapress-targets">
						<div class="target-item">
							<span class="target-label"><?php esc_html_e( 'PageSpeed Score', 'riapress' ); ?></span>
							<div class="target-bar">
								<div class="target-progress" style="width: <?php echo esc_attr( $optimization['score'] ); ?>%;"></div>
							</div>
							<span class="target-value"><?php echo esc_html( $optimization['score'] ); ?>/100</span>
						</div>
						<div class="targets-list">
							<h4><?php esc_html_e( 'Goals:', 'riapress' ); ?></h4>
							<ul>
								<li>
									<span class="<?php echo ( $theme_size['total']['bytes'] / 1024 ) < 50 ? 'target-met' : 'target-pending'; ?>">
										<?php esc_html_e( 'Core theme < 50KB', 'riapress' ); ?>
									</span>
								</li>
								<li>
									<span class="<?php echo $http_requests['total'] < 5 ? 'target-met' : 'target-pending'; ?>">
										<?php esc_html_e( '< 5 HTTP requests', 'riapress' ); ?>
									</span>
								</li>
								<li>
									<span class="<?php echo $optimization['score'] >= 90 ? 'target-met' : 'target-pending'; ?>">
										<?php esc_html_e( '90+ Performance Score', 'riapress' ); ?>
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

			</div>

			<div class="riapress-card riapress-help-card">
				<h2><?php esc_html_e( 'Performance Tips', 'riapress' ); ?></h2>
				<div class="performance-tips">
					<div class="tip">
						<h4><?php esc_html_e( '1. Optimize Images', 'riapress' ); ?></h4>
						<p><?php esc_html_e( 'Use WebP format and lazy loading for images. Enable WordPress native lazy loading.', 'riapress' ); ?></p>
					</div>
					<div class="tip">
						<h4><?php esc_html_e( '2. Minimize HTTP Requests', 'riapress' ); ?></h4>
						<p><?php esc_html_e( 'Combine CSS and JavaScript files. Use inline critical CSS for above-the-fold content.', 'riapress' ); ?></p>
					</div>
					<div class="tip">
						<h4><?php esc_html_e( '3. Use Local Fonts', 'riapress' ); ?></h4>
						<p><?php esc_html_e( 'Host fonts locally instead of loading from Google Fonts CDN. Reduces external requests and improves GDPR compliance.', 'riapress' ); ?></p>
					</div>
					<div class="tip">
						<h4><?php esc_html_e( '4. Enable Caching', 'riapress' ); ?></h4>
						<p><?php esc_html_e( 'Use a caching plugin like WP Rocket or W3 Total Cache for better performance.', 'riapress' ); ?></p>
					</div>
				</div>
			</div>

		</div>
		<?php
	}
}

// Initialize the performance monitor.
new RP_Performance_Monitor();
