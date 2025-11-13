<?php
/**
 * RIA Tag Block
 *
 * Registers the block using the metadata loaded from the `block.json` file.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

new RP_Custom_Block('ria-tag', 'ria-tag/build/', 'ria-tag');
