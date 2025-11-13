import { useBlockProps } from '@wordpress/block-editor';
import * as Icons from '../../../shared/icons';
export default function save({ attributes }) {
	const {
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor,
		items,
		separator,
		separatorIcon,
		fontSize,
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
		className: `ria-breadcrumb font-size-${fontSize} ${variantClass} ${customColorClass}`.trim(),
		'data-animation': animationType,
		'data-duration': animationDuration,
		'data-delay': animationDelay,
		'data-easing': animationEasing,
		'data-animate-on-scroll': animateOnScroll,
		'data-stagger-delay': staggerDelay,
		style: customStyles,
	});

	// Get separator icon if specified
	// Icon mapping
	const iconMap = {
		'ChevronRight': Icons.ChevronRight,
		'ChevronLeft': Icons.ChevronLeft,
		'ArrowRight': Icons.ArrowRight,
		'Minus': Icons.Minus,
		'Circle': Icons.Circle,
		'Plus': Icons.Plus,
	};

	// Get separator icon if specified
	const SeparatorIcon = separatorIcon && iconMap[separatorIcon] ? iconMap[separatorIcon] : null;

	return (
		<nav {...blockProps} aria-label="Breadcrumb">
			<ol className="ria-breadcrumb-list">
				{items.map((item, index) => (
					<li key={index} className="ria-breadcrumb-item">
						{item.url ? (
							<a href={item.url} className="ria-breadcrumb-link">{item.label}</a>
						) : (
							<span className="ria-breadcrumb-current" aria-current="page">{item.label}</span>
						)}
						{index < items.length - 1 && (
							<span className="ria-breadcrumb-separator" aria-hidden="true">
								{SeparatorIcon ? (
									<SeparatorIcon size={14} />
								) : (
									separator
								)}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
