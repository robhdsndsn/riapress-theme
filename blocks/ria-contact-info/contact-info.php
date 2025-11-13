<?php
/**
 * RIA Contact Info Block
 *
 * Displays contact information with phone, email, address, and social links.
 *
 * @package RIA_Blocks
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-contact-info', 'ria-contact-info/build/', 'ria-contact-info' );
