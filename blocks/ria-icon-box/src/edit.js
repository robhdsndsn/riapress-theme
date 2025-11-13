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
import * as Icons from '../../../shared/icons';
export default function Edit({ attributes, setAttributes }) {
	const {
		variant,
		customBackgroundColor,
		customBorderColor,
		iconName,
		iconSize,
		iconColor,
		heading,
		description,
		textAlign,
		iconPosition,
		linkUrl,
		linkTarget,
		backgroundColor,
		showBackground,
		borderRadius,
		borderWidth,
		borderStyle,
		borderColor,
		boxShadow,
		hoverShadow,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		hoverAnimation,
	} = attributes;

	const blockProps = useBlockProps({
		className: `icon-box icon-position-${iconPosition} text-align-${textAlign} shadow-${boxShadow} hover-shadow-${hoverShadow} hover-${hoverAnimation}`,
		style: {
			backgroundColor: showBackground ? backgroundColor : 'transparent',
			borderRadius: borderRadius + 'px',
			borderWidth: borderWidth + 'px',
			borderStyle: borderStyle,
			borderColor: borderColor,
			textAlign: textAlign,
		},
	});

	// Icon mapping from dashicon names to Lucide components
	const iconMap = {
		'star-filled': Star,
		'heart': Heart,
		'yes': Check,
		'shield': Shield,
		'lock': Lock,
		'lightbulb': Lightbulb,
		'chart-bar': BarChart3,
		'camera': Camera,
		'cloud': Cloud,
		'admin-users': Users,
		'admin-tools': Settings,
		'admin-settings': Settings,
		'megaphone': Megaphone,
		'thumbs-up': ThumbsUp,
		'awards': Award,
	};

	// Icon options for dropdown
	const iconOptions = [
		{ label: 'Star', value: 'star-filled' },
		{ label: 'Heart', value: 'heart' },
		{ label: 'Check', value: 'yes' },
		{ label: 'Shield', value: 'shield' },
		{ label: 'Lock', value: 'lock' },
		{ label: 'Lightbulb', value: 'lightbulb' },
		{ label: 'Chart', value: 'chart-bar' },
		{ label: 'Camera', value: 'camera' },
		{ label: 'Cloud', value: 'cloud' },
		{ label: 'Admin Users', value: 'admin-users' },
		{ label: 'Admin Tools', value: 'admin-tools' },
		{ label: 'Admin Settings', value: 'admin-settings' },
		{ label: 'Megaphone', value: 'megaphone' },
		{ label: 'Thumbs Up', value: 'thumbs-up' },
		{ label: 'Awards', value: 'awards' },
	];

	// Get the icon component
	const IconComponent = iconMap[iconName] || Star;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Color Scheme', 'ria-icon-box')} initialOpen={false}>
					<SelectControl
						label={__('Variant', 'ria-icon-box')}
						value={variant}
						options={[
							{ label: __('Primary', 'ria-icon-box'), value: 'primary' },
							{ label: __('Secondary', 'ria-icon-box'), value: 'secondary' },
							{ label: __('Accent', 'ria-icon-box'), value: 'accent' },
							{ label: __('Neutral (Default)', 'ria-icon-box'), value: 'neutral' },
							{ label: __('Custom', 'ria-icon-box'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ variant: value })}
						help={__('Choose a color scheme or use custom colors', 'ria-icon-box')}
					/>
					{variant === 'custom' && (
						<>
							<p><strong>{__('Custom Colors', 'ria-icon-box')}</strong></p>
							<PanelColorSettings
								title={__('Background Color', 'ria-icon-box')}
								colorSettings={[
									{
										value: customBackgroundColor,
										onChange: (value) => setAttributes({ customBackgroundColor: value }),
										label: __('Background', 'ria-icon-box'),
									}
								]}
							/>
							<PanelColorSettings
								title={__('Border Color', 'ria-icon-box')}
								colorSettings={[
									{
										value: customBorderColor,
										onChange: (value) => setAttributes({ customBorderColor: value }),
										label: __('Border', 'ria-icon-box'),
									}
								]}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Icon Settings', 'ria-icon-box')} initialOpen={true}>
					<SelectControl
						label={__('Icon', 'ria-icon-box')}
						value={iconName}
						options={iconOptions}
						onChange={(value) => setAttributes({ iconName: value })}
					/>
					<RangeControl
						label={__('Icon Size', 'ria-icon-box')}
						value={iconSize}
						onChange={(value) => setAttributes({ iconSize: value })}
						min={24}
						max={120}
					/>
					<div style={{ marginBottom: '16px' }}>
						<label>{__('Icon Color', 'ria-icon-box')}</label>
						<ColorPicker
							color={iconColor}
							onChangeComplete={(value) => setAttributes({ iconColor: value.hex })}
						/>
					</div>
					<SelectControl
						label={__('Icon Position', 'ria-icon-box')}
						value={iconPosition}
						options={[
							{ label: 'Top', value: 'top' },
							{ label: 'Left', value: 'left' },
							{ label: 'Right', value: 'right' },
						]}
						onChange={(value) => setAttributes({ iconPosition: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Content Settings', 'ria-icon-box')}>
					<SelectControl
						label={__('Text Alignment', 'ria-icon-box')}
						value={textAlign}
						options={[
							{ label: 'Left', value: 'left' },
							{ label: 'Center', value: 'center' },
							{ label: 'Right', value: 'right' },
						]}
						onChange={(value) => setAttributes({ textAlign: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Link Settings', 'ria-icon-box')}>
					<TextControl
						label={__('Link URL', 'ria-icon-box')}
						value={linkUrl}
						onChange={(value) => setAttributes({ linkUrl: value })}
						placeholder="https://"
					/>
					<ToggleControl
						label={__('Open in New Tab', 'ria-icon-box')}
						checked={linkTarget}
						onChange={(value) => setAttributes({ linkTarget: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Style Settings', 'ria-icon-box')}>
					<ToggleControl
						label={__('Show Background', 'ria-icon-box')}
						checked={showBackground}
						onChange={(value) => setAttributes({ showBackground: value })}
					/>
					{showBackground && (
						<div style={{ marginBottom: '16px' }}>
							<label>{__('Background Color', 'ria-icon-box')}</label>
							<ColorPicker
								color={backgroundColor}
								onChangeComplete={(value) => setAttributes({ backgroundColor: value.hex })}
							/>
						</div>
					)}
					<RangeControl
						label={__('Border Radius', 'ria-icon-box')}
						value={borderRadius}
						onChange={(value) => setAttributes({ borderRadius: value })}
						min={0}
						max={50}
					/>
					<RangeControl
						label={__('Border Width', 'ria-icon-box')}
						value={borderWidth}
						onChange={(value) => setAttributes({ borderWidth: value })}
						min={0}
						max={10}
					/>
					{borderWidth > 0 && (
						<>
							<SelectControl
								label={__('Border Style', 'ria-icon-box')}
								value={borderStyle}
								options={[
									{ label: 'Solid', value: 'solid' },
									{ label: 'Dashed', value: 'dashed' },
									{ label: 'Dotted', value: 'dotted' },
								]}
								onChange={(value) => setAttributes({ borderStyle: value })}
							/>
							<div style={{ marginBottom: '16px' }}>
								<label>{__('Border Color', 'ria-icon-box')}</label>
								<ColorPicker
									color={borderColor}
									onChangeComplete={(value) => setAttributes({ borderColor: value.hex })}
								/>
							</div>
						</>
					)}
					<SelectControl
						label={__('Box Shadow', 'ria-icon-box')}
						value={boxShadow}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
						]}
						onChange={(value) => setAttributes({ boxShadow: value })}
					/>
					<SelectControl
						label={__('Hover Shadow', 'ria-icon-box')}
						value={hoverShadow}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
						]}
						onChange={(value) => setAttributes({ hoverShadow: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Animation Settings', 'ria-icon-box')}>
					<ToggleControl
						label={__('Enable Animation', 'ria-icon-box')}
						checked={animationEnabled}
						onChange={(value) => setAttributes({ animationEnabled: value })}
					/>
					{animationEnabled && (
						<>
							<SelectControl
								label={__('Animation Type', 'ria-icon-box')}
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
								label={__('Animation Duration (seconds)', 'ria-icon-box')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={0.1}
								max={2}
								step={0.1}
							/>
							<RangeControl
								label={__('Animation Delay (seconds)', 'ria-icon-box')}
								value={animationDelay}
								onChange={(value) => setAttributes({ animationDelay: value })}
								min={0}
								max={2}
								step={0.1}
							/>
							<SelectControl
								label={__('Animation Easing', 'ria-icon-box')}
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
						label={__('Hover Animation', 'ria-icon-box')}
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
				<div className="icon-box-inner">
					<div className="icon-box-icon" style={{ fontSize: iconSize + 'px', color: iconColor }}>
						<IconComponent size={iconSize} color={iconColor} />
					</div>
					<div className="icon-box-content">
						<RichText
							tagName="h3"
							className="icon-box-heading"
							value={heading}
							onChange={(value) => setAttributes({ heading: value })}
							placeholder={__('Add heading...', 'ria-icon-box')}
						/>
						<RichText
							tagName="p"
							className="icon-box-description"
							value={description}
							onChange={(value) => setAttributes({ description: value })}
							placeholder={__('Add description...', 'ria-icon-box')}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
