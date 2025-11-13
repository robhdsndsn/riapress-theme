import { useBlockProps } from '@wordpress/block-editor';
import * as Icons from '../../../shared/icons';
export default function save({ attributes }) {
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

	// Color variant classes
	const variantClass = variant && variant !== 'custom' ? `has-${variant}-variant` : '';
	const customColorClass = variant === 'custom' ? 'has-custom-colors' : '';

	// Custom color styles
	const customStyles = variant === 'custom' ? {
		color: customColor,
		backgroundColor: customBackgroundColor,
		borderColor: customBorderColor,
	} : {};

	const blockProps = useBlockProps.save({
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
	// Icon mapping
	const iconMap = {
		'Star': Icons.Star,
		'Heart': Icons.Heart,
		'Circle': Icons.Circle,
		'Diamond': Icons.Diamond,
		'Award': Icons.Award,
	};

	// Get icon component
	const IconComponent = iconName && iconMap[iconName] ? iconMap[iconName] : Icons.Star;

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
		<div {...blockProps}>
			<div className="ria-rating-stars">{stars}</div>
			{showValue && (
				<span className="ria-rating-value">{valueText}</span>
			)}
		</div>
	);
}
