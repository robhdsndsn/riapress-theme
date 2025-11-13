<?php
/**
 * RIA Icon Box Block
 *
 * Display an icon with heading and description
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

new RP_Custom_Block( 'ria-icon-box', 'ria-icon-box/build/', 'ria-icon-box' );
