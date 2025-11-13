document.addEventListener( 'DOMContentLoaded', () => {
	initMainMenuA11y();

	const windowWidth = window.innerWidth;
	const dropdownSubmenuToggle = document.querySelectorAll(
		'[data-dropdown-submenu-toggle]'
	);
	const isSubmenuItemA = document.querySelectorAll(
		'.is-submenu-item a, .is-submenu-item button'
	);

	dropdownSubmenuToggle.forEach( ( item ) => {
		item.addEventListener( 'click', toggleDropdownSubmenu );
		if ( windowWidth > 767 ) {
			item.addEventListener( 'blur', dropdownSubmenuCloseAria );
		}
	} );

	isSubmenuItemA.forEach( ( item ) => {
		if ( windowWidth > 767 ) {
			item.addEventListener( 'blur', blurDropdownSubmenuItem );
		}
	} );
} );

const initMainMenuA11y = () => {
	const dropdownMenus = document.querySelectorAll(
		'[data-a11y-dropdown-menu]'
	);
	dropdownMenus.forEach( ( menu, menuIndex ) => {
		const lisWithSubmenus = menu.querySelectorAll(
			'.is-dropdown-submenu-parent'
		);
		lisWithSubmenus.forEach( ( li, theIndex ) => {
			const buttons = li.querySelectorAll( 'button' );
			const submenus = li.querySelectorAll( '.submenu' );

			buttons.forEach( ( button, index ) => {
				button.setAttribute( 'aria-expanded', 'false' );
				button.setAttribute(
					'aria-controls',
					`menu_${ menuIndex }_submenu_${ theIndex }`
				);
				button.setAttribute(
					'id',
					`menu_${ menuIndex }_toggle_${ theIndex }`
				);
			} );

			submenus.forEach( ( submenu, index ) => {
				submenu.setAttribute(
					'aria-labelledby',
					`menu_${ menuIndex }_toggle_${ theIndex }`
				);
				submenu.setAttribute(
					'id',
					`menu_${ menuIndex }_submenu_${ theIndex }`
				);
			} );
		} );
	} );
};

const toggleDropdownSubmenu = ( e ) => {
	const button = e.target;
	const parentLi = button.parentNode;
	const submenu = parentLi.querySelector( '.submenu' );

	if ( parentLi.classList.contains( 'is-active' ) ) {
		parentLi.classList.remove( 'is-active' );
		submenu.classList.remove( 'dropdown-active' );
		button.setAttribute( 'aria-expanded', 'false' );
	} else {
		parentLi.classList.add( 'is-active' );
		submenu.classList.add( 'dropdown-active' );
		button.setAttribute( 'aria-expanded', 'true' );
	}
};

const dropdownSubmenuCloseAria = ( e ) => {
	const button = e.target;
	const parentLi = button.parentNode;
	const submenu = parentLi.querySelector( '.submenu' );

	if (
		e.relatedTarget === null ||
		! e.relatedTarget.parentElement.classList.contains( 'is-submenu-item' )
	) {
		parentLi.classList.remove( 'is-active' );
		submenu.classList.remove( 'dropdown-active' );
		button.setAttribute( 'aria-expanded', 'false' );
	}
};

const blurDropdownSubmenuItem = ( e ) => {
	if (
		e.relatedTarget !== null &&
		! e.relatedTarget.parentNode.classList.contains( 'is-submenu-item' )
	) {
		const item = e.target;
		const parentLi = item.parentElement.parentElement.parentElement;
		const parentButton = parentLi.querySelector( 'button' );
		const submenu = item.parentElement.parentElement;

		parentLi.classList.remove( 'is-active' );
		submenu.classList.remove( 'dropdown-active' );
		parentButton.setAttribute( 'aria-expanded', 'false' );
	}
};
