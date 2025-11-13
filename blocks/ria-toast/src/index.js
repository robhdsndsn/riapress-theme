/**
 * RIA Toast Container Block
 *
 * Container for dynamic toast notifications with shadcn/ui design
 */

import './style.scss';
import './editor.scss';

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

/**
 * Edit Component
 */
function Edit({ attributes, setAttributes }) {
	const { position, maxToasts, variant, customColor, customBackgroundColor, customBorderColor } = attributes;

	const blockProps = useBlockProps({
		className: `ria-toast-container-editor ria-toast-${position}`,
	});

	const positionLabels = {
		'top-right': __('Top Right', 'ria-toast'),
		'top-left': __('Top Left', 'ria-toast'),
		'bottom-right': __('Bottom Right', 'ria-toast'),
		'bottom-left': __('Bottom Left', 'ria-toast'),
		'top-center': __('Top Center', 'ria-toast'),
		'bottom-center': __('Bottom Center', 'ria-toast'),
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Toast Settings', 'ria-toast')} initialOpen={true}>
					<SelectControl
						label={__('Position', 'ria-toast')}
						value={position}
						options={Object.entries(positionLabels).map(([value, label]) => ({
							label,
							value,
						}))}
						onChange={(value) => setAttributes({ position: value })}
						help={__('Where toasts will appear on screen', 'ria-toast')}
					/>
					<RangeControl
						label={__('Max Visible Toasts', 'ria-toast')}
						value={maxToasts}
						onChange={(value) => setAttributes({ maxToasts: value })}
						min={1}
						max={10}
						help={__('Maximum number of toasts shown at once', 'ria-toast')}
					/>
				</PanelBody>

				<PanelBody title={__('Color Settings', 'ria-toast')} initialOpen={false}>
					<SelectControl
						label={__('Color Variant', 'ria-toast')}
						value={variant || 'default'}
						options={[
							{ label: __('Default', 'ria-toast'), value: 'default' },
							{ label: __('Primary', 'ria-toast'), value: 'primary' },
							{ label: __('Secondary', 'ria-toast'), value: 'secondary' },
							{ label: __('Accent', 'ria-toast'), value: 'accent' },
							{ label: __('Neutral', 'ria-toast'), value: 'neutral' },
							{ label: __('Custom', 'ria-toast'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ variant: value })}
						help={__('Default color scheme for toasts created from this container', 'ria-toast')}
					/>
				</PanelBody>

				{variant === 'custom' && (
					<PanelColorSettings
						title={__('Custom Colors', 'ria-toast')}
						colorSettings={[
							{
								value: customColor,
								onChange: (value) => setAttributes({ customColor: value }),
								label: __('Text Color', 'ria-toast')
							},
							{
								value: customBackgroundColor,
								onChange: (value) => setAttributes({ customBackgroundColor: value }),
								label: __('Background Color', 'ria-toast')
							},
							{
								value: customBorderColor,
								onChange: (value) => setAttributes({ customBorderColor: value }),
								label: __('Border Color', 'ria-toast')
							}
						]}
					/>
				)}
			</InspectorControls>

			<div {...blockProps}>
				<div className="ria-toast-editor-preview">
					<div className="ria-toast-editor-icon">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
							<line x1="12" y1="9" x2="12" y2="13" />
							<line x1="12" y1="17" x2="12.01" y2="17" />
						</svg>
					</div>
					<div className="ria-toast-editor-content">
						<div className="ria-toast-editor-title">
							{__('Toast Container', 'ria-toast')}
						</div>
						<div className="ria-toast-editor-description">
							{__('Position:', 'ria-toast')} {positionLabels[position]}
						</div>
						<div className="ria-toast-editor-note">
							{__('Toasts will appear here dynamically when triggered via JavaScript', 'ria-toast')}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

/**
 * Save Component
 * Just outputs the container div - JavaScript handles the rest
 */
function Save({ attributes }) {
	const { position, maxToasts, variant, customColor, customBackgroundColor, customBorderColor } = attributes;

	const blockProps = useBlockProps.save({
		className: `ria-toast-container ria-toast-${position} ${variant && variant !== 'custom' ? `has-${variant}-variant` : ''} ${variant === 'custom' ? 'has-custom-colors' : ''}`,
		'data-position': position,
		'data-max-toasts': maxToasts,
		'data-variant': variant || 'default',
		style: variant === 'custom' ? {
			'--toast-color': customColor,
			'--toast-background': customBackgroundColor,
			'--toast-border': customBorderColor
		} : {}
	});

	return (
		<div {...blockProps} aria-live="polite" aria-atomic="true" />
	);
}

// Register block
registerBlockType(metadata.name, {
	edit: Edit,
	save: Save,
});
