<?php
/**
 * @package rp
 * Theme functions for the riapress theme.
 * For more info: https://developer.wordpress.org/themes/basics/theme-functions/
 */

/**
 * Helper to help debug stuff.
 *
 * @param mixed $debug - the data you want to debug
 * @param bool  $die true to die after debug
 * @param bool  $vardump true to make it var_dump() instead of print_r()
 * @param bool  $admin true to display the debug output in admin area
 */
function zdebug( $debug, $die = false, $vardump = false, $admin = false ) {

	if ( $admin ) {
		echo '<pre style="margin-left:170px; color: black!important; background-color: white!important;">';
	} else {
		echo '<pre style="color: black!important; background-color: white!important; outline: 1px solid black!important;">';
	}
	if ( true === $vardump ) {
		var_dump( $debug );
	} else {
		print_r( $debug );
	}
	echo '</pre>';
	if ( $die ) {
		die;
	}
}

// Classes.
require_once get_template_directory() . '/classes/class-rp-custom-block.php';

// Register scripts and stylesheets.
require_once get_template_directory() . '/functions/enqueue-scripts.php';
// Block animations system.
require_once get_template_directory() . '/functions/block-animations.php';
// Register custom menus and menu walkers.
//require_once get_template_directory() . '/functions/menu.php';
// Theme Support.
require_once get_template_directory() . '/functions/theme-support.php';
// Tracking Support.
require_once get_template_directory() . '/functions/tracking-support.php';
// Gutenberg Related Theme Support.
require_once get_template_directory() . '/functions/gutenberg-support.php';
// RIA Design System - Theme Configuration.
require_once get_template_directory() . '/functions/ria-theme-config.php';
// RIA Design System - Admin Interface.
require_once get_template_directory() . '/functions/ria-design-system.php';
// RIA Design System - Settings API.
require_once get_template_directory() . '/functions/ria-design-system-settings.php';
// RIA Design System - Blocks Manager.
require_once get_template_directory() . '/functions/ria-blocks-manager.php';
// RIA Design System - Settings Export/Import.
require_once get_template_directory() . '/functions/ria-settings-export-import.php';
// RIA Design System - CSS Output.
require_once get_template_directory() . '/functions/ria-design-system-output.php';
// Performance Monitoring System.
require_once get_template_directory() . '/functions/performance-monitor.php';
// Image Sizes.
require_once get_template_directory() . '/functions/image-sizes.php';
// Post Types.
require_once get_template_directory() . '/functions/client/courses/class-rp-courses.php';
// Disabled Events, but keeping logic in case for future use.
//require_once get_template_directory() . '/functions/client/events/class-rp-events.php';
require_once get_template_directory() . '/functions/client/resources/class-rp-resources.php';
