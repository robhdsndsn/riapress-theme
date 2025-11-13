import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	RangeControl,
	ColorPicker,
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const {
		variant,
		customBackgroundColor,
		customBorderColor,
		number,
		label,
		description,
		numberColor,
		numberSize,
		prefix,
		suffix,
		textAlign,
		backgroundColor,
		showBackground,
		borderRadius,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		hoverAnimation,
	} = attributes;

	const blockProps = useBlockProps({
		className: `number-box text-align-${textAlign} hover-${hoverAnimation}`,
		style: {
			backgroundColor: showBackground ? backgroundColor : 'transparent',
			borderRadius: borderRadius + 'px',
			textAlign: textAlign,
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Color Scheme', 'number-box')} initialOpen={false}>
					<SelectControl
						label={__('Variant', 'number-box')}
						value={variant}
						options={[
							{ label: __('Primary', 'number-box'), value: 'primary' },
							{ label: __('Secondary', 'number-box'), value: 'secondary' },
							{ label: __('Accent', 'number-box'), value: 'accent' },
							{ label: __('Neutral (Default)', 'number-box'), value: 'neutral' },
							{ label: __('Custom', 'number-box'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ variant: value })}
						help={__('Choose a color scheme or use custom colors', 'number-box')}
					/>
					{variant === 'custom' && (
						<>
							<p><strong>{__('Custom Colors', 'number-box')}</strong></p>
							<PanelColorSettings
								title={__('Background Color', 'number-box')}
								colorSettings={[
									{
										value: customBackgroundColor,
										onChange: (value) => setAttributes({ customBackgroundColor: value }),
										label: __('Background', 'number-box'),
									}
								]}
							/>
							<PanelColorSettings
								title={__('Border Color', 'number-box')}
								colorSettings={[
									{
										value: customBorderColor,
										onChange: (value) => setAttributes({ customBorderColor: value }),
										label: __('Border', 'number-box'),
									}
								]}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Number Settings', 'ria-number-box')} initialOpen={true}>
					<TextControl
						label={__('Number', 'ria-number-box')}
						value={number}
						onChange={(value) => setAttributes({ number: value })}
						help={__('Can be a number or text (e.g., "100" or "99%")', 'ria-number-box')}
					/>
					<TextControl
						label={__('Prefix', 'ria-number-box')}
						value={prefix}
						onChange={(value) => setAttributes({ prefix: value })}
						placeholder="$"
						help={__('Optional prefix (e.g., "$", "#")', 'ria-number-box')}
					/>
					<TextControl
						label={__('Suffix', 'ria-number-box')}
						value={suffix}
						onChange={(value) => setAttributes({ suffix: value })}
						placeholder="%"
						help={__('Optional suffix (e.g., "%", "+")', 'ria-number-box')}
					/>
					<RangeControl
						label={__('Number Size', 'ria-number-box')}
						value={numberSize}
						onChange={(value) => setAttributes({ numberSize: value })}
						min={24}
						max={120}
					/>
					<div style={{ marginBottom: '16px' }}>
						<label>{__('Number Color', 'ria-number-box')}</label>
						<ColorPicker
							color={numberColor}
							onChangeComplete={(value) => setAttributes({ numberColor: value.hex })}
						/>
					</div>
				</PanelBody>

				<PanelBody title={__('Content Settings', 'ria-number-box')}>
					<SelectControl
						label={__('Text Alignment', 'ria-number-box')}
						value={textAlign}
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' },
						]}
						onChange={(value) => setAttributes({ textAlign: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Style Settings', 'ria-number-box')}>
					<ToggleControl
						label={__('Show Background', 'ria-number-box')}
						checked={showBackground}
						onChange={(value) => setAttributes({ showBackground: value })}
					/>
					{showBackground && (
						<div style={{ marginBottom: '16px' }}>
							<label>{__('Background Color', 'ria-number-box')}</label>
							<ColorPicker
								color={backgroundColor}
								onChangeComplete={(value) => setAttributes({ backgroundColor: value.hex })}
							/>
						</div>
					)}
					<RangeControl
						label={__('Border Radius', 'ria-number-box')}
						value={borderRadius}
						onChange={(value) => setAttributes({ borderRadius: value })}
						min={0}
						max={50}
					/>
				</PanelBody>

				<PanelBody title={__('Animation Settings', 'ria-number-box')}>
					<ToggleControl
						label={__('Enable Animation', 'ria-number-box')}
						checked={animationEnabled}
						onChange={(value) => setAttributes({ animationEnabled: value })}
					/>
					{animationEnabled && (
						<>
							<SelectControl
								label={__('Animation Type', 'ria-number-box')}
								value={animationType}
								options={[
									{ label: 'Fade In Up', value: 'fadeInUp' },
									{ label: 'Fade In', value: 'fadeIn' },
									{ label: 'Slide In Left', value: 'slideInLeft' },
									{ label: 'Slide In Right', value: 'slideInRight' },
									{ label: 'Zoom In', value: 'zoomIn' },
								]}
								onChange={(value) => setAttributes({ animationType: value })}
							/>
							<RangeControl
								label={__('Animation Duration (seconds)', 'ria-number-box')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={0.1}
								max={2}
								step={0.1}
							/>
							<RangeControl
								label={__('Animation Delay (seconds)', 'ria-number-box')}
								value={animationDelay}
								onChange={(value) => setAttributes({ animationDelay: value })}
								min={0}
								max={2}
								step={0.1}
							/>
							<SelectControl
								label={__('Animation Easing', 'ria-number-box')}
								value={animationEasing}
								options={[
									{ label: 'Ease Out', value: 'ease-out' },
									{ label: 'Ease In', value: 'ease-in' },
									{ label: 'Ease In Out', value: 'ease-in-out' },
									{ label: 'Linear', value: 'linear' },
								]}
								onChange={(value) => setAttributes({ animationEasing: value })}
							/>
						</>
					)}
					<SelectControl
						label={__('Hover Animation', 'ria-number-box')}
						value={hoverAnimation}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Lift', value: 'lift' },
							{ label: 'Grow', value: 'grow' },
							{ label: 'Glow', value: 'glow' },
						]}
						onChange={(value) => setAttributes({ hoverAnimation: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="number-box-inner">
					<div className="number-box-number" style={{ fontSize: numberSize + 'px', color: numberColor }}>
						<span className="number-prefix">{prefix}</span>
						<span className="number-value">{number}</span>
						<span className="number-suffix">{suffix}</span>
					</div>
					<div className="number-box-content">
						<RichText
							tagName="h4"
							className="number-box-label"
							value={label}
							onChange={(value) => setAttributes({ label: value })}
							placeholder={__('Add label...', 'ria-number-box')}
						/>
						<RichText
							tagName="p"
							className="number-box-description"
							value={description}
							onChange={(value) => setAttributes({ description: value })}
							placeholder={__('Add description...', 'ria-number-box')}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
