<?php
/**
 * Server-side rendering for the rp-accordion block.
 *
 * @package rp-accordions
 */

$intro         = isset( $attributes['intro'] ) ? $attributes['intro'] : '';
$heading_level = isset( $attributes['headingLevel'] ) ? intval( $attributes['headingLevel'] ) : 2;
$heading_tag   = 'h' . $heading_level;

// Get fontSize from attributes or context.
$font_size = isset( $attributes['fontSize'] ) ? $attributes['fontSize'] : '';
if ( empty( $font_size ) && isset( $block ) && isset( $block->context['zp/accordions/fontSize'] ) ) {
	$font_size = $block->context['zp/accordions/fontSize'];
}

// Prepare inline style for fontSize.
$font_size_style = '';
if ( ! empty( $font_size ) ) {
	// If it's a number, add 'px' suffix, otherwise use as-is for values like '1.5rem'.
	$font_size_css   = is_numeric( $font_size ) ? $font_size . 'px' : $font_size;
	$font_size_style = ' style="font-size: ' . $font_size_css . ';"';
}

$accordion_id = isset( $attributes['accordionId'] ) ? $attributes['accordionId'] : '';

// Generate a unique and stable accordion ID if not provided.
if ( empty( $accordion_id ) ) {
	// Use a hash of the block's anchor, intro, or fallback to a random string.
	if ( ! empty( $attributes['anchor'] ) ) {
		$accordion_id = sanitize_title( $attributes['anchor'] );
	} elseif ( ! empty( $intro ) ) {
		$accordion_id = 'acc_' . substr( md5( $intro ), 0, 8 );
	} else {
		$accordion_id = 'acc_' . wp_generate_password( 8, false, false );
	}
}
$cookie_name         = 'rp_accordion_' . $accordion_id;
$open_all_by_default = false;
if ( isset( $block ) && isset( $block->context['zp/accordions/openAllByDefault'] ) ) {
	$open_all_by_default = (bool) $block->context['zp/accordions/openAllByDefault'];
}
$open = $open_all_by_default;
if ( $accordion_id && isset( $_COOKIE[ $cookie_name ] ) ) {
	$open = $_COOKIE[ $cookie_name ] === '1';
}

// Get fontSize class from block wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes();
$font_size_class    = '';
if ( preg_match( '/has-[a-z-]+-font-size/', $wrapper_attributes, $matches ) ) {
	$font_size_class = $matches[0];
}

$heading_classes = 'accordion-intro ' . $font_size_class;
$button_classes  = 'accordion-toggle' . ( $open ? ' is-active' : '' );
$panel_classes   = 'accordion-content' . ( $open ? ' is-active' : '' );
$header_id       = 'accordion-header-' . $accordion_id;
$panel_id        = 'accordion-panel-' . $accordion_id;

?>
<div class="wp-block-rp-accordion">
	<button type="button"
		class="<?php echo esc_attr( $button_classes ); ?>"
		id="<?php echo esc_attr( $header_id ); ?>"
		aria-expanded="<?php echo $open ? 'true' : 'false'; ?>"
		data-accordion-header="true"
		data-accordion-id="<?php echo esc_attr( $accordion_id ); ?>" <?php echo $font_size_style; ?>>
		<span class="accordion-icon"></span>
		<<?php echo esc_html( $heading_tag ); ?> class="<?php echo esc_attr( $heading_classes ); ?>" <?php echo $font_size_style ; ?>>
			<?php
			echo wp_kses(
				$intro,
				array(
					'strong' => array(),
					'em'     => array(),
				)
			);
			?>
		</<?php echo esc_html( $heading_tag ); ?>>
	</button>
	<div id="<?php echo esc_attr( $panel_id ); ?>" class="<?php echo esc_attr( $panel_classes ); ?>"<?php echo $open ? '' : ' hidden'; ?>>
		<?php echo $content; ?>
	</div>
</div>
