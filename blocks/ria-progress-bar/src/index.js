import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	__experimentalColorGradientControl as ColorGradientControl,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
	Button,
	__experimentalBoxControl as BoxControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Trash2, Plus } from 'lucide-react';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
	...metadata,
	edit: ({ attributes, setAttributes }) => {
		const {
			bars,
			layout,
			showLabel,
			labelPosition,
			showPercentage,
			percentagePosition,
			height,
			variant,
			customBarColor,
			customBackgroundColor,
			customTextColor,
			customInsideTextColor,
			customBorderColor,
			useGradient,
			customGradientStart,
			customGradientEnd,
			gradientDirection,
			stripedPattern,
			animated,
			animateOnScroll,
			animationDuration,
			animationDelay,
			easing,
			showIcon,
			icon,
			iconPosition,
			borderWidth,
			borderStyle,
			borderRadius,
			boxShadow,
			hoverShadow,
			animationEnabled,
			animationType,
			containerAnimationDuration,
			containerAnimationDelay,
			animationEasing,
			hoverAnimation,
		} = attributes;

		const [selectedBar, setSelectedBar] = useState(0);

		// Update a specific bar
		const updateBar = (index, key, value) => {
			const newBars = [...bars];
			newBars[index] = { ...newBars[index], [key]: value };
			setAttributes({ bars: newBars });
		};

		// Add a new bar
		const addBar = () => {
			setAttributes({
				bars: [
					...bars,
					{
						label: 'New Progress',
						percentage: 50,
					},
				],
			});
			setSelectedBar(bars.length);
		};

		// Remove a bar
		const removeBar = (index) => {
			const newBars = bars.filter((_, i) => i !== index);
			setAttributes({ bars: newBars });
			if (selectedBar >= newBars.length) {
				setSelectedBar(Math.max(0, newBars.length - 1));
			}
		};

		const blockProps = useBlockProps({
			className: `ria-progress-bar variant-${variant} layout-${layout} label-${labelPosition} percentage-${percentagePosition} shadow-${boxShadow} hover-shadow-${hoverShadow} hover-${hoverAnimation}${stripedPattern ? ' striped' : ''}${animated ? ' animated' : ''}`,
		});

		const getGradientStyle = (color) => {
			if (!useGradient) return color;

			const directions = {
				horizontal: 'to right',
				vertical: 'to bottom',
				diagonal: 'to bottom right',
			};

			// Use custom gradient colors if variant is custom, otherwise use default theme colors
			const startColor = variant === 'custom' && customGradientStart ? customGradientStart : color;
			const endColor = variant === 'custom' && customGradientEnd ? customGradientEnd : color;

			return `linear-gradient(${directions[gradientDirection]}, ${startColor}, ${endColor})`;
		};

		return (
			<>
				<InspectorControls>
					{/* Bars Management */}
					<PanelBody title={__('Progress Bars', 'ria-progress-bar')} initialOpen={true}>
						<div className="bars-list">
							{bars.map((bar, index) => (
								<div
									key={index}
									className={`bar-item ${selectedBar === index ? 'active' : ''}`}
									style={{ marginBottom: '8px' }}
								>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<Button
											isSecondary
											onClick={() => setSelectedBar(index)}
											style={{ flex: 1, justifyContent: 'flex-start' }}
										>
											{bar.label || `Bar ${index + 1}`} - {bar.percentage}%
										</Button>
										{bars.length > 1 && (
											<Button
												isDestructive
												icon={<Trash2 />}
												onClick={() => removeBar(index)}
												label={__('Remove Bar', 'ria-progress-bar')}
											/>
										)}
									</div>
								</div>
							))}
						</div>
						<Button isPrimary icon={<Plus />} onClick={addBar} style={{ marginTop: '12px' }}>
							{__('Add Progress Bar', 'ria-progress-bar')}
						</Button>

						{bars[selectedBar] && (
							<>
								<hr style={{ margin: '20px 0' }} />
								<h3>{__('Edit Bar', 'ria-progress-bar')}: {bars[selectedBar].label || `Bar ${selectedBar + 1}`}</h3>
								<TextControl
									label={__('Label', 'ria-progress-bar')}
									value={bars[selectedBar].label || ''}
									onChange={(value) => updateBar(selectedBar, 'label', value)}
									placeholder={__('Enter label...', 'ria-progress-bar')}
								/>
								<RangeControl
									label={__('Percentage', 'ria-progress-bar')}
									value={bars[selectedBar].percentage || 0}
									onChange={(value) => updateBar(selectedBar, 'percentage', value)}
									min={0}
									max={100}
									help={`${bars[selectedBar].percentage || 0}%`}
								/>
								<ColorGradientControl
									label={__('Bar Color', 'ria-progress-bar')}
									colorValue={bars[selectedBar].barColor || customBarColor}
									onColorChange={(value) => updateBar(selectedBar, 'barColor', value)}
								/>
							</>
						)}
					</PanelBody>

					{/* Layout Settings */}
					<PanelBody title={__('Layout', 'ria-progress-bar')} initialOpen={false}>
						<SelectControl
							label={__('Layout Style', 'ria-progress-bar')}
							value={layout}
							onChange={(value) => setAttributes({ layout: value })}
							options={[
								{ label: __('Default', 'ria-progress-bar'), value: 'default' },
								{ label: __('Thin', 'ria-progress-bar'), value: 'thin' },
								{ label: __('Thick', 'ria-progress-bar'), value: 'thick' },
								{ label: __('Rounded', 'ria-progress-bar'), value: 'rounded' },
								{ label: __('Minimal', 'ria-progress-bar'), value: 'minimal' },
							]}
						/>
						<RangeControl
							label={__('Bar Height', 'ria-progress-bar')}
							value={height}
							onChange={(value) => setAttributes({ height: value })}
							min={8}
							max={60}
							help={__('Height of the progress bar in pixels', 'ria-progress-bar')}
						/>
					</PanelBody>

					{/* Display Options */}
					<PanelBody title={__('Display Options', 'ria-progress-bar')} initialOpen={false}>
						<ToggleControl
							label={__('Show Label', 'ria-progress-bar')}
							checked={showLabel}
							onChange={(value) => setAttributes({ showLabel: value })}
						/>
						{showLabel && (
							<SelectControl
								label={__('Label Position', 'ria-progress-bar')}
								value={labelPosition}
								onChange={(value) => setAttributes({ labelPosition: value })}
								options={[
									{ label: __('Above', 'ria-progress-bar'), value: 'above' },
									{ label: __('Below', 'ria-progress-bar'), value: 'below' },
									{ label: __('Inside', 'ria-progress-bar'), value: 'inside' },
									{ label: __('Left', 'ria-progress-bar'), value: 'left' },
									{ label: __('Right', 'ria-progress-bar'), value: 'right' },
								]}
							/>
						)}
						<ToggleControl
							label={__('Show Percentage', 'ria-progress-bar')}
							checked={showPercentage}
							onChange={(value) => setAttributes({ showPercentage: value })}
						/>
						{showPercentage && (
							<SelectControl
								label={__('Percentage Position', 'ria-progress-bar')}
								value={percentagePosition}
								onChange={(value) => setAttributes({ percentagePosition: value })}
								options={[
									{ label: __('Inside Bar', 'ria-progress-bar'), value: 'inside' },
									{ label: __('Right of Bar', 'ria-progress-bar'), value: 'right' },
									{ label: __('Above Bar', 'ria-progress-bar'), value: 'above' },
									{ label: __('Below Bar', 'ria-progress-bar'), value: 'below' },
									{ label: __('None', 'ria-progress-bar'), value: 'none' },
								]}
							/>
						)}
						<ToggleControl
							label={__('Show Icon', 'ria-progress-bar')}
							checked={showIcon}
							onChange={(value) => setAttributes({ showIcon: value })}
						/>
						{showIcon && (
							<>
								<TextControl
									label={__('Icon Name', 'ria-progress-bar')}
									value={icon}
									onChange={(value) => setAttributes({ icon: value })}
									help={__('Enter Lucide icon name (e.g., "trophy", "check-circle")', 'ria-progress-bar')}
								/>
								<SelectControl
									label={__('Icon Position', 'ria-progress-bar')}
									value={iconPosition}
									onChange={(value) => setAttributes({ iconPosition: value })}
									options={[
										{ label: __('Left', 'ria-progress-bar'), value: 'left' },
										{ label: __('Right', 'ria-progress-bar'), value: 'right' },
									]}
								/>
							</>
						)}
					</PanelBody>

					{/* Color Scheme */}
					<PanelBody title={__('Color Scheme', 'ria-progress-bar')} initialOpen={false}>
						<SelectControl
							label={__('Variant', 'ria-progress-bar')}
							value={variant}
							options={[
								{ label: __('Primary (Navy)', 'ria-progress-bar'), value: 'primary' },
								{ label: __('Secondary (Green)', 'ria-progress-bar'), value: 'secondary' },
								{ label: __('Accent (Orange)', 'ria-progress-bar'), value: 'accent' },
								{ label: __('Neutral (Gray)', 'ria-progress-bar'), value: 'neutral' },
								{ label: __('Custom', 'ria-progress-bar'), value: 'custom' },
							]}
							onChange={(value) => setAttributes({ variant: value })}
							help={__('Choose a color scheme from your theme, or select Custom for manual control', 'ria-progress-bar')}
						/>
					</PanelBody>

					{variant === 'custom' && (
						<PanelColorSettings
							title={__('Custom Colors', 'ria-progress-bar')}
							colorSettings={[
								{
									value: customBarColor,
									onChange: (value) => setAttributes({ customBarColor: value }),
									label: __('Bar Color', 'ria-progress-bar'),
								},
								{
									value: customBackgroundColor,
									onChange: (value) => setAttributes({ customBackgroundColor: value }),
									label: __('Background Color', 'ria-progress-bar'),
								},
								{
									value: customTextColor,
									onChange: (value) => setAttributes({ customTextColor: value }),
									label: __('Text Color', 'ria-progress-bar'),
								},
								{
									value: customInsideTextColor,
									onChange: (value) => setAttributes({ customInsideTextColor: value }),
									label: __('Inside Text Color', 'ria-progress-bar'),
								},
								{
									value: customBorderColor,
									onChange: (value) => setAttributes({ customBorderColor: value }),
									label: __('Border Color', 'ria-progress-bar'),
								},
							]}
						/>
					)}

					{/* Gradients */}
					<PanelBody title={__('Gradient Effects', 'ria-progress-bar')} initialOpen={false}>
						<ToggleControl
							label={__('Use Gradient', 'ria-progress-bar')}
							checked={useGradient}
							onChange={(value) => setAttributes({ useGradient: value })}
							help={__('Apply gradient effect to progress bars', 'ria-progress-bar')}
						/>
						{useGradient && (
							<>
								<ColorGradientControl
									label={__('Gradient Start Color', 'ria-progress-bar')}
									colorValue={gradientStart}
									onColorChange={(value) => setAttributes({ gradientStart: value })}
								/>
								<ColorGradientControl
									label={__('Gradient End Color', 'ria-progress-bar')}
									colorValue={gradientEnd}
									onColorChange={(value) => setAttributes({ gradientEnd: value })}
								/>
								<SelectControl
									label={__('Gradient Direction', 'ria-progress-bar')}
									value={gradientDirection}
									onChange={(value) => setAttributes({ gradientDirection: value })}
									options={[
										{ label: __('Horizontal', 'ria-progress-bar'), value: 'horizontal' },
										{ label: __('Vertical', 'ria-progress-bar'), value: 'vertical' },
										{ label: __('Diagonal', 'ria-progress-bar'), value: 'diagonal' },
									]}
								/>
							</>
						)}
					</PanelBody>

					{/* Effects */}
					<PanelBody title={__('Visual Effects', 'ria-progress-bar')} initialOpen={false}>
						<ToggleControl
							label={__('Striped Pattern', 'ria-progress-bar')}
							checked={stripedPattern}
							onChange={(value) => setAttributes({ stripedPattern: value })}
							help={__('Add diagonal stripes to progress bars', 'ria-progress-bar')}
						/>
						{stripedPattern && (
							<ToggleControl
								label={__('Animated Stripes', 'ria-progress-bar')}
								checked={animated}
								onChange={(value) => setAttributes({ animated: value })}
								help={__('Make stripes move across the bar', 'ria-progress-bar')}
							/>
						)}
					</PanelBody>

					{/* Progress Animation */}
					<PanelBody title={__('Progress Animation', 'ria-progress-bar')} initialOpen={false}>
						<ToggleControl
							label={__('Animate on Scroll', 'ria-progress-bar')}
							checked={animateOnScroll}
							onChange={(value) => setAttributes({ animateOnScroll: value })}
							help={__('Animate progress fill when scrolling into view', 'ria-progress-bar')}
						/>
						{animateOnScroll && (
							<>
								<RangeControl
									label={__('Animation Duration (seconds)', 'ria-progress-bar')}
									value={animationDuration}
									onChange={(value) => setAttributes({ animationDuration: value })}
									min={0.3}
									max={5}
									step={0.1}
									help={__('How long the fill animation takes', 'ria-progress-bar')}
								/>
								<RangeControl
									label={__('Animation Delay (seconds)', 'ria-progress-bar')}
									value={animationDelay}
									onChange={(value) => setAttributes({ animationDelay: value })}
									min={0}
									max={2}
									step={0.1}
									help={__('Delay before animation starts', 'ria-progress-bar')}
								/>
								<SelectControl
									label={__('Easing Function', 'ria-progress-bar')}
									value={easing}
									onChange={(value) => setAttributes({ easing: value })}
									options={[
										{ label: __('Linear', 'ria-progress-bar'), value: 'linear' },
										{ label: __('Ease', 'ria-progress-bar'), value: 'ease' },
										{ label: __('Ease In', 'ria-progress-bar'), value: 'ease-in' },
										{ label: __('Ease Out', 'ria-progress-bar'), value: 'ease-out' },
										{ label: __('Ease In Out', 'ria-progress-bar'), value: 'ease-in-out' },
									]}
								/>
							</>
						)}
					</PanelBody>

					{/* Border & Shadow */}
					<PanelBody title={__('Border & Shadow', 'ria-progress-bar')} initialOpen={false}>
						<RangeControl
							label={__('Border Width', 'ria-progress-bar')}
							value={borderWidth}
							onChange={(value) => setAttributes({ borderWidth: value })}
							min={0}
							max={10}
						/>
						{borderWidth > 0 && (
							<>
								<SelectControl
									label={__('Border Style', 'ria-progress-bar')}
									value={borderStyle}
									onChange={(value) => setAttributes({ borderStyle: value })}
									options={[
										{ label: __('None', 'ria-progress-bar'), value: 'none' },
										{ label: __('Solid', 'ria-progress-bar'), value: 'solid' },
										{ label: __('Dashed', 'ria-progress-bar'), value: 'dashed' },
										{ label: __('Dotted', 'ria-progress-bar'), value: 'dotted' },
										{ label: __('Double', 'ria-progress-bar'), value: 'double' },
										{ label: __('Groove', 'ria-progress-bar'), value: 'groove' },
										{ label: __('Ridge', 'ria-progress-bar'), value: 'ridge' },
									]}
								/>
								<ColorGradientControl
									label={__('Border Color', 'ria-progress-bar')}
									colorValue={borderColor}
									onColorChange={(value) => setAttributes({ borderColor: value })}
								/>
							</>
						)}
						<RangeControl
							label={__('Border Radius', 'ria-progress-bar')}
							value={borderRadius}
							onChange={(value) => setAttributes({ borderRadius: value })}
							min={0}
							max={50}
						/>
						<SelectControl
							label={__('Box Shadow', 'ria-progress-bar')}
							value={boxShadow}
							onChange={(value) => setAttributes({ boxShadow: value })}
							options={[
								{ label: __('None', 'ria-progress-bar'), value: 'none' },
								{ label: __('Small', 'ria-progress-bar'), value: 'small' },
								{ label: __('Medium', 'ria-progress-bar'), value: 'medium' },
								{ label: __('Large', 'ria-progress-bar'), value: 'large' },
								{ label: __('X-Large', 'ria-progress-bar'), value: 'xlarge' },
								{ label: __('2X-Large', 'ria-progress-bar'), value: '2xlarge' },
								{ label: __('Inner', 'ria-progress-bar'), value: 'inner' },
							]}
						/>
						<SelectControl
							label={__('Hover Shadow', 'ria-progress-bar')}
							value={hoverShadow}
							onChange={(value) => setAttributes({ hoverShadow: value })}
							options={[
								{ label: __('None', 'ria-progress-bar'), value: 'none' },
								{ label: __('Small', 'ria-progress-bar'), value: 'small' },
								{ label: __('Medium', 'ria-progress-bar'), value: 'medium' },
								{ label: __('Large', 'ria-progress-bar'), value: 'large' },
								{ label: __('X-Large', 'ria-progress-bar'), value: 'xlarge' },
								{ label: __('2X-Large', 'ria-progress-bar'), value: '2xlarge' },
							]}
						/>
					</PanelBody>

					{/* Container Animation */}
					<PanelBody title={__('Container Animation', 'ria-progress-bar')} initialOpen={false}>
						<ToggleControl
							label={__('Enable Container Animation', 'ria-progress-bar')}
							checked={animationEnabled}
							onChange={(value) => setAttributes({ animationEnabled: value })}
							help={__('Animate entire container on scroll', 'ria-progress-bar')}
						/>
						{animationEnabled && (
							<>
								<SelectControl
									label={__('Animation Type', 'ria-progress-bar')}
									value={animationType}
									onChange={(value) => setAttributes({ animationType: value })}
									options={[
										{ label: __('Fade In', 'ria-progress-bar'), value: 'fadeIn' },
										{ label: __('Fade In Up', 'ria-progress-bar'), value: 'fadeInUp' },
										{ label: __('Fade In Down', 'ria-progress-bar'), value: 'fadeInDown' },
										{ label: __('Fade In Left', 'ria-progress-bar'), value: 'fadeInLeft' },
										{ label: __('Fade In Right', 'ria-progress-bar'), value: 'fadeInRight' },
										{ label: __('Slide In Up', 'ria-progress-bar'), value: 'slideInUp' },
										{ label: __('Slide In Down', 'ria-progress-bar'), value: 'slideInDown' },
										{ label: __('Slide In Left', 'ria-progress-bar'), value: 'slideInLeft' },
										{ label: __('Slide In Right', 'ria-progress-bar'), value: 'slideInRight' },
										{ label: __('Zoom In', 'ria-progress-bar'), value: 'zoomIn' },
										{ label: __('Zoom In Up', 'ria-progress-bar'), value: 'zoomInUp' },
										{ label: __('Bounce In', 'ria-progress-bar'), value: 'bounceIn' },
										{ label: __('Rotate In', 'ria-progress-bar'), value: 'rotateIn' },
										{ label: __('Flip In X', 'ria-progress-bar'), value: 'flipInX' },
										{ label: __('Flip In Y', 'ria-progress-bar'), value: 'flipInY' },
										{ label: __('None', 'ria-progress-bar'), value: 'none' },
									]}
								/>
								<RangeControl
									label={__('Animation Duration (ms)', 'ria-progress-bar')}
									value={containerAnimationDuration * 1000}
									onChange={(value) => setAttributes({ containerAnimationDuration: value / 1000 })}
									min={100}
									max={3000}
									step={100}
								/>
								<RangeControl
									label={__('Animation Delay (ms)', 'ria-progress-bar')}
									value={containerAnimationDelay}
									onChange={(value) => setAttributes({ containerAnimationDelay: value })}
									min={0}
									max={2000}
									step={100}
								/>
								<SelectControl
									label={__('Animation Easing', 'ria-progress-bar')}
									value={animationEasing}
									onChange={(value) => setAttributes({ animationEasing: value })}
									options={[
										{ label: __('Linear', 'ria-progress-bar'), value: 'linear' },
										{ label: __('Ease', 'ria-progress-bar'), value: 'ease' },
										{ label: __('Ease In', 'ria-progress-bar'), value: 'ease-in' },
										{ label: __('Ease Out', 'ria-progress-bar'), value: 'ease-out' },
										{ label: __('Ease In Out', 'ria-progress-bar'), value: 'ease-in-out' },
									]}
								/>
							</>
						)}
						<SelectControl
							label={__('Hover Animation', 'ria-progress-bar')}
							value={hoverAnimation}
							onChange={(value) => setAttributes({ hoverAnimation: value })}
							options={[
								{ label: __('None', 'ria-progress-bar'), value: 'none' },
								{ label: __('Lift', 'ria-progress-bar'), value: 'lift' },
								{ label: __('Grow', 'ria-progress-bar'), value: 'grow' },
								{ label: __('Shrink', 'ria-progress-bar'), value: 'shrink' },
								{ label: __('Rotate', 'ria-progress-bar'), value: 'rotate' },
								{ label: __('Tilt', 'ria-progress-bar'), value: 'tilt' },
								{ label: __('Glow', 'ria-progress-bar'), value: 'glow' },
								{ label: __('Pulse', 'ria-progress-bar'), value: 'pulse' },
								{ label: __('Bounce', 'ria-progress-bar'), value: 'bounce' },
							]}
							help={__('Animation on hover', 'ria-progress-bar')}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="ria-progress-bars">
						{bars.map((bar, index) => {
							const currentBarColor = bar.barColor || customBarColor;
							const barStyle = useGradient
								? { background: getGradientStyle(currentBarColor) }
								: { backgroundColor: currentBarColor };

							return (
								<div
									key={index}
									className="ria-progress-item"
									style={{
										marginBottom: index < bars.length - 1 ? '16px' : '0',
									}}
								>
									{showLabel && labelPosition === 'above' && (
										<div className="progress-label above" style={{ color: customTextColor }}>
											{bar.label}
										</div>
									)}

									<div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
										{showLabel && labelPosition === 'left' && (
											<div className="progress-label left" style={{ color: customTextColor }}>
												{bar.label}
											</div>
										)}

										{showPercentage && percentagePosition === 'above' && (
											<div className="progress-percentage above" style={{ color: customTextColor }}>
												{bar.percentage}%
											</div>
										)}

										<div
											className="progress-container"
											style={{
												height: `${height}px`,
												backgroundColor: customBackgroundColor,
												borderRadius: `${borderRadius}px`,
												border: borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none',
												flex: 1,
												position: 'relative',
												overflow: 'hidden',
											}}
										>
											<div
												className="progress-fill"
												style={{
													...barStyle,
													width: `${bar.percentage}%`,
													height: '100%',
													transition: 'width 0.3s ease',
													position: 'relative',
													display: 'flex',
													alignItems: 'center',
													paddingLeft: '8px',
													paddingRight: '8px',
												}}
											>
												{showPercentage && percentagePosition === 'inside' && (
													<span className="percentage-text" style={{ color: customInsideTextColor, fontSize: '12px', fontWeight: 'bold' }}>
														{bar.percentage}%
													</span>
												)}
												{showLabel && labelPosition === 'inside' && (
													<span className="label-text" style={{ color: customInsideTextColor, fontSize: '12px' }}>
														{bar.label}
													</span>
												)}
											</div>
										</div>

										{showPercentage && percentagePosition === 'right' && (
											<div className="progress-percentage right" style={{ color: customTextColor, minWidth: '45px', textAlign: 'right' }}>
												{bar.percentage}%
											</div>
										)}

										{showLabel && labelPosition === 'right' && (
											<div className="progress-label right" style={{ color: customTextColor }}>
												{bar.label}
											</div>
										)}
									</div>

									{showPercentage && percentagePosition === 'below' && (
										<div className="progress-percentage below" style={{ color: customTextColor }}>
											{bar.percentage}%
										</div>
									)}

									{showLabel && labelPosition === 'below' && (
										<div className="progress-label below" style={{ color: customTextColor }}>
											{bar.label}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const {
			bars,
			layout,
			variant,
			showLabel,
			labelPosition,
			showPercentage,
			percentagePosition,
			height,
			useGradient,
			gradientDirection,
			stripedPattern,
			animated,
			animateOnScroll,
			animationDuration,
			animationDelay,
			easing,
			showIcon,
			icon,
			iconPosition,
			borderWidth,
			borderStyle,
			borderRadius,
			boxShadow,
			hoverShadow,
			animationEnabled,
			animationType,
			containerAnimationDuration,
			containerAnimationDelay,
			animationEasing,
			hoverAnimation,
			customBackgroundColor,
			customTextColor,
			customInsideTextColor,
			customBorderColor,
			customBarColor,
			gradientStart,
			gradientEnd,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `ria-progress-bar variant-${variant} layout-${layout} label-${labelPosition} percentage-${percentagePosition} shadow-${boxShadow} hover-shadow-${hoverShadow} hover-${hoverAnimation}${stripedPattern ? ' striped' : ''}${animated ? ' animated' : ''}`,
			'data-animation': animationEnabled ? animationType : 'none',
			'data-animation-duration': containerAnimationDuration * 1000,
			'data-animation-delay': containerAnimationDelay,
			'data-animation-easing': animationEasing,
			'data-animate-on-scroll': animateOnScroll,
			'data-progress-duration': animationDuration,
			'data-progress-delay': animationDelay,
			'data-easing': easing,
			style: {
				'--bar-height': `${height}px`,
				'--bg-color': customBackgroundColor,
				'--text-color': customTextColor,
				'--inside-text-color': customInsideTextColor,
				'--border-width': `${borderWidth}px`,
				'--border-style': borderStyle,
				'--border-color': customBorderColor,
				'--border-radius': `${borderRadius}px`,
			},
		});

		const getGradientStyle = (color) => {
			if (!useGradient) return { backgroundColor: color };

			const directions = {
				horizontal: 'to right',
				vertical: 'to bottom',
				diagonal: 'to bottom right',
			};

			return {
				background: `linear-gradient(${directions[gradientDirection]}, ${gradientStart}, ${gradientEnd})`,
			};
		};

		return (
			<div {...blockProps}>
				<div className="ria-progress-bars">
					{bars.map((bar, index) => {
						const barStyle = bar.barColor
							? (useGradient ? getGradientStyle(bar.barColor) : { backgroundColor: bar.barColor })
							: {};

						return (
							<div
								key={index}
								className="ria-progress-item"
								data-percentage={bar.percentage}
								role="progressbar"
								aria-valuenow={bar.percentage}
								aria-valuemin="0"
								aria-valuemax="100"
								aria-label={bar.label}
							>
								{showLabel && labelPosition === 'above' && (
									<div className="progress-label above">{bar.label}</div>
								)}

								<div className="progress-wrapper">
									{showLabel && labelPosition === 'left' && (
										<div className="progress-label left">{bar.label}</div>
									)}

									{showPercentage && percentagePosition === 'above' && (
										<div className="progress-percentage above">{bar.percentage}%</div>
									)}

									<div className="progress-container">
										<div
											className="progress-fill"
											style={barStyle}
											data-target-width={bar.percentage}
										>
											{showPercentage && percentagePosition === 'inside' && (
												<span className="percentage-text">{bar.percentage}%</span>
											)}
											{showLabel && labelPosition === 'inside' && (
												<span className="label-text">{bar.label}</span>
											)}
										</div>
									</div>

									{showPercentage && percentagePosition === 'right' && (
										<div className="progress-percentage right">{bar.percentage}%</div>
									)}

									{showLabel && labelPosition === 'right' && (
										<div className="progress-label right">{bar.label}</div>
									)}
								</div>

								{showPercentage && percentagePosition === 'below' && (
									<div className="progress-percentage below">{bar.percentage}%</div>
								)}

								{showLabel && labelPosition === 'below' && (
									<div className="progress-label below">{bar.label}</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		);
	},
});
