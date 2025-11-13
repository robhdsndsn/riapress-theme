/**
 * RIA Button Group Block
 *
 * Shadcn-inspired button group with support for horizontal/vertical layout
 */

import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';

const ALLOWED_BLOCKS = ['ria/button'];
const BUTTON_TEMPLATE = [
	['ria/button', { text: 'Button 1' }],
	['ria/button', { text: 'Button 2' }],
];

registerBlockType('ria/buttons', {
	edit: ({ attributes, setAttributes }) => {
		const {
			orientation,
			alignment,
			gap,
			wrapButtons,
			variant = 'default',
			customColor,
			customBackgroundColor,
			customBorderColor,
		} = attributes;

		// Build class names
		const classes = ['button-group', `button-group-${orientation}`, `align-${alignment}`];
		if (wrapButtons) classes.push('wrap');
		if (variant !== 'default') classes.push(`has-${variant}-variant`);
		if (variant === 'custom' && (customColor || customBackgroundColor || customBorderColor)) {
			classes.push('has-custom-colors');
		}

		const blockProps = useBlockProps({
			className: classes.join(' '),
			style: {
				gap: gap > 0 ? `${gap}px` : undefined,
				...(variant === 'custom' ? {
					'--custom-color': customColor || undefined,
					'--custom-background-color': customBackgroundColor || undefined,
					'--custom-border-color': customBorderColor || undefined,
				} : {}),
			},
		});

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon="align-pull-left"
							label={__('Horizontal', 'ria-button-group')}
							onClick={() => setAttributes({ orientation: 'horizontal' })}
							isActive={orientation === 'horizontal'}
						/>
						<ToolbarButton
							icon="align-pull-right"
							label={__('Vertical', 'ria-button-group')}
							onClick={() => setAttributes({ orientation: 'vertical' })}
							isActive={orientation === 'vertical'}
						/>
					</ToolbarGroup>
				</BlockControls>

				<InspectorControls>
					<PanelBody title={__('Color Settings', 'riapress')} initialOpen={false}>
						<SelectControl
							label={__('Color Variant', 'riapress')}
							value={variant}
							options={[
								{ label: __('Default', 'riapress'), value: 'default' },
								{ label: __('Primary', 'riapress'), value: 'primary' },
								{ label: __('Secondary', 'riapress'), value: 'secondary' },
								{ label: __('Accent', 'riapress'), value: 'accent' },
								{ label: __('Neutral', 'riapress'), value: 'neutral' },
								{ label: __('Custom', 'riapress'), value: 'custom' }
							]}
							onChange={(value) => setAttributes({ variant: value })}
						/>
					</PanelBody>

					<PanelBody title={__('Layout Settings', 'ria-button-group')}>
						<SelectControl
							label={__('Orientation', 'ria-button-group')}
							value={orientation}
							options={[
								{ label: __('Horizontal', 'ria-button-group'), value: 'horizontal' },
								{ label: __('Vertical', 'ria-button-group'), value: 'vertical' },
							]}
							onChange={(value) => setAttributes({ orientation: value })}
						/>

						<SelectControl
							label={__('Alignment', 'ria-button-group')}
							value={alignment}
							options={[
								{ label: __('Start', 'ria-button-group'), value: 'start' },
								{ label: __('Center', 'ria-button-group'), value: 'center' },
								{ label: __('End', 'ria-button-group'), value: 'end' },
								{ label: __('Space Between', 'ria-button-group'), value: 'space-between' },
							]}
							onChange={(value) => setAttributes({ alignment: value })}
						/>

						<RangeControl
							label={__('Gap Between Buttons', 'ria-button-group')}
							value={gap}
							onChange={(value) => setAttributes({ gap: value })}
							min={0}
							max={40}
							step={2}
							help={__('Set to 0 for connected buttons (shadcn style)', 'ria-button-group')}
						/>

						{orientation === 'horizontal' && (
							<ToggleControl
								label={__('Wrap Buttons', 'ria-button-group')}
								checked={wrapButtons}
								onChange={(value) => setAttributes({ wrapButtons: value })}
								help={__('Allow buttons to wrap to next line on small screens', 'ria-button-group')}
							/>
						)}
					</PanelBody>

					{variant === 'custom' && (
						<PanelColorSettings
							title={__('Custom Colors', 'riapress')}
							colorSettings={[
								{
									value: customColor,
									onChange: (value) => setAttributes({ customColor: value }),
									label: __('Text Color', 'riapress')
								},
								{
									value: customBackgroundColor,
									onChange: (value) => setAttributes({ customBackgroundColor: value }),
									label: __('Background Color', 'riapress')
								},
								{
									value: customBorderColor,
									onChange: (value) => setAttributes({ customBorderColor: value }),
									label: __('Border Color', 'riapress')
								}
							]}
						/>
					)}
				</InspectorControls>

				<div {...blockProps}>
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={BUTTON_TEMPLATE}
						renderAppender={InnerBlocks.ButtonBlockAppender}
					/>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			orientation,
			alignment,
			gap,
			wrapButtons,
			variant = 'default',
			customColor,
			customBackgroundColor,
			customBorderColor,
		} = attributes;

		// Build class names
		const classes = ['button-group', `button-group-${orientation}`, `align-${alignment}`];
		if (wrapButtons) classes.push('wrap');
		if (variant !== 'default') classes.push(`has-${variant}-variant`);
		if (variant === 'custom' && (customColor || customBackgroundColor || customBorderColor)) {
			classes.push('has-custom-colors');
		}

		const blockProps = useBlockProps.save({
			className: classes.join(' '),
			style: {
				gap: gap > 0 ? `${gap}px` : undefined,
				...(variant === 'custom' ? {
					'--custom-color': customColor || undefined,
					'--custom-background-color': customBackgroundColor || undefined,
					'--custom-border-color': customBorderColor || undefined,
				} : {}),
			},
			role: 'group',
			'aria-label': __('Button group', 'ria-button-group'),
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
