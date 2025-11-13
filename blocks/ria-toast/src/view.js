/**
 * RIA Toast System
 *
 * Global toast notification system with shadcn/ui design
 * Usage: RIA.toast.success('Message saved!', { description: 'Your changes have been saved.' })
 */

(function() {
	'use strict';

	// Toast state
	const state = {
		toasts: [],
		nextId: 1,
		container: null,
		maxToasts: 5,
		position: 'top-right',
	};

	// Lucide icons
	const icons = {
		success: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9 12l2 2 4-4',
		error: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 8v4 M12 16h.01',
		warning: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z M12 9v4 M12 17h.01',
		info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01',
		default: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
	};

	/**
	 * Create SVG icon
	 */
	function createIcon(type) {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '20');
		svg.setAttribute('height', '20');
		svg.setAttribute('viewBox', '0 0 24 24');
		svg.setAttribute('fill', 'none');
		svg.setAttribute('stroke', 'currentColor');
		svg.setAttribute('stroke-width', '2');
		svg.setAttribute('stroke-linecap', 'round');
		svg.setAttribute('stroke-linejoin', 'round');

		const pathData = icons[type] || icons.default;
		pathData.split(' M').forEach((d, index) => {
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttribute('d', (index === 0 ? '' : 'M') + d);
			svg.appendChild(path);
		});

		return svg;
	}

	/**
	 * Create toast element
	 */
	function createToastElement(toast) {
		const toastEl = document.createElement('div');
		toastEl.className = `ria-toast ria-toast-${toast.variant}`;
		toastEl.setAttribute('role', 'status');
		toastEl.setAttribute('aria-live', 'polite');
		toastEl.dataset.toastId = toast.id;

		// Icon
		if (toast.showIcon !== false) {
			const iconWrapper = document.createElement('div');
			iconWrapper.className = 'ria-toast-icon';
			iconWrapper.appendChild(createIcon(toast.variant));
			toastEl.appendChild(iconWrapper);
		}

		// Content
		const content = document.createElement('div');
		content.className = 'ria-toast-content';

		if (toast.title) {
			const title = document.createElement('div');
			title.className = 'ria-toast-title';
			title.textContent = toast.title;
			content.appendChild(title);
		}

		if (toast.description) {
			const description = document.createElement('div');
			description.className = 'ria-toast-description';
			description.textContent = toast.description;
			content.appendChild(description);
		}

		toastEl.appendChild(content);

		// Action button (optional)
		if (toast.action) {
			const actionBtn = document.createElement('button');
			actionBtn.className = 'ria-toast-action';
			actionBtn.textContent = toast.action.label;
			actionBtn.setAttribute('type', 'button');
			actionBtn.onclick = (e) => {
				e.stopPropagation();
				toast.action.onClick();
				if (toast.action.closeOnClick !== false) {
					dismissToast(toast.id);
				}
			};
			actionBtn.onkeydown = (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					e.stopPropagation();
					toast.action.onClick();
					if (toast.action.closeOnClick !== false) {
						dismissToast(toast.id);
					}
				}
			};
			toastEl.appendChild(actionBtn);
		}

		// Close button
		const closeBtn = document.createElement('button');
		closeBtn.className = 'ria-toast-close';
		closeBtn.setAttribute('type', 'button');
		closeBtn.setAttribute('aria-label', 'Close');
		closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18 M6 6l12 12"/></svg>';
		closeBtn.onclick = () => dismissToast(toast.id);
		closeBtn.onkeydown = (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				dismissToast(toast.id);
			}
		};
		toastEl.appendChild(closeBtn);

		return toastEl;
	}

	/**
	 * Show toast
	 */
	function showToast(toastData) {
		// Create toast object
		const toast = {
			id: state.nextId++,
			variant: toastData.variant || 'default',
			title: toastData.title || '',
			description: toastData.description || toastData.message || '',
			showIcon: toastData.showIcon !== false,
			duration: toastData.duration !== undefined ? toastData.duration : 5000,
			action: toastData.action,
		};

		// Add to state
		state.toasts.push(toast);

		// Remove oldest if exceeding max
		if (state.toasts.length > state.maxToasts) {
			const oldestId = state.toasts[0].id;
			dismissToast(oldestId);
		}

		// Create and append element
		const toastEl = createToastElement(toast);
		state.container.appendChild(toastEl);

		// Trigger entrance animation
		requestAnimationFrame(() => {
			toastEl.classList.add('ria-toast-show');
		});

		// Auto-dismiss
		if (toast.duration > 0) {
			toast.timeoutId = setTimeout(() => {
				dismissToast(toast.id);
			}, toast.duration);
		}

		return toast.id;
	}

	/**
	 * Dismiss toast
	 */
	function dismissToast(id) {
		const toastIndex = state.toasts.findIndex(t => t.id === id);
		if (toastIndex === -1) return;

		const toast = state.toasts[toastIndex];
		const toastEl = state.container.querySelector(`[data-toast-id="${id}"]`);

		if (toastEl) {
			// Trigger exit animation
			toastEl.classList.add('ria-toast-hide');

			// Remove after animation
			setTimeout(() => {
				toastEl.remove();
			}, 300);
		}

		// Clear timeout if exists
		if (toast.timeoutId) {
			clearTimeout(toast.timeoutId);
		}

		// Remove from state
		state.toasts.splice(toastIndex, 1);
	}

	/**
	 * Dismiss all toasts
	 */
	function dismissAll() {
		const toastIds = state.toasts.map(t => t.id);
		toastIds.forEach(id => dismissToast(id));
	}

	/**
	 * Initialize toast system
	 */
	function init() {
		// Find or create container
		state.container = document.querySelector('.ria-toast-container');

		if (!state.container) {
			// Auto-create container if block not added
			state.container = document.createElement('div');
			state.container.className = 'ria-toast-container ria-toast-top-right';
			state.container.setAttribute('aria-live', 'polite');
			state.container.setAttribute('aria-atomic', 'true');
			state.container.dataset.position = 'top-right';
			state.container.dataset.maxToasts = '5';
			document.body.appendChild(state.container);
		}

		// Read config from container
		state.position = state.container.dataset.position || 'top-right';
		state.maxToasts = parseInt(state.container.dataset.maxToasts) || 5;

		// Create global API
		window.RIA = window.RIA || {};
		window.RIA.toast = {
			// Main show method
			show: showToast,

			// Convenience methods
			success: (title, options = {}) => showToast({ ...options, title, variant: 'success' }),
			error: (title, options = {}) => showToast({ ...options, title, variant: 'error' }),
			warning: (title, options = {}) => showToast({ ...options, title, variant: 'warning' }),
			info: (title, options = {}) => showToast({ ...options, title, variant: 'info' }),
			default: (title, options = {}) => showToast({ ...options, title, variant: 'default' }),

			// Dismiss methods
			dismiss: dismissToast,
			dismissAll: dismissAll,

			// Promise helper
			promise: (promise, messages) => {
				const id = showToast({
					title: messages.loading || 'Loading...',
					variant: 'default',
					duration: 0, // Don't auto-dismiss
				});

				promise
					.then((result) => {
						dismissToast(id);
						if (messages.success) {
							showToast({
								title: messages.success,
								variant: 'success',
							});
						}
						return result;
					})
					.catch((error) => {
						dismissToast(id);
						if (messages.error) {
							showToast({
								title: messages.error,
								description: error.message,
								variant: 'error',
							});
						}
						throw error;
					});

				return promise;
			},
		};

		console.log('🍞 RIA Toast system initialized');
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
