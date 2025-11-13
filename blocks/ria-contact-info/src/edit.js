import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, PanelColorSettings, __experimentalColorGradientControl as ColorGradientControl } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	RangeControl,
	SelectControl,
	Button,
	ColorPicker,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import './editor.scss';

// Icon components (simplified SVG)
const PhoneIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
	</svg>
);

const MailIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
		<polyline points="22,6 12,13 2,6" />
	</svg>
);

const MapPinIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
		<circle cx="12" cy="10" r="3" />
	</svg>
);

const GlobeIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<circle cx="12" cy="12" r="10" />
		<line x1="2" y1="12" x2="22" y2="12" />
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</svg>
);

const PrinterIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<polyline points="6 9 6 2 18 2 18 9" />
		<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
		<rect x="6" y="14" width="12" height="8" />
	</svg>
);

// Social icon components
const FacebookIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
		<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
	</svg>
);

const TwitterIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
		<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
	</svg>
);

const LinkedInIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
		<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
	</svg>
);

const InstagramIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
	</svg>
);

const YouTubeIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
		<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
	</svg>
);

const GitHubIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
	</svg>
);

const getSocialIcon = (platform) => {
	switch (platform.toLowerCase()) {
		case 'facebook':
			return <FacebookIcon />;
		case 'twitter':
			return <TwitterIcon />;
		case 'linkedin':
			return <LinkedInIcon />;
		case 'instagram':
			return <InstagramIcon />;
		case 'youtube':
			return <YouTubeIcon />;
		case 'github':
			return <GitHubIcon />;
		default:
			return <GlobeIcon />;
	}
};

export default function Edit({ attributes, setAttributes }) {
	const {
		layout,
		phone,
		email,
		address,
		website,
		fax,
		socialLinks,
		showPhone,
		showEmail,
		showAddress,
		showWebsite,
		showFax,
		showSocial,
		showIcons,
		iconPosition,
		iconSize,
		iconStyle,
		textColor,
		linkColor,
		itemSpacing,
		alignment,
		fontSize,
		showLabels,
		phoneLabel,
		emailLabel,
		addressLabel,
		websiteLabel,
		faxLabel,
		clickablePhone,
		clickableEmail,
		socialIconSize,
		socialIconStyle,
		variant,
		customBackgroundColor,
		customIconColor,
		customTextColor,
		customLinkColor,
		customBorderColor,
		iconColor,
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

	const blockProps = useBlockProps({
		className: `ria-contact-info layout-${layout} align-${alignment} font-${fontSize} icon-${iconStyle} icon-pos-${iconPosition} variant-${variant}`,
		style: variant === 'custom' ? {
			'--custom-bg-color': customBackgroundColor,
			'--custom-icon-color': customIconColor,
			'--custom-text-color': customTextColor,
			'--custom-link-color': customLinkColor,
			'--custom-border-color': customBorderColor,
			'--icon-size': `${iconSize}px`,
			'--item-spacing': `${itemSpacing}px`,
			'--social-icon-size': `${socialIconSize}px`,
			'--border-width': `${borderWidth}px`,
			'--border-radius': `${borderRadius}px`,
		} : {
			'--icon-size': `${iconSize}px`,
			'--item-spacing': `${itemSpacing}px`,
			'--social-icon-size': `${socialIconSize}px`,
			'--border-width': `${borderWidth}px`,
			'--border-radius': `${borderRadius}px`,
		},
	});

	const addSocialLink = () => {
		setAttributes({
			socialLinks: [...socialLinks, { platform: 'Facebook', url: '' }],
		});
	};

	const updateSocialLink = (index, field, value) => {
		const newLinks = [...socialLinks];
		newLinks[index][field] = value;
		setAttributes({ socialLinks: newLinks });
	};

	const removeSocialLink = (index) => {
		const newLinks = socialLinks.filter((_, i) => i !== index);
		setAttributes({ socialLinks: newLinks });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Contact Information', 'ria-contact-info')} initialOpen={true}>
					<TextControl
						label={__('Phone', 'ria-contact-info')}
						value={phone}
						onChange={(value) => setAttributes({ phone: value })}
						placeholder="(555) 123-4567"
					/>
					<TextControl
						label={__('Email', 'ria-contact-info')}
						value={email}
						onChange={(value) => setAttributes({ email: value })}
						placeholder="info@example.com"
						type="email"
					/>
					<TextControl
						label={__('Address', 'ria-contact-info')}
						value={address}
						onChange={(value) => setAttributes({ address: value })}
						placeholder="123 Main St, City, ST 12345"
					/>
					<TextControl
						label={__('Website', 'ria-contact-info')}
						value={website}
						onChange={(value) => setAttributes({ website: value })}
						placeholder="https://example.com"
						type="url"
					/>
					<TextControl
						label={__('Fax', 'ria-contact-info')}
						value={fax}
						onChange={(value) => setAttributes({ fax: value })}
						placeholder="(555) 123-4568"
					/>
				</PanelBody>

				<PanelBody title={__('Social Links', 'ria-contact-info')}>
					<VStack spacing={3}>
						{socialLinks.map((link, index) => (
							<div key={index} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
								<SelectControl
									label={__('Platform', 'ria-contact-info')}
									value={link.platform}
									options={[
										{ label: 'Facebook', value: 'Facebook' },
										{ label: 'Twitter', value: 'Twitter' },
										{ label: 'LinkedIn', value: 'LinkedIn' },
										{ label: 'Instagram', value: 'Instagram' },
										{ label: 'YouTube', value: 'YouTube' },
										{ label: 'GitHub', value: 'GitHub' },
									]}
									onChange={(value) => updateSocialLink(index, 'platform', value)}
								/>
								<TextControl
									label={__('URL', 'ria-contact-info')}
									value={link.url}
									onChange={(value) => updateSocialLink(index, 'url', value)}
									placeholder="https://"
									type="url"
								/>
								<Button
									isDestructive
									onClick={() => removeSocialLink(index)}
									style={{ marginTop: '8px' }}
								>
									{__('Remove', 'ria-contact-info')}
								</Button>
							</div>
						))}
						<Button isPrimary onClick={addSocialLink}>
							{__('Add Social Link', 'ria-contact-info')}
						</Button>
					</VStack>
				</PanelBody>

				<PanelBody title={__('Layout', 'ria-contact-info')}>
					<SelectControl
						label={__('Layout Style', 'ria-contact-info')}
						value={layout}
						options={[
							{ label: __('Vertical List', 'ria-contact-info'), value: 'vertical' },
							{ label: __('Horizontal Row', 'ria-contact-info'), value: 'horizontal' },
							{ label: __('Grid (2 Columns)', 'ria-contact-info'), value: 'grid' },
							{ label: __('Compact', 'ria-contact-info'), value: 'compact' },
							{ label: __('Card Style', 'ria-contact-info'), value: 'card' },
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>
					<SelectControl
						label={__('Alignment', 'ria-contact-info')}
						value={alignment}
						options={[
							{ label: __('Left', 'ria-contact-info'), value: 'left' },
							{ label: __('Center', 'ria-contact-info'), value: 'center' },
							{ label: __('Right', 'ria-contact-info'), value: 'right' },
						]}
						onChange={(value) => setAttributes({ alignment: value })}
					/>
					<SelectControl
						label={__('Font Size', 'ria-contact-info')}
						value={fontSize}
						options={[
							{ label: __('Small (14px)', 'ria-contact-info'), value: 'small' },
							{ label: __('Medium (16px)', 'ria-contact-info'), value: 'medium' },
							{ label: __('Large (18px)', 'ria-contact-info'), value: 'large' },
						]}
						onChange={(value) => setAttributes({ fontSize: value })}
					/>
					<RangeControl
						label={__('Item Spacing', 'ria-contact-info')}
						value={itemSpacing}
						onChange={(value) => setAttributes({ itemSpacing: value })}
						min={4}
						max={32}
						step={2}
					/>
				</PanelBody>

				<PanelBody title={__('Icon Settings', 'ria-contact-info')}>
					<ToggleControl
						label={__('Show Icons', 'ria-contact-info')}
						checked={showIcons}
						onChange={(value) => setAttributes({ showIcons: value })}
					/>
					{showIcons && (
						<>
							<SelectControl
								label={__('Icon Position', 'ria-contact-info')}
								value={iconPosition}
								options={[
									{ label: __('Left', 'ria-contact-info'), value: 'left' },
									{ label: __('Right', 'ria-contact-info'), value: 'right' },
									{ label: __('Top', 'ria-contact-info'), value: 'top' },
								]}
								onChange={(value) => setAttributes({ iconPosition: value })}
							/>
							<SelectControl
								label={__('Icon Style', 'ria-contact-info')}
								value={iconStyle}
								options={[
									{ label: __('Default (Plain)', 'ria-contact-info'), value: 'default' },
									{ label: __('Circle Background', 'ria-contact-info'), value: 'circle' },
									{ label: __('Square Background', 'ria-contact-info'), value: 'square' },
									{ label: __('Minimal (Borderless)', 'ria-contact-info'), value: 'minimal' },
								]}
								onChange={(value) => setAttributes({ iconStyle: value })}
							/>
							<RangeControl
								label={__('Icon Size', 'ria-contact-info')}
								value={iconSize}
								onChange={(value) => setAttributes({ iconSize: value })}
								min={12}
								max={48}
								step={2}
							/>
							<div style={{ marginBottom: '16px' }}>
								<label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
									{__('Icon Color', 'ria-contact-info')}
								</label>
								<ColorPicker
									color={iconColor}
									onChangeComplete={(value) => setAttributes({ iconColor: value.hex })}
								/>
							</div>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Display Options', 'ria-contact-info')}>
					<ToggleControl
						label={__('Show Phone', 'ria-contact-info')}
						checked={showPhone}
						onChange={(value) => setAttributes({ showPhone: value })}
					/>
					<ToggleControl
						label={__('Show Email', 'ria-contact-info')}
						checked={showEmail}
						onChange={(value) => setAttributes({ showEmail: value })}
					/>
					<ToggleControl
						label={__('Show Address', 'ria-contact-info')}
						checked={showAddress}
						onChange={(value) => setAttributes({ showAddress: value })}
					/>
					<ToggleControl
						label={__('Show Website', 'ria-contact-info')}
						checked={showWebsite}
						onChange={(value) => setAttributes({ showWebsite: value })}
					/>
					<ToggleControl
						label={__('Show Fax', 'ria-contact-info')}
						checked={showFax}
						onChange={(value) => setAttributes({ showFax: value })}
					/>
					<ToggleControl
						label={__('Show Social Links', 'ria-contact-info')}
						checked={showSocial}
						onChange={(value) => setAttributes({ showSocial: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Labels', 'ria-contact-info')}>
					<ToggleControl
						label={__('Show Labels', 'ria-contact-info')}
						checked={showLabels}
						onChange={(value) => setAttributes({ showLabels: value })}
						help={__('Display labels before each contact field', 'ria-contact-info')}
					/>
					{showLabels && (
						<>
							<TextControl
								label={__('Phone Label', 'ria-contact-info')}
								value={phoneLabel}
								onChange={(value) => setAttributes({ phoneLabel: value })}
							/>
							<TextControl
								label={__('Email Label', 'ria-contact-info')}
								value={emailLabel}
								onChange={(value) => setAttributes({ emailLabel: value })}
							/>
							<TextControl
								label={__('Address Label', 'ria-contact-info')}
								value={addressLabel}
								onChange={(value) => setAttributes({ addressLabel: value })}
							/>
							<TextControl
								label={__('Website Label', 'ria-contact-info')}
								value={websiteLabel}
								onChange={(value) => setAttributes({ websiteLabel: value })}
							/>
							<TextControl
								label={__('Fax Label', 'ria-contact-info')}
								value={faxLabel}
								onChange={(value) => setAttributes({ faxLabel: value })}
							/>
						</>
					)}
					<ToggleControl
						label={__('Clickable Phone', 'ria-contact-info')}
						checked={clickablePhone}
						onChange={(value) => setAttributes({ clickablePhone: value })}
						help={__('Make phone number a tel: link', 'ria-contact-info')}
					/>
					<ToggleControl
						label={__('Clickable Email', 'ria-contact-info')}
						checked={clickableEmail}
						onChange={(value) => setAttributes({ clickableEmail: value })}
						help={__('Make email a mailto: link', 'ria-contact-info')}
					/>
				</PanelBody>

				<PanelBody title={__('Social Icon Settings', 'ria-contact-info')}>
					<SelectControl
						label={__('Social Icon Style', 'ria-contact-info')}
						value={socialIconStyle}
						options={[
							{ label: __('Default', 'ria-contact-info'), value: 'default' },
							{ label: __('Circle', 'ria-contact-info'), value: 'circle' },
							{ label: __('Square', 'ria-contact-info'), value: 'square' },
							{ label: __('Rounded', 'ria-contact-info'), value: 'rounded' },
						]}
						onChange={(value) => setAttributes({ socialIconStyle: value })}
					/>
					<RangeControl
						label={__('Social Icon Size', 'ria-contact-info')}
						value={socialIconSize}
						onChange={(value) => setAttributes({ socialIconSize: value })}
						min={16}
						max={48}
						step={2}
					/>
				</PanelBody>

				<PanelBody title={__('Color Scheme', 'ria-contact-info')} initialOpen={false}>
					<SelectControl
						label={__('Variant', 'ria-contact-info')}
						value={variant}
						options={[
							{ label: __('Primary (Navy)', 'ria-contact-info'), value: 'primary' },
							{ label: __('Secondary (Green)', 'ria-contact-info'), value: 'secondary' },
							{ label: __('Accent (Orange)', 'ria-contact-info'), value: 'accent' },
							{ label: __('Neutral (Gray)', 'ria-contact-info'), value: 'neutral' },
							{ label: __('Custom', 'ria-contact-info'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ variant: value })}
						help={__('Choose a color scheme or use custom colors', 'ria-contact-info')}
					/>
				</PanelBody>

				{variant === 'custom' && (
					<PanelColorSettings
						title={__('Custom Colors', 'ria-contact-info')}
						colorSettings={[
							{
								value: customBackgroundColor,
								onChange: (color) => setAttributes({ customBackgroundColor: color }),
								label: __('Background Color', 'ria-contact-info')
							},
							{
								value: customIconColor,
								onChange: (color) => setAttributes({ customIconColor: color }),
								label: __('Icon Color', 'ria-contact-info')
							},
							{
								value: customTextColor,
								onChange: (color) => setAttributes({ customTextColor: color }),
								label: __('Text Color', 'ria-contact-info')
							},
							{
								value: customLinkColor,
								onChange: (color) => setAttributes({ customLinkColor: color }),
								label: __('Link Color', 'ria-contact-info')
							},
							{
								value: customBorderColor,
								onChange: (color) => setAttributes({ customBorderColor: color }),
								label: __('Border Color', 'ria-contact-info')
							}
						]}
					/>
				)}

				<PanelBody title={__('Borders & Shadow', 'ria-contact-info')}>
					<RangeControl
						label={__('Border Width', 'ria-contact-info')}
						value={borderWidth}
						onChange={(value) => setAttributes({ borderWidth: value })}
						min={0}
						max={10}
					/>
					{borderWidth > 0 && (
						<>
							<SelectControl
								label={__('Border Style', 'ria-contact-info')}
								value={borderStyle}
								options={[
									{ label: 'Solid', value: 'solid' },
									{ label: 'Dashed', value: 'dashed' },
									{ label: 'Dotted', value: 'dotted' },
									{ label: 'Double', value: 'double' },
								]}
								onChange={(value) => setAttributes({ borderStyle: value })}
							/>
						</>
					)}
					<RangeControl
						label={__('Border Radius', 'ria-contact-info')}
						value={borderRadius}
						onChange={(value) => setAttributes({ borderRadius: value })}
						min={0}
						max={50}
					/>
					<SelectControl
						label={__('Box Shadow', 'ria-contact-info')}
						value={boxShadow}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
							{ label: 'X-Large', value: 'xlarge' },
							{ label: '2X-Large', value: '2xlarge' },
						]}
						onChange={(value) => setAttributes({ boxShadow: value })}
					/>
					<SelectControl
						label={__('Hover Shadow', 'ria-contact-info')}
						value={hoverShadow}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Small', value: 'small' },
							{ label: 'Medium', value: 'medium' },
							{ label: 'Large', value: 'large' },
							{ label: 'X-Large', value: 'xlarge' },
							{ label: '2X-Large', value: '2xlarge' },
						]}
						onChange={(value) => setAttributes({ hoverShadow: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Animation', 'ria-contact-info')}>
					<ToggleControl
						label={__('Enable Animation', 'ria-contact-info')}
						checked={animationEnabled}
						onChange={(value) => setAttributes({ animationEnabled: value })}
					/>
					{animationEnabled && (
						<>
							<SelectControl
								label={__('Animation Type', 'ria-contact-info')}
								value={animationType}
								options={[
									{ label: 'Fade In', value: 'fadeIn' },
									{ label: 'Fade In Up', value: 'fadeInUp' },
									{ label: 'Fade In Down', value: 'fadeInDown' },
									{ label: 'Fade In Left', value: 'fadeInLeft' },
									{ label: 'Fade In Right', value: 'fadeInRight' },
									{ label: 'Slide In Up', value: 'slideInUp' },
									{ label: 'Slide In Down', value: 'slideInDown' },
									{ label: 'Slide In Left', value: 'slideInLeft' },
									{ label: 'Slide In Right', value: 'slideInRight' },
									{ label: 'Zoom In', value: 'zoomIn' },
									{ label: 'Zoom In Up', value: 'zoomInUp' },
									{ label: 'Bounce In', value: 'bounceIn' },
									{ label: 'Rotate In', value: 'rotateIn' },
									{ label: 'Flip In X', value: 'flipInX' },
									{ label: 'Flip In Y', value: 'flipInY' },
								]}
								onChange={(value) => setAttributes({ animationType: value })}
							/>
							<RangeControl
								label={__('Duration (ms)', 'ria-contact-info')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={100}
								max={3000}
								step={100}
							/>
							<RangeControl
								label={__('Delay (ms)', 'ria-contact-info')}
								value={animationDelay}
								onChange={(value) => setAttributes({ animationDelay: value })}
								min={0}
								max={2000}
								step={100}
							/>
							<SelectControl
								label={__('Easing', 'ria-contact-info')}
								value={animationEasing}
								options={[
									{ label: 'Linear', value: 'linear' },
									{ label: 'Ease', value: 'ease' },
									{ label: 'Ease In', value: 'ease-in' },
									{ label: 'Ease Out', value: 'ease-out' },
									{ label: 'Ease In Out', value: 'ease-in-out' },
								]}
								onChange={(value) => setAttributes({ animationEasing: value })}
							/>
						</>
					)}
					<SelectControl
						label={__('Hover Animation', 'ria-contact-info')}
						value={hoverAnimation}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Lift', value: 'lift' },
							{ label: 'Grow', value: 'grow' },
							{ label: 'Shrink', value: 'shrink' },
							{ label: 'Rotate', value: 'rotate' },
							{ label: 'Tilt', value: 'tilt' },
							{ label: 'Glow', value: 'glow' },
							{ label: 'Pulse', value: 'pulse' },
							{ label: 'Bounce', value: 'bounce' },
						]}
						onChange={(value) => setAttributes({ hoverAnimation: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="contact-items">
					{showPhone && phone && (
						<div className="contact-item">
							{showIcons && <PhoneIcon />}
							<div className="contact-content">
								{showLabels && <span className="contact-label">{phoneLabel}</span>}
								<span className="contact-value">{phone}</span>
							</div>
						</div>
					)}
					{showEmail && email && (
						<div className="contact-item">
							{showIcons && <MailIcon />}
							<div className="contact-content">
								{showLabels && <span className="contact-label">{emailLabel}</span>}
								<span className="contact-value">{email}</span>
							</div>
						</div>
					)}
					{showAddress && address && (
						<div className="contact-item">
							{showIcons && <MapPinIcon />}
							<div className="contact-content">
								{showLabels && <span className="contact-label">{addressLabel}</span>}
								<span className="contact-value">{address}</span>
							</div>
						</div>
					)}
					{showWebsite && website && (
						<div className="contact-item">
							{showIcons && <GlobeIcon />}
							<div className="contact-content">
								{showLabels && <span className="contact-label">{websiteLabel}</span>}
								<span className="contact-value">{website}</span>
							</div>
						</div>
					)}
					{showFax && fax && (
						<div className="contact-item">
							{showIcons && <PrinterIcon />}
							<div className="contact-content">
								{showLabels && <span className="contact-label">{faxLabel}</span>}
								<span className="contact-value">{fax}</span>
							</div>
						</div>
					)}
				</div>
				{showSocial && socialLinks.length > 0 && (
					<div className={`social-links social-${socialIconStyle}`}>
						{socialLinks.map((link, index) => (
							<a key={index} href={link.url} className="social-link" target="_blank" rel="noopener noreferrer">
								{getSocialIcon(link.platform)}
							</a>
						))}
					</div>
				)}
			</div>
		</>
	);
}
