/**
 * RIA Theme Helpers
 *
 * JavaScript utilities for accessing theme configuration in Gutenberg blocks.
 * These helpers make it easy to get theme defaults for colors, typography, spacing, etc.
 *
 * @package RIAPress
 * @since 1.0.0
 */

/**
 * Get the complete theme configuration
 * Available after wp.data is loaded in the block editor
 *
 * @return {Object} Complete theme configuration
 */
export function getThemeConfig() {
	if (typeof window.riaThemeConfig !== 'undefined') {
		return window.riaThemeConfig;
	}

	// Fallback defaults if config not loaded
	console.warn(
		'RIA Theme Config not found. Using fallback defaults. Make sure ria-theme-config.php is loaded.'
	);
	return getFallbackConfig();
}

/**
 * Get a specific theme value by path
 *
 * @param {string} path - Dot-notation path to value (e.g., 'colors.primary')
 * @param {*} defaultValue - Default value if path not found
 * @return {*} The theme value or default
 *
 * @example
 * // Get primary color
 * const primaryColor = getThemeValue('colors.primary', '#2563eb');
 *
 * // Get heading size
 * const h2Size = getThemeValue('typography.headingSizes.h2', 36);
 *
 * // Get spacing
 * const mediumSpacing = getThemeValue('spacing.medium', 16);
 */
export function getThemeValue(path, defaultValue = null) {
	const config = getThemeConfig();
	const keys = path.split('.');

	let value = config;
	for (const key of keys) {
		if (value && typeof value === 'object' && key in value) {
			value = value[key];
		} else {
			return defaultValue;
		}
	}

	return value;
}

/**
 * Get color palette
 *
 * @return {Object} Color definitions
 *
 * @example
 * const colors = getColors();
 * console.log(colors.primary); // '#2563eb'
 */
export function getColors() {
	return getThemeValue('colors', {});
}

/**
 * Get a specific color
 *
 * @param {string} colorName - Name of the color (e.g., 'primary', 'secondary')
 * @param {string} fallback - Fallback color if not found
 * @return {string} Hex color value
 *
 * @example
 * const primaryColor = getColor('primary');
 * const customColor = getColor('customBrand', '#ff0000');
 */
export function getColor(colorName, fallback = '#000000') {
	return getThemeValue(`colors.${colorName}`, fallback);
}

/**
 * Get typography configuration
 *
 * @return {Object} Typography settings
 */
export function getTypography() {
	return getThemeValue('typography', {});
}

/**
 * Get heading size
 *
 * @param {string|number} level - Heading level (1-6 or 'h1'-'h6')
 * @param {number} fallback - Fallback size in pixels
 * @return {number} Font size in pixels
 *
 * @example
 * const h2Size = getHeadingSize(2); // or getHeadingSize('h2')
 */
export function getHeadingSize(level, fallback = 24) {
	const headingLevel = typeof level === 'number' ? `h${level}` : level;
	return getThemeValue(
		`typography.headingSizes.${headingLevel}`,
		fallback
	);
}

/**
 * Get spacing configuration
 *
 * @return {Object} Spacing values
 */
export function getSpacing() {
	return getThemeValue('spacing', {});
}

/**
 * Get a specific spacing value
 *
 * @param {string} size - Size name (e.g., 'small', 'medium', 'large')
 * @param {number} fallback - Fallback value in pixels
 * @return {number} Spacing value in pixels
 *
 * @example
 * const mediumSpacing = getSpacingValue('medium'); // 16
 * const customSpacing = getSpacingValue('custom', 20);
 */
export function getSpacingValue(size, fallback = 16) {
	return getThemeValue(`spacing.${size}`, fallback);
}

/**
 * Get border configuration
 *
 * @return {Object} Border settings
 */
export function getBorders() {
	return getThemeValue('borders', {});
}

/**
 * Get border radius value
 *
 * @param {string} size - Size name (e.g., 'small', 'medium', 'large')
 * @param {number} fallback - Fallback value in pixels
 * @return {number} Border radius in pixels
 *
 * @example
 * const mediumRadius = getBorderRadius('medium'); // 8
 */
export function getBorderRadius(size, fallback = 8) {
	return getThemeValue(`borders.radius.${size}`, fallback);
}

/**
 * Get default border configuration
 *
 * @return {Object} Default border settings (width, color, style, radius)
 */
export function getDefaultBorder() {
	return getThemeValue('borders.default', {
		width: 1,
		color: '#e5e7eb',
		style: 'solid',
		radius: 8,
	});
}

/**
 * Get shadow configuration
 *
 * @return {Object} Shadow presets
 */
export function getShadows() {
	return getThemeValue('shadows', {});
}

/**
 * Get a specific box shadow
 *
 * @param {string} size - Shadow size (e.g., 'small', 'medium', 'large')
 * @param {string} fallback - Fallback CSS box-shadow value
 * @return {string} CSS box-shadow value
 *
 * @example
 * const mediumShadow = getShadow('medium');
 */
export function getShadow(size, fallback = 'none') {
	return getThemeValue(`shadows.${size}`, fallback);
}

/**
 * Get button configuration
 *
 * @return {Object} Button settings
 */
export function getButtonConfig() {
	return getThemeValue('buttons', {});
}

/**
 * Get button style configuration
 *
 * @param {string} style - Button style (e.g., 'primary', 'secondary', 'outline')
 * @return {Object} Button style settings (background, color, border)
 *
 * @example
 * const primaryStyle = getButtonStyle('primary');
 * console.log(primaryStyle.background); // '#2563eb'
 */
export function getButtonStyle(style) {
	return getThemeValue(`buttons.styles.${style}`, {
		background: '#2563eb',
		color: '#ffffff',
		border: '#2563eb',
	});
}

/**
 * Get default button settings
 *
 * @return {Object} Default button configuration
 */
export function getButtonDefaults() {
	return getThemeValue('buttons.defaults', {
		borderRadius: 6,
		borderWidth: 2,
		paddingX: 24,
		paddingY: 12,
		fontSize: 16,
		fontWeight: 500,
	});
}

/**
 * Get CSS variable name for a theme value
 *
 * @param {string} category - Category (e.g., 'color', 'spacing', 'font-size')
 * @param {string} name - Name of the value
 * @return {string} CSS variable name
 *
 * @example
 * const cssVar = getCSSVariable('color', 'primary'); // '--ria-color-primary'
 * const fontSize = getCSSVariable('font-size', 'h2'); // '--ria-font-size-h2'
 */
export function getCSSVariable(category, name) {
	return `--ria-${category}-${name}`;
}

/**
 * Get CSS variable value for a theme value
 *
 * @param {string} category - Category (e.g., 'color', 'spacing', 'font-size')
 * @param {string} name - Name of the value
 * @return {string} CSS var() expression
 *
 * @example
 * const colorStyle = { color: getCSSVar('color', 'primary') };
 * // Results in: { color: 'var(--ria-color-primary)' }
 */
export function getCSSVar(category, name) {
	return `var(${getCSSVariable(category, name)})`;
}

/**
 * Generate inline styles object with theme defaults
 *
 * @param {Object} overrides - Style overrides
 * @param {Object} themeDefaults - Theme default values to use
 * @return {Object} Complete style object
 *
 * @example
 * // Button with theme defaults
 * const buttonStyle = generateStyles(
 *   { fontSize: 18 }, // override
 *   {
 *     backgroundColor: getColor('primary'),
 *     color: getColor('white'),
 *     borderRadius: getBorderRadius('medium')
 *   }
 * );
 */
export function generateStyles(overrides = {}, themeDefaults = {}) {
	return {
		...themeDefaults,
		...overrides,
	};
}

/**
 * Fallback configuration if theme config not loaded
 * Matches the PHP defaults
 *
 * @return {Object} Fallback configuration
 */
function getFallbackConfig() {
	return {
		colors: {
			primary: '#2563eb',
			primaryDark: '#1d4ed8',
			primaryLight: '#eff6ff',
			secondary: '#6b7280',
			secondaryDark: '#4b5563',
			success: '#10b981',
			warning: '#f59e0b',
			error: '#ef4444',
			info: '#3b82f6',
			text: '#1f2937',
			textLight: '#6b7280',
			background: '#ffffff',
			backgroundGray: '#f9fafb',
			border: '#e5e7eb',
			black: '#000000',
			white: '#ffffff',
			transparent: 'transparent',
		},
		typography: {
			baseFontSize: 16,
			baseLineHeight: 1.6,
			headingSizes: {
				h1: 48,
				h2: 36,
				h3: 24,
				h4: 20,
				h5: 18,
				h6: 16,
			},
			fontWeights: {
				light: 300,
				normal: 400,
				medium: 500,
				semibold: 600,
				bold: 700,
			},
			lineHeights: {
				tight: 1.2,
				normal: 1.6,
				relaxed: 1.8,
			},
		},
		spacing: {
			none: 0,
			xs: 4,
			small: 8,
			medium: 16,
			large: 24,
			xl: 32,
			xxl: 48,
			'3xl': 64,
			'4xl': 80,
		},
		borders: {
			radius: {
				none: 0,
				small: 4,
				medium: 8,
				large: 16,
				xl: 24,
				full: 9999,
			},
			width: {
				none: 0,
				thin: 1,
				medium: 2,
				thick: 4,
			},
			default: {
				width: 1,
				color: '#e5e7eb',
				style: 'solid',
				radius: 8,
			},
		},
		shadows: {
			none: 'none',
			small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
			medium:
				'0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
			large: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
			xlarge:
				'0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
		},
		buttons: {
			styles: {
				primary: {
					background: '#2563eb',
					color: '#ffffff',
					border: '#2563eb',
				},
				secondary: {
					background: '#6b7280',
					color: '#ffffff',
					border: '#6b7280',
				},
				outline: {
					background: 'transparent',
					color: '#2563eb',
					border: '#2563eb',
				},
				text: {
					background: 'transparent',
					color: '#2563eb',
					border: 'transparent',
				},
			},
			defaults: {
				borderRadius: 6,
				borderWidth: 2,
				paddingX: 24,
				paddingY: 12,
				fontSize: 16,
				fontWeight: 500,
			},
		},
	};
}
