/**
 * RIA Accordion Item Block
 *
 * Individual accordion item that can contain any blocks via InnerBlocks
 */

import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	RichText,
	InnerBlocks,
	useInnerBlocksProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import './editor.scss';
import './style.scss';

registerBlockType('ria/accordion-item', {
	edit: ({ attributes, setAttributes, clientId, context }) => {
		const {
			title,
			isOpen,
			itemId,
			variant = 'default',
			customColor,
			customBackgroundColor,
			customBorderColor,
		} = attributes;

		// Get parent accordion settings from context
		const {
			iconPosition = 'right',
			titlePadding = 16,
			titleBackgroundColor = '#f9fafb',
			titleColor = '#1a1a1a',
			contentPadding = 16,
			contentBackgroundColor = '#ffffff',
			contentColor = '#4b5563',
			borderWidth = 1,
			borderStyle = 'solid',
			borderColor = '#e5e7eb',
			borderRadius = 8,
			titleSize = 'medium',
		} = context;

		// Generate unique ID on mount if not set
		useEffect(() => {
			if (!itemId) {
				setAttributes({ itemId: `accordion-item-${clientId}` });
			}
		}, [clientId, itemId, setAttributes]);

		// Check if this is the first item in the accordion (should be open by default)
		const { blockIndex } = useSelect(
			(select) => {
				const { getBlockIndex } = select('core/block-editor');
				return {
					blockIndex: getBlockIndex(clientId),
				};
			},
			[clientId]
		);

		// Open first item by default for better UX
		useEffect(() => {
			if (blockIndex === 0 && isOpen === false) {
				setAttributes({ isOpen: true });
			}
		}, [blockIndex, isOpen, setAttributes]);

		// Build class names
		const classes = ['accordion-item'];
		if (isOpen) classes.push('is-open');
		if (variant !== 'default') classes.push(`has-${variant}-variant`);
		if (variant === 'custom' && (customColor || customBackgroundColor || customBorderColor)) {
			classes.push('has-custom-colors');
		}

		const blockProps = useBlockProps({
			className: classes.join(' '),
			style: {
				borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
				borderStyle: borderWidth > 0 ? borderStyle : undefined,
				borderColor: borderWidth > 0 ? borderColor : undefined,
				borderRadius: `${borderRadius}px`,
				...(variant === 'custom' ? {
					'--custom-color': customColor || undefined,
					'--custom-background-color': customBackgroundColor || undefined,
					'--custom-border-color': customBorderColor || undefined,
				} : {}),
			},
		});

		const titleStyles = {
			padding: `${titlePadding}px`,
			backgroundColor: titleBackgroundColor,
			color: titleColor,
			fontSize:
				titleSize === 'small' ? '14px' :
				titleSize === 'medium' ? '16px' :
				titleSize === 'large' ? '18px' : '20px',
		};

		const contentStyles = {
			padding: `${contentPadding}px`,
			backgroundColor: contentBackgroundColor,
			color: contentColor,
		};

		const innerBlocksProps = useInnerBlocksProps(
			{
				className: 'accordion-content-inner',
			},
			{
				templateLock: false,
				renderAppender: InnerBlocks.ButtonBlockAppender,
			}
		);

		const toggleItem = () => {
			setAttributes({ isOpen: !isOpen });
		};

		return (
			<>
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
					{/* Item Controls */}
					<div className="accordion-item-controls">
					<span className="item-label">
						{blockIndex !== null ? `Item ${blockIndex + 1}` : 'Item'}
					</span>
				</div>

				{/* Title */}
				<div
					className={`accordion-item-title icon-${iconPosition}`}
					style={titleStyles}
					role="button"
					tabIndex={0}
					onClick={toggleItem}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							toggleItem();
						}
					}}
					aria-expanded={isOpen}
					aria-label={title || __('Accordion item', 'ria-accordion')}
				>
					{iconPosition === 'left' && iconPosition !== 'none' && (
						<span className="accordion-icon" aria-hidden="true">
							{isOpen ? '▲' : '▼'}
						</span>
					)}

					<RichText
						tagName="span"
						value={title}
						onChange={(value) => setAttributes({ title: value })}
						placeholder={__('Accordion title...', 'ria-accordion')}
						className="accordion-title-text"
						allowedFormats={['core/bold', 'core/italic']}
					/>

					{iconPosition === 'right' && iconPosition !== 'none' && (
						<span className="accordion-icon" aria-hidden="true">
							{isOpen ? '▲' : '▼'}
						</span>
					)}

					{/* Toggle button - always visible */}
					<button
						type="button"
						className="accordion-toggle-button"
						onClick={toggleItem}
						aria-label={isOpen ? __('Collapse', 'ria-accordion') : __('Expand', 'ria-accordion')}
					>
						{isOpen ? '−' : '+'}
					</button>
				</div>

				{/* Content - Always visible in editor when open */}
				{isOpen && (
					<div
						className="accordion-item-content"
						style={contentStyles}
					>
						<div {...innerBlocksProps} />
					</div>
				)}
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			title,
			isOpen,
			itemId,
			variant = 'default',
			customColor,
			customBackgroundColor,
			customBorderColor,
		} = attributes;

		// Build class names
		const classes = ['accordion-item'];
		if (isOpen) classes.push('is-open');
		if (variant !== 'default') classes.push(`has-${variant}-variant`);
		if (variant === 'custom' && (customColor || customBackgroundColor || customBorderColor)) {
			classes.push('has-custom-colors');
		}

		const blockProps = useBlockProps.save({
			className: classes.join(' '),
			'data-is-open': isOpen,
			style: variant === 'custom' ? {
				'--custom-color': customColor || undefined,
				'--custom-background-color': customBackgroundColor || undefined,
				'--custom-border-color': customBorderColor || undefined,
			} : {},
		});

		const contentId = `${itemId}-content`;

		return (
			<div {...blockProps}>
				<button
					className="accordion-item-title"
					role="button"
					aria-expanded={isOpen}
					aria-controls={contentId}
					id={itemId}
					tabIndex={0}
				>
					<RichText.Content
						tagName="span"
						value={title}
						className="accordion-title-text"
					/>
					<span className="accordion-icon icon-close" aria-hidden="true">
						▼
					</span>
					<span className="accordion-icon icon-open" aria-hidden="true">
						▲
					</span>
				</button>

				<div
					className="accordion-item-content"
					role="region"
					aria-labelledby={itemId}
					id={contentId}
					aria-hidden={!isOpen}
				>
					<div className="accordion-content-inner">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
});
