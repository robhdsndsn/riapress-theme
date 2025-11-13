import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { SkeletonAvatar } from '../../../components/skeletons';

export default function Edit({ attributes, setAttributes }) {
	const { quote,
		author,
		authorTitle,
		authorOrganization,
		authorImageId,
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
		quoteColor,
		authorColor,
		backgroundColor,
		accentColor,
		showAccentBar,
		accentBarPosition,
		accentBarWidth,
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
		hoverAnimation,
	variant,
	customQuoteColor,
	customAuthorColor,
	customBackgroundColor,
	customAccentColor,
	customBorderColor
} = attributes;

	// Image loading state for skeleton
	const [imageLoading, setImageLoading] = useState(!!authorImageUrl);

	const blockProps = useBlockProps({
		className: `ria-quote variant-${variant} style-${style} quote-size-${quoteSize} text-align-${textAlignment} attribution-align-${attributionAlignment} ${showQuoteMarks ? `quote-marks-${quoteMarkStyle}` : 'no-quote-marks'} ${showAccentBar ? `accent-bar-${accentBarPosition}` : ''}`,
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
	});

	return (
		<>
			<InspectorControls>
				{/* Author Details Panel */}
				<PanelBody title={__('Author Details', 'ria-quote')} initialOpen={true}>
					<TextControl
						label={__('Author Name', 'ria-quote')}
						value={author}
						onChange={(value) => setAttributes({ author: value })}
						help={__('Name of the person being quoted', 'ria-quote')}
					/>
					<TextControl
						label={__('Author Title', 'ria-quote')}
						value={authorTitle}
						onChange={(value) => setAttributes({ authorTitle: value })}
						help={__('Job title or role', 'ria-quote')}
					/>
					<TextControl
						label={__('Organization', 'ria-quote')}
						value={authorOrganization}
						onChange={(value) => setAttributes({ authorOrganization: value })}
						help={__('Company or organization name', 'ria-quote')}
					/>
				</PanelBody>

				{/* Author Image Panel */}
				<PanelBody title={__('Author Image', 'ria-quote')} initialOpen={false}>
					<ToggleControl
						label={__('Show Author Image', 'ria-quote')}
						checked={showAuthorImage}
						onChange={(value) => setAttributes({ showAuthorImage: value })}
					/>
					{showAuthorImage && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										setAttributes({
											authorImageId: media.id,
											authorImageUrl: media.url,
										});
										setImageLoading(true);
									}}
									allowedTypes={['image']}
									value={authorImageId}
									render={({ open }) => (
										<div className="author-image-upload">
											{authorImageUrl ? (
												<>
													{imageLoading && <SkeletonAvatar size={authorImageSize} />}
													<img
														src={authorImageUrl}
														alt={author}
														style={{
															width: `${authorImageSize}px`,
															height: `${authorImageSize}px`,
															objectFit: 'cover',
															borderRadius:
																authorImageShape === 'circle'
																	? '50%'
																	: authorImageShape === 'rounded'
																	? '8px'
																	: '0',
															display: imageLoading ? 'none' : 'block'
														}}
														onLoad={() => setImageLoading(false)}
														onError={() => setImageLoading(false)}
													/>
													<div className="image-buttons">
														<Button onClick={open} variant="secondary">
															{__('Change Image', 'ria-quote')}
														</Button>
														<Button
															onClick={() =>
																setAttributes({
																	authorImageId: 0,
																	authorImageUrl: '',
																})
															}
															variant="tertiary"
															isDestructive
														>
															{__('Remove', 'ria-quote')}
														</Button>
													</div>
												</>
											) : (
												<Button onClick={open} variant="primary">
													{__('Select Image', 'ria-quote')}
												</Button>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>
							<SelectControl
								label={__('Image Shape', 'ria-quote')}
								value={authorImageShape}
								options={[
									{ label: __('Circle', 'ria-quote'), value: 'circle' },
									{ label: __('Square', 'ria-quote'), value: 'square' },
									{ label: __('Rounded', 'ria-quote'), value: 'rounded' },
								]}
								onChange={(value) => setAttributes({ authorImageShape: value })}
							/>
							<RangeControl
								label={__('Image Size (px)', 'ria-quote')}
								value={authorImageSize}
								onChange={(value) => setAttributes({ authorImageSize: value })}
								min={30}
								max={200}
								step={10}
							/>
						</>
					)}
				</PanelBody>

				{/* Style Panel */}
				<PanelBody title={__('Style', 'ria-quote')} initialOpen={false}>
					<SelectControl
						label={__('Quote Style', 'ria-quote')}
						value={style}
						options={[
							{ label: __('Default', 'ria-quote'), value: 'default' },
							{ label: __('Large', 'ria-quote'), value: 'large' },
							{ label: __('Minimal', 'ria-quote'), value: 'minimal' },
							{ label: __('Boxed', 'ria-quote'), value: 'boxed' },
							{ label: __('Accent Bar', 'ria-quote'), value: 'accent-bar' },
						]}
						onChange={(value) => setAttributes({ style: value })}
					/>
					<SelectControl
						label={__('Quote Size', 'ria-quote')}
						value={quoteSize}
						options={[
							{ label: __('Small (16px)', 'ria-quote'), value: 'small' },
							{ label: __('Medium (20px)', 'ria-quote'), value: 'medium' },
							{ label: __('Large (28px)', 'ria-quote'), value: 'large' },
							{ label: __('Extra Large (36px)', 'ria-quote'), value: 'xlarge' },
						]}
						onChange={(value) => setAttributes({ quoteSize: value })}
					/>
					<ToggleControl
						label={__('Show Quote Marks', 'ria-quote')}
						checked={showQuoteMarks}
						onChange={(value) => setAttributes({ showQuoteMarks: value })}
					/>
					{showQuoteMarks && (
						<SelectControl
							label={__('Quote Mark Style', 'ria-quote')}
							value={quoteMarkStyle}
							options={[
								{ label: __('Default (Inline)', 'ria-quote'), value: 'default' },
								{ label: __('Large Decorative', 'ria-quote'), value: 'large' },
								{ label: __('Icon', 'ria-quote'), value: 'icon' },
								{ label: __('None', 'ria-quote'), value: 'none' },
							]}
							onChange={(value) => setAttributes({ quoteMarkStyle: value })}
						/>
					)}
				</PanelBody>

				{/* Display Panel */}
				<PanelBody title={__('Display', 'ria-quote')} initialOpen={false}>
					<SelectControl
						label={__('Text Alignment', 'ria-quote')}
						value={textAlignment}
						options={[
							{ label: __('Left', 'ria-quote'), value: 'left' },
							{ label: __('Center', 'ria-quote'), value: 'center' },
							{ label: __('Right', 'ria-quote'), value: 'right' },
						]}
						onChange={(value) => setAttributes({ textAlignment: value })}
					/>
					<SelectControl
						label={__('Attribution Alignment', 'ria-quote')}
						value={attributionAlignment}
						options={[
							{ label: __('Left', 'ria-quote'), value: 'left' },
							{ label: __('Center', 'ria-quote'), value: 'center' },
							{ label: __('Right', 'ria-quote'), value: 'right' },
						]}
						onChange={(value) => setAttributes({ attributionAlignment: value })}
					/>
				</PanelBody>

				{/* Colors Panel */}
				<PanelBody title={__('Colors', 'ria-quote')} initialOpen={false}>
					<p className="components-base-control__label">
						{__('Quote Color', 'ria-quote')}
					</p>
					<ColorPalette
						value={quoteColor}
						onChange={(value) => setAttributes({ quoteColor: value || '#1a1a1a' })}
					/>
					<p className="components-base-control__label">
						{__('Author Color', 'ria-quote')}
					</p>
					<ColorPalette
						value={authorColor}
						onChange={(value) => setAttributes({ authorColor: value || '#6b7280' })}
					/>
					<p className="components-base-control__label">
						{__('Background Color', 'ria-quote')}
					</p>
					<ColorPalette
						value={customBackgroundColor}
						onChange={(value) =>
							setAttributes({ customBackgroundColor: value || '#f9fafb' })
						}
					/>
					<p className="components-base-control__label">
						{__('Accent Color', 'ria-quote')}
					</p>
					<ColorPalette
						value={accentColor}
						onChange={(value) => setAttributes({ accentColor: value || '#2563eb' })}
					/>
				</PanelBody>

				{/* Accent Bar Panel */}
				<PanelBody title={__('Accent Bar', 'ria-quote')} initialOpen={false}>
					<ToggleControl
						label={__('Show Accent Bar', 'ria-quote')}
						checked={showAccentBar}
						onChange={(value) => setAttributes({ showAccentBar: value })}
					/>
					{showAccentBar && (
						<>
							<SelectControl
								label={__('Bar Position', 'ria-quote')}
								value={accentBarPosition}
								options={[
									{ label: __('Left', 'ria-quote'), value: 'left' },
									{ label: __('Right', 'ria-quote'), value: 'right' },
									{ label: __('Top', 'ria-quote'), value: 'top' },
									{ label: __('Bottom', 'ria-quote'), value: 'bottom' },
								]}
								onChange={(value) => setAttributes({ accentBarPosition: value })}
							/>
							<RangeControl
								label={__('Bar Width (px)', 'ria-quote')}
								value={accentBarWidth}
								onChange={(value) => setAttributes({ accentBarWidth: value })}
								min={2}
								max={10}
								step={1}
							/>
						</>
					)}
				</PanelBody>

				{/* Borders & Shadows Panel */}
				<PanelBody title={__('Borders & Shadows', 'ria-quote')} initialOpen={false}>
					<RangeControl
						label={__('Border Width (px)', 'ria-quote')}
						value={borderWidth}
						onChange={(value) => setAttributes({ borderWidth: value })}
						min={0}
						max={10}
						step={1}
					/>
					{borderWidth > 0 && (
						<>
							<SelectControl
								label={__('Border Style', 'ria-quote')}
								value={borderStyle}
								options={[
									{ label: __('Solid', 'ria-quote'), value: 'solid' },
									{ label: __('Dashed', 'ria-quote'), value: 'dashed' },
									{ label: __('Dotted', 'ria-quote'), value: 'dotted' },
									{ label: __('Double', 'ria-quote'), value: 'double' },
									{ label: __('Groove', 'ria-quote'), value: 'groove' },
									{ label: __('Ridge', 'ria-quote'), value: 'ridge' },
								]}
								onChange={(value) => setAttributes({ borderStyle: value })}
							/>
							<p className="components-base-control__label">
								{__('Border Color', 'ria-quote')}
							</p>
							<ColorPalette
								value={customBorderColor}
								onChange={(value) =>
									setAttributes({ customBorderColor: value || '#e5e7eb' })
								}
							/>
						</>
					)}
					<RangeControl
						label={__('Border Radius (px)', 'ria-quote')}
						value={borderRadius}
						onChange={(value) => setAttributes({ borderRadius: value })}
						min={0}
						max={50}
						step={1}
					/>
					<SelectControl
						label={__('Box Shadow', 'ria-quote')}
						value={boxShadow}
						options={[
							{ label: __('None', 'ria-quote'), value: 'none' },
							{ label: __('Small', 'ria-quote'), value: 'small' },
							{ label: __('Medium', 'ria-quote'), value: 'medium' },
							{ label: __('Large', 'ria-quote'), value: 'large' },
							{ label: __('Extra Large', 'ria-quote'), value: 'xlarge' },
							{ label: __('2X Large', 'ria-quote'), value: '2xlarge' },
							{ label: __('Inner', 'ria-quote'), value: 'inner' },
						]}
						onChange={(value) => setAttributes({ boxShadow: value })}
					/>
					<SelectControl
						label={__('Hover Shadow', 'ria-quote')}
						value={hoverShadow}
						options={[
							{ label: __('None', 'ria-quote'), value: 'none' },
							{ label: __('Small', 'ria-quote'), value: 'small' },
							{ label: __('Medium', 'ria-quote'), value: 'medium' },
							{ label: __('Large', 'ria-quote'), value: 'large' },
							{ label: __('Extra Large', 'ria-quote'), value: 'xlarge' },
							{ label: __('2X Large', 'ria-quote'), value: '2xlarge' },
						]}
						onChange={(value) => setAttributes({ hoverShadow: value })}
					/>
				</PanelBody>

				{/* Animation Panel */}
				<PanelBody title={__('Animation', 'ria-quote')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Animation', 'ria-quote')}
						checked={animationEnabled}
						onChange={(value) => setAttributes({ animationEnabled: value })}
					/>
					{animationEnabled && (
						<>
							<SelectControl
								label={__('Animation Type', 'ria-quote')}
								value={animationType}
								options={[
									{ label: __('Fade In', 'ria-quote'), value: 'fadeIn' },
									{ label: __('Fade In Up', 'ria-quote'), value: 'fadeInUp' },
									{ label: __('Fade In Down', 'ria-quote'), value: 'fadeInDown' },
									{ label: __('Fade In Left', 'ria-quote'), value: 'fadeInLeft' },
									{ label: __('Fade In Right', 'ria-quote'), value: 'fadeInRight' },
									{ label: __('Slide In Up', 'ria-quote'), value: 'slideInUp' },
									{ label: __('Slide In Down', 'ria-quote'), value: 'slideInDown' },
									{ label: __('Slide In Left', 'ria-quote'), value: 'slideInLeft' },
									{ label: __('Slide In Right', 'ria-quote'), value: 'slideInRight' },
									{ label: __('Zoom In', 'ria-quote'), value: 'zoomIn' },
									{ label: __('Zoom In Up', 'ria-quote'), value: 'zoomInUp' },
									{ label: __('Bounce In', 'ria-quote'), value: 'bounceIn' },
									{ label: __('Rotate In', 'ria-quote'), value: 'rotateIn' },
									{ label: __('Flip In X', 'ria-quote'), value: 'flipInX' },
									{ label: __('Flip In Y', 'ria-quote'), value: 'flipInY' },
									{ label: __('None', 'ria-quote'), value: 'none' },
								]}
								onChange={(value) => setAttributes({ animationType: value })}
							/>
							<RangeControl
								label={__('Duration (ms)', 'ria-quote')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={200}
								max={2000}
								step={100}
							/>
							<RangeControl
								label={__('Delay (ms)', 'ria-quote')}
								value={animationDelay}
								onChange={(value) => setAttributes({ animationDelay: value })}
								min={0}
								max={2000}
								step={100}
							/>
							<SelectControl
								label={__('Easing', 'ria-quote')}
								value={animationEasing}
								options={[
									{ label: __('Linear', 'ria-quote'), value: 'linear' },
									{ label: __('Ease', 'ria-quote'), value: 'ease' },
									{ label: __('Ease In', 'ria-quote'), value: 'ease-in' },
									{ label: __('Ease Out', 'ria-quote'), value: 'ease-out' },
									{ label: __('Ease In Out', 'ria-quote'), value: 'ease-in-out' },
								]}
								onChange={(value) => setAttributes({ animationEasing: value })}
							/>
						</>
					)}
					<SelectControl
						label={__('Hover Animation', 'ria-quote')}
						value={hoverAnimation}
						options={[
							{ label: __('None', 'ria-quote'), value: 'none' },
							{ label: __('Lift', 'ria-quote'), value: 'lift' },
							{ label: __('Grow', 'ria-quote'), value: 'grow' },
							{ label: __('Shrink', 'ria-quote'), value: 'shrink' },
							{ label: __('Rotate', 'ria-quote'), value: 'rotate' },
							{ label: __('Tilt', 'ria-quote'), value: 'tilt' },
							{ label: __('Glow', 'ria-quote'), value: 'glow' },
							{ label: __('Pulse', 'ria-quote'), value: 'pulse' },
							{ label: __('Bounce', 'ria-quote'), value: 'bounce' },
						]}
						onChange={(value) => setAttributes({ hoverAnimation: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="quote-content">
					<RichText
						tagName="blockquote"
						className="quote-text"
						value={quote}
						onChange={(value) => setAttributes({ quote: value })}
						placeholder={__('Enter quote text...', 'ria-quote')}
						allowedFormats={['core/italic', 'core/bold']}
					/>
				</div>

				<div className="quote-attribution">
					{showAuthorImage && authorImageUrl && (
						<>
							{imageLoading && <SkeletonAvatar size={authorImageSize} />}
							<img
								src={authorImageUrl}
								alt={author}
								className={`author-image shape-${authorImageShape}`}
								style={{
									width: `${authorImageSize}px`,
									height: `${authorImageSize}px`,
									display: imageLoading ? 'none' : 'block'
								}}
								onLoad={() => setImageLoading(false)}
								onError={() => setImageLoading(false)}
							/>
						</>
					)}
					<div className="author-info">
						<RichText
							tagName="cite"
							className="author-name"
							value={author}
							onChange={(value) => setAttributes({ author: value })}
							placeholder={__('Author Name', 'ria-quote')}
							allowedFormats={[]}
						/>
						{authorTitle && (
							<RichText
								tagName="span"
								className="author-title"
								value={authorTitle}
								onChange={(value) => setAttributes({ authorTitle: value })}
								placeholder={__('Author Title', 'ria-quote')}
								allowedFormats={[]}
							/>
						)}
						{authorOrganization && (
							<RichText
								tagName="span"
								className="author-organization"
								value={authorOrganization}
								onChange={(value) => setAttributes({ authorOrganization: value })}
								placeholder={__('Organization', 'ria-quote')}
								allowedFormats={[]}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
