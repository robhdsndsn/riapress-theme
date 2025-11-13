import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	RangeControl,
	Button,
	ColorPicker,
	Placeholder,
} from '@wordpress/components';
import * as Icons from '../../../shared/icons';
export default function Edit({ attributes, setAttributes }) {
	const {
		variant,
		customBackgroundColor,
		customBorderColor,
		imageId,
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

	const blockProps = useBlockProps({
		className: `image-box overlay-${overlayPosition} hover-${hoverAnimation}`,
	});

	const onSelectImage = (media) => {
		setAttributes({
			imageId: media.id,
			imageUrl: media.url,
			imageAlt: media.alt,
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Color Scheme', 'image-box')} initialOpen={false}>
					<SelectControl
						label={__('Variant', 'image-box')}
						value={variant}
						options={[
							{ label: __('Primary', 'image-box'), value: 'primary' },
							{ label: __('Secondary', 'image-box'), value: 'secondary' },
							{ label: __('Accent', 'image-box'), value: 'accent' },
							{ label: __('Neutral (Default)', 'image-box'), value: 'neutral' },
							{ label: __('Custom', 'image-box'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ variant: value })}
						help={__('Choose a color scheme or use custom colors', 'image-box')}
					/>
					{variant === 'custom' && (
						<>
							<p><strong>{__('Custom Colors', 'image-box')}</strong></p>
							<PanelColorSettings
								title={__('Background Color', 'image-box')}
								colorSettings={[
									{
										value: customBackgroundColor,
										onChange: (value) => setAttributes({ customBackgroundColor: value }),
										label: __('Background', 'image-box'),
									}
								]}
							/>
							<PanelColorSettings
								title={__('Border Color', 'image-box')}
								colorSettings={[
									{
										value: customBorderColor,
										onChange: (value) => setAttributes({ customBorderColor: value }),
										label: __('Border', 'image-box'),
									}
								]}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Image Settings', 'ria-image-box')} initialOpen={true}>
					<RangeControl
						label={__('Image Height', 'ria-image-box')}
						value={imageHeight}
						onChange={(value) => setAttributes({ imageHeight: value })}
						min={200}
						max={800}
					/>
					<SelectControl
						label={__('Image Fit', 'ria-image-box')}
						value={imageObjectFit}
						options={[
							{ label: 'Cover', value: 'cover' },
							{ label: 'Contain', value: 'contain' },
							{ label: 'Fill', value: 'fill' },
						]}
						onChange={(value) => setAttributes({ imageObjectFit: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Overlay Settings', 'ria-image-box')}>
					<SelectControl
						label={__('Overlay Position', 'ria-image-box')}
						value={overlayPosition}
						options={[
							{ label: 'Bottom Left', value: 'bottom-left' },
							{ label: 'Bottom Right', value: 'bottom-right' },
							{ label: 'Top Left', value: 'top-left' },
							{ label: 'Top Right', value: 'top-right' },
							{ label: 'Center', value: 'center' },
							{ label: 'Full', value: 'full' },
						]}
						onChange={(value) => setAttributes({ overlayPosition: value })}
					/>
					<div style={{ marginBottom: '16px' }}>
						<label>{__('Overlay Color', 'ria-image-box')}</label>
						<ColorPicker
							color={overlayColor}
							onChangeComplete={(value) => setAttributes({ overlayColor: value.hex })}
						/>
					</div>
					<RangeControl
						label={__('Overlay Opacity (%)', 'ria-image-box')}
						value={overlayOpacity}
						onChange={(value) => setAttributes({ overlayOpacity: value })}
						min={0}
						max={100}
					/>
					<div style={{ marginBottom: '16px' }}>
						<label>{__('Text Color', 'ria-image-box')}</label>
						<ColorPicker
							color={textColor}
							onChangeComplete={(value) => setAttributes({ textColor: value.hex })}
						/>
					</div>
				</PanelBody>

				<PanelBody title={__('Link Settings', 'ria-image-box')}>
					<TextControl
						label={__('Link URL', 'ria-image-box')}
						value={linkUrl}
						onChange={(value) => setAttributes({ linkUrl: value })}
						placeholder="https://"
					/>
					<ToggleControl
						label={__('Open in New Tab', 'ria-image-box')}
						checked={linkTarget}
						onChange={(value) => setAttributes({ linkTarget: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Animation Settings', 'ria-image-box')}>
					<ToggleControl
						label={__('Enable Animation', 'ria-image-box')}
						checked={animationEnabled}
						onChange={(value) => setAttributes({ animationEnabled: value })}
					/>
					{animationEnabled && (
						<>
							<SelectControl
								label={__('Animation Type', 'ria-image-box')}
								value={animationType}
								options={[
									{ label: 'Fade In Up', value: 'fadeInUp' },
									{ label: 'Fade In', value: 'fadeIn' },
									{ label: 'Slide In Left', value: 'slideInLeft' },
									{ label: 'Slide In Right', value: 'slideInRight' },
									{ label: 'Zoom In', value: 'zoomIn' },
								]}
								onChange={(value) => setAttributes({ animationType: value })}
							/>
							<RangeControl
								label={__('Animation Duration (seconds)', 'ria-image-box')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={0.1}
								max={2}
								step={0.1}
							/>
							<RangeControl
								label={__('Animation Delay (seconds)', 'ria-image-box')}
								value={animationDelay}
								onChange={(value) => setAttributes({ animationDelay: value })}
								min={0}
								max={2}
								step={0.1}
							/>
							<SelectControl
								label={__('Animation Easing', 'ria-image-box')}
								value={animationEasing}
								options={[
									{ label: 'Ease Out', value: 'ease-out' },
									{ label: 'Ease In', value: 'ease-in' },
									{ label: 'Ease In Out', value: 'ease-in-out' },
									{ label: 'Linear', value: 'linear' },
								]}
								onChange={(value) => setAttributes({ animationEasing: value })}
							/>
						</>
					)}
					<SelectControl
						label={__('Hover Animation', 'ria-image-box')}
						value={hoverAnimation}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Zoom', value: 'zoom' },
							{ label: 'Lift', value: 'lift' },
							{ label: 'Glow', value: 'glow' },
						]}
						onChange={(value) => setAttributes({ hoverAnimation: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{!imageUrl ? (
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImage}
							allowedTypes={['image']}
							value={imageId}
							render={({ open }) => (
								<Placeholder
									icon={<Icons.Image />}
									label={__('Image Box', 'ria-image-box')}
									instructions={__('Select an image to get started', 'ria-image-box')}
								>
									<Button onClick={open} variant="primary">
										{__('Select Image', 'ria-image-box')}
									</Button>
								</Placeholder>
							)}
						/>
					</MediaUploadCheck>
				) : (
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
							<RichText
								tagName="h3"
								className="image-box-heading"
								value={heading}
								onChange={(value) => setAttributes({ heading: value })}
								placeholder={__('Add heading...', 'ria-image-box')}
							/>
							<RichText
								tagName="p"
								className="image-box-description"
								value={description}
								onChange={(value) => setAttributes({ description: value })}
								placeholder={__('Add description...', 'ria-image-box')}
							/>
						</div>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectImage}
								allowedTypes={['image']}
								value={imageId}
								render={({ open }) => (
									<Button
										onClick={open}
										variant="secondary"
										className="image-box-replace-button"
										style={{
											position: 'absolute',
											top: '10px',
											right: '10px',
											zIndex: 10,
										}}
									>
										{__('Replace Image', 'ria-image-box')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
					</div>
				)}
			</div>
		</>
	);
}
