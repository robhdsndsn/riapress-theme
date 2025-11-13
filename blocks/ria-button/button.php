<?php
/**
 * RIA Button Block
 *
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

new RP_Custom_Block('ria-button', 'ria-button/build/', 'ria-button');
