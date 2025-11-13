<?php
/**
 * RIA Separator Block
 *
 * Registers the block using the metadata loaded from the `block.json` file.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

new RP_Custom_Block('ria-separator', 'ria-separator/build/', 'ria-separator');