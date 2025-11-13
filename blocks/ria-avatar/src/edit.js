import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, TextControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const {
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor,
		imageId,
		imageUrl,
		imageAlt,
		initials,
		name,
		size,
		shape,
		borderWidth,
		showBorder,
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

	// Generate initials from name if not set
	const displayInitials = initials || (name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?');

	const blockProps = useBlockProps({
		className: `ria-avatar size-${size} shape-${shape} ${variantClass} ${customColorClass}`.trim(),
		'data-animation': animationType,
		'data-duration': animationDuration,
		'data-delay': animationDelay,
		'data-easing': animationEasing,
		'data-animate-on-scroll': animateOnScroll,
		'data-stagger-delay': staggerDelay,
		style: {
			...customStyles,
			borderWidth: showBorder ? `${borderWidth}px` : '0',
		},
	});

	const onSelectImage = (media) => {
		setAttributes({
			imageId: media.id,
			imageUrl: media.url,
			imageAlt: media.alt || name || '',
		});
	};

	const onRemoveImage = () => {
		setAttributes({
			imageId: 0,
			imageUrl: '',
			imageAlt: '',
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Avatar Settings', 'riapress')} initialOpen={true}>
					<TextControl
						label={__('Name', 'riapress')}
						value={name}
						onChange={(value) => setAttributes({ name: value })}
						help={__('Used for alt text and auto-generating initials', 'riapress')}
					/>
					<TextControl
						label={__('Initials', 'riapress')}
						value={initials}
						onChange={(value) => setAttributes({ initials: value.toUpperCase().slice(0, 2) })}
						help={__('Leave empty to auto-generate from name', 'riapress')}
						maxLength={2}
					/>
				</PanelBody>

				<PanelBody title={__('Image Settings', 'riapress')} initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImage}
							allowedTypes={['image']}
							value={imageId}
							render={({ open }) => (
								<div className="ria-avatar-image-control">
									{imageUrl ? (
										<>
											<img src={imageUrl} alt={imageAlt} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
											<Button onClick={onRemoveImage} isDestructive>
												{__('Remove Image', 'riapress')}
											</Button>
										</>
									) : (
										<Button onClick={open} variant="primary">
											{__('Upload Image', 'riapress')}
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody title={__('Appearance', 'riapress')} initialOpen={true}>
					<SelectControl
						label={__('Size', 'riapress')}
						value={size}
						options={[
							{ label: __('Small', 'riapress'), value: 'small' },
							{ label: __('Medium', 'riapress'), value: 'medium' },
							{ label: __('Large', 'riapress'), value: 'large' },
							{ label: __('X-Large', 'riapress'), value: 'xlarge' },
						]}
						onChange={(value) => setAttributes({ size: value })}
					/>
					<SelectControl
						label={__('Shape', 'riapress')}
						value={shape}
						options={[
							{ label: __('Circle', 'riapress'), value: 'circle' },
							{ label: __('Square', 'riapress'), value: 'square' },
							{ label: __('Rounded Square', 'riapress'), value: 'rounded' },
						]}
						onChange={(value) => setAttributes({ shape: value })}
					/>
					<ToggleControl
						label={__('Show Border', 'riapress')}
						checked={showBorder}
						onChange={(value) => setAttributes({ showBorder: value })}
					/>
					{showBorder && (
						<RangeControl
							label={__('Border Width', 'riapress')}
							value={borderWidth}
							onChange={(value) => setAttributes({ borderWidth: value })}
							min={1}
							max={8}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Color Settings', 'riapress')} initialOpen={false}>
					<SelectControl
						label={__('Color Variant', 'riapress')}
						value={variant || 'neutral'}
						options={[
							{ label: __('Neutral', 'riapress'), value: 'neutral' },
							{ label: __('Primary', 'riapress'), value: 'primary' },
							{ label: __('Secondary', 'riapress'), value: 'secondary' },
							{ label: __('Accent', 'riapress'), value: 'accent' },
							{ label: __('Custom', 'riapress'), value: 'custom' },
						]}
						onChange={(value) => setAttributes({ variant: value })}
						help={__('Select a predefined color scheme or use custom colors', 'riapress')}
					/>
				</PanelBody>

				{variant === 'custom' && (
					<PanelColorSettings
						title={__('Custom Colors', 'riapress')}
						colorSettings={[
							{
								value: customColor,
								onChange: (value) => setAttributes({ customColor: value }),
								label: __('Text Color', 'riapress'),
							},
							{
								value: customBackgroundColor,
								onChange: (value) => setAttributes({ customBackgroundColor: value }),
								label: __('Background Color', 'riapress'),
							},
							{
								value: customBorderColor,
								onChange: (value) => setAttributes({ customBorderColor: value }),
								label: __('Border Color', 'riapress'),
							},
						]}
					/>
				)}

				<PanelBody title={__('Animation Settings', 'riapress')} initialOpen={false}>
					<SelectControl
						label={__('Animation Type', 'riapress')}
						value={animationType}
						options={[
							{ label: __('None', 'riapress'), value: 'none' },
							{ label: __('Fade In', 'riapress'), value: 'fadeIn' },
							{ label: __('Slide Up', 'riapress'), value: 'slideUp' },
							{ label: __('Slide Down', 'riapress'), value: 'slideDown' },
							{ label: __('Slide Left', 'riapress'), value: 'slideLeft' },
							{ label: __('Slide Right', 'riapress'), value: 'slideRight' },
							{ label: __('Scale Up', 'riapress'), value: 'scaleUp' },
							{ label: __('Zoom In', 'riapress'), value: 'zoomIn' },
						]}
						onChange={(value) => setAttributes({ animationType: value })}
					/>
					{animationType !== 'none' && (
						<>
							<RangeControl
								label={__('Animation Duration (seconds)', 'riapress')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={0.1}
								max={3}
								step={0.1}
							/>
							<RangeControl
								label={__('Animation Delay (seconds)', 'riapress')}
								value={animationDelay}
								onChange={(value) => setAttributes({ animationDelay: value })}
								min={0}
								max={2}
								step={0.1}
							/>
							<SelectControl
								label={__('Animation Easing', 'riapress')}
								value={animationEasing}
								options={[
									{ label: __('Ease Out', 'riapress'), value: 'ease-out' },
									{ label: __('Ease In', 'riapress'), value: 'ease-in' },
									{ label: __('Ease In Out', 'riapress'), value: 'ease-in-out' },
									{ label: __('Linear', 'riapress'), value: 'linear' },
								]}
								onChange={(value) => setAttributes({ animationEasing: value })}
							/>
							<ToggleControl
								label={__('Animate on Scroll', 'riapress')}
								checked={animateOnScroll}
								onChange={(value) => setAttributes({ animateOnScroll: value })}
								help={__('Trigger animation when block enters viewport', 'riapress')}
							/>
							<RangeControl
								label={__('Stagger Delay (seconds)', 'riapress')}
								value={staggerDelay}
								onChange={(value) => setAttributes({ staggerDelay: value })}
								min={0}
								max={1}
								step={0.05}
								help={__('Delay between multiple avatars', 'riapress')}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{imageUrl ? (
					<img src={imageUrl} alt={imageAlt || name} className="ria-avatar-image" />
				) : (
					<div className="ria-avatar-initials">{displayInitials}</div>
				)}
			</div>
		</>
	);
}
