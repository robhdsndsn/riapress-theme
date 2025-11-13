<?php
/**
 * RIA Breadcrumb Block
 *
 * Registers the block using the metadata loaded from the `block.json` file.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

new RP_Custom_Block('ria-breadcrumb', 'ria-breadcrumb/build/', 'ria-breadcrumb');
