import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		variant,
		customBackgroundColor,
		customBorderColor,
		layout,
		imagePosition,
		imageId,
		imageUrl,
		imageAlt,
		imageAspectRatio,
		imageObjectFit,
		imageOverlayColor,
		imageOverlayOpacity,
		showImage,
		headingText,
		headingLevel,
		headingColor,
		bodyText,
		textColor,
		buttonText,
		buttonUrl,
		buttonStyle,
		buttonTarget,
		showButton,
		contentAlignment,
		verticalAlignment,
		backgroundColor,
		borderRadius,
		borderWidth,
		borderColor,
		borderStyle,
		boxShadow,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		hoverElevation,
		makeEntireCardClickable,
		imageWidth,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `variant-${variant || 'neutral'}`,
		style: variant === 'custom' ? {
			'--custom-bg-color': customBackgroundColor || 'transparent',
			'--custom-border-color': customBorderColor || 'transparent',
		} : {}
	});

	const cardStyle = {
		backgroundColor,
		borderRadius: `${borderRadius}px`,
		borderWidth: `${borderWidth}px`,
		borderColor,
		borderStyle,
		flexDirection: layout === 'horizontal' && imagePosition === 'left' ? 'row' :
		               layout === 'horizontal' && imagePosition === 'right' ? 'row-reverse' : 'column',
	};

	const contentStyle = {
		padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
		textAlign: contentAlignment,
		justifyContent: verticalAlignment === 'top' ? 'flex-start' :
		                verticalAlignment === 'center' ? 'center' : 'flex-end',
	};

	const imageStyle = {
		aspectRatio: imageAspectRatio !== 'none' ? imageAspectRatio : undefined,
		objectFit: imageObjectFit,
		width: layout === 'horizontal' ? `${imageWidth}%` : '100%',
	};

	const containerClassName = [
		'ria-card',
		`variant-${variant || 'neutral'}`,
		`layout-${layout}`,
		`image-position-${imagePosition}`,
		boxShadow !== 'none' ? `shadow-${boxShadow}` : null,
		hoverElevation ? 'hover-elevation' : null,
		makeEntireCardClickable ? 'clickable-card' : null,
	].filter(Boolean).join(' ');

	const HeadingTag = `h${headingLevel}`;

	const CardContent = () => (
		<>
			{showImage && imageUrl && (
				<div className="ria-card-image-wrapper">
					<img
						src={imageUrl}
						alt={imageAlt}
						style={imageStyle}
						className="ria-card-image"
					/>
					{imageOverlayColor && imageOverlayOpacity > 0 && (
						<div
							className="ria-card-image-overlay"
							style={{
								backgroundColor: imageOverlayColor,
								opacity: imageOverlayOpacity / 100,
							}}
						></div>
					)}
				</div>
			)}

			<div className="ria-card-content" style={contentStyle}>
				{headingText && (
					<RichText.Content
						tagName={HeadingTag}
						className="ria-card-heading"
						value={headingText}
						style={{ color: headingColor }}
					/>
				)}

				{bodyText && (
					<RichText.Content
						tagName="p"
						className="ria-card-text"
						value={bodyText}
						style={{ color: textColor }}
					/>
				)}

				{showButton && buttonText && buttonUrl && (
					<div className="ria-card-button-wrapper">
						{!makeEntireCardClickable && (
							<a
								href={buttonUrl}
								className={`ria-card-button button-style-${buttonStyle}`}
								target={buttonTarget}
								rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
							>
								<RichText.Content value={buttonText} />
							</a>
						)}
						{makeEntireCardClickable && (
							<span className={`ria-card-button button-style-${buttonStyle}`}>
								<RichText.Content value={buttonText} />
							</span>
						)}
					</div>
				)}
			</div>
		</>
	);

	return (
		<div {...blockProps}>
			{makeEntireCardClickable && buttonUrl ? (
				<a
					href={buttonUrl}
					className={containerClassName}
					style={cardStyle}
					target={buttonTarget}
					rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
				>
					<CardContent />
				</a>
			) : (
				<div className={containerClassName} style={cardStyle}>
					<CardContent />
				</div>
			)}
		</div>
	);
}
