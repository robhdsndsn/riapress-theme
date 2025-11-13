import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText, PanelColorSettings, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, TextControl, ToggleControl, Button, ButtonGroup, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { SkeletonImage } from '../../../components/skeletons';

export default function Edit({ attributes, setAttributes }) {
	const [imageLoading, setImageLoading] = useState(true);
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

	// Reset loading state when image URL changes
	useEffect(() => {
		if (imageUrl) {
			setImageLoading(true);
		}
	}, [imageUrl]);

	const blockProps = useBlockProps({
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

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={contentAlignment}
					onChange={(value) => setAttributes({ contentAlignment: value })}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Layout', 'ria-card')} initialOpen={true}>
					<SelectControl
						label={__('Card Layout', 'ria-card')}
						value={layout}
						options={[
							{ label: __('Vertical', 'ria-card'), value: 'vertical' },
							{ label: __('Horizontal', 'ria-card'), value: 'horizontal' },
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>

					{layout === 'horizontal' && (
						<>
							<SelectControl
								label={__('Image Position', 'ria-card')}
								value={imagePosition}
								options={[
									{ label: __('Left', 'ria-card'), value: 'left' },
									{ label: __('Right', 'ria-card'), value: 'right' },
								]}
								onChange={(value) => setAttributes({ imagePosition: value })}
							/>

							<RangeControl
								label={__('Image Width (%)', 'ria-card')}
								value={imageWidth}
								onChange={(value) => setAttributes({ imageWidth: value })}
								min={20}
								max={70}
								step={5}
							/>
						</>
					)}

					<SelectControl
						label={__('Vertical Alignment', 'ria-card')}
						value={verticalAlignment}
						options={[
							{ label: __('Top', 'ria-card'), value: 'top' },
							{ label: __('Center', 'ria-card'), value: 'center' },
							{ label: __('Bottom', 'ria-card'), value: 'bottom' },
						]}
						onChange={(value) => setAttributes({ verticalAlignment: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Color Scheme', 'ria-card')} initialOpen={false}>
					<SelectControl
						label={__('Variant', 'ria-card')}
						value={variant}
						options={[
							{ label: __('Primary', 'ria-card'), value: 'primary' },
							{ label: __('Secondary', 'ria-card'), value: 'secondary' },
							{ label: __('Tertiary', 'ria-card'), value: 'tertiary' },
							{ label: __('Neutral (Default)', 'ria-card'), value: 'neutral' },
							{ label: __('Custom', 'ria-card'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ variant: value })}
						help={__('Choose a color scheme or use custom colors', 'ria-card')}
					/>
					{variant === 'custom' && (
						<>
							<p><strong>{__('Custom Colors', 'ria-card')}</strong></p>
							<PanelColorSettings
								title={__('Background Color', 'ria-card')}
								colorSettings={[
									{
										value: customBackgroundColor,
										onChange: (value) => setAttributes({ customBackgroundColor: value }),
										label: __('Background', 'ria-card'),
									}
								]}
							/>
							<PanelColorSettings
								title={__('Border Color', 'ria-card')}
								colorSettings={[
									{
										value: customBorderColor,
										onChange: (value) => setAttributes({ customBorderColor: value }),
										label: __('Border', 'ria-card'),
									}
								]}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Image Settings', 'ria-card')} initialOpen={false}>
					<ToggleControl
						label={__('Show Image', 'ria-card')}
						checked={showImage}
						onChange={(value) => setAttributes({ showImage: value })}
					/>

					{showImage && (
						<>
							<SelectControl
								label={__('Aspect Ratio', 'ria-card')}
								value={imageAspectRatio}
								options={[
									{ label: __('None', 'ria-card'), value: 'none' },
									{ label: __('Square (1:1)', 'ria-card'), value: '1/1' },
									{ label: __('Landscape (4:3)', 'ria-card'), value: '4/3' },
									{ label: __('Widescreen (16:9)', 'ria-card'), value: '16/9' },
									{ label: __('Portrait (3:4)', 'ria-card'), value: '3/4' },
								]}
								onChange={(value) => setAttributes({ imageAspectRatio: value })}
							/>

							<SelectControl
								label={__('Object Fit', 'ria-card')}
								value={imageObjectFit}
								options={[
									{ label: __('Cover', 'ria-card'), value: 'cover' },
									{ label: __('Contain', 'ria-card'), value: 'contain' },
									{ label: __('Fill', 'ria-card'), value: 'fill' },
								]}
								onChange={(value) => setAttributes({ imageObjectFit: value })}
							/>

							<RangeControl
								label={__('Overlay Opacity', 'ria-card')}
								value={imageOverlayOpacity}
								onChange={(value) => setAttributes({ imageOverlayOpacity: value })}
								min={0}
								max={100}
								step={5}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Heading Settings', 'ria-card')} initialOpen={false}>
					<SelectControl
						label={__('Heading Level', 'ria-card')}
						value={headingLevel}
						options={[
							{ label: __('H2', 'ria-card'), value: 2 },
							{ label: __('H3', 'ria-card'), value: 3 },
							{ label: __('H4', 'ria-card'), value: 4 },
							{ label: __('H5', 'ria-card'), value: 5 },
							{ label: __('H6', 'ria-card'), value: 6 },
						]}
						onChange={(value) => setAttributes({ headingLevel: parseInt(value) })}
					/>
				</PanelBody>

				<PanelBody title={__('Button Settings', 'ria-card')} initialOpen={false}>
					<ToggleControl
						label={__('Show Button', 'ria-card')}
						checked={showButton}
						onChange={(value) => setAttributes({ showButton: value })}
					/>

					{showButton && (
						<>
							<SelectControl
								label={__('Button Style', 'ria-card')}
								value={buttonStyle}
								options={[
									{ label: __('Primary', 'ria-card'), value: 'primary' },
									{ label: __('Secondary', 'ria-card'), value: 'secondary' },
									{ label: __('Outline', 'ria-card'), value: 'outline' },
									{ label: __('Text', 'ria-card'), value: 'text' },
								]}
								onChange={(value) => setAttributes({ buttonStyle: value })}
							/>

							<TextControl
								label={__('Button URL', 'ria-card')}
								value={buttonUrl}
								onChange={(value) => setAttributes({ buttonUrl: value })}
								type="url"
								placeholder="https://"
							/>

							<ToggleControl
								label={__('Open in New Tab', 'ria-card')}
								checked={buttonTarget === '_blank'}
								onChange={(value) => setAttributes({ buttonTarget: value ? '_blank' : '_self' })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Card Styling', 'ria-card')} initialOpen={false}>
					<RangeControl
						label={__('Border Radius', 'ria-card')}
						value={borderRadius}
						onChange={(value) => setAttributes({ borderRadius: value })}
						min={0}
						max={50}
						step={1}
					/>

					<RangeControl
						label={__('Border Width', 'ria-card')}
						value={borderWidth}
						onChange={(value) => setAttributes({ borderWidth: value })}
						min={0}
						max={10}
						step={1}
					/>

					<SelectControl
						label={__('Border Style', 'ria-card')}
						value={borderStyle}
						options={[
							{ label: __('Solid', 'ria-card'), value: 'solid' },
							{ label: __('Dashed', 'ria-card'), value: 'dashed' },
							{ label: __('Dotted', 'ria-card'), value: 'dotted' },
						]}
						onChange={(value) => setAttributes({ borderStyle: value })}
					/>

					<SelectControl
						label={__('Box Shadow', 'ria-card')}
						value={boxShadow}
						options={[
							{ label: __('None', 'ria-card'), value: 'none' },
							{ label: __('Small', 'ria-card'), value: 'small' },
							{ label: __('Medium', 'ria-card'), value: 'medium' },
							{ label: __('Large', 'ria-card'), value: 'large' },
							{ label: __('Extra Large', 'ria-card'), value: 'xlarge' },
						]}
						onChange={(value) => setAttributes({ boxShadow: value })}
					/>

					<ToggleControl
						label={__('Hover Elevation', 'ria-card')}
						checked={hoverElevation}
						onChange={(value) => setAttributes({ hoverElevation: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Spacing', 'ria-card')} initialOpen={false}>
					<RangeControl
						label={__('Padding Top', 'ria-card')}
						value={paddingTop}
						onChange={(value) => setAttributes({ paddingTop: value })}
						min={0}
						max={80}
						step={4}
					/>

					<RangeControl
						label={__('Padding Right', 'ria-card')}
						value={paddingRight}
						onChange={(value) => setAttributes({ paddingRight: value })}
						min={0}
						max={80}
						step={4}
					/>

					<RangeControl
						label={__('Padding Bottom', 'ria-card')}
						value={paddingBottom}
						onChange={(value) => setAttributes({ paddingBottom: value })}
						min={0}
						max={80}
						step={4}
					/>

					<RangeControl
						label={__('Padding Left', 'ria-card')}
						value={paddingLeft}
						onChange={(value) => setAttributes({ paddingLeft: value })}
						min={0}
						max={80}
						step={4}
					/>
				</PanelBody>

				<PanelColorSettings
					title={__('Colors', 'ria-card')}
					initialOpen={false}
					colorSettings={[
						{
							value: backgroundColor,
							onChange: (value) => setAttributes({ backgroundColor: value }),
							label: __('Background Color', 'ria-card'),
						},
						{
							value: borderColor,
							onChange: (value) => setAttributes({ borderColor: value }),
							label: __('Border Color', 'ria-card'),
						},
						{
							value: headingColor,
							onChange: (value) => setAttributes({ headingColor: value }),
							label: __('Heading Color', 'ria-card'),
						},
						{
							value: textColor,
							onChange: (value) => setAttributes({ textColor: value }),
							label: __('Text Color', 'ria-card'),
						},
						{
							value: imageOverlayColor,
							onChange: (value) => setAttributes({ imageOverlayColor: value }),
							label: __('Image Overlay Color', 'ria-card'),
						},
					]}
				/>

				<PanelBody title={__('Advanced', 'ria-card')} initialOpen={false}>
					<ToggleControl
						label={__('Make Entire Card Clickable', 'ria-card')}
						checked={makeEntireCardClickable}
						onChange={(value) => setAttributes({ makeEntireCardClickable: value })}
						help={__('When enabled, clicking anywhere on the card will trigger the button action', 'ria-card')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className={containerClassName} style={cardStyle}>
					{showImage && (
						<div className="ria-card-image-wrapper">
							<MediaUploadCheck>
								{!imageUrl ? (
									<MediaUpload
										onSelect={(media) => setAttributes({
											imageId: media.id,
											imageUrl: media.url,
											imageAlt: media.alt || '',
										})}
										allowedTypes={['image']}
										value={imageId}
										render={({ open }) => (
											<Button
												className="ria-card-image-placeholder"
												onClick={open}
												variant="secondary"
											>
												{__('Upload Image', 'ria-card')}
											</Button>
										)}
									/>
								) : (
									<>
										{imageLoading && (
											<SkeletonImage
												width="100%"
												aspectRatio={imageAspectRatio !== 'none' ? imageAspectRatio : '16/9'}
												borderRadius="8px"
											/>
										)}
										<img
											src={imageUrl}
											alt={imageAlt}
											style={{
												...imageStyle,
												display: imageLoading ? 'none' : 'block',
											}}
											className="ria-card-image"
											onLoad={() => setImageLoading(false)}
											onError={() => setImageLoading(false)}
										/>
										{imageOverlayColor && imageOverlayOpacity > 0 && !imageLoading && (
											<div
												className="ria-card-image-overlay"
												style={{
													backgroundColor: imageOverlayColor,
													opacity: imageOverlayOpacity / 100,
												}}
											></div>
										)}
										<div className="ria-card-image-controls">
											<MediaUpload
												onSelect={(media) => setAttributes({
													imageId: media.id,
													imageUrl: media.url,
													imageAlt: media.alt || '',
												})}
												allowedTypes={['image']}
												value={imageId}
												render={({ open }) => (
													<Button onClick={open} variant="secondary" size="small">
														{__('Replace', 'ria-card')}
													</Button>
												)}
											/>
											<Button
												onClick={() => setAttributes({ imageId: 0, imageUrl: '', imageAlt: '' })}
												variant="secondary"
												size="small"
												isDestructive
											>
												{__('Remove', 'ria-card')}
											</Button>
										</div>
									</>
								)}
							</MediaUploadCheck>
						</div>
					)}

					<div className="ria-card-content" style={contentStyle}>
						<RichText
							tagName={HeadingTag}
							className="ria-card-heading"
							value={headingText}
							onChange={(value) => setAttributes({ headingText: value })}
							placeholder={__('Card heading...', 'ria-card')}
							style={{ color: headingColor }}
						/>

						<RichText
							tagName="p"
							className="ria-card-text"
							value={bodyText}
							onChange={(value) => setAttributes({ bodyText: value })}
							placeholder={__('Card description...', 'ria-card')}
							style={{ color: textColor }}
						/>

						{showButton && (
							<div className="ria-card-button-wrapper">
								<RichText
									tagName="span"
									className={`ria-card-button button-style-${buttonStyle}`}
									value={buttonText}
									onChange={(value) => setAttributes({ buttonText: value })}
									placeholder={__('Button text...', 'ria-card')}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
