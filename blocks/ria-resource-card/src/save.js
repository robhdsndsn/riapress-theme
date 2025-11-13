/**
 * Save Component for RIA Resource Card Block
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
	const {
		layout,
		title,
		excerpt,
		thumbnailUrl,
		fileType,
		fileUrl,
		fileSize,
		isExternal,
		externalUrl,
		topics,
		categories,
		publicationDate,
		authors,
		showThumbnail,
		showFileTypeIcon,
		showExcerpt,
		showTopics,
		showCategories,
		showDate,
		showAuthors,
		showFileSize,
		buttonText,
		buttonStyle,
		openInNewTab,
		backgroundColor,
		hoverEffect,
		borderWidth,
		borderStyle,
		borderColor,
		borderRadius,
		boxShadow,
		hoverShadow,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		hoverAnimation
	} = attributes;

	// File type icon mapping (return icon names for data-icon attributes)
	const getFileTypeIcon = (type) => {
		const iconMap = {
			pdf: 'file-text',
			doc: 'file-text',
			docx: 'file-text',
			xls: 'table',
			xlsx: 'table',
			ppt: 'presentation',
			pptx: 'presentation',
			zip: 'archive',
			video: 'video',
			external: 'link'
		};
		return iconMap[type] || 'file-text';
	};

	// Determine final URL
	const finalUrl = isExternal ? externalUrl : fileUrl;

	// Build class names
	const classNames = [
		'ria-resource-card',
		`layout-${layout}`,
		`hover-effect-${hoverEffect}`,
		hoverAnimation !== 'none' ? `hover-animation-${hoverAnimation}` : '',
		boxShadow !== 'none' ? `shadow-${boxShadow}` : '',
		hoverShadow !== 'none' ? `hover-shadow-${hoverShadow}` : ''
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps.save({
		className: classNames,
		style: {
			backgroundColor,
			borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
			borderStyle: borderWidth > 0 ? borderStyle : undefined,
			borderColor: borderWidth > 0 ? borderColor : undefined,
			borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined
		},
		'data-animation': animationEnabled ? animationType : 'none',
		'data-delay': animationDelay,
		'data-duration': animationDuration,
		'data-easing': animationEasing
	});

	return (
		<div {...blockProps}>
			{/* Thumbnail */}
			{showThumbnail && thumbnailUrl && (
				<div className="resource-thumbnail">
					<img src={thumbnailUrl} alt={title || 'Resource thumbnail'} loading="lazy" />
				</div>
			)}

			{/* Content */}
			<div className="resource-content">
				{/* File Type Icon */}
				{showFileTypeIcon && (
					<div className="file-type-icon">
						<span className="icon" data-icon={getFileTypeIcon(fileType)}></span>
					</div>
				)}

				{/* Title */}
				{title && (
					<RichText.Content
						tagName="h3"
						className="resource-title"
						value={title}
					/>
				)}

				{/* Topics */}
				{showTopics && topics.length > 0 && (
					<div className="resource-topics">
						{topics.map((topic, index) => (
							<span key={index} className="topic-tag">{topic}</span>
						))}
					</div>
				)}

				{/* Excerpt */}
				{showExcerpt && excerpt && (
					<RichText.Content
						tagName="p"
						className="resource-excerpt"
						value={excerpt}
					/>
				)}

				{/* Metadata */}
				<div className="resource-metadata">
					{showDate && publicationDate && (
						<span className="meta-date">
							<span className="meta-icon" data-icon="calendar"></span> {new Date(publicationDate).toLocaleDateString()}
						</span>
					)}
					{showAuthors && authors.length > 0 && (
						<span className="meta-authors">
							<span className="meta-icon" data-icon="users"></span> {authors.join(', ')}
						</span>
					)}
					{showFileSize && fileSize && !isExternal && (
						<span className="meta-filesize">
							<span className="meta-icon" data-icon="hard-drive"></span> {fileSize}
						</span>
					)}
				</div>

				{/* Categories (if shown) */}
				{showCategories && categories.length > 0 && (
					<div className="resource-categories">
						{categories.map((category, index) => (
							<span key={index} className="category-tag">{category}</span>
						))}
					</div>
				)}

				{/* Button/Link */}
				{finalUrl && (
					<a
						href={finalUrl}
						className={`resource-button button-style-${buttonStyle}`}
						target={openInNewTab ? '_blank' : '_self'}
						rel={openInNewTab ? 'noopener noreferrer' : undefined}
						download={!isExternal ? true : undefined}
					>
						<span className="button-text">
							{buttonText || (isExternal ? 'Visit Link' : 'Download')}
						</span>
						{isExternal && <span className="external-icon">↗</span>}
					</a>
				)}
			</div>
		</div>
	);
};

export default Save;
