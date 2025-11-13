/**
 * RIA Modal - Frontend JavaScript
 *
 * Handles modal open/close functionality, keyboard navigation,
 * focus management, and accessibility features.
 */

(function() {
	'use strict';

	// Track active modal
	let activeModal = null;
	let previousFocusElement = null;
	let focusableElements = [];
	let firstFocusableElement = null;
	let lastFocusableElement = null;

	/**
	 * Initialize all modal blocks on the page
	 */
	function initModals() {
		const modalBlocks = document.querySelectorAll('.wp-block-ria-modal');

		modalBlocks.forEach((block) => {
			const trigger = block.querySelector('.modal-trigger');
			const overlay = block.querySelector('.modal-overlay');
			const modal = block.querySelector('.modal-content');
			const closeButton = block.querySelector('.modal-close');
			const config = JSON.parse(block.dataset.modalConfig || '{}');

			if (!trigger || !overlay || !modal) {
				console.warn('RIA Modal: Missing required elements', block);
				return;
			}

			// Trigger click - open modal
			trigger.addEventListener('click', (e) => {
				e.preventDefault();
				openModal(block, overlay, modal, config);
			});

			// Trigger keyboard support - open modal
			trigger.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					openModal(block, overlay, modal, config);
				}
			});

			// Close button click
			if (closeButton) {
				closeButton.addEventListener('click', (e) => {
					e.preventDefault();
					closeModal(block, overlay, modal, config);
				});

				// Close button keyboard support
				closeButton.addEventListener('keydown', (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						closeModal(block, overlay, modal, config);
					}
				});
			}

			// Overlay click (if enabled)
			if (config.closeOnOverlayClick !== false) {
				overlay.addEventListener('click', (e) => {
					// Only close if clicking the overlay itself, not modal content
					if (e.target === overlay) {
						closeModal(block, overlay, modal, config);
					}
				});
			}

			// Escape key (if enabled)
			if (config.closeOnEscape !== false) {
				document.addEventListener('keydown', (e) => {
					if (e.key === 'Escape' && activeModal === block) {
						closeModal(block, overlay, modal, config);
					}
				});
			}

			// Process special content types
			processModalContent(modal, block);
		});
	}

	/**
	 * Open modal
	 */
	function openModal(block, overlay, modal, config) {
		// Store previously focused element
		previousFocusElement = document.activeElement;

		// Show overlay
		overlay.classList.add('active');
		overlay.setAttribute('aria-hidden', 'false');

		// Apply animation if enabled
		if (config.animationEnabled !== false) {
			const animationType = config.animationType || 'fadeInUp';
			const duration = config.animationDuration || 0.6;
			const easing = config.animationEasing || 'ease-out';

			modal.style.animation = `${animationType} ${duration}s ${easing}`;

			// Reset animation after completion
			setTimeout(() => {
				modal.style.animation = '';
			}, duration * 1000);
		}

		// Set active modal
		activeModal = block;

		// Setup focus trap
		setupFocusTrap(modal);

		// Focus first element or close button
		setTimeout(() => {
			const closeButton = modal.querySelector('.modal-close');
			const firstInput = modal.querySelector('input, textarea, select, button, a[href]');

			if (closeButton) {
				closeButton.focus();
			} else if (firstInput) {
				firstInput.focus();
			}
		}, 100);

		// Prevent body scroll
		document.body.style.overflow = 'hidden';

		// Emit custom event
		block.dispatchEvent(new CustomEvent('riaModalOpen', { detail: { block, overlay, modal } }));
	}

	/**
	 * Close modal
	 */
	function closeModal(block, overlay, modal, config) {
		// Hide overlay
		overlay.classList.remove('active');
		overlay.setAttribute('aria-hidden', 'true');

		// Clear active modal
		activeModal = null;

		// Restore focus
		if (previousFocusElement) {
			previousFocusElement.focus();
			previousFocusElement = null;
		}

		// Allow body scroll
		document.body.style.overflow = '';

		// Clear focus trap
		focusableElements = [];
		firstFocusableElement = null;
		lastFocusableElement = null;

		// Emit custom event
		block.dispatchEvent(new CustomEvent('riaModalClose', { detail: { block, overlay, modal } }));
	}

	/**
	 * Setup focus trap inside modal
	 */
	function setupFocusTrap(modal) {
		// Get all focusable elements
		focusableElements = Array.from(
			modal.querySelectorAll(
				'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		);

		if (focusableElements.length === 0) return;

		firstFocusableElement = focusableElements[0];
		lastFocusableElement = focusableElements[focusableElements.length - 1];

		// Tab key handler
		modal.addEventListener('keydown', handleFocusTrap);
	}

	/**
	 * Handle focus trap on Tab key
	 */
	function handleFocusTrap(e) {
		if (e.key !== 'Tab') return;

		// Shift + Tab
		if (e.shiftKey) {
			if (document.activeElement === firstFocusableElement) {
				e.preventDefault();
				lastFocusableElement.focus();
			}
		}
		// Tab
		else {
			if (document.activeElement === lastFocusableElement) {
				e.preventDefault();
				firstFocusableElement.focus();
			}
		}
	}

	/**
	 * Process special modal content types
	 */
	function processModalContent(modal, block) {
		// Video embed
		const videoContent = modal.querySelector('.modal-video-content');
		if (videoContent) {
			const videoUrl = videoContent.dataset.videoUrl;
			if (videoUrl) {
				const embedUrl = getVideoEmbedUrl(videoUrl);
				if (embedUrl) {
					const iframe = document.createElement('iframe');
					iframe.src = embedUrl;
					iframe.width = '100%';
					iframe.height = '100%';
					iframe.frameBorder = '0';
					iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
					iframe.allowFullscreen = true;
					iframe.style.aspectRatio = '16 / 9';
					videoContent.appendChild(iframe);
				}
			}
		}

		// Form rendering (if using a form plugin that supports dynamic loading)
		const formContent = modal.querySelector('.modal-form-content');
		if (formContent) {
			const formId = formContent.dataset.formId;
			if (formId) {
				// Check if a form shortcode renderer exists (Gravity Forms, Contact Form 7, etc.)
				// This is a placeholder - actual implementation depends on the form plugin
				console.info(`RIA Modal: Form ID ${formId} should be rendered here`);

				// Example for Contact Form 7 shortcode rendering
				// You would need to add the shortcode in the WordPress editor instead
			}
		}
	}

	/**
	 * Convert video URL to embed URL
	 */
	function getVideoEmbedUrl(url) {
		// YouTube
		const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
		const youtubeMatch = url.match(youtubeRegex);
		if (youtubeMatch && youtubeMatch[1]) {
			return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
		}

		// Vimeo
		const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
		const vimeoMatch = url.match(vimeoRegex);
		if (vimeoMatch && vimeoMatch[1]) {
			return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
		}

		// If already an embed URL, return as-is
		if (url.includes('embed')) {
			return url;
		}

		console.warn('RIA Modal: Unsupported video URL format', url);
		return null;
	}

	/**
	 * Public API for programmatic control
	 */
	window.RIAModal = {
		/**
		 * Open a modal by block element or selector
		 */
		open: function(blockOrSelector) {
			const block = typeof blockOrSelector === 'string'
				? document.querySelector(blockOrSelector)
				: blockOrSelector;

			if (!block || !block.classList.contains('wp-block-ria-modal')) {
				console.warn('RIA Modal: Invalid block element', blockOrSelector);
				return;
			}

			const overlay = block.querySelector('.modal-overlay');
			const modal = block.querySelector('.modal-content');
			const config = JSON.parse(block.dataset.modalConfig || '{}');

			openModal(block, overlay, modal, config);
		},

		/**
		 * Close the currently active modal
		 */
		close: function() {
			if (!activeModal) return;

			const overlay = activeModal.querySelector('.modal-overlay');
			const modal = activeModal.querySelector('.modal-content');
			const config = JSON.parse(activeModal.dataset.modalConfig || '{}');

			closeModal(activeModal, overlay, modal, config);
		},

		/**
		 * Get the currently active modal
		 */
		getActive: function() {
			return activeModal;
		},
	};

	/**
	 * Initialize on DOM ready
	 */
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initModals);
	} else {
		initModals();
	}

	// Re-initialize if new modals are added dynamically (for page builders, AJAX, etc.)
	if (window.MutationObserver) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length) {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === 1 && node.classList && node.classList.contains('wp-block-ria-modal')) {
							initModals();
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

})();
