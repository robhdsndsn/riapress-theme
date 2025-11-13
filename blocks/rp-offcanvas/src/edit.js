import { useState, useEffect } from '@wordpress/element';
import { BlockControls, InnerBlocks, useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { ToolbarButton, Modal, Button, PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const {
		variant = 'default',
		customColor,
		customBackgroundColor,
		customBorderColor,
	} = attributes;

	const [isModalOpen, setIsModalOpen] = useState(false);

	// Function to open the modal
	const openModal = () => {
		document.body.classList.add('custom-modal-open');
		setIsModalOpen(true);
	};

	// Function to close the modal
	const closeModal = () => {
		document.body.classList.remove('custom-modal-open');
		setIsModalOpen(false);
	};

	// Clean up class when component unmounts
	useEffect(() => {
		return () => {
			document.body.classList.remove('custom-modal-open');
		};
	}, []);

	// Inline SVG for hamburger icon
	const HamburgerIcon = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
			fill="currentColor"
			aria-hidden="true"
		>
			<rect x="4" y="6" width="16" height="2" />
			<rect x="4" y="11" width="16" height="2" />
			<rect x="4" y="16" width="16" height="2" />
		</svg>
	);

	const classes = ['wp-block-rp-offcanvas'];
	if (variant !== 'default') {
		classes.push(`has-${variant}-variant`);
	}
	if (variant === 'custom' && (customColor || customBackgroundColor || customBorderColor)) {
		classes.push('has-custom-colors');
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Color Settings', 'riapress')} initialOpen={false}>
					<SelectControl
						label={__('Color Variant', 'riapress')}
						value={variant}
						options={[
							{ label: __('Default', 'riapress'), value: 'default' },
							{ label: __('Primary', 'riapress'), value: 'primary' },
							{ label: __('Secondary', 'riapress'), value: 'secondary' },
							{ label: __('Accent', 'riapress'), value: 'accent' },
							{ label: __('Neutral', 'riapress'), value: 'neutral' },
							{ label: __('Custom', 'riapress'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ variant: value })}
					/>
				</PanelBody>

				{variant === 'custom' && (
					<PanelColorSettings
						title={__('Custom Colors', 'riapress')}
						colorSettings={[
							{
								value: customColor,
								onChange: (value) => setAttributes({ customColor: value }),
								label: __('Text Color', 'riapress')
							},
							{
								value: customBackgroundColor,
								onChange: (value) => setAttributes({ customBackgroundColor: value }),
								label: __('Background Color', 'riapress')
							},
							{
								value: customBorderColor,
								onChange: (value) => setAttributes({ customBorderColor: value }),
								label: __('Border Color', 'riapress')
							}
						]}
					/>
				)}
			</InspectorControls>

			<div {...useBlockProps({
				className: classes.join(' '),
				style: variant === 'custom' ? {
					'--custom-color': customColor || undefined,
					'--custom-background-color': customBackgroundColor || undefined,
					'--custom-border-color': customBorderColor || undefined,
				} : {},
			})}>

				{isModalOpen && (

				<div id="modal" className="modal" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
					<div className="modal-content">
						<button onClick={closeModal} type="button" className="modal--close-button components-button has-icon" aria-label="Close">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
								aria-hidden="true" focusable="false">
								<path
									d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path>
							</svg>
						</button>
						<div className="content-container">

							<InnerBlocks />
						</div>
					</div>
				</div>
			)}

				<button class="offcanvas-icon"
					onClick={openModal}
					aria-hidden="true"
					aria-label={__('Open Offcanvas Menu', 'offcanvas')}>
					<span class="offcanvas-line line1"></span>
					<span class="offcanvas-line line2"></span>
				</button>
			</div>
		</>
	);
}
