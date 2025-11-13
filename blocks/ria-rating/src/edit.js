import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import * as Icons from '../../../shared/icons';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const {
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor,
		rating,
		maxRating,
		size,
		showValue,
		valueFormat,
		iconName,
		filledColor,
		emptyColor,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		animateOnScroll,
		staggerDelay,
	} = attributes;

	// Icon mapping - predefined set of common rating icons
	const iconMap = {
		'Star': Star,
		'Heart': Heart,
		'Circle': Circle,
		'Diamond': Diamond,
		'Award': Award,
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
		className: `ria-rating size-${size} ${variantClass} ${customColorClass}`.trim(),
		'data-animation': animationType,
		'data-duration': animationDuration,
		'data-delay': animationDelay,
		'data-easing': animationEasing,
		'data-animate-on-scroll': animateOnScroll,
		'data-stagger-delay': staggerDelay,
		style: customStyles,
	});

	// Get icon component
	const IconComponent = iconName && iconMap[iconName] ? iconMap[iconName] : Star;

	// Generate stars
	const stars = [];
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;

	for (let i = 0; i < maxRating; i++) {
		const isFilled = i < fullStars;
		const isHalf = i === fullStars && hasHalfStar;

		stars.push(
			<span
				key={i}
				className={`ria-rating-star ${isFilled ? 'is-filled' : ''} ${isHalf ? 'is-half' : ''}`}
				style={{
					color: isFilled || isHalf ? (filledColor || undefined) : (emptyColor || undefined),
				}}
			>
				<IconComponent
					className="ria-rating-star-icon"
					fill={isFilled ? 'currentColor' : 'none'}
				/>
				{isHalf && (
					<span className="ria-rating-star-half">
						<IconComponent
							className="ria-rating-star-icon"
							fill="currentColor"
						/>
					</span>
				)}
			</span>
		);
	}

	// Format value text
	const valueText = valueFormat === 'fraction'
		? `${rating}/${maxRating}`
		: rating.toFixed(1);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Rating Settings', 'riapress')} initialOpen={true}>
					<RangeControl
						label={__('Rating', 'riapress')}
						value={rating}
						onChange={(value) => setAttributes({ rating: value })}
						min={0}
						max={maxRating}
						step={0.5}
					/>
					<RangeControl
						label={__('Max Rating', 'riapress')}
						value={maxRating}
						onChange={(value) => setAttributes({ maxRating: value })}
						min={3}
						max={10}
						help={__('Maximum number of stars', 'riapress')}
					/>
					<SelectControl
						label={__('Size', 'riapress')}
						value={size}
						options={[
							{ label: __('Small', 'riapress'), value: 'small' },
							{ label: __('Medium', 'riapress'), value: 'medium' },
							{ label: __('Large', 'riapress'), value: 'large' },
							{ label: __('X-Large', 'riapress'), value: 'xlarge' },
						]}
						onChange={(value) => setAttributes({ size: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Display Settings', 'riapress')} initialOpen={true}>
					<ToggleControl
						label={__('Show Rating Value', 'riapress')}
						checked={showValue}
						onChange={(value) => setAttributes({ showValue: value })}
					/>
					{showValue && (
						<SelectControl
							label={__('Value Format', 'riapress')}
							value={valueFormat}
							options={[
								{ label: __('Decimal (5.0)', 'riapress'), value: 'decimal' },
								{ label: __('Fraction (5/5)', 'riapress'), value: 'fraction' },
							]}
							onChange={(value) => setAttributes({ valueFormat: value })}
						/>
					)}
					<TextControl
						label={__('Icon Name (Lucide)', 'riapress')}
						value={iconName}
						onChange={(value) => setAttributes({ iconName: value })}
						help={__('e.g., Star, Heart, Circle', 'riapress')}
					/>
				</PanelBody>

				<PanelBody title={__('Color Settings', 'riapress')} initialOpen={false}>
					<SelectControl
						label={__('Color Variant', 'riapress')}
						value={variant || 'accent'}
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
								value: filledColor,
								onChange: (value) => setAttributes({ filledColor: value }),
								label: __('Filled Star Color', 'riapress'),
							},
							{
								value: emptyColor,
								onChange: (value) => setAttributes({ emptyColor: value }),
								label: __('Empty Star Color', 'riapress'),
							},
							{
								value: customColor,
								onChange: (value) => setAttributes({ customColor: value }),
								label: __('Text Color', 'riapress'),
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
							{ label: __('Scale Up', 'riapress'), value: 'scaleUp' },
							{ label: __('Slide Up', 'riapress'), value: 'slideUp' },
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
								max={0.2}
								step={0.01}
								help={__('Delay between each star', 'riapress')}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="ria-rating-stars">{stars}</div>
				{showValue && (
					<span className="ria-rating-value">{valueText}</span>
				)}
			</div>
		</>
	);
}
