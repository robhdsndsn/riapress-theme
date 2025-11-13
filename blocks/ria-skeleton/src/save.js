import { useBlockProps } from '@wordpress/block-editor';

// Import skeleton components
import {
	SkeletonText,
	SkeletonImage,
	SkeletonAvatar,
	SkeletonButton,
	SkeletonCard,
} from '../../../components/skeletons';

export default function save({ attributes }) {
	const {
		skeletonType,
		lines,
		width,
		height,
		aspectRatio,
		size,
		showImage,
		showButton,
		layout,
		count,
		animationType,
		animationDelay,
		borderRadius,
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor,
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
		className: `ria-skeleton-loader ${variantClass} ${customColorClass}`.trim(),
		'data-animation': animationType,
		'data-delay': animationDelay,
		style: { ...customStyles, borderRadius: borderRadius ? `${borderRadius}px` : undefined },
	});

	// Render skeleton based on type
	const renderSkeleton = (index = 0) => {
		const key = `skeleton-${index}`;

		switch (skeletonType) {
			case 'text':
				return <SkeletonText key={key} lines={lines} size={size} />;
			case 'image':
				return <SkeletonImage key={key} aspectRatio={aspectRatio} height={height} />;
			case 'avatar':
				return <SkeletonAvatar key={key} size={size} />;
			case 'button':
				return <SkeletonButton key={key} size={size} width={width} />;
			case 'card':
				return (
					<SkeletonCard
						key={key}
						showImage={showImage}
						showButton={showButton}
						layout={layout}
					/>
				);
			default:
				return <SkeletonCard key={key} />;
		}
	};

	// Render multiple instances based on count
	const renderSkeletons = () => {
		const skeletons = [];
		for (let i = 0; i < count; i++) {
			skeletons.push(renderSkeleton(i));
		}
		return skeletons;
	};

	return (
		<div {...blockProps}>
			{renderSkeletons()}
		</div>
	);
}
