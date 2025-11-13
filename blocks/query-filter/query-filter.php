<?php
/**
 * Plugin Name:       Gregius Query Filter
 * Description:       Query filter for query block.
 * Version:           0.1.0
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Author:            Gregius team
 * Author URI:        https://gregius.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gregius-query-filter
 *
 * @package           gregius-query-filter
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}


new RP_Custom_Block(
	array(
		'query-active-filters',
		'query-clear',
		'query-keyword',
		'query-taxonomy',
		'query-sort-by'
	),
	array(
		'query-filter/build/query-active-filters',
		'query-filter/build/query-clear',
		'query-filter/build/query-keyword',
		'query-filter/build/query-taxonomy',
		'query-filter/build/query-sort-by',
	),
	'query-filter'
);
// Include helper functions
require_once __DIR__ . '/includes/functions.php';

// Initialize
add_action( 'init', 'bootstrap' );

