/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

function generateRandomId(length = 10) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

function setAccordionCookie(accordionId, isOpen) {
	console.log(`Setting cookie for accordionId: ${accordionId}, isOpen: ${isOpen}`);
	document.cookie = `rp_accordion_${accordionId}=${isOpen ? '1' : '0'}; path=/; SameSite=Lax`;
}

function getOrSetAccordionId(toggle) {
	// Only get the data-accordion-id set server-side in render.php
	return toggle.getAttribute('data-accordion-id');
}

/**
 * initAccordions
 */
function initAccordions() {
	const accordionGroups = document.querySelectorAll('.wp-block-rp-accordions');
	accordionGroups.forEach((parent, groupIndex) => {
		const accordionToggles = parent.querySelectorAll('.wp-block-rp-accordion .accordion-toggle');
		accordionToggles.forEach((toggle) => {
			const accordionId = getOrSetAccordionId(toggle);
			console.log('Accordion toggle found with data-accordion-id:', accordionId);
			// IDs for accessibility (optional, not used for state)
			const uniqueId = generateRandomId();
			toggle.id = `accordion-header-${uniqueId}`;
			toggle.nextElementSibling.id = `accordion-panel-${uniqueId}`;

			toggle.onclick = function () {
				const isActive = this.classList.toggle('is-active');
				this.nextElementSibling.classList.toggle('is-active');
				this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
				console.log(`Toggled accordionId: ${accordionId}, new state: ${isActive}`);
				setAccordionCookie(accordionId, isActive);
			};
		});
	});
}

window.addEventListener(
	'load',
	function () {
		initAccordions();
	},
	false
);
