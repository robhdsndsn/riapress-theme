/**
 * Edit Component for RIA Resource Card Block
 */
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText, ColorPalette } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
	RangeControl,
	Button,
	Placeholder,
	__experimentalInputControl as InputControl,
	DateTimePicker
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import * as Icons from '../../../shared/icons';
import { SkeletonImage } from '../../../components/skeletons';

const Edit = ({ attributes, setAttributes }) => {
	const {
		layout,
		title,
		excerpt,
		thumbnailId,
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
		relatedProducts,
		showThumbnail,
		showFileTypeIcon,
		showExcerpt,
		showTopics,
		showCategories,
		showDate,
		showAuthors,
		showFileSize,
		showRelatedProducts,
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

	const [newTopic, setNewTopic] = useState('');
	const [newAuthor, setNewAuthor] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [imageLoading, setImageLoading] = useState(!!thumbnailUrl);

	// File type icon mapping (Lucide React components)
	const getFileTypeIcon = (type) => {
		const iconMap = {
			pdf: FileText,
			doc: FileText,
			docx: FileText,
			xls: Table,
			xlsx: Table,
			ppt: Presentation,
			pptx: Presentation,
			zip: Archive,
			video: Video,
			external: Link
		};
		const IconComponent = iconMap[type] || FileText;
		return <IconComponent size={20} />;
	};

	const blockProps = useBlockProps({
		className: `ria-resource-card layout-${layout}`,
		style: {
			backgroundColor,
			borderWidth: `${borderWidth}px`,
			borderStyle,
			borderColor,
			borderRadius: `${borderRadius}px`
		}
	});

	// Add topic
	const addTopic = () => {
		if (newTopic.trim()) {
			setAttributes({ topics: [...topics, newTopic.trim()] });
			setNewTopic('');
		}
	};

	// Remove topic
	const removeTopic = (index) => {
		const newTopics = topics.filter((_, i) => i !== index);
		setAttributes({ topics: newTopics });
	};

	// Add author
	const addAuthor = () => {
		if (newAuthor.trim()) {
			setAttributes({ authors: [...authors, newAuthor.trim()] });
			setNewAuthor('');
		}
	};

	// Remove author
	const removeAuthor = (index) => {
		const newAuthors = authors.filter((_, i) => i !== index);
		setAttributes({ authors: newAuthors });
	};

	return (
		<>
			<InspectorControls>
				{/* Layout Settings */}
				<PanelBody title={__('Layout Settings', 'ria-resource-card')} initialOpen={true}>
					<SelectControl
						label={__('Layout', 'ria-resource-card')}
						value={layout}
						options={[
							{ label: 'Card', value: 'card' },
							{ label: 'List', value: 'list' },
							{ label: 'Compact', value: 'compact' },
							{ label: 'Featured', value: 'featured' }
						]}
						onChange={(value) => setAttributes({ layout: value })}
						help={__('Choose how the resource card is displayed', 'ria-resource-card')}
					/>
				</PanelBody>

				{/* Content Settings */}
				<PanelBody title={__('Content Settings', 'ria-resource-card')}>
					<ToggleControl
						label={__('Show Excerpt', 'ria-resource-card')}
						checked={showExcerpt}
						onChange={(value) => setAttributes({ showExcerpt: value })}
					/>
				</PanelBody>

				{/* Thumbnail Settings */}
				<PanelBody title={__('Thumbnail Settings', 'ria-resource-card')}>
					<ToggleControl
						label={__('Show Thumbnail', 'ria-resource-card')}
						checked={showThumbnail}
						onChange={(value) => setAttributes({ showThumbnail: value })}
					/>
					{showThumbnail && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => {
									setAttributes({
										thumbnailId: media.id,
										thumbnailUrl: media.url
									});
									setImageLoading(true);
								}}
								allowedTypes={['image']}
								value={thumbnailId}
								render={({ open }) => (
									<div style={{ marginTop: '10px' }}>
										{thumbnailUrl ? (
											<>
												{imageLoading && <SkeletonImage aspectRatio="16/9" />}
												<img
													src={thumbnailUrl}
													alt={__('Thumbnail preview', 'ria-resource-card')}
													style={{
														maxWidth: '100%',
														height: 'auto',
														marginBottom: '10px',
														display: imageLoading ? 'none' : 'block'
													}}
													onLoad={() => setImageLoading(false)}
													onError={() => setImageLoading(false)}
												/>
												<Button onClick={open} variant="secondary" style={{ marginRight: '8px' }}>
													{__('Change Image', 'ria-resource-card')}
												</Button>
												<Button
													onClick={() => setAttributes({ thumbnailId: 0, thumbnailUrl: '' })}
													variant="tertiary"
													isDestructive
												>
													{__('Remove', 'ria-resource-card')}
												</Button>
											</>
										) : (
											<Button onClick={open} variant="primary">
												{__('Select Image', 'ria-resource-card')}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>
					)}
				</PanelBody>

				{/* File Settings */}
				<PanelBody title={__('File Settings', 'ria-resource-card')}>
					<ToggleControl
						label={__('External Link', 'ria-resource-card')}
						checked={isExternal}
						onChange={(value) => setAttributes({ isExternal: value })}
						help={__('Link to external URL instead of downloadable file', 'ria-resource-card')}
					/>

					{isExternal ? (
						<TextControl
							label={__('External URL', 'ria-resource-card')}
							value={externalUrl}
							onChange={(value) => setAttributes({ externalUrl: value })}
							placeholder="https://example.com"
							help={__('URL to external resource', 'ria-resource-card')}
						/>
					) : (
						<>
							<SelectControl
								label={__('File Type', 'ria-resource-card')}
								value={fileType}
								options={[
									{ label: 'PDF Document', value: 'pdf' },
									{ label: 'Word Document', value: 'doc' },
									{ label: 'Word Document (.docx)', value: 'docx' },
									{ label: 'Excel Spreadsheet', value: 'xls' },
									{ label: 'Excel Spreadsheet (.xlsx)', value: 'xlsx' },
									{ label: 'PowerPoint Presentation', value: 'ppt' },
									{ label: 'PowerPoint Presentation (.pptx)', value: 'pptx' },
									{ label: 'ZIP Archive', value: 'zip' },
									{ label: 'Video', value: 'video' }
								]}
								onChange={(value) => setAttributes({ fileType: value })}
							/>
							<TextControl
								label={__('File URL', 'ria-resource-card')}
								value={fileUrl}
								onChange={(value) => setAttributes({ fileUrl: value })}
								placeholder="/wp-content/uploads/file.pdf"
								help={__('URL to downloadable file', 'ria-resource-card')}
							/>
							<TextControl
								label={__('File Size', 'ria-resource-card')}
								value={fileSize}
								onChange={(value) => setAttributes({ fileSize: value })}
								placeholder="2.5 MB"
								help={__('Display file size (e.g., "2.5 MB")', 'ria-resource-card')}
							/>
						</>
					)}

					<ToggleControl
						label={__('Show File Type Icon', 'ria-resource-card')}
						checked={showFileTypeIcon}
						onChange={(value) => setAttributes({ showFileTypeIcon: value })}
					/>
					<ToggleControl
						label={__('Show File Size', 'ria-resource-card')}
						checked={showFileSize}
						onChange={(value) => setAttributes({ showFileSize: value })}
					/>
				</PanelBody>

				{/* Metadata Settings */}
				<PanelBody title={__('Metadata Settings', 'ria-resource-card')}>
					{/* Topics */}
					<ToggleControl
						label={__('Show Topics', 'ria-resource-card')}
						checked={showTopics}
						onChange={(value) => setAttributes({ showTopics: value })}
					/>
					{showTopics && (
						<div style={{ marginTop: '10px' }}>
							<p style={{ marginBottom: '8px', fontWeight: 500 }}>
								{__('Topics', 'ria-resource-card')}
							</p>
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
								{topics.map((topic, index) => (
									<span
										key={index}
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											padding: '4px 8px',
											backgroundColor: '#f0f0f0',
											borderRadius: '4px',
											fontSize: '12px'
										}}
									>
										{topic}
										<button
											onClick={() => removeTopic(index)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													removeTopic(index);
												}
											}}
											aria-label={__('Remove topic', 'ria-resource-card') + ' ' + topic}
											type="button"
											style={{
												marginLeft: '6px',
												border: 'none',
												background: 'none',
												cursor: 'pointer',
												fontSize: '14px',
												lineHeight: '1'
											}}
										>
											×
										</button>
									</span>
								))}
							</div>
							<div style={{ display: 'flex', gap: '8px' }}>
								<input
									type="text"
									value={newTopic}
									onChange={(e) => setNewTopic(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											addTopic();
										}
									}}
									placeholder={__('Add topic...', 'ria-resource-card')}
									style={{ flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
								/>
								<Button onClick={addTopic} variant="secondary" size="small">
									{__('Add', 'ria-resource-card')}
								</Button>
							</div>
						</div>
					)}

					{/* Publication Date */}
					<ToggleControl
						label={__('Show Publication Date', 'ria-resource-card')}
						checked={showDate}
						onChange={(value) => setAttributes({ showDate: value })}
					/>
					{showDate && (
						<div style={{ marginTop: '10px' }}>
							<Button
								onClick={() => setShowDatePicker(!showDatePicker)}
								variant="secondary"
								style={{ marginBottom: '10px' }}
							>
								{publicationDate || __('Select Date', 'ria-resource-card')}
							</Button>
							{showDatePicker && (
								<DateTimePicker
									currentDate={publicationDate}
									onChange={(date) => {
										setAttributes({ publicationDate: date });
										setShowDatePicker(false);
									}}
								/>
							)}
						</div>
					)}

					{/* Authors */}
					<ToggleControl
						label={__('Show Authors', 'ria-resource-card')}
						checked={showAuthors}
						onChange={(value) => setAttributes({ showAuthors: value })}
					/>
					{showAuthors && (
						<div style={{ marginTop: '10px' }}>
							<p style={{ marginBottom: '8px', fontWeight: 500 }}>
								{__('Authors', 'ria-resource-card')}
							</p>
							<div style={{ marginBottom: '10px' }}>
								{authors.map((author, index) => (
									<div
										key={index}
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											padding: '6px 8px',
											marginBottom: '4px',
											backgroundColor: '#f0f0f0',
											borderRadius: '4px'
										}}
									>
										<span style={{ fontSize: '13px' }}>{author}</span>
										<button
											onClick={() => removeAuthor(index)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													removeAuthor(index);
												}
											}}
											aria-label={__('Remove author', 'ria-resource-card') + ' ' + author}
											type="button"
											style={{
												border: 'none',
												background: 'none',
												cursor: 'pointer',
												fontSize: '16px',
												lineHeight: '1'
											}}
										>
											×
										</button>
									</div>
								))}
							</div>
							<div style={{ display: 'flex', gap: '8px' }}>
								<input
									type="text"
									value={newAuthor}
									onChange={(e) => setNewAuthor(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											addAuthor();
										}
									}}
									placeholder={__('Add author...', 'ria-resource-card')}
									style={{ flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
								/>
								<Button onClick={addAuthor} variant="secondary" size="small">
									{__('Add', 'ria-resource-card')}
								</Button>
							</div>
						</div>
					)}

					<ToggleControl
						label={__('Show Categories', 'ria-resource-card')}
						checked={showCategories}
						onChange={(value) => setAttributes({ showCategories: value })}
					/>
					<ToggleControl
						label={__('Show Related Products', 'ria-resource-card')}
						checked={showRelatedProducts}
						onChange={(value) => setAttributes({ showRelatedProducts: value })}
					/>
				</PanelBody>

				{/* Button Settings */}
				<PanelBody title={__('Button Settings', 'ria-resource-card')}>
					<TextControl
						label={__('Button Text', 'ria-resource-card')}
						value={buttonText}
						onChange={(value) => setAttributes({ buttonText: value })}
						placeholder="Download"
					/>
					<SelectControl
						label={__('Button Style', 'ria-resource-card')}
						value={buttonStyle}
						options={[
							{ label: 'Primary', value: 'primary' },
							{ label: 'Secondary', value: 'secondary' },
							{ label: 'Accent', value: 'accent' },
							{ label: 'Ghost', value: 'ghost' }
						]}
						onChange={(value) => setAttributes({ buttonStyle: value })}
					/>
					<ToggleControl
						label={__('Open in New Tab', 'ria-resource-card')}
						checked={openInNewTab}
						onChange={(value) => setAttributes({ openInNewTab: value })}
					/>
				</PanelBody>

				{/* Styling Settings */}
				<PanelBody title={__('Styling Settings', 'ria-resource-card')}>
					<p style={{ marginBottom: '8px', fontWeight: 500 }}>
						{__('Background Color', 'ria-resource-card')}
					</p>
					<ColorPalette
						value={backgroundColor}
						onChange={(value) => setAttributes({ backgroundColor: value || '#ffffff' })}
					/>

					<SelectControl
						label={__('Hover Effect', 'ria-resource-card')}
						value={hoverEffect}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Elevate (Shadow)', value: 'elevate' },
							{ label: 'Scale', value: 'scale' },
							{ label: 'Border Highlight', value: 'border' }
						]}
						onChange={(value) => setAttributes({ hoverEffect: value })}
					/>
				</PanelBody>

				{/* Border & Shadow */}
				<PanelBody title={__('Border & Shadow', 'ria-resource-card')}>
					<RangeControl
						label={__('Border Width', 'ria-resource-card')}
						value={borderWidth}
						onChange={(value) => setAttributes({ borderWidth: value })}
						min={0}
						max={10}
					/>
					<SelectControl
						label={__('Border Style', 'ria-resource-card')}
						value={borderStyle}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Solid', value: 'solid' },
							{ label: 'Dashed', value: 'dashed' },
							{ label: 'Dotted', value: 'dotted' },
							{ label: 'Double', value: 'double' }
						]}
						onChange={(value) => setAttributes({ borderStyle: value })}
					/>
					<p style={{ marginBottom: '8px', fontWeight: 500 }}>
						{__('Border Color', 'ria-resource-card')}
					</p>
					<ColorPalette
						value={borderColor}
						onChange={(value) => setAttributes({ borderColor: value || '#e5e7eb' })}
					/>
					<RangeControl
						label={__('Border Radius', 'ria-resource-card')}
						value={borderRadius}
						onChange={(value) => setAttributes({ borderRadius: value })}
						min={0}
						max={50}
					/>
					<SelectControl
						label={__('Box Shadow', 'ria-resource-card')}
						value={boxShadow}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
							{ label: 'XLarge', value: 'xlarge' },
							{ label: '2XLarge', value: '2xlarge' }
						]}
						onChange={(value) => setAttributes({ boxShadow: value })}
					/>
					<SelectControl
						label={__('Hover Shadow', 'ria-resource-card')}
						value={hoverShadow}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
							{ label: 'XLarge', value: 'xlarge' },
							{ label: '2XLarge', value: '2xlarge' }
						]}
						onChange={(value) => setAttributes({ hoverShadow: value })}
					/>
				</PanelBody>

				{/* Animation Settings */}
				<PanelBody title={__('Animation Settings', 'ria-resource-card')}>
					<ToggleControl
						label={__('Enable Animation', 'ria-resource-card')}
						checked={animationEnabled}
						onChange={(value) => setAttributes({ animationEnabled: value })}
					/>
					{animationEnabled && (
						<>
							<SelectControl
								label={__('Animation Type', 'ria-resource-card')}
								value={animationType}
								options={[
									{ label: 'Fade In', value: 'fadeIn' },
									{ label: 'Fade In Up', value: 'fadeInUp' },
									{ label: 'Fade In Down', value: 'fadeInDown' },
									{ label: 'Fade In Left', value: 'fadeInLeft' },
									{ label: 'Fade In Right', value: 'fadeInRight' },
									{ label: 'Slide In Up', value: 'slideInUp' },
									{ label: 'Slide In Down', value: 'slideInDown' },
									{ label: 'Zoom In', value: 'zoomIn' },
									{ label: 'Bounce In', value: 'bounceIn' }
								]}
								onChange={(value) => setAttributes({ animationType: value })}
							/>
							<RangeControl
								label={__('Duration (ms)', 'ria-resource-card')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={100}
								max={3000}
								step={100}
							/>
							<RangeControl
								label={__('Delay (ms)', 'ria-resource-card')}
								value={animationDelay}
								onChange={(value) => setAttributes({ animationDelay: value })}
								min={0}
								max={2000}
								step={100}
							/>
							<SelectControl
								label={__('Easing', 'ria-resource-card')}
								value={animationEasing}
								options={[
									{ label: 'Linear', value: 'linear' },
									{ label: 'Ease', value: 'ease' },
									{ label: 'Ease In', value: 'ease-in' },
									{ label: 'Ease Out', value: 'ease-out' },
									{ label: 'Ease In Out', value: 'ease-in-out' }
								]}
								onChange={(value) => setAttributes({ animationEasing: value })}
							/>
						</>
					)}
					<SelectControl
						label={__('Hover Animation', 'ria-resource-card')}
						value={hoverAnimation}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Lift', value: 'lift' },
							{ label: 'Grow', value: 'grow' },
							{ label: 'Pulse', value: 'pulse' }
						]}
						onChange={(value) => setAttributes({ hoverAnimation: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{/* Thumbnail */}
				{showThumbnail && (
					<div className="resource-thumbnail">
						{thumbnailUrl ? (
							<>
								{imageLoading && <SkeletonImage aspectRatio="16/9" />}
								<img
									src={thumbnailUrl}
									alt={title || __('Resource thumbnail', 'ria-resource-card')}
									onLoad={() => setImageLoading(false)}
									onError={() => setImageLoading(false)}
									style={{ display: imageLoading ? 'none' : 'block' }}
								/>
							</>
						) : (
							<div className="thumbnail-placeholder">
								<span>{__('No Image', 'ria-resource-card')}</span>
							</div>
						)}
					</div>
				)}

				{/* Content */}
				<div className="resource-content">
					{/* File Type Icon */}
					{showFileTypeIcon && (
						<div className="file-type-icon">
							<span className="icon">{getFileTypeIcon(fileType)}</span>
						</div>
					)}

					{/* Title */}
					<RichText
						tagName="h3"
						className="resource-title"
						value={title}
						onChange={(value) => setAttributes({ title: value })}
						placeholder={__('Resource Title', 'ria-resource-card')}
					/>

					{/* Topics */}
					{showTopics && topics.length > 0 && (
						<div className="resource-topics">
							{topics.map((topic, index) => (
								<span key={index} className="topic-tag">{topic}</span>
							))}
						</div>
					)}

					{/* Excerpt */}
					{showExcerpt && (
						<RichText
							tagName="p"
							className="resource-excerpt"
							value={excerpt}
							onChange={(value) => setAttributes({ excerpt: value })}
							placeholder={__('Resource description...', 'ria-resource-card')}
						/>
					)}

					{/* Metadata */}
					<div className="resource-metadata">
						{showDate && publicationDate && (
							<span className="meta-date">
								{new Date(publicationDate).toLocaleDateString()}
							</span>
						)}
						{showAuthors && authors.length > 0 && (
							<span className="meta-authors">
								{authors.join(', ')}
							</span>
						)}
						{showFileSize && fileSize && (
							<span className="meta-filesize">
								{fileSize}
							</span>
						)}
					</div>

					{/* Button */}
					<div className={`resource-button button-style-${buttonStyle}`}>
						<span>{buttonText || __('Download', 'ria-resource-card')}</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;
