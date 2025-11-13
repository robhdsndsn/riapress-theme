<?php
/**
 * RIA Notification Block
 *
 * Display alert/notice boxes with different types and icons
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

new RP_Custom_Block( 'ria-notification', 'ria-notification/build/', 'ria-notification' );
