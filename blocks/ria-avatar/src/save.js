import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor,
		imageUrl,
		imageAlt,
		initials,
		name,
		size,
		shape,
		borderWidth,
		showBorder,
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

	// Generate initials from name if not set
	const displayInitials = initials || (name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?');

	const blockProps = useBlockProps.save({
		className: `ria-avatar size-${size} shape-${shape} ${variantClass} ${customColorClass}`.trim(),
		'data-animation': animationType,
		'data-duration': animationDuration,
		'data-delay': animationDelay,
		'data-easing': animationEasing,
		'data-animate-on-scroll': animateOnScroll,
		'data-stagger-delay': staggerDelay,
		style: {
			...customStyles,
			borderWidth: showBorder ? `${borderWidth}px` : '0',
		},
	});

	return (
		<div {...blockProps}>
			{imageUrl ? (
				<img src={imageUrl} alt={imageAlt || name} className="ria-avatar-image" />
			) : (
				<div className="ria-avatar-initials">{displayInitials}</div>
			)}
		</div>
	);
}
