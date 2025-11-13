<?php
/**
 * Renders the offcanvas navigation block for the theme.
 *
 * @package RIAPress
 */

?>

<div <?php echo get_block_wrapper_attributes(); ?> 
	data-wp-interactive="zp/offcanvas-navigation"
	data-wp-context='{"isOpen": false, "lastFocusedElement": null}'
>
	<button type="button" 
		id="offcanvas-open-toggle" 
		class="offcanvas-toggle open" 
		data-wp-bind--aria-expanded="state.isOpen"
		data-wp-class--active="state.isOpen"
		data-wp-on-async--click="actions.openOffcanvas"
		aria-controls="offcanvas" 
		tabindex="0">
		<span class="screen-reader-text"><?php echo esc_html_x( 'Toggle offcanvas menu', 'Header offcanvas - Screen Reader Text', 'zp4' ); ?></span>
		
		<div class="offcanvas-icon">
			<span class="offcanvas-line line1"></span>
			<span class="offcanvas-line line2"></span>
		</div>
	</button>

	<div id="offcanvas" 
		class="offcanvas" 
		data-wp-class--hidden="!state.isOpen"
		role="dialog" 
		aria-label="<?php echo esc_attr_x( 'Off-canvas menu', 'Accessibility label', 'zp4' ); ?>"
		data-wp-on-async--click="actions.handleOutsideClick"
		aria-hidden="true">
		<div class="content-container" data-wp-class--slide-in="state.isOpen">

		
			<button type="button" 
				id="offcanvas-close-toggle" 
				class="offcanvas-toggle close" 
				data-wp-bind--aria-expanded="state.isOpen"
				data-wp-class--active="state.isOpen"
				data-wp-on-async--click="actions.closeOffcanvas"
				aria-controls="offcanvas" 
				tabindex="0">
				<span class="screen-reader-text"><?php echo esc_html_x( 'Toggle offcanvas menu', 'Header offcanvas - Screen Reader Text', 'zp4' ); ?></span>
				
				<div class="offcanvas-icon">
					<span class="offcanvas-line line1"></span>
					<span class="offcanvas-line line2"></span>
				</div>
			</button>

			<?php echo $content; ?>
		</div>
	</div> <!-- end .offcanvas -->
</div>
