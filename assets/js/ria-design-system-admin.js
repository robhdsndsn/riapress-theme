/**
 * RIA Design System - Admin JavaScript
 *
 * @package RIAPress
 * @since 1.0.0
 */

(function($) {
	'use strict';

	/**
	 * Color Management System
	 */
	const RIAColorManager = {

		/**
		 * Initialize color pickers
		 */
		init: function() {
			this.initColorPickers();
			this.bindEvents();
		},

		/**
		 * Initialize WordPress color pickers
		 */
		initColorPickers: function() {
			if (!$.fn.wpColorPicker) {
				return;
			}

			$('.ria-color-picker').wpColorPicker({
				change: function(event, ui) {
					const $input = $(event.target);
					const color = ui.color.toString();

					// Update preview
					$input.closest('.ria-color-item').find('.ria-color-preview').css('background-color', color);

					// Mark as modified
					RIAColorManager.markAsModified($input);
				}
			});
		},

		/**
		 * Bind event handlers
		 */
		bindEvents: function() {
			// Save button
			$('#ria-save-colors').on('click', function(e) {
				e.preventDefault();
				RIAColorManager.saveColors();
			});

			// Reset button
			$('#ria-reset-colors').on('click', function(e) {
				e.preventDefault();
				RIAColorManager.resetColors();
			});

			// Export CSS button
			$('#ria-export-css').on('click', function(e) {
				e.preventDefault();
				RIAColorManager.exportCSS();
			});

			// Track changes
			$('.ria-color-picker').on('change', function() {
				RIAColorManager.markAsModified($(this));
			});
		},

		/**
		 * Mark color as modified
		 */
		markAsModified: function($input) {
			const $item = $input.closest('.ria-color-item');
			const defaultValue = $input.data('default-value');
			const currentValue = $input.val();

			if (currentValue !== defaultValue) {
				$item.addClass('is-modified');

				// Add "Customized" badge if not already present
				if (!$item.find('.ria-badge').length) {
					$item.find('label strong').after(' <span class="ria-badge">Customized</span>');
				}
			} else {
				$item.removeClass('is-modified');
				$item.find('.ria-badge').remove();
			}
		},

		/**
		 * Collect all color values
		 */
		collectColors: function() {
			const colors = {};

			$('.ria-color-picker').each(function() {
				const $input = $(this);
				const slug = $input.data('slug');
				const value = $input.val();

				colors[slug] = value;
			});

			return colors;
		},

		/**
		 * Save colors via AJAX
		 */
		saveColors: function() {
			const $button = $('#ria-save-colors');
			const $status = $('.ria-save-status');

			// Collect colors
			const colors = this.collectColors();

			// Disable button
			$button.prop('disabled', true).addClass('updating-message');

			// Show loading status
			$status.html('<span class="spinner is-active" style="float: none; margin: 0;"></span> Saving...').show();

			// Send AJAX request
			$.ajax({
				url: riaAdmin.ajaxurl,
				type: 'POST',
				data: {
					action: 'ria_save_design_tokens',
					nonce: riaAdmin.nonce,
					category: 'colors',
					data: colors
				},
				success: function(response) {
					if (response.success) {
						// Show success message
						$status.html('<span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span> ' + response.data.message).show();

						// Remove "modified" class from all items
						$('.ria-color-item').removeClass('is-modified');

						// Hide message after 3 seconds
						setTimeout(function() {
							$status.fadeOut();
						}, 3000);

					} else {
						// Show error message
						$status.html('<span class="dashicons dashicons-warning" style="color: #dc3232;"></span> Error: ' + response.data.message).show();
					}
				},
				error: function(xhr, status, error) {
					$status.html('<span class="dashicons dashicons-warning" style="color: #dc3232;"></span> Error: ' + error).show();
				},
				complete: function() {
					// Re-enable button
					$button.prop('disabled', false).removeClass('updating-message');
				}
			});
		},

		/**
		 * Reset colors to defaults
		 */
		resetColors: function() {
			if (!confirm('Are you sure you want to reset all colors to their default values? This cannot be undone.')) {
				return;
			}

			const $button = $('#ria-reset-colors');
			const $status = $('.ria-save-status');

			// Disable button
			$button.prop('disabled', true).addClass('updating-message');

			// Show loading status
			$status.html('<span class="spinner is-active" style="float: none; margin: 0;"></span> Resetting...').show();

			// Send AJAX request
			$.ajax({
				url: riaAdmin.ajaxurl,
				type: 'POST',
				data: {
					action: 'ria_reset_design_tokens',
					nonce: riaAdmin.nonce,
					category: 'colors'
				},
				success: function(response) {
					if (response.success) {
						// Show success message
						$status.html('<span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span> ' + response.data.message).show();

						// Reload page to show reset colors
						setTimeout(function() {
							window.location.reload();
						}, 1000);

					} else {
						// Show error message
						$status.html('<span class="dashicons dashicons-warning" style="color: #dc3232;"></span> Error: ' + response.data.message).show();
					}
				},
				error: function(xhr, status, error) {
					$status.html('<span class="dashicons dashicons-warning" style="color: #dc3232;"></span> Error: ' + error).show();
				},
				complete: function() {
					// Re-enable button
					$button.prop('disabled', false).removeClass('updating-message');
				}
			});
		},

		/**
		 * Export CSS
		 */
		exportCSS: function() {
			const colors = this.collectColors();

			// Generate CSS
			let css = '/**\n';
			css += ' * RIAPress Custom Colors Export\n';
			css += ' * Generated: ' + new Date().toLocaleString() + '\n';
			css += ' */\n\n';
			css += ':root {\n';

			// Add colors
			$('.ria-color-picker').each(function() {
				const $input = $(this);
				const slug = $input.data('slug');
				const value = $input.val();
				const cssVar = $input.closest('.ria-color-item').find('.ria-color-slug').text();

				css += '\t' + cssVar + ': ' + value + ';\n';
			});

			css += '}\n';

			// Create download
			const blob = new Blob([css], { type: 'text/css' });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'riapress-custom-colors.css';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);

			// Show success message
			$('.ria-save-status').html('<span class="dashicons dashicons-download" style="color: #46b450;"></span> CSS exported successfully!').show();
			setTimeout(function() {
				$('.ria-save-status').fadeOut();
			}, 3000);
		}
	};

	$(document).ready(function() {

		// Initialize color management
		RIAColorManager.init();

		// Initialize legacy color pickers (for backwards compatibility)
		if ($.fn.wpColorPicker) {
			$('.ria-color-picker').wpColorPicker();
		}

		// Reset to defaults button
		$('.ria-reset-button').on('click', function(e) {
			e.preventDefault();

			if (!confirm('Are you sure you want to reset all values to defaults? This will remove all your customizations.')) {
				return;
			}

			// Clear all input values
			$(this).closest('form').find('input[type=text], input[type=number], textarea').val('');

			// Reinitialize color pickers with default colors
			$('.ria-color-picker').each(function() {
				var defaultColor = $(this).data('default-color');
				if (defaultColor) {
					$(this).wpColorPicker('color', defaultColor);
				}
			});

			// Submit form
			$(this).closest('form').find('input[type=submit]').click();
		});

		// Font upload button
		$('.ria-upload-font-button').on('click', function(e) {
			e.preventDefault();

			var $button = $(this);
			var fontName = $('#ria-font-name').val().trim();

			if (!fontName) {
				alert('Please enter a font name first.');
				$('#ria-font-name').focus();
				return;
			}

			// Open WordPress media uploader
			var mediaUploader = wp.media({
				title: 'Upload Font Files',
				button: {
					text: 'Use these files'
				},
				multiple: true,
				library: {
					type: ['application/x-font-woff', 'application/x-font-woff2', 'application/x-font-ttf', 'font/woff', 'font/woff2', 'font/ttf']
				}
			});

			mediaUploader.on('select', function() {
				var attachments = mediaUploader.state().get('selection').toJSON();

				if (attachments.length === 0) {
					return;
				}

				$button.prop('disabled', true).text('Uploading...');

				// Upload font via AJAX
				$.ajax({
					url: riaAdmin.ajaxurl,
					type: 'POST',
					data: {
						action: 'ria_upload_font',
						nonce: riaAdmin.nonce,
						font_name: fontName,
						files: attachments.map(function(att) {
							return {
								id: att.id,
								url: att.url,
								filename: att.filename
							};
						})
					},
					success: function(response) {
						if (response.success) {
							alert('Font uploaded successfully!');
							location.reload();
						} else {
							alert('Error: ' + (response.data || 'Unknown error'));
						}
					},
					error: function() {
						alert('Upload failed. Please try again.');
					},
					complete: function() {
						$button.prop('disabled', false).text('Upload Font Files');
					}
				});
			});

			mediaUploader.open();
		});

		// Delete font button
		$(document).on('click', '.ria-delete-font', function(e) {
			e.preventDefault();

			if (!confirm('Are you sure you want to delete this font?')) {
				return;
			}

			var $button = $(this);
			var fontId = $button.data('font-id');

			$button.prop('disabled', true).text('Deleting...');

			$.ajax({
				url: riaAdmin.ajaxurl,
				type: 'POST',
				data: {
					action: 'ria_delete_font',
					nonce: riaAdmin.nonce,
					font_id: fontId
				},
				success: function(response) {
					if (response.success) {
						$button.closest('.font-item').fadeOut(function() {
							$(this).remove();

							// Check if fonts list is empty
							if ($('.fonts-list .font-item').length === 0) {
								$('.fonts-list').replaceWith('<p class="description">No custom fonts installed yet.</p>');
							}
						});
					} else {
						alert('Error: ' + (response.data || 'Unknown error'));
						$button.prop('disabled', false).text('Delete');
					}
				},
				error: function() {
					alert('Delete failed. Please try again.');
					$button.prop('disabled', false).text('Delete');
				}
			});
		});

		// Tab persistence
		var activeTab = new URLSearchParams(window.location.search).get('tab');
		if (activeTab) {
			localStorage.setItem('ria_active_tab', activeTab);
		}

		// Smooth scroll to top when switching tabs
		$('.nav-tab').on('click', function() {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});

		// Auto-save notice
		var $forms = $('.ria-design-tokens-form, .ria-advanced-form');
		$forms.on('change', 'input, textarea, select', function() {
			var $form = $(this).closest('form');
			if (!$form.data('changed')) {
				$form.data('changed', true);
				$form.find('.ria-form-actions').prepend('<span class="unsaved-notice" style="color: #d63638; margin-right: 12px;">Unsaved changes</span>');
			}
		});

		$forms.on('submit', function() {
			$(this).find('.unsaved-notice').remove();
			$(this).data('changed', false);
		});

		// Warn before leaving with unsaved changes
		$(window).on('beforeunload', function() {
			if ($forms.data('changed')) {
				return 'You have unsaved changes. Are you sure you want to leave?';
			}
		});

	});

})(jQuery);

	/**
	 * Export/Import Functionality
	 */

	// Export Settings
	$('#ria-export-settings').on('click', function() {
		var $button = $(this);
		$button.prop('disabled', true).text('Exporting...');

		$.ajax({
			url: riaAdmin.ajaxurl,
			type: 'POST',
			data: {
				action: 'ria_export_settings',
				nonce: riaAdmin.nonce
			},
			success: function(response) {
				if (response.success) {
					$('#ria-export-json').val(response.data.json);
					$('#ria-export-output').slideDown();
					alert('Settings exported successfully!');
				} else {
					alert('Error: ' + (response.data.message || 'Export failed'));
				}
			},
			error: function() {
				alert('Network error. Please try again.');
			},
			complete: function() {
				$button.prop('disabled', false).html('<span class="dashicons dashicons-download" style="margin-top:3px;"></span> Export Settings');
			}
		});
	});

	// Copy Export
	$('#ria-copy-export').on('click', function() {
		var $textarea = $('#ria-export-json');
		$textarea.select();
		document.execCommand('copy');
		$(this).text('Copied!');
		setTimeout(() => $(this).text('Copy to Clipboard'), 2000);
	});

	// Select File
	$('#ria-select-file').on('click', () => $('#ria-import-file').click());

	// Handle File
	$('#ria-import-file').on('change', function(e) {
		var file = e.target.files[0];
		if (file) {
			var reader = new FileReader();
			reader.onload = (e) => $('#ria-import-json').val(e.target.result);
			reader.readAsText(file);
		}
	});

	// Import Settings
	$('#ria-import-settings').on('click', function() {
		var json = $('#ria-import-json').val().trim();
		if (!json) return alert('Please paste JSON or select a file.');
		if (!confirm('Import settings? A backup will be created.')) return;

		var $button = $(this), $result = $('#ria-import-result');
		$button.prop('disabled', true).text('Importing...');

		$.ajax({
			url: riaAdmin.ajaxurl,
			type: 'POST',
			data: {
				action: 'ria_import_settings',
				nonce: riaAdmin.nonce,
				json: json,
				create_backup: $('#ria-create-backup').is(':checked')
			},
			success: function(response) {
				if (response.success) {
					$result.html('<div class="notice notice-success inline"><p>' + response.data.message + '</p></div>').slideDown();
					setTimeout(() => location.reload(), 2000);
				} else {
					$result.html('<div class="notice notice-error inline"><p>' + (response.data.message || 'Import failed') + '</p></div>').slideDown();
				}
			},
			complete: () => $button.prop('disabled', false).html('<span class="dashicons dashicons-upload" style="margin-top:3px;"></span> Import Settings')
		});
	});

	// Restore Backup
	$('.ria-restore-backup').on('click', function() {
		var backupId = $(this).data('backup-id');
		if (!confirm('Restore from backup "' + backupId + '"?')) return;

		$(this).prop('disabled', true).text('Restoring...');

		$.ajax({
			url: riaAdmin.ajaxurl,
			type: 'POST',
			data: { action: 'ria_import_settings', nonce: riaAdmin.nonce, backup_id: backupId },
			success: (r) => r.success ? (alert('Restored!'), location.reload()) : alert('Error: ' + (r.data.message || 'Failed'))
		});
	});

	// Download Backup
	$('.ria-download-backup').on('click', function() {
		var backupId = $(this).data('backup-id');
		$(this).prop('disabled', true).text('Downloading...');

		$.ajax({
			url: riaAdmin.ajaxurl,
			type: 'POST',
			data: { action: 'ria_download_backup', nonce: riaAdmin.nonce, backup_id: backupId },
			success: function(response) {
				if (response.success) {
					var blob = new Blob([response.data.json], { type: 'application/json' });
					var url = URL.createObjectURL(blob);
					var a = document.createElement('a');
					a.href = url; a.download = response.data.filename;
					document.body.appendChild(a);
					a.click();
					URL.revokeObjectURL(url);
					document.body.removeChild(a);
				}
			},
			complete: function() {
				$(this).prop('disabled', false).text('Download');
			}.bind(this)
		});
	});

