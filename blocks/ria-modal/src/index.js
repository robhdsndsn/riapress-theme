/**
 * RIA Modal/Popup Block
 *
 * WordPress Gutenberg block for creating modal popups with various trigger types
 * and content types. Fully accessible with keyboard navigation and ARIA labels.
 */

import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	InnerBlocks,
	RichText,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	TextControl,
	Button,
	ColorPicker,
	Placeholder,
	__experimentalBoxControl as BoxControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import './editor.scss';
import './style.scss';

/**
 * Block registration
 */
registerBlockType('ria/modal', {
	/**
	 * Edit component - Renders in WordPress editor
	 */
	edit: ({ attributes, setAttributes, clientId }) => {
		const {
			triggerType,
			triggerText,
			triggerButtonStyle,
			triggerButtonSize,
			triggerIcon,
			triggerIconPosition,
			triggerImageId,
			triggerImageUrl,
			modalSize,
			modalTitle,
			showModalTitle,
			modalContentType,
			videoUrl,
			imageId,
			imageUrl,
			formId,
			overlayColor,
			closeOnOverlayClick,
			closeOnEscape,
			showCloseButton,
			closeButtonStyle,
			modalBorderRadius,
			modalBoxShadow,
			triggerAlignment,
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
			customBackgroundColor,
			customTextColor,
			customBorderColor,
		} = attributes;

		const [showPreview, setShowPreview] = useState(false);

		const blockProps = useBlockProps({
			className: `ria-modal align-${triggerAlignment}`,
		});

		/**
		 * Render trigger element based on type
		 */
		const renderTrigger = () => {
			const triggerClasses = `modal-trigger trigger-${triggerType} style-${triggerButtonStyle} size-${triggerButtonSize} shadow-${boxShadow} hover-shadow-${hoverShadow}`;

			const triggerStyles = {
				borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
				borderStyle: borderWidth > 0 ? borderStyle : undefined,
				borderColor: borderWidth > 0 ? borderColor : undefined,
				borderRadius: `${borderRadius}px`,
			};

			// Apply custom colors if custom variant selected
			if (triggerButtonStyle === 'custom') {
				if (customBackgroundColor) triggerStyles.backgroundColor = customBackgroundColor;
				if (customTextColor) triggerStyles.color = customTextColor;
				if (customBorderColor) triggerStyles.borderColor = customBorderColor;
			}

			switch (triggerType) {
				case 'button':
					return (
						<button className={triggerClasses} style={triggerStyles}>
							{triggerIconPosition === 'left' && triggerIcon && (
								<span className="trigger-icon icon-left">{triggerIcon}</span>
							)}
							<RichText
								tagName="span"
								value={triggerText}
								onChange={(value) => setAttributes({ triggerText: value })}
								placeholder={__('Open Modal', 'ria-modal')}
								className="trigger-text"
								allowedFormats={[]}
							/>
							{triggerIconPosition === 'right' && triggerIcon && (
								<span className="trigger-icon icon-right">{triggerIcon}</span>
							)}
						</button>
					);

				case 'link':
					return (
						<a href="#" className={triggerClasses} style={triggerStyles}>
							{triggerIconPosition === 'left' && triggerIcon && (
								<span className="trigger-icon icon-left">{triggerIcon}</span>
							)}
							<RichText
								tagName="span"
								value={triggerText}
								onChange={(value) => setAttributes({ triggerText: value })}
								placeholder={__('Open Modal', 'ria-modal')}
								className="trigger-text"
								allowedFormats={[]}
							/>
							{triggerIconPosition === 'right' && triggerIcon && (
								<span className="trigger-icon icon-right">{triggerIcon}</span>
							)}
						</a>
					);

				case 'image':
					return (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => {
									setAttributes({
										triggerImageId: media.id,
										triggerImageUrl: media.url,
									});
								}}
								allowedTypes={['image']}
								value={triggerImageId}
								render={({ open }) => (
									<div className={triggerClasses} style={triggerStyles}>
										{triggerImageUrl ? (
											<img
												src={triggerImageUrl}
												alt={triggerText || __('Modal Trigger', 'ria-modal')}
												onClick={open}
											/>
										) : (
											<Button onClick={open} variant="secondary">
												{__('Select Trigger Image', 'ria-modal')}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>
					);

				case 'icon':
					return (
						<div className={triggerClasses} style={triggerStyles}>
							<span className="trigger-icon-large">
								{triggerIcon || '⚙️'}
							</span>
						</div>
					);

				default:
					return null;
			}
		};

		/**
		 * Render modal content preview
		 */
		const renderModalContent = () => {
			switch (modalContentType) {
				case 'custom':
					return (
						<div className="modal-custom-content">
							<InnerBlocks
								templateLock={false}
								placeholder={__('Add content for your modal...', 'ria-modal')}
							/>
						</div>
					);

				case 'video':
					return (
						<div className="modal-video-content">
							{videoUrl ? (
								<div className="video-embed-preview">
									<p>{__('Video:', 'ria-modal')} {videoUrl}</p>
									<p className="help-text">{__('Video will be embedded on the frontend', 'ria-modal')}</p>
								</div>
							) : (
								<Placeholder
									icon="video-alt3"
									label={__('Video URL', 'ria-modal')}
									instructions={__('Enter a YouTube or Vimeo URL in the sidebar', 'ria-modal')}
								/>
							)}
						</div>
					);

				case 'image':
					return (
						<div className="modal-image-content">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										setAttributes({
											imageId: media.id,
											imageUrl: media.url,
										});
									}}
									allowedTypes={['image']}
									value={imageId}
									render={({ open }) => (
										<div className="image-upload-area">
											{imageUrl ? (
												<img src={imageUrl} alt={modalTitle || __('Modal Image', 'ria-modal')} />
											) : (
												<Button onClick={open} variant="secondary">
													{__('Select Modal Image', 'ria-modal')}
												</Button>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>
						</div>
					);

				case 'form':
					return (
						<div className="modal-form-content">
							<Placeholder
								icon="feedback"
								label={__('Form ID', 'ria-modal')}
								instructions={__('Enter a form ID in the sidebar. Form will render on frontend.', 'ria-modal')}
							>
								{formId > 0 && <p>{__('Form ID:', 'ria-modal')} {formId}</p>}
							</Placeholder>
						</div>
					);

				default:
					return null;
			}
		};

		return (
			<>
				<InspectorControls>
					{/* Trigger Settings */}
					<PanelBody title={__('Trigger Settings', 'ria-modal')} initialOpen={true}>
						<SelectControl
							label={__('Trigger Type', 'ria-modal')}
							value={triggerType}
							options={[
								{ label: __('Button', 'ria-modal'), value: 'button' },
								{ label: __('Link', 'ria-modal'), value: 'link' },
								{ label: __('Image', 'ria-modal'), value: 'image' },
								{ label: __('Icon', 'ria-modal'), value: 'icon' },
							]}
							onChange={(value) => setAttributes({ triggerType: value })}
						/>

						{(triggerType === 'button' || triggerType === 'link') && (
							<>
								<SelectControl
									label={__('Button Style', 'ria-modal')}
									value={triggerButtonStyle}
									options={[
										{ label: __('Primary', 'ria-modal'), value: 'primary' },
										{ label: __('Secondary', 'ria-modal'), value: 'secondary' },
										{ label: __('Tertiary', 'ria-modal'), value: 'tertiary' },
										{ label: __('Outline Primary', 'ria-modal'), value: 'outline-primary' },
										{ label: __('Outline Secondary', 'ria-modal'), value: 'outline-secondary' },
										{ label: __('Outline Tertiary', 'ria-modal'), value: 'outline-tertiary' },
										{ label: __('Ghost', 'ria-modal'), value: 'ghost' },
										{ label: __('Link', 'ria-modal'), value: 'link' },
										{ label: __('Custom', 'ria-modal'), value: 'custom' },
									]}
									onChange={(value) => setAttributes({ triggerButtonStyle: value })}
								/>

								<SelectControl
									label={__('Button Size', 'ria-modal')}
									value={triggerButtonSize}
									options={[
										{ label: __('Small', 'ria-modal'), value: 'small' },
										{ label: __('Medium', 'ria-modal'), value: 'medium' },
										{ label: __('Large', 'ria-modal'), value: 'large' },
									]}
									onChange={(value) => setAttributes({ triggerButtonSize: value })}
								/>

								<TextControl
									label={__('Icon (emoji or text)', 'ria-modal')}
									value={triggerIcon}
									onChange={(value) => setAttributes({ triggerIcon: value })}
									help={__('Add an icon before or after the text', 'ria-modal')}
								/>

								{triggerIcon && (
									<SelectControl
										label={__('Icon Position', 'ria-modal')}
										value={triggerIconPosition}
										options={[
											{ label: __('Left', 'ria-modal'), value: 'left' },
											{ label: __('Right', 'ria-modal'), value: 'right' },
											{ label: __('None', 'ria-modal'), value: 'none' },
										]}
										onChange={(value) => setAttributes({ triggerIconPosition: value })}
									/>
								)}
							</>
						)}

						{triggerType === 'icon' && (
							<TextControl
								label={__('Icon (emoji or text)', 'ria-modal')}
								value={triggerIcon}
								onChange={(value) => setAttributes({ triggerIcon: value })}
								help={__('Enter an emoji or icon character', 'ria-modal')}
							/>
						)}

						<SelectControl
							label={__('Trigger Alignment', 'ria-modal')}
							value={triggerAlignment}
							options={[
								{ label: __('Left', 'ria-modal'), value: 'left' },
								{ label: __('Center', 'ria-modal'), value: 'center' },
								{ label: __('Right', 'ria-modal'), value: 'right' },
							]}
							onChange={(value) => setAttributes({ triggerAlignment: value })}
						/>
					</PanelBody>

					{/* Custom Colors for Custom Variant */}
					{(triggerType === 'button' || triggerType === 'link') && triggerButtonStyle === 'custom' && (
						<PanelColorSettings
							title={__('Custom Colors', 'ria-modal')}
							colorSettings={[
								{
									value: customBackgroundColor,
									onChange: (value) => setAttributes({ customBackgroundColor: value }),
									label: __('Background Color', 'ria-modal'),
								},
								{
									value: customTextColor,
									onChange: (value) => setAttributes({ customTextColor: value }),
									label: __('Text Color', 'ria-modal'),
								},
								{
									value: customBorderColor,
									onChange: (value) => setAttributes({ customBorderColor: value }),
									label: __('Border Color', 'ria-modal'),
								},
							]}
						/>
					)}

					{/* Modal Settings */}
					<PanelBody title={__('Modal Settings', 'ria-modal')}>
						<SelectControl
							label={__('Modal Color Variant', 'ria-modal')}
							value={attributes.variant || 'default'}
							options={[
								{ label: __('Default', 'ria-modal'), value: 'default' },
								{ label: __('Primary', 'ria-modal'), value: 'primary' },
								{ label: __('Secondary', 'ria-modal'), value: 'secondary' },
								{ label: __('Accent', 'ria-modal'), value: 'accent' },
								{ label: __('Neutral', 'ria-modal'), value: 'neutral' },
								{ label: __('Custom', 'ria-modal'), value: 'custom' }
							]}
							onChange={(value) => setAttributes({ variant: value })}
							help={__('Select a predefined color scheme for the modal or use custom colors', 'ria-modal')}
						/>

						<TextControl
							label={__('Modal Title', 'ria-modal')}
							value={modalTitle}
							onChange={(value) => setAttributes({ modalTitle: value })}
						/>

						<ToggleControl
							label={__('Show Modal Title', 'ria-modal')}
							checked={showModalTitle}
							onChange={(value) => setAttributes({ showModalTitle: value })}
						/>

						<SelectControl
							label={__('Modal Size', 'ria-modal')}
							value={modalSize}
							options={[
								{ label: __('Small', 'ria-modal'), value: 'small' },
								{ label: __('Medium', 'ria-modal'), value: 'medium' },
								{ label: __('Large', 'ria-modal'), value: 'large' },
								{ label: __('Extra Large', 'ria-modal'), value: 'xlarge' },
								{ label: __('Full Screen', 'ria-modal'), value: 'full' },
							]}
							onChange={(value) => setAttributes({ modalSize: value })}
						/>

						<SelectControl
							label={__('Content Type', 'ria-modal')}
							value={modalContentType}
							options={[
								{ label: __('Custom Content', 'ria-modal'), value: 'custom' },
								{ label: __('Video Embed', 'ria-modal'), value: 'video' },
								{ label: __('Image', 'ria-modal'), value: 'image' },
								{ label: __('Form', 'ria-modal'), value: 'form' },
							]}
							onChange={(value) => setAttributes({ modalContentType: value })}
						/>

						{modalContentType === 'video' && (
							<TextControl
								label={__('Video URL', 'ria-modal')}
								value={videoUrl}
								onChange={(value) => setAttributes({ videoUrl: value })}
								help={__('YouTube or Vimeo URL', 'ria-modal')}
							/>
						)}

						{modalContentType === 'form' && (
							<TextControl
								label={__('Form ID', 'ria-modal')}
								type="number"
								value={formId}
								onChange={(value) => setAttributes({ formId: parseInt(value) || 0 })}
								help={__('Enter the ID of the form to display', 'ria-modal')}
							/>
						)}

						<RangeControl
							label={__('Border Radius (px)', 'ria-modal')}
							value={modalBorderRadius}
							onChange={(value) => setAttributes({ modalBorderRadius: value })}
							min={0}
							max={50}
						/>

						<SelectControl
							label={__('Box Shadow', 'ria-modal')}
							value={modalBoxShadow}
							options={[
								{ label: __('None', 'ria-modal'), value: 'none' },
								{ label: __('Small', 'ria-modal'), value: 'small' },
								{ label: __('Medium', 'ria-modal'), value: 'medium' },
								{ label: __('Large', 'ria-modal'), value: 'large' },
								{ label: __('Extra Large', 'ria-modal'), value: 'xlarge' },
								{ label: __('2X Large', 'ria-modal'), value: '2xlarge' },
							]}
							onChange={(value) => setAttributes({ modalBoxShadow: value })}
						/>
					</PanelBody>

					{/* Modal Custom Colors */}
					{(attributes.variant === 'custom') && (
						<PanelColorSettings
							title={__('Modal Custom Colors', 'ria-modal')}
							colorSettings={[
								{
									value: attributes.customModalColor,
									onChange: (value) => setAttributes({ customModalColor: value }),
									label: __('Modal Text Color', 'ria-modal'),
								},
								{
									value: attributes.customModalBackgroundColor,
									onChange: (value) => setAttributes({ customModalBackgroundColor: value }),
									label: __('Modal Background Color', 'ria-modal'),
								},
								{
									value: attributes.customModalBorderColor,
									onChange: (value) => setAttributes({ customModalBorderColor: value }),
									label: __('Modal Border Color', 'ria-modal'),
								},
							]}
						/>
					)}

					{/* Close Options */}
					<PanelBody title={__('Close Options', 'ria-modal')}>
						<p className="components-base-control__label">
							{__('Overlay Color', 'ria-modal')}
						</p>
						<ColorPicker
							color={overlayColor}
							onChangeComplete={(value) => {
								const { rgb } = value;
								setAttributes({
									overlayColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
								});
							}}
							enableAlpha
						/>

						<ToggleControl
							label={__('Close on Overlay Click', 'ria-modal')}
							checked={closeOnOverlayClick}
							onChange={(value) => setAttributes({ closeOnOverlayClick: value })}
						/>

						<ToggleControl
							label={__('Close on Escape Key', 'ria-modal')}
							checked={closeOnEscape}
							onChange={(value) => setAttributes({ closeOnEscape: value })}
						/>

						<ToggleControl
							label={__('Show Close Button', 'ria-modal')}
							checked={showCloseButton}
							onChange={(value) => setAttributes({ showCloseButton: value })}
						/>

						{showCloseButton && (
							<SelectControl
								label={__('Close Button Style', 'ria-modal')}
								value={closeButtonStyle}
								options={[
									{ label: __('Default', 'ria-modal'), value: 'default' },
									{ label: __('Minimal', 'ria-modal'), value: 'minimal' },
									{ label: __('Circle', 'ria-modal'), value: 'circle' },
								]}
								onChange={(value) => setAttributes({ closeButtonStyle: value })}
							/>
						)}
					</PanelBody>

					{/* Border & Shadow */}
					<PanelBody title={__('Trigger Border & Shadow', 'ria-modal')}>
						<RangeControl
							label={__('Border Width', 'ria-modal')}
							value={borderWidth}
							onChange={(value) => setAttributes({ borderWidth: value })}
							min={0}
							max={10}
						/>

						{borderWidth > 0 && (
							<>
								<SelectControl
									label={__('Border Style', 'ria-modal')}
									value={borderStyle}
									options={[
										{ label: __('Solid', 'ria-modal'), value: 'solid' },
										{ label: __('Dashed', 'ria-modal'), value: 'dashed' },
										{ label: __('Dotted', 'ria-modal'), value: 'dotted' },
									]}
									onChange={(value) => setAttributes({ borderStyle: value })}
								/>

								<p className="components-base-control__label">
									{__('Border Color', 'ria-modal')}
								</p>
								<ColorPicker
									color={borderColor}
									onChangeComplete={(value) => setAttributes({ borderColor: value.hex })}
								/>
							</>
						)}

						<RangeControl
							label={__('Border Radius', 'ria-modal')}
							value={borderRadius}
							onChange={(value) => setAttributes({ borderRadius: value })}
							min={0}
							max={50}
						/>

						<SelectControl
							label={__('Box Shadow', 'ria-modal')}
							value={boxShadow}
							options={[
								{ label: __('None', 'ria-modal'), value: 'none' },
								{ label: __('Small', 'ria-modal'), value: 'small' },
								{ label: __('Medium', 'ria-modal'), value: 'medium' },
								{ label: __('Large', 'ria-modal'), value: 'large' },
							]}
							onChange={(value) => setAttributes({ boxShadow: value })}
						/>

						<SelectControl
							label={__('Hover Shadow', 'ria-modal')}
							value={hoverShadow}
							options={[
								{ label: __('None', 'ria-modal'), value: 'none' },
								{ label: __('Small', 'ria-modal'), value: 'small' },
								{ label: __('Medium', 'ria-modal'), value: 'medium' },
								{ label: __('Large', 'ria-modal'), value: 'large' },
							]}
							onChange={(value) => setAttributes({ hoverShadow: value })}
						/>
					</PanelBody>

					{/* Animation Settings */}
					<PanelBody title={__('Animation Settings', 'ria-modal')}>
						<ToggleControl
							label={__('Enable Animation', 'ria-modal')}
							checked={animationEnabled}
							onChange={(value) => setAttributes({ animationEnabled: value })}
						/>

						{animationEnabled && (
							<>
								<SelectControl
									label={__('Animation Type', 'ria-modal')}
									value={animationType}
									options={[
										{ label: __('Fade In', 'ria-modal'), value: 'fadeIn' },
										{ label: __('Fade In Up', 'ria-modal'), value: 'fadeInUp' },
										{ label: __('Fade In Down', 'ria-modal'), value: 'fadeInDown' },
										{ label: __('Slide In Up', 'ria-modal'), value: 'slideInUp' },
										{ label: __('Zoom In', 'ria-modal'), value: 'zoomIn' },
									]}
									onChange={(value) => setAttributes({ animationType: value })}
								/>

								<RangeControl
									label={__('Duration (seconds)', 'ria-modal')}
									value={animationDuration}
									onChange={(value) => setAttributes({ animationDuration: value })}
									min={0.1}
									max={3}
									step={0.1}
								/>

								<RangeControl
									label={__('Delay (seconds)', 'ria-modal')}
									value={animationDelay}
									onChange={(value) => setAttributes({ animationDelay: value })}
									min={0}
									max={2}
									step={0.1}
								/>

								<SelectControl
									label={__('Easing', 'ria-modal')}
									value={animationEasing}
									options={[
										{ label: __('Linear', 'ria-modal'), value: 'linear' },
										{ label: __('Ease', 'ria-modal'), value: 'ease' },
										{ label: __('Ease In', 'ria-modal'), value: 'ease-in' },
										{ label: __('Ease Out', 'ria-modal'), value: 'ease-out' },
										{ label: __('Ease In Out', 'ria-modal'), value: 'ease-in-out' },
									]}
									onChange={(value) => setAttributes({ animationEasing: value })}
								/>
							</>
						)}

						<SelectControl
							label={__('Hover Animation', 'ria-modal')}
							value={hoverAnimation}
							options={[
								{ label: __('None', 'ria-modal'), value: 'none' },
								{ label: __('Lift', 'ria-modal'), value: 'lift' },
								{ label: __('Grow', 'ria-modal'), value: 'grow' },
								{ label: __('Pulse', 'ria-modal'), value: 'pulse' },
							]}
							onChange={(value) => setAttributes({ hoverAnimation: value })}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="modal-trigger-wrapper">
						{renderTrigger()}
					</div>

					<div className="modal-preview-container">
						<div className="preview-header">
							<h4>{__('Modal Preview', 'ria-modal')}</h4>
							<Button
								variant="secondary"
								size="small"
								onClick={() => setShowPreview(!showPreview)}
							>
								{showPreview ? __('Hide', 'ria-modal') : __('Show', 'ria-modal')}
							</Button>
						</div>

						{showPreview && (
							<div
								className={`modal-preview size-${modalSize} ${attributes.variant && attributes.variant !== 'custom' ? `has-${attributes.variant}-variant` : ''} ${attributes.variant === 'custom' ? 'has-custom-colors' : ''}`}
								style={attributes.variant === 'custom' ? {
									color: attributes.customModalColor,
									backgroundColor: attributes.customModalBackgroundColor,
									borderColor: attributes.customModalBorderColor
								} : {}}
							>
								{showModalTitle && modalTitle && (
									<h3 className="modal-title">{modalTitle}</h3>
								)}
								{renderModalContent()}
							</div>
						)}
					</div>
				</div>
			</>
		);
	},

	/**
	 * Save component - Renders on frontend
	 */
	save: ({ attributes }) => {
		const {
			triggerType,
			triggerText,
			triggerButtonStyle,
			triggerButtonSize,
			triggerIcon,
			triggerIconPosition,
			triggerImageId,
			triggerImageUrl,
			modalSize,
			modalTitle,
			showModalTitle,
			modalContentType,
			videoUrl,
			imageUrl,
			formId,
			overlayColor,
			closeOnOverlayClick,
			closeOnEscape,
			showCloseButton,
			closeButtonStyle,
			modalBorderRadius,
			modalBoxShadow,
			triggerAlignment,
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
			customBackgroundColor,
			customTextColor,
			customBorderColor,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `ria-modal align-${triggerAlignment}`,
			'data-modal-config': JSON.stringify({
				closeOnOverlayClick,
				closeOnEscape,
				animationEnabled,
				animationType,
				animationDuration,
				animationEasing,
			}),
		});

		const triggerClasses = `modal-trigger trigger-${triggerType} style-${triggerButtonStyle} size-${triggerButtonSize} shadow-${boxShadow} hover-shadow-${hoverShadow} hover-${hoverAnimation}`;

		const triggerStyles = {
			borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
			borderStyle: borderWidth > 0 ? borderStyle : undefined,
			borderColor: borderWidth > 0 ? borderColor : undefined,
			borderRadius: `${borderRadius}px`,
		};

		// Apply custom colors if custom variant selected
		if (triggerButtonStyle === 'custom') {
			if (customBackgroundColor) triggerStyles.backgroundColor = customBackgroundColor;
			if (customTextColor) triggerStyles.color = customTextColor;
			if (customBorderColor) triggerStyles.borderColor = customBorderColor;
		}

		const modalStyles = {
			borderRadius: `${modalBorderRadius}px`,
		};

		/**
		 * Render trigger element
		 */
		const renderTrigger = () => {
			switch (triggerType) {
				case 'button':
					return (
						<button className={triggerClasses} style={triggerStyles} aria-haspopup="dialog">
							{triggerIconPosition === 'left' && triggerIcon && (
								<span className="trigger-icon icon-left" aria-hidden="true">{triggerIcon}</span>
							)}
							<RichText.Content
								tagName="span"
								value={triggerText}
								className="trigger-text"
							/>
							{triggerIconPosition === 'right' && triggerIcon && (
								<span className="trigger-icon icon-right" aria-hidden="true">{triggerIcon}</span>
							)}
						</button>
					);

				case 'link':
					return (
						<a href="#" className={triggerClasses} style={triggerStyles} role="button" aria-haspopup="dialog">
							{triggerIconPosition === 'left' && triggerIcon && (
								<span className="trigger-icon icon-left" aria-hidden="true">{triggerIcon}</span>
							)}
							<RichText.Content
								tagName="span"
								value={triggerText}
								className="trigger-text"
							/>
							{triggerIconPosition === 'right' && triggerIcon && (
								<span className="trigger-icon icon-right" aria-hidden="true">{triggerIcon}</span>
							)}
						</a>
					);

				case 'image':
					return triggerImageUrl ? (
						<button className={triggerClasses} style={triggerStyles} aria-haspopup="dialog">
							<img
								src={triggerImageUrl}
								alt={triggerText || 'Open Modal'}
							/>
						</button>
					) : null;

				case 'icon':
					return (
						<button className={triggerClasses} style={triggerStyles} aria-haspopup="dialog" aria-label={triggerText || 'Open Modal'}>
							<span className="trigger-icon-large" aria-hidden="true">
								{triggerIcon || '⚙️'}
							</span>
						</button>
					);

				default:
					return null;
			}
		};

		/**
		 * Render modal content
		 */
		const renderModalContent = () => {
			switch (modalContentType) {
				case 'custom':
					return (
						<div className="modal-custom-content">
							<InnerBlocks.Content />
						</div>
					);

				case 'video':
					return videoUrl ? (
						<div className="modal-video-content" data-video-url={videoUrl}>
							{/* Video will be embedded by view.js */}
						</div>
					) : null;

				case 'image':
					return imageUrl ? (
						<div className="modal-image-content">
							<img src={imageUrl} alt={modalTitle || 'Modal Image'} />
						</div>
					) : null;

				case 'form':
					return formId > 0 ? (
						<div className="modal-form-content" data-form-id={formId}>
							{/* Form will be rendered by view.js or shortcode */}
						</div>
					) : null;

				default:
					return null;
			}
		};

		return (
			<div {...blockProps}>
				<div className="modal-trigger-wrapper">
					{renderTrigger()}
				</div>

				<div
					className="modal-overlay"
					style={{ backgroundColor: overlayColor }}
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
					aria-hidden="true"
				>
					<div
						className={`modal-content size-${modalSize} shadow-${modalBoxShadow} ${attributes.variant && attributes.variant !== 'custom' ? `has-${attributes.variant}-variant` : ''} ${attributes.variant === 'custom' ? 'has-custom-colors' : ''}`}
						style={{
							...modalStyles,
							...(attributes.variant === 'custom' ? {
								color: attributes.customModalColor,
								backgroundColor: attributes.customModalBackgroundColor,
								borderColor: attributes.customModalBorderColor
							} : {})
						}}
						role="document"
					>
						{showCloseButton && (
							<button
								className={`modal-close close-style-${closeButtonStyle}`}
								aria-label="Close modal"
							>
								<span aria-hidden="true">&times;</span>
							</button>
						)}

						{showModalTitle && modalTitle && (
							<h2 id="modal-title" className="modal-title">
								{modalTitle}
							</h2>
						)}

						<div className="modal-body">
							{renderModalContent()}
						</div>
					</div>
				</div>
			</div>
		);
	},
});
