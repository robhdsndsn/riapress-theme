/**
 * RIA Popover - Frontend JavaScript
 * Handles popover positioning, open/close, and interactions
 */

class RIAPopover {
	constructor(element) {
		this.wrapper = element;
		this.trigger = element.querySelector('.ria-popover-trigger');
		this.content = element.querySelector('.ria-popover-content');
		this.arrow = element.querySelector('.ria-popover-arrow');
		this.isOpen = false;

		// Get settings from data attributes
		this.position = element.dataset.position || 'bottom';
		this.align = element.dataset.align || 'center';
		this.width = element.dataset.width || '320px';
		this.offset = parseInt(element.dataset.offset) || 8;
		this.showArrow = element.dataset.showArrow === 'true';
		this.closeOnOutside = element.dataset.closeOutside !== 'false';
		this.closeOnEscape = element.dataset.closeEscape !== 'false';

		this.init();
	}

	init() {
		// Apply width
		this.content.style.width = this.width;

		// Bind events
		this.trigger.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.toggle();
		});

		// Close on outside click
		if (this.closeOnOutside) {
			document.addEventListener('click', (e) => {
				if (this.isOpen && !this.wrapper.contains(e.target)) {
					this.close();
				}
			});
		}

		// Close on escape key
		if (this.closeOnEscape) {
			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' && this.isOpen) {
					this.close();
				}
			});
		}

		// Close on scroll (optional)
		window.addEventListener('scroll', () => {
			if (this.isOpen) {
				this.updatePosition();
			}
		}, { passive: true });

		// Close on window resize
		window.addEventListener('resize', () => {
			if (this.isOpen) {
				this.updatePosition();
			}
		});
	}

	toggle() {
		if (this.isOpen) {
			this.close();
		} else {
			this.open();
		}
	}

	open() {
		this.isOpen = true;
		this.wrapper.classList.add('ria-popover--open');
		this.content.setAttribute('aria-hidden', 'false');
		this.trigger.setAttribute('aria-expanded', 'true');
		
		// Position the popover
		this.updatePosition();

		// Focus first focusable element
		setTimeout(() => {
			const focusable = this.content.querySelector('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
			if (focusable) {
				focusable.focus();
			}
		}, 10);
	}

	close() {
		this.isOpen = false;
		this.wrapper.classList.remove('ria-popover--open');
		this.content.setAttribute('aria-hidden', 'true');
		this.trigger.setAttribute('aria-expanded', 'false');
		
		// Return focus to trigger
		this.trigger.focus();
	}

	updatePosition() {
		const triggerRect = this.trigger.getBoundingClientRect();
		const contentRect = this.content.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		let top, left;

		// Calculate position based on setting
		switch (this.position) {
			case 'top':
				top = -(contentRect.height + this.offset);
				left = (triggerRect.width - contentRect.width) / 2;
				break;

			case 'top-start':
				top = -(contentRect.height + this.offset);
				left = 0;
				break;

			case 'top-end':
				top = -(contentRect.height + this.offset);
				left = triggerRect.width - contentRect.width;
				break;

			case 'bottom':
				top = triggerRect.height + this.offset;
				left = (triggerRect.width - contentRect.width) / 2;
				break;

			case 'bottom-start':
				top = triggerRect.height + this.offset;
				left = 0;
				break;

			case 'bottom-end':
				top = triggerRect.height + this.offset;
				left = triggerRect.width - contentRect.width;
				break;

			case 'left':
				top = (triggerRect.height - contentRect.height) / 2;
				left = -(contentRect.width + this.offset);
				break;

			case 'right':
				top = (triggerRect.height - contentRect.height) / 2;
				left = triggerRect.width + this.offset;
				break;

			default:
				top = triggerRect.height + this.offset;
				left = (triggerRect.width - contentRect.width) / 2;
		}

		// Apply position
		this.content.style.top = `${top}px`;
		this.content.style.left = `${left}px`;

		// Smart positioning - adjust if out of viewport
		const absoluteRect = this.content.getBoundingClientRect();
		
		// Check right edge
		if (absoluteRect.right > viewportWidth - 10) {
			const adjustment = absoluteRect.right - viewportWidth + 20;
			left -= adjustment;
			this.content.style.left = `${left}px`;
		}

		// Check left edge
		if (absoluteRect.left < 10) {
			const adjustment = 10 - absoluteRect.left;
			left += adjustment;
			this.content.style.left = `${left}px`;
		}

		// Check top edge
		if (absoluteRect.top < 10) {
			// Flip to bottom if positioned on top
			if (this.position.startsWith('top')) {
				top = triggerRect.height + this.offset;
				this.content.style.top = `${top}px`;
			}
		}

		// Check bottom edge
		if (absoluteRect.bottom > viewportHeight - 10) {
			// Flip to top if positioned on bottom
			if (this.position.startsWith('bottom')) {
				top = -(contentRect.height + this.offset);
				this.content.style.top = `${top}px`;
			}
		}

		// Position arrow if it exists
		if (this.arrow && this.showArrow) {
			this.positionArrow();
		}
	}

	positionArrow() {
		const triggerRect = this.trigger.getBoundingClientRect();
		const contentRect = this.content.getBoundingClientRect();

		// Remove previous positioning
		this.arrow.style.removeProperty('top');
		this.arrow.style.removeProperty('bottom');
		this.arrow.style.removeProperty('left');
		this.arrow.style.removeProperty('right');

		if (this.position.startsWith('top')) {
			this.arrow.classList.add('ria-popover-arrow--bottom');
			this.arrow.style.left = '50%';
			this.arrow.style.transform = 'translateX(-50%)';
		} else if (this.position.startsWith('bottom')) {
			this.arrow.classList.add('ria-popover-arrow--top');
			this.arrow.style.left = '50%';
			this.arrow.style.transform = 'translateX(-50%)';
		} else if (this.position === 'left') {
			this.arrow.classList.add('ria-popover-arrow--right');
			this.arrow.style.top = '50%';
			this.arrow.style.transform = 'translateY(-50%)';
		} else if (this.position === 'right') {
			this.arrow.classList.add('ria-popover-arrow--left');
			this.arrow.style.top = '50%';
			this.arrow.style.transform = 'translateY(-50%)';
		}
	}
}

// Initialize all popovers on page load
document.addEventListener('DOMContentLoaded', () => {
	const popovers = document.querySelectorAll('.ria-popover-wrapper');
	popovers.forEach(popover => {
		new RIAPopover(popover);
	});
});

// Export for programmatic access
window.RIAPopover = RIAPopover;
