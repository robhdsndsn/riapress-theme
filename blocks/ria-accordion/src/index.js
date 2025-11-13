/**
 * RIA Accordion Block (Parent Container)
 *
 * WordPress Gutenberg accordion that uses InnerBlocks for flexibility
 * Child blocks: ria/accordion-item
 */

import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	useInnerBlocksProps,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	ColorPicker,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';

registerBlockType('ria/accordion', {
	edit: ({ attributes, setAttributes, clientId }) => {
		const {
		layout,
		accordionType,
		allowMultipleOpen,
		defaultOpen,
		iconPosition,
		openIcon,
		closeIcon,
		iconSize,
		titleTag,
		titleSize,
		titlePadding,
		contentPadding,
		itemSpacing,
		animationSpeed,
		smooth,
		showDividers,
		dividerWidth,
		borderWidth,
		borderStyle,
		borderRadius,
		boxShadow,
		hoverShadow,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		hoverAnimation,
		staggerAnimation,
		staggerDelay,
		variant,
		customIconColor,
		customTitleColor,
		customTitleBackground,
		customContentColor,
		customBorderColor,
		titleBackgroundColor,
		contentBackgroundColor,
		titleColor,
		contentColor,
		borderColor,
		dividerColor,
	} = attributes;

		const blockProps = useBlockProps({
			className: `ria-accordion layout-${layout} accordion-type-${accordionType}`,
			style: {
				gap: itemSpacing ? `${itemSpacing}px` : undefined,
			},
		});

		const innerBlocksProps = useInnerBlocksProps(
			{
				className: 'accordion-items-wrapper',
			},
			{
				allowedBlocks: ['ria/accordion-item'],
				template: [
					['ria/accordion-item', { title: 'First Accordion Item' }],
					['ria/accordion-item', { title: 'Second Accordion Item' }],
				],
				renderAppender: () => (
					<Button
						variant="secondary"
						className="add-accordion-item-button"
						onClick={() => {
							const { dispatch } = wp.data;
							const { insertBlock } = dispatch('core/block-editor');
							const { createBlock } = wp.blocks;

							const newBlock = createBlock('ria/accordion-item', {
								title: 'New Accordion Item',
							});

							insertBlock(newBlock, undefined, clientId);
						}}
					>
						{__('+ Add Accordion Item', 'ria-accordion')}
					</Button>
				),
			}
		);

		return (
			<>
				<InspectorControls>
					{/* Layout & Behavior */}
					<PanelBody title={__('Layout & Behavior', 'ria-accordion')} initialOpen={true}>
						<SelectControl
							label={__('Layout Style', 'ria-accordion')}
							value={layout}
							options={[
								{ label: __('Default', 'ria-accordion'), value: 'default' },
								{ label: __('Minimal', 'ria-accordion'), value: 'minimal' },
								{ label: __('Bordered', 'ria-accordion'), value: 'bordered' },
								{ label: __('Filled', 'ria-accordion'), value: 'filled' },
							]}
							onChange={(value) => setAttributes({ layout: value })}
						/>

						<SelectControl
							label={__('Accordion Type', 'ria-accordion')}
							value={accordionType}
							options={[
								{ label: __('Accordion (single open)', 'ria-accordion'), value: 'accordion' },
								{ label: __('Toggle (multiple open)', 'ria-accordion'), value: 'toggle' },
							]}
							onChange={(value) => {
								setAttributes({
									accordionType: value,
									allowMultipleOpen: value === 'toggle',
								});
							}}
							help={__('Accordion allows only one panel open at a time. Toggle allows multiple.', 'ria-accordion')}
						/>

						{accordionType === 'toggle' && (
							<ToggleControl
								label={__('Allow Multiple Open', 'ria-accordion')}
								checked={allowMultipleOpen}
								onChange={(value) => setAttributes({ allowMultipleOpen: value })}
							/>
						)}

						<RangeControl
							label={__('Item Spacing (px)', 'ria-accordion')}
							value={itemSpacing}
							onChange={(value) => setAttributes({ itemSpacing: value })}
							min={0}
							max={32}
						/>

					{/* Color Scheme */}
					<PanelBody title={__('Color Scheme', 'ria-accordion')}>
						<SelectControl
							label={__('Variant', 'ria-accordion')}
							value={variant}
							options={[
								{ label: __('Primary (Navy)', 'ria-accordion'), value: 'primary' },
								{ label: __('Secondary (Green)', 'ria-accordion'), value: 'secondary' },
								{ label: __('Tertiary (Orange)', 'ria-accordion'), value: 'tertiary' },
								{ label: __('Neutral (Gray)', 'ria-accordion'), value: 'neutral' },
								{ label: __('Custom', 'ria-accordion'), value: 'custom' },
							]}
							onChange={(value) => setAttributes({ variant: value })}
							help={__('Choose a color scheme from your theme, or select Custom for manual control', 'ria-accordion')}
						/>
					</PanelBody>

					{variant === 'custom' && (
						<PanelColorSettings
							title={__('Custom Colors', 'ria-accordion')}
							colorSettings={[
								{
									value: customIconColor,
									onChange: (value) => setAttributes({ customIconColor: value }),
									label: __('Icon Color', 'ria-accordion'),
								},
								{
									value: customTitleColor,
									onChange: (value) => setAttributes({ customTitleColor: value }),
									label: __('Title Text Color', 'ria-accordion'),
								},
								{
									value: customTitleBackground,
									onChange: (value) => setAttributes({ customTitleBackground: value }),
									label: __('Title Background', 'ria-accordion'),
								},
								{
									value: customContentColor,
									onChange: (value) => setAttributes({ customContentColor: value }),
									label: __('Content Text Color', 'ria-accordion'),
								},
								{
									value: customBorderColor,
									onChange: (value) => setAttributes({ customBorderColor: value }),
									label: __('Border Color', 'ria-accordion'),
								},
							]}
						/>
					)}

					</PanelBody>

					{/* Icons */}
					<PanelBody title={__('Icons', 'ria-accordion')}>
						<SelectControl
							label={__('Icon Position', 'ria-accordion')}
							value={iconPosition}
							options={[
								{ label: __('Left', 'ria-accordion'), value: 'left' },
								{ label: __('Right', 'ria-accordion'), value: 'right' },
								{ label: __('None', 'ria-accordion'), value: 'none' },
							]}
							onChange={(value) => setAttributes({ iconPosition: value })}
						/>

						{iconPosition !== 'none' && (
							<>
								<RangeControl
									label={__('Icon Size (px)', 'ria-accordion')}
									value={iconSize}
									onChange={(value) => setAttributes({ iconSize: value })}
									min={12}
									max={48}
								/>

							</>
						)}
					</PanelBody>

					{/* Typography */}
					<PanelBody title={__('Typography', 'ria-accordion')}>
						<SelectControl
							label={__('Title Tag', 'ria-accordion')}
							value={titleTag}
							options={[
								{ label: 'H2', value: 'h2' },
								{ label: 'H3', value: 'h3' },
								{ label: 'H4', value: 'h4' },
								{ label: 'H5', value: 'h5' },
								{ label: 'H6', value: 'h6' },
								{ label: 'DIV', value: 'div' },
							]}
							onChange={(value) => setAttributes({ titleTag: value })}
						/>

						<SelectControl
							label={__('Title Size', 'ria-accordion')}
							value={titleSize}
							options={[
								{ label: __('Small', 'ria-accordion'), value: 'small' },
								{ label: __('Medium', 'ria-accordion'), value: 'medium' },
								{ label: __('Large', 'ria-accordion'), value: 'large' },
								{ label: __('Extra Large', 'ria-accordion'), value: 'xlarge' },
							]}
							onChange={(value) => setAttributes({ titleSize: value })}
						/>


						<p className="components-base-control__label">
							{__('Title Background', 'ria-accordion')}
						</p>
						<ColorPicker
							color={titleBackgroundColor}
							onChangeComplete={(color) => setAttributes({ titleBackgroundColor: color.hex })}
							enableAlpha
						/>


						<p className="components-base-control__label">
							{__('Content Background', 'ria-accordion')}
						</p>
						<ColorPicker
							color={contentBackgroundColor}
							onChangeComplete={(color) => setAttributes({ contentBackgroundColor: color.hex })}
							enableAlpha
						/>
					</PanelBody>

					{/* Spacing */}
					<PanelBody title={__('Spacing', 'ria-accordion')}>
						<RangeControl
							label={__('Title Padding (px)', 'ria-accordion')}
							value={titlePadding}
							onChange={(value) => setAttributes({ titlePadding: value })}
							min={0}
							max={48}
						/>

						<RangeControl
							label={__('Content Padding (px)', 'ria-accordion')}
							value={contentPadding}
							onChange={(value) => setAttributes({ contentPadding: value })}
							min={0}
							max={48}
						/>
					</PanelBody>

					{/* Dividers */}
					<PanelBody title={__('Dividers', 'ria-accordion')}>
						<ToggleControl
							label={__('Show Dividers', 'ria-accordion')}
							checked={showDividers}
							onChange={(value) => setAttributes({ showDividers: value })}
						/>

						{showDividers && (
							<>
								<RangeControl
									label={__('Divider Width (px)', 'ria-accordion')}
									value={dividerWidth}
									onChange={(value) => setAttributes({ dividerWidth: value })}
									min={1}
									max={5}
								/>

								<p className="components-base-control__label">
									{__('Divider Color', 'ria-accordion')}
								</p>
								<ColorPicker
									color={dividerColor}
									onChangeComplete={(color) => setAttributes({ dividerColor: color.hex })}
								/>
							</>
						)}
					</PanelBody>

					{/* Borders & Shadows */}
					<PanelBody title={__('Borders & Shadows', 'ria-accordion')}>
						<RangeControl
							label={__('Border Width (px)', 'ria-accordion')}
							value={borderWidth}
							onChange={(value) => setAttributes({ borderWidth: value })}
							min={0}
							max={10}
						/>

						{borderWidth > 0 && (
							<>
								<SelectControl
									label={__('Border Style', 'ria-accordion')}
									value={borderStyle}
									options={[
										{ label: __('Solid', 'ria-accordion'), value: 'solid' },
										{ label: __('Dashed', 'ria-accordion'), value: 'dashed' },
										{ label: __('Dotted', 'ria-accordion'), value: 'dotted' },
										{ label: __('Double', 'ria-accordion'), value: 'double' },
									]}
									onChange={(value) => setAttributes({ borderStyle: value })}
								/>

								<p className="components-base-control__label">
									{__('Border Color', 'ria-accordion')}
								</p>
								<ColorPicker
									color={borderColor}
									onChangeComplete={(color) => setAttributes({ borderColor: color.hex })}
								/>
							</>
						)}

						<RangeControl
							label={__('Border Radius (px)', 'ria-accordion')}
							value={borderRadius}
							onChange={(value) => setAttributes({ borderRadius: value })}
							min={0}
							max={24}
						/>

						<SelectControl
							label={__('Box Shadow', 'ria-accordion')}
							value={boxShadow}
							options={[
								{ label: __('None', 'ria-accordion'), value: 'none' },
								{ label: __('Small', 'ria-accordion'), value: 'small' },
								{ label: __('Medium', 'ria-accordion'), value: 'medium' },
								{ label: __('Large', 'ria-accordion'), value: 'large' },
								{ label: __('Extra Large', 'ria-accordion'), value: 'xlarge' },
							]}
							onChange={(value) => setAttributes({ boxShadow: value })}
						/>

						<SelectControl
							label={__('Hover Shadow', 'ria-accordion')}
							value={hoverShadow}
							options={[
								{ label: __('None', 'ria-accordion'), value: 'none' },
								{ label: __('Small', 'ria-accordion'), value: 'small' },
								{ label: __('Medium', 'ria-accordion'), value: 'medium' },
								{ label: __('Large', 'ria-accordion'), value: 'large' },
								{ label: __('Extra Large', 'ria-accordion'), value: 'xlarge' },
							]}
							onChange={(value) => setAttributes({ hoverShadow: value })}
						/>
					</PanelBody>

					{/* Animation */}
					<PanelBody title={__('Animation', 'ria-accordion')}>
						<RangeControl
							label={__('Animation Speed (ms)', 'ria-accordion')}
							value={animationSpeed}
							onChange={(value) => setAttributes({ animationSpeed: value })}
							min={100}
							max={1000}
							step={50}
							help={__('Speed for panel expand/collapse animation', 'ria-accordion')}
						/>

						<ToggleControl
							label={__('Smooth Animation', 'ria-accordion')}
							checked={smooth}
							onChange={(value) => setAttributes({ smooth: value })}
						/>

						<ToggleControl
							label={__('Enable Container Animation', 'ria-accordion')}
							checked={animationEnabled}
							onChange={(value) => setAttributes({ animationEnabled: value })}
							help={__('Animate entire accordion when scrolling into view', 'ria-accordion')}
						/>

						{animationEnabled && (
							<>
								<SelectControl
									label={__('Animation Type', 'ria-accordion')}
									value={animationType}
									options={[
										{ label: __('Fade In', 'ria-accordion'), value: 'fadeIn' },
										{ label: __('Fade In Up', 'ria-accordion'), value: 'fadeInUp' },
										{ label: __('Fade In Down', 'ria-accordion'), value: 'fadeInDown' },
										{ label: __('Slide In Up', 'ria-accordion'), value: 'slideInUp' },
										{ label: __('Zoom In', 'ria-accordion'), value: 'zoomIn' },
									]}
									onChange={(value) => setAttributes({ animationType: value })}
								/>

								<RangeControl
									label={__('Duration (ms)', 'ria-accordion')}
									value={animationDuration}
									onChange={(value) => setAttributes({ animationDuration: value })}
									min={100}
									max={2000}
									step={100}
								/>

								<RangeControl
									label={__('Delay (ms)', 'ria-accordion')}
									value={animationDelay}
									onChange={(value) => setAttributes({ animationDelay: value })}
									min={0}
									max={1000}
									step={100}
								/>

								<ToggleControl
									label={__('Stagger Items', 'ria-accordion')}
									checked={staggerAnimation}
									onChange={(value) => setAttributes({ staggerAnimation: value })}
									help={__('Animate items sequentially', 'ria-accordion')}
								/>

								{staggerAnimation && (
									<RangeControl
										label={__('Stagger Delay (ms)', 'ria-accordion')}
										value={staggerDelay}
										onChange={(value) => setAttributes({ staggerDelay: value })}
										min={0}
										max={500}
										step={50}
									/>
								)}
							</>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			layout,
			accordionType,
			allowMultipleOpen,
			defaultOpen,
			animationSpeed,
			smooth,
			animationEnabled,
			animationType,
			animationDuration,
			animationDelay,
			animationEasing,
			itemSpacing,
			titleBackgroundColor,
			contentBackgroundColor,
			titleColor,
			contentColor,
			borderColor,
			dividerColor,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `ria-accordion layout-${layout} accordion-type-${accordionType}`,
			'data-accordion-config': JSON.stringify({
				allowMultipleOpen,
				defaultOpen,
				animationSpeed,
				smooth,
			}),
			'data-animation': animationEnabled ? animationType : 'none',
			'data-animation-duration': animationDuration,
			'data-animation-delay': animationDelay,
			'data-animation-easing': animationEasing,
			style: {
				gap: itemSpacing ? `${itemSpacing}px` : undefined,
			},
		});

		return (
			<div {...blockProps}>
				<div className="accordion-items-wrapper">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},

	// Provide context to child blocks
	providesContext: {
		'ria/accordion/iconPosition': 'iconPosition',
		'ria/accordion/openIcon': 'openIcon',
		'ria/accordion/closeIcon': 'closeIcon',
		'ria/accordion/iconSize': 'iconSize',
		'ria/accordion/iconColor': 'iconColor',
		'ria/accordion/titleTag': 'titleTag',
		'ria/accordion/titleSize': 'titleSize',
		'ria/accordion/titleColor': 'titleColor',
		'ria/accordion/titleBackgroundColor': 'titleBackgroundColor',
		'ria/accordion/titleHoverColor': 'titleHoverColor',
		'ria/accordion/contentColor': 'contentColor',
		'ria/accordion/contentBackgroundColor': 'contentBackgroundColor',
		'ria/accordion/titlePadding': 'titlePadding',
		'ria/accordion/contentPadding': 'contentPadding',
		'ria/accordion/borderWidth': 'borderWidth',
		'ria/accordion/borderStyle': 'borderStyle',
		'ria/accordion/borderColor': 'borderColor',
		'ria/accordion/borderRadius': 'borderRadius',
		'ria/accordion/boxShadow': 'boxShadow',
		'ria/accordion/hoverShadow': 'hoverShadow',
	},
});
