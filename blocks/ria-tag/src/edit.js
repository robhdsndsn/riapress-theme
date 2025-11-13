import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as Icons from '../../../shared/icons';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const {
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor,
		text,
		size,
		shape,
		iconName,
		iconPosition,
		isRemovable,
		link,
		linkTarget,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		animateOnScroll,
		staggerDelay,
	} = attributes;

	// Icon mapping - predefined set of common tag icons
	const iconMap = {
		'Tag': Tag,
		'X': X,
		'Hash': Hash,
		'Check': Check,
		'Star': Star,
		'Award': Award,
		'Info': Info,
	};

	// Color variant classes
	const variantClass = variant && variant !== 'custom' ? `has-${variant}-variant` : '';
	const customColorClass = variant === 'custom' ? 'has-custom-colors' : '';

	// Custom color styles
	const customStyles = variant === 'custom' ? {
		color: customColor,
		backgroundColor: customBackgroundColor,
		borderColor: customBorderColor,
	} : {};

	const blockProps = useBlockProps({
		className: `ria-tag size-${size} shape-${shape} ${variantClass} ${customColorClass}`.trim(),
		'data-animation': animationType,
		'data-duration': animationDuration,
		'data-delay': animationDelay,
		'data-easing': animationEasing,
		'data-animate-on-scroll': animateOnScroll,
		'data-stagger-delay': staggerDelay,
		style: customStyles,
	});

	// Get Lucide icon component
	const LucideIcon = iconName && iconMap[iconName] ? iconMap[iconName] : null;

	const tagContent = (
		<>
			{iconName && iconPosition === 'left' && LucideIcon && (
				<LucideIcon className="ria-tag-icon" size={size === 'small' ? 12 : size === 'large' ? 20 : 16} />
			)}
			<span className="ria-tag-text">{text}</span>
			{iconName && iconPosition === 'right' && LucideIcon && (
				<LucideIcon className="ria-tag-icon" size={size === 'small' ? 12 : size === 'large' ? 20 : 16} />
			)}
			{isRemovable && (
				<button className="ria-tag-remove" aria-label={__('Remove', 'riapress')}>
					×
				</button>
			)}
		</>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Tag Settings', 'riapress')} initialOpen={true}>
					<TextControl
						label={__('Text', 'riapress')}
						value={text}
						onChange={(value) => setAttributes({ text: value })}
					/>
					<SelectControl
						label={__('Size', 'riapress')}
						value={size}
						options={[
							{ label: __('Small', 'riapress'), value: 'small' },
							{ label: __('Medium', 'riapress'), value: 'medium' },
							{ label: __('Large', 'riapress'), value: 'large' },
						]}
						onChange={(value) => setAttributes({ size: value })}
					/>
					<SelectControl
						label={__('Shape', 'riapress')}
						value={shape}
						options={[
							{ label: __('Rounded', 'riapress'), value: 'rounded' },
							{ label: __('Pill', 'riapress'), value: 'pill' },
							{ label: __('Square', 'riapress'), value: 'square' },
						]}
						onChange={(value) => setAttributes({ shape: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Icon Settings', 'riapress')} initialOpen={false}>
					<TextControl
						label={__('Icon Name (Lucide)', 'riapress')}
						value={iconName}
						onChange={(value) => setAttributes({ iconName: value })}
						help={__('e.g., Tag, X, Star, CheckCircle', 'riapress')}
					/>
					{iconName && (
						<SelectControl
							label={__('Icon Position', 'riapress')}
							value={iconPosition}
							options={[
								{ label: __('Left', 'riapress'), value: 'left' },
								{ label: __('Right', 'riapress'), value: 'right' },
							]}
							onChange={(value) => setAttributes({ iconPosition: value })}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Link Settings', 'riapress')} initialOpen={false}>
					<TextControl
						label={__('Link URL', 'riapress')}
						value={link}
						onChange={(value) => setAttributes({ link: value })}
						help={__('Leave empty for no link', 'riapress')}
					/>
					{link && (
						<SelectControl
							label={__('Link Target', 'riapress')}
							value={linkTarget}
							options={[
								{ label: __('Same Tab', 'riapress'), value: '_self' },
								{ label: __('New Tab', 'riapress'), value: '_blank' },
							]}
							onChange={(value) => setAttributes({ linkTarget: value })}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Behavior', 'riapress')} initialOpen={false}>
					<ToggleControl
						label={__('Show Remove Button', 'riapress')}
						checked={isRemovable}
						onChange={(value) => setAttributes({ isRemovable: value })}
						help={__('Adds a close/remove button (requires JavaScript)', 'riapress')}
					/>
				</PanelBody>

				<PanelBody title={__('Color Settings', 'riapress')} initialOpen={false}>
					<SelectControl
						label={__('Color Variant', 'riapress')}
						value={variant || 'neutral'}
						options={[
							{ label: __('Neutral', 'riapress'), value: 'neutral' },
							{ label: __('Primary', 'riapress'), value: 'primary' },
							{ label: __('Secondary', 'riapress'), value: 'secondary' },
							{ label: __('Accent', 'riapress'), value: 'accent' },
							{ label: __('Custom', 'riapress'), value: 'custom' },
						]}
						onChange={(value) => setAttributes({ variant: value })}
						help={__('Select a predefined color scheme or use custom colors', 'riapress')}
					/>
				</PanelBody>

				{variant === 'custom' && (
					<PanelColorSettings
						title={__('Custom Colors', 'riapress')}
						colorSettings={[
							{
								value: customColor,
								onChange: (value) => setAttributes({ customColor: value }),
								label: __('Text Color', 'riapress'),
							},
							{
								value: customBackgroundColor,
								onChange: (value) => setAttributes({ customBackgroundColor: value }),
								label: __('Background Color', 'riapress'),
							},
							{
								value: customBorderColor,
								onChange: (value) => setAttributes({ customBorderColor: value }),
								label: __('Border Color', 'riapress'),
							},
						]}
					/>
				)}

				<PanelBody title={__('Animation Settings', 'riapress')} initialOpen={false}>
					<SelectControl
						label={__('Animation Type', 'riapress')}
						value={animationType}
						options={[
							{ label: __('None', 'riapress'), value: 'none' },
							{ label: __('Fade In', 'riapress'), value: 'fadeIn' },
							{ label: __('Slide Up', 'riapress'), value: 'slideUp' },
							{ label: __('Scale Up', 'riapress'), value: 'scaleUp' },
						]}
						onChange={(value) => setAttributes({ animationType: value })}
					/>
					{animationType !== 'none' && (
						<>
							<RangeControl
								label={__('Animation Duration (seconds)', 'riapress')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={0.1}
								max={3}
								step={0.1}
							/>
							<RangeControl
								label={__('Animation Delay (seconds)', 'riapress')}
								value={animationDelay}
								onChange={(value) => setAttributes({ animationDelay: value })}
								min={0}
								max={2}
								step={0.1}
							/>
							<ToggleControl
								label={__('Animate on Scroll', 'riapress')}
								checked={animateOnScroll}
								onChange={(value) => setAttributes({ animateOnScroll: value })}
							/>
							<RangeControl
								label={__('Stagger Delay (seconds)', 'riapress')}
								value={staggerDelay}
								onChange={(value) => setAttributes({ staggerDelay: value })}
								min={0}
								max={1}
								step={0.05}
								help={__('Delay between multiple tags', 'riapress')}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>{tagContent}</div>
		</>
	);
}
