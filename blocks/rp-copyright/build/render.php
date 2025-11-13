<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $attributes['fontSizeClass'] ) );
$siteTitle          = $attributes['siteTitle'];
$currentYear        = date( 'Y' );

?>

<p <?php echo $wrapper_attributes; ?>>
	<span class="current-year">@ <?php echo $currentYear ?> </span>
	<span class="site-name"><?php echo $siteTitle; ?></span>
</p>
