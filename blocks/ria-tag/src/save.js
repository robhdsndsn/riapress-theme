import { useBlockProps } from '@wordpress/block-editor';
import * as Icons from '../../../shared/icons';
export default function save({ attributes }) {
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
	// Icon mapping
	const iconMap = {
		'Tag': Icons.Tag,
		'X': Icons.X,
		'Hash': Icons.Hash,
		'Check': Icons.Check,
		'Star': Icons.Star,
		'Award': Icons.Award,
		'Info': Icons.Info,
	};

	// Get icon if specified
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
				<button className="ria-tag-remove" aria-label="Remove">
					×
				</button>
			)}
		</>
	);

	if (link) {
		return (
			<a href={link} target={linkTarget} rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined} {...blockProps}>
				{tagContent}
			</a>
		);
	}

	return <div {...blockProps}>{tagContent}</div>;
}
