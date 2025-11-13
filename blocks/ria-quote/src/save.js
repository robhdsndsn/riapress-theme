import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const {
		quote,
		author,
		authorTitle,
		authorOrganization,
		authorImageUrl,
		style,
		quoteSize,
		showQuoteMarks,
		quoteMarkStyle,
		showAuthorImage,
		authorImageShape,
		authorImageSize,
		attributionAlignment,
		textAlignment,
		variant,
		customQuoteColor,
		customAuthorColor,
		customBackgroundColor,
		customAccentColor,
		customBorderColor,
		showAccentBar,
		accentBarPosition,
		accentBarWidth,
		borderWidth,
		borderStyle,
		borderRadius,
		boxShadow,
		hoverShadow,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		hoverAnimation,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `ria-quote variant-${variant} style-${style} quote-size-${quoteSize} text-align-${textAlignment} attribution-align-${attributionAlignment} ${showQuoteMarks ? `quote-marks-${quoteMarkStyle}` : 'no-quote-marks'} ${showAccentBar ? `accent-bar-${accentBarPosition}` : ''} shadow-${boxShadow} ${hoverShadow !== 'none' ? `hover-shadow-${hoverShadow}` : ''} ${hoverAnimation !== 'none' ? `hover-${hoverAnimation}` : ''}`,
		style: {
			...(variant === 'custom' && {
				'--custom-quote-color': customQuoteColor,
				'--custom-author-color': customAuthorColor,
				'--custom-bg-color': customBackgroundColor,
				'--custom-accent-color': customAccentColor,
				'--custom-border-color': customBorderColor,
			}),
			'--accent-bar-width': `${accentBarWidth}px`,
			'--border-width': `${borderWidth}px`,
			'--border-style': borderStyle,
			'--border-radius': `${borderRadius}px`,
		},
		...(animationEnabled && {
			'data-animation': animationType,
			'data-duration': animationDuration,
			'data-delay': animationDelay,
			'data-easing': animationEasing,
		}),
	});

	return (
		<div {...blockProps}>
			<div className="quote-content">
				{quote && <RichText.Content tagName="blockquote" className="quote-text" value={quote} />}
			</div>

			{(author || authorTitle || authorOrganization || (showAuthorImage && authorImageUrl)) && (
				<div className="quote-attribution">
					{showAuthorImage && authorImageUrl && (
						<img
							src={authorImageUrl}
							alt={author}
							className={`author-image shape-${authorImageShape}`}
							style={{
								width: `${authorImageSize}px`,
								height: `${authorImageSize}px`,
							}}
						/>
					)}
					<div className="author-info">
						{author && <RichText.Content tagName="cite" className="author-name" value={author} />}
						{authorTitle && (
							<RichText.Content tagName="span" className="author-title" value={authorTitle} />
						)}
						{authorOrganization && (
							<RichText.Content
								tagName="span"
								className="author-organization"
								value={authorOrganization}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
