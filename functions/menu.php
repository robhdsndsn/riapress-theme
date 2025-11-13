<?php

class RIAPRESS_MENUS {
	const HEADER_FLAT_NAV = 'header-flat-nav';
	const HEADER_DROPDOWN_NAV = 'header-dropdown-nav';
	const FOOTER_NAV = 'footer-nav';
}

// Register menus
register_nav_menus(
	array(
		RIAPRESS_MENUS::HEADER_FLAT_NAV     => __( 'Header Flat Menu', 'zp' ),
		RIAPRESS_MENUS::HEADER_DROPDOWN_NAV => __( 'Header Dropdown Menu', 'zp' ),
		RIAPRESS_MENUS::FOOTER_NAV          => __( 'Footer Menu', 'zp' )
	)
);

// Header Flat Menu
function riapress_header_flat_nav() {
	wp_nav_menu( array(
		'container'      => false,
		'menu_class'     => 'menu',
		'items_wrap'     => '<ul id="header_flat_menu" class="%2$s">%3$s</ul>',
		'theme_location' => RIAPRESS_MENUS::HEADER_FLAT_NAV,
		'depth'          => 1,
		'fallback_cb'    => ''
	) );
}

// Main Menu
function riapress_header_dropdown_nav() {
	wp_nav_menu( array(
		'container'      => false,
		'menu_class'     => 'dropdown menu',
		'items_wrap'     => '<ul id="header_dropdown_menu" class="%2$s" data-a11y-dropdown-menu>%3$s</ul>',
		'theme_location' => RIAPRESS_MENUS::HEADER_DROPDOWN_NAV,
		'depth'          => 2,
		'fallback_cb'    => false,
		'walker'         => new Accessible_Dropdown_Menu_Walker()
	) );
}

class Accessible_Dropdown_Menu_Walker extends Walker_Nav_Menu {
	function start_lvl( &$output, $depth = 0, $args = array() ) {
		$indent = str_repeat( "\t", $depth );
		$output .= "\n$indent<ul class=\"menu submenu\">\n";
	}

	/**
	 * Starts the element output.
	 *
	 * @param string $output Used to append additional content (passed by reference).
	 * @param WP_Post $item Menu item data object.
	 * @param int $depth Depth of menu item. Used for padding.
	 * @param stdClass $args An object of wp_nav_menu() arguments.
	 * @param int $id Current item ID.
	 *
	 * @see Walker::start_el()
	 *
	 * @since 3.0.0
	 * @since 4.4.0 The {@see 'nav_menu_item_args'} filter was added.
	 *
	 */
	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		if ( isset( $args->item_spacing ) && 'discard' === $args->item_spacing ) {
			$t = '';
			$n = '';
		} else {
			$t = "\t";
			$n = "\n";
		}
		$indent = ( $depth ) ? str_repeat( $t, $depth ) : '';

		$classes = empty( $item->classes ) ? array() : (array) $item->classes;

		if ( $args->walker->has_children ) {
			$classes[] = 'is-dropdown-submenu-parent';
		}

		if ( in_array( 'resources-section', $classes ) ) {
			if ( is_singular( 'post' ) || is_singular( BR_CASE_STUDIES::SLUG ) ) {
				$classes[] = 'active';
			}
		}

		$classes[] = 'menu-item-' . $item->ID;
		if ( $depth > 0 ) {
//			$classes[] = 'depth-' . $depth;
			$classes[] = 'is-submenu-item';
		}

		/**
		 * Filters the arguments for a single nav menu item.
		 *
		 * @param stdClass $args An object of wp_nav_menu() arguments.
		 * @param WP_Post $item Menu item data object.
		 * @param int $depth Depth of menu item. Used for padding.
		 *
		 * @since 4.4.0
		 *
		 */
		$args = apply_filters( 'nav_menu_item_args', $args, $item, $depth );

		/**
		 * Filters the CSS classes applied to a menu item's list item element.
		 *
		 * @param string[] $classes Array of the CSS classes that are applied to the menu item's `<li>` element.
		 * @param WP_Post $item The current menu item.
		 * @param stdClass $args An object of wp_nav_menu() arguments.
		 * @param int $depth Depth of menu item. Used for padding.
		 *
		 * @since 3.0.0
		 * @since 4.1.0 The `$depth` parameter was added.
		 *
		 */
		$class_names = implode( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

		/**
		 * Filters the ID applied to a menu item's list item element.
		 *
		 * @param string $menu_id The ID that is applied to the menu item's `<li>` element.
		 * @param WP_Post $item The current menu item.
		 * @param stdClass $args An object of wp_nav_menu() arguments.
		 * @param int $depth Depth of menu item. Used for padding.
		 *
		 * @since 3.0.1
		 * @since 4.1.0 The `$depth` parameter was added.
		 *
		 */
		$id = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

		$output .= $indent . '<li' . $id . $class_names . '>';

		$atts           = array();
		$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
		$atts['target'] = ! empty( $item->target ) ? $item->target : '';
		if ( '_blank' === $item->target && empty( $item->xfn ) ) {
			$atts['rel'] = 'noopener';
		} else {
			$atts['rel'] = $item->xfn;
		}
		$atts['href']         = ! empty( $item->url ) ? $item->url : '';
		$atts['aria-current'] = $item->current ? 'page' : '';

		/**
		 * Filters the HTML attributes applied to a menu item's anchor element.
		 *
		 * @param array $atts {
		 *     The HTML attributes applied to the menu item's `<a>` element, empty strings are ignored.
		 *
		 * @type string $title Title attribute.
		 * @type string $target Target attribute.
		 * @type string $rel The rel attribute.
		 * @type string $href The href attribute.
		 * @type string $aria-current The aria-current attribute.
		 * }
		 *
		 * @param WP_Post $item The current menu item.
		 * @param stdClass $args An object of wp_nav_menu() arguments.
		 * @param int $depth Depth of menu item. Used for padding.
		 *
		 * @since 3.6.0
		 * @since 4.1.0 The `$depth` parameter was added.
		 *
		 */
		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

		$attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( is_scalar( $value ) && '' !== $value && false !== $value ) {
				$value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				if ( ! $args->walker->has_children ) {
					$attributes .= ' ' . $attr . '="' . $value . '"';
				}
			}
		}

		/** This filter is documented in wp-includes/post-template.php */
		$title = apply_filters( 'the_title', $item->title, $item->ID );

		/**
		 * Filters a menu item's title.
		 *
		 * @param string $title The menu item's title.
		 * @param WP_Post $item The current menu item.
		 * @param stdClass $args An object of wp_nav_menu() arguments.
		 * @param int $depth Depth of menu item. Used for padding.
		 *
		 * @since 4.4.0
		 *
		 */
		$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

		$item_output = $args->before;

		if ( $args->walker->has_children ) {
			$item_output .= '<button data-dropdown-submenu-toggle aira-label="' . _x( 'This toggles the submenu for', 'dropdown menu toggle aria label', 'zp' ) . ' ' . $title . '" ' . $attributes . '>';
		} else {
			$item_output .= '<a' . $attributes . '>';
		}
		$item_output .= $args->link_before . $title . $args->link_after;
		if ( $args->walker->has_children ) {
			$item_output .= '</button>';
		} else {
			$item_output .= '</a>';

		}
		$item_output .= $args->after;

		/**
		 * Filters a menu item's starting output.
		 *
		 * The menu item's starting output only includes `$args->before`, the opening `<a>`,
		 * the menu item's title, the closing `</a>`, and `$args->after`. Currently, there is
		 * no filter for modifying the opening and closing `<li>` for a menu item.
		 *
		 * @param string $item_output The menu item's starting HTML output.
		 * @param WP_Post $item Menu item data object.
		 * @param int $depth Depth of menu item. Used for padding.
		 * @param stdClass $args An object of wp_nav_menu() arguments.
		 *
		 * @since 3.0.0
		 *
		 */
		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}
}

// Footer Menu
function riapress_footer_nav() {
	wp_nav_menu( array(
		'container'      => false,
		'menu_class'     => 'menu',
		'menu_id'        => 'footer_menu',
		'theme_location' => RIAPRESS_MENUS::FOOTER_NAV,
		'depth'          => 0,
		'fallback_cb'    => ''
	) );
}
