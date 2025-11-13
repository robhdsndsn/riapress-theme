<?php
/**
 * RIA Accordion Item Block
 *
 * Individual accordion item that can contain any blocks
 * Must be used inside the ria/accordion parent block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

new RP_Custom_Block( 'ria-accordion-item', 'ria-accordion-item/build/', 'ria-accordion' );
