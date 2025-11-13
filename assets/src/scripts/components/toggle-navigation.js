// console.log('global.js loaded');
const initToggleNavigation = () => {
	const navigation = document.querySelector( '#navigation' );
	let viewportWidth =
		window.innerWidth || document.documentElement.clientWidth;
	const toggle = document.querySelector( '#navigation-toggle' );

	const updateNavigationClass = () => {
		if ( viewportWidth < 767 ) {
			navigation.classList.add( 'navigation-mobile' );
		} else {
			navigation.classList.remove( 'navigation-mobile' );
		}
	};

	updateNavigationClass();

	window.addEventListener( 'resize', () => {
		viewportWidth =
			window.innerWidth || document.documentElement.clientWidth;
		updateNavigationClass();
	} );

	toggle.setAttribute( 'aria-expanded', 'false' );
	toggle.addEventListener( 'click', () => {
		const isExpanded = toggle.getAttribute( 'aria-expanded' ) === 'true';
		toggle.classList.toggle( 'active', ! isExpanded );
		toggle.setAttribute( 'aria-expanded', ! isExpanded ? 'true' : 'false' );
		document
			.querySelector( 'body' )
			.classList.toggle( 'navigation-active', ! isExpanded );
		document
			.querySelector( '.navigation-mobile' )
			.classList.toggle( 'navigation-active', ! isExpanded );
	} );
};

window.addEventListener( 'load', initToggleNavigation );
