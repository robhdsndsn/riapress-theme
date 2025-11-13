import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		variant,
		customBackgroundColor,
		customBorderColor,
		imageUrl,
		imageAlt,
		heading,
		description,
		linkUrl,
		linkTarget,
		overlayPosition,
		overlayColor,
		overlayOpacity,
		textColor,
		imageHeight,
		imageObjectFit,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		hoverAnimation,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `image-box overlay-${overlayPosition} hover-${hoverAnimation}`,
		'data-animation': animationEnabled ? animationType : '',
		'data-animation-duration': animationEnabled ? animationDuration : '',
		'data-animation-delay': animationEnabled ? animationDelay : '',
		'data-animation-easing': animationEnabled ? animationEasing : '',
	});

	const content = (
		<div className="image-box-inner" style={{ height: imageHeight + 'px' }}>
			<div className="image-box-image">
				<img
					src={imageUrl}
					alt={imageAlt}
					style={{
						width: '100%',
						height: '100%',
						objectFit: imageObjectFit,
					}}
				/>
			</div>
			<div
				className="image-box-overlay"
				style={{
					backgroundColor: overlayColor,
					opacity: overlayOpacity / 100,
				}}
			/>
			<div className="image-box-content" style={{ color: textColor }}>
				<RichText.Content
					tagName="h3"
					className="image-box-heading"
					value={heading}
				/>
				<RichText.Content
					tagName="p"
					className="image-box-description"
					value={description}
				/>
			</div>
		</div>
	);

	if (linkUrl) {
		return (
			<div {...blockProps}>
				<a
					href={linkUrl}
					target={linkTarget ? '_blank' : '_self'}
					rel={linkTarget ? 'noopener noreferrer' : undefined}
					className="image-box-link"
				>
					{content}
				</a>
			</div>
		);
	}

	return <div {...blockProps}>{content}</div>;
}
