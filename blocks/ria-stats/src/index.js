import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	PanelColorSettings,
	__experimentalColorGradientControl as ColorGradientControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

const ALLOWED_BLOCKS = ['ria/stat'];

const TEMPLATE = [
	['ria/stat', { value: '250+', label: 'Projects Completed' }],
	['ria/stat', { value: '98%', label: 'Client Satisfaction' }],
	['ria/stat', { value: '15', label: 'Years Experience' }],
];

registerBlockType(metadata.name, {
	...metadata,
	edit: ({ attributes, setAttributes }) => {
		const {
			columns,
			columnsTablet,
			columnsMobile,
			gap,
			style,
			alignment,
			verticalAlignment,
			variant,
			customBackgroundColor,
			customCardBackgroundColor,
			customDividerColor,
			customBorderColor,
			showDividers,
			dividerWidth,
			dividerStyle,
			equalHeight,
			countUpAnimation,
			countUpDuration,
			countUpDelay,
			borderWidth,
			borderStyle,
			borderRadius,
			boxShadow,
			hoverShadow,
			animationEnabled,
			animationType,
			animationDuration,
			animationDelay,
			animationEasing,
			hoverAnimation,
			staggerAnimation,
			staggerDelay,
		} = attributes;

		const blockProps = useBlockProps({
			className: `ria-stats-group variant-${variant} style-${style} align-${alignment} valign-${verticalAlignment}${equalHeight ? ' equal-height' : ''}${showDividers ? ' has-dividers' : ''}`,
			style: {
				backgroundColor: customBackgroundColor || undefined,
				gap: `${gap}px`,
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
			},
		});

		return (
			<>
				<InspectorControls>
					{/* Layout Settings */}
					<PanelBody title={__('Layout Settings', 'ria-stats-group')} initialOpen={true}>
						<RangeControl
							label={__('Columns (Desktop)', 'ria-stats-group')}
							value={columns}
							onChange={(value) => setAttributes({ columns: value })}
							min={1}
							max={6}
							help={__('Number of columns on desktop screens', 'ria-stats-group')}
						/>
						<RangeControl
							label={__('Columns (Tablet)', 'ria-stats-group')}
							value={columnsTablet}
							onChange={(value) => setAttributes({ columnsTablet: value })}
							min={1}
							max={4}
							help={__('Number of columns on tablet screens', 'ria-stats-group')}
						/>
						<RangeControl
							label={__('Columns (Mobile)', 'ria-stats-group')}
							value={columnsMobile}
							onChange={(value) => setAttributes({ columnsMobile: value })}
							min={1}
							max={2}
							help={__('Number of columns on mobile screens', 'ria-stats-group')}
						/>
						<RangeControl
							label={__('Gap Between Items', 'ria-stats-group')}
							value={gap}
							onChange={(value) => setAttributes({ gap: value })}
							min={0}
							max={80}
							help={__('Space between stat items in pixels', 'ria-stats-group')}
						/>
						<SelectControl
							label={__('Horizontal Alignment', 'ria-stats-group')}
							value={alignment}
							onChange={(value) => setAttributes({ alignment: value })}
							options={[
								{ label: __('Left', 'ria-stats-group'), value: 'left' },
								{ label: __('Center', 'ria-stats-group'), value: 'center' },
								{ label: __('Right', 'ria-stats-group'), value: 'right' },
							]}
						/>
						<SelectControl
							label={__('Vertical Alignment', 'ria-stats-group')}
							value={verticalAlignment}
							onChange={(value) => setAttributes({ verticalAlignment: value })}
							options={[
								{ label: __('Top', 'ria-stats-group'), value: 'top' },
								{ label: __('Center', 'ria-stats-group'), value: 'center' },
								{ label: __('Bottom', 'ria-stats-group'), value: 'bottom' },
								{ label: __('Stretch', 'ria-stats-group'), value: 'stretch' },
							]}
						/>
						<ToggleControl
							label={__('Equal Height Items', 'ria-stats-group')}
							checked={equalHeight}
							onChange={(value) => setAttributes({ equalHeight: value })}
							help={__('Make all stat items the same height', 'ria-stats-group')}
						/>
					</PanelBody>

					{/* Style Settings */}
					<PanelBody title={__('Style Settings', 'ria-stats-group')} initialOpen={false}>
						<SelectControl
							label={__('Style Variant', 'ria-stats-group')}
							value={style}
							onChange={(value) => setAttributes({ style: value })}
							options={[
								{ label: __('Default', 'ria-stats-group'), value: 'default' },
								{ label: __('Cards', 'ria-stats-group'), value: 'cards' },
								{ label: __('Minimal', 'ria-stats-group'), value: 'minimal' },
								{ label: __('Bordered', 'ria-stats-group'), value: 'bordered' },
								{ label: __('Background', 'ria-stats-group'), value: 'background' },
							]}
							help={__('Visual style for the stats group', 'ria-stats-group')}
						/>
						<ColorGradientControl
							label={__('Container Background Color', 'ria-stats-group')}
							colorValue={customBackgroundColor}
							onColorChange={(value) => setAttributes({ customBackgroundColor: value })}
						/>
						{(style === 'cards' || style === 'background') && (
							<ColorGradientControl
								label={__('Card Background Color', 'ria-stats-group')}
								colorValue={cardBackgroundColor}
								onColorChange={(value) => setAttributes({ cardBackgroundColor: value })}
							/>
						)}
					</PanelBody>

					{/* Border & Shadow */}
					<PanelBody title={__('Border & Shadow', 'ria-stats-group')} initialOpen={false}>
						<RangeControl
							label={__('Border Width', 'ria-stats-group')}
							value={borderWidth}
							onChange={(value) => setAttributes({ borderWidth: value })}
							min={0}
							max={10}
						/>
						{borderWidth > 0 && (
							<>
								<SelectControl
									label={__('Border Style', 'ria-stats-group')}
									value={borderStyle}
									onChange={(value) => setAttributes({ borderStyle: value })}
									options={[
										{ label: __('None', 'ria-stats-group'), value: 'none' },
										{ label: __('Solid', 'ria-stats-group'), value: 'solid' },
										{ label: __('Dashed', 'ria-stats-group'), value: 'dashed' },
										{ label: __('Dotted', 'ria-stats-group'), value: 'dotted' },
										{ label: __('Double', 'ria-stats-group'), value: 'double' },
										{ label: __('Groove', 'ria-stats-group'), value: 'groove' },
										{ label: __('Ridge', 'ria-stats-group'), value: 'ridge' },
									]}
								/>
								<ColorGradientControl
									label={__('Border Color', 'ria-stats-group')}
									colorValue={customBorderColor}
									onColorChange={(value) => setAttributes({ customBorderColor: value })}
								/>
							</>
						)}
						<RangeControl
							label={__('Border Radius', 'ria-stats-group')}
							value={borderRadius}
							onChange={(value) => setAttributes({ borderRadius: value })}
							min={0}
							max={50}
						/>
						<SelectControl
							label={__('Box Shadow', 'ria-stats-group')}
							value={boxShadow}
							onChange={(value) => setAttributes({ boxShadow: value })}
							options={[
								{ label: __('None', 'ria-stats-group'), value: 'none' },
								{ label: __('Small', 'ria-stats-group'), value: 'small' },
								{ label: __('Medium', 'ria-stats-group'), value: 'medium' },
								{ label: __('Large', 'ria-stats-group'), value: 'large' },
								{ label: __('X-Large', 'ria-stats-group'), value: 'xlarge' },
								{ label: __('2X-Large', 'ria-stats-group'), value: '2xlarge' },
								{ label: __('Inner', 'ria-stats-group'), value: 'inner' },
							]}
						/>
						<SelectControl
							label={__('Hover Shadow', 'ria-stats-group')}
							value={hoverShadow}
							onChange={(value) => setAttributes({ hoverShadow: value })}
							options={[
								{ label: __('None', 'ria-stats-group'), value: 'none' },
								{ label: __('Small', 'ria-stats-group'), value: 'small' },
								{ label: __('Medium', 'ria-stats-group'), value: 'medium' },
								{ label: __('Large', 'ria-stats-group'), value: 'large' },
								{ label: __('X-Large', 'ria-stats-group'), value: 'xlarge' },
								{ label: __('2X-Large', 'ria-stats-group'), value: '2xlarge' },
							]}
						/>
					</PanelBody>

					{/* Dividers */}
					<PanelBody title={__('Dividers', 'ria-stats-group')} initialOpen={false}>
						<ToggleControl
							label={__('Show Dividers', 'ria-stats-group')}
							checked={showDividers}
							onChange={(value) => setAttributes({ showDividers: value })}
							help={__('Display dividers between stat items', 'ria-stats-group')}
						/>
						{showDividers && (
							<>
								<ColorGradientControl
									label={__('Divider Color', 'ria-stats-group')}
									colorValue={dividerColor}
									onColorChange={(value) => setAttributes({ dividerColor: value })}
								/>
								<RangeControl
									label={__('Divider Width', 'ria-stats-group')}
									value={dividerWidth}
									onChange={(value) => setAttributes({ dividerWidth: value })}
									min={1}
									max={5}
								/>
								<SelectControl
									label={__('Divider Style', 'ria-stats-group')}
									value={dividerStyle}
									onChange={(value) => setAttributes({ dividerStyle: value })}
									options={[
										{ label: __('Solid', 'ria-stats-group'), value: 'solid' },
										{ label: __('Dashed', 'ria-stats-group'), value: 'dashed' },
										{ label: __('Dotted', 'ria-stats-group'), value: 'dotted' },
									]}
								/>
							</>
						)}
					</PanelBody>

					{/* Count-Up Animation */}
					<PanelBody title={__('Count-Up Animation', 'ria-stats-group')} initialOpen={false}>
						<ToggleControl
							label={__('Enable Count-Up Animation', 'ria-stats-group')}
							checked={countUpAnimation}
							onChange={(value) => setAttributes({ countUpAnimation: value })}
							help={__('Animate numbers counting up when they enter the viewport', 'ria-stats-group')}
						/>
						{countUpAnimation && (
							<>
								<RangeControl
									label={__('Animation Duration (seconds)', 'ria-stats-group')}
									value={countUpDuration}
									onChange={(value) => setAttributes({ countUpDuration: value })}
									min={0.5}
									max={5}
									step={0.1}
									help={__('How long the count-up animation takes', 'ria-stats-group')}
								/>
								<RangeControl
									label={__('Animation Delay (seconds)', 'ria-stats-group')}
									value={countUpDelay}
									onChange={(value) => setAttributes({ countUpDelay: value })}
									min={0}
									max={2}
									step={0.1}
									help={__('Delay before starting the count-up animation', 'ria-stats-group')}
								/>
							</>
						)}
					</PanelBody>

					{/* Scroll Animation */}
					<PanelBody title={__('Scroll Animation', 'ria-stats-group')} initialOpen={false}>
						<ToggleControl
							label={__('Enable Scroll Animation', 'ria-stats-group')}
							checked={animationEnabled}
							onChange={(value) => setAttributes({ animationEnabled: value })}
							help={__('Animate the stats group when it enters the viewport', 'ria-stats-group')}
						/>
						{animationEnabled && (
							<>
								<SelectControl
									label={__('Animation Type', 'ria-stats-group')}
									value={animationType}
									onChange={(value) => setAttributes({ animationType: value })}
									options={[
										{ label: __('Fade In', 'ria-stats-group'), value: 'fadeIn' },
										{ label: __('Fade In Up', 'ria-stats-group'), value: 'fadeInUp' },
										{ label: __('Fade In Down', 'ria-stats-group'), value: 'fadeInDown' },
										{ label: __('Fade In Left', 'ria-stats-group'), value: 'fadeInLeft' },
										{ label: __('Fade In Right', 'ria-stats-group'), value: 'fadeInRight' },
										{ label: __('Slide In Up', 'ria-stats-group'), value: 'slideInUp' },
										{ label: __('Slide In Down', 'ria-stats-group'), value: 'slideInDown' },
										{ label: __('Slide In Left', 'ria-stats-group'), value: 'slideInLeft' },
										{ label: __('Slide In Right', 'ria-stats-group'), value: 'slideInRight' },
										{ label: __('Zoom In', 'ria-stats-group'), value: 'zoomIn' },
										{ label: __('Zoom In Up', 'ria-stats-group'), value: 'zoomInUp' },
										{ label: __('Bounce In', 'ria-stats-group'), value: 'bounceIn' },
										{ label: __('Rotate In', 'ria-stats-group'), value: 'rotateIn' },
										{ label: __('Flip In X', 'ria-stats-group'), value: 'flipInX' },
										{ label: __('Flip In Y', 'ria-stats-group'), value: 'flipInY' },
										{ label: __('None', 'ria-stats-group'), value: 'none' },
									]}
								/>
								<RangeControl
									label={__('Animation Duration (ms)', 'ria-stats-group')}
									value={animationDuration}
									onChange={(value) => setAttributes({ animationDuration: value })}
									min={100}
									max={3000}
									step={100}
								/>
								<RangeControl
									label={__('Animation Delay (ms)', 'ria-stats-group')}
									value={animationDelay}
									onChange={(value) => setAttributes({ animationDelay: value })}
									min={0}
									max={2000}
									step={100}
								/>
								<SelectControl
									label={__('Animation Easing', 'ria-stats-group')}
									value={animationEasing}
									onChange={(value) => setAttributes({ animationEasing: value })}
									options={[
										{ label: __('Linear', 'ria-stats-group'), value: 'linear' },
										{ label: __('Ease', 'ria-stats-group'), value: 'ease' },
										{ label: __('Ease In', 'ria-stats-group'), value: 'ease-in' },
										{ label: __('Ease Out', 'ria-stats-group'), value: 'ease-out' },
										{ label: __('Ease In Out', 'ria-stats-group'), value: 'ease-in-out' },
									]}
								/>
								<ToggleControl
									label={__('Stagger Animation', 'ria-stats-group')}
									checked={staggerAnimation}
									onChange={(value) => setAttributes({ staggerAnimation: value })}
									help={__('Animate items one after another', 'ria-stats-group')}
								/>
								{staggerAnimation && (
									<RangeControl
										label={__('Stagger Delay (ms)', 'ria-stats-group')}
										value={staggerDelay}
										onChange={(value) => setAttributes({ staggerDelay: value })}
										min={0}
										max={500}
										step={50}
										help={__('Delay between each item animation', 'ria-stats-group')}
									/>
								)}
							</>
						)}
					</PanelBody>

					{/* Hover Animation */}
					<PanelBody title={__('Hover Animation', 'ria-stats-group')} initialOpen={false}>
						<SelectControl
							label={__('Hover Animation', 'ria-stats-group')}
							value={hoverAnimation}
							onChange={(value) => setAttributes({ hoverAnimation: value })}
							options={[
								{ label: __('None', 'ria-stats-group'), value: 'none' },
								{ label: __('Lift', 'ria-stats-group'), value: 'lift' },
								{ label: __('Grow', 'ria-stats-group'), value: 'grow' },
								{ label: __('Shrink', 'ria-stats-group'), value: 'shrink' },
								{ label: __('Rotate', 'ria-stats-group'), value: 'rotate' },
								{ label: __('Tilt', 'ria-stats-group'), value: 'tilt' },
								{ label: __('Glow', 'ria-stats-group'), value: 'glow' },
								{ label: __('Pulse', 'ria-stats-group'), value: 'pulse' },
								{ label: __('Bounce', 'ria-stats-group'), value: 'bounce' },
							]}
							help={__('Animation effect when hovering over stat items', 'ria-stats-group')}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={TEMPLATE}
						orientation="horizontal"
					/>
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const {
			columns,
			columnsTablet,
			columnsMobile,
			gap,
			style,
			alignment,
			verticalAlignment,
			variant,
			customBackgroundColor,
			customCardBackgroundColor,
			customDividerColor,
			customBorderColor,
			cardBackgroundColor,
			dividerColor,
			showDividers,
			dividerWidth,
			dividerStyle,
			equalHeight,
			countUpAnimation,
			countUpDuration,
			countUpDelay,
			borderWidth,
			borderStyle,
			borderRadius,
			boxShadow,
			hoverShadow,
			animationEnabled,
			animationType,
			animationDuration,
			animationDelay,
			animationEasing,
			hoverAnimation,
			staggerAnimation,
			staggerDelay,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `ria-stats-group variant-${variant} style-${style} align-${alignment} valign-${verticalAlignment}${equalHeight ? ' equal-height' : ''}${showDividers ? ' has-dividers' : ''} shadow-${boxShadow} hover-shadow-${hoverShadow} hover-${hoverAnimation}`,
			style: {
				'--stats-columns': String(columns),
				'--stats-columns-tablet': String(columnsTablet),
				'--stats-columns-mobile': String(columnsMobile),
				'--stats-gap': `${gap}px`,
				'--bg-color': customBackgroundColor || undefined,
				'--card-bg-color': cardBackgroundColor || undefined,
				'--divider-color': dividerColor || undefined,
				'--divider-width': `${dividerWidth}px`,
				'--divider-style': dividerStyle,
				'--border-width': `${borderWidth}px`,
				'--border-style': borderStyle,
				'--border-color': customBorderColor,
				'--border-radius': `${borderRadius}px`,
			},
			'data-animation': animationEnabled ? animationType : 'none',
			'data-animation-duration': animationDuration,
			'data-animation-delay': animationDelay,
			'data-animation-easing': animationEasing,
			'data-stagger': staggerAnimation,
			'data-stagger-delay': staggerDelay,
			'data-countup': countUpAnimation,
			'data-countup-duration': countUpDuration,
			'data-countup-delay': countUpDelay,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
