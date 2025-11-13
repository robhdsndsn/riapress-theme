<?php
/**
 * RIA Event Card Block
 *
 * Display event information with dates, location, registration, metadata, and multiple layouts.
 * Supports signature events, status badges, speakers, organizers, topics, and capacity tracking.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-event-card', 'ria-event-card/build/', 'ria-event-card' );
