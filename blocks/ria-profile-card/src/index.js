/**
 * RIA Person Profile Block
 * Production-ready display block for researcher/staff profiles
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	ColorPalette
, PanelColorSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
	Button,
	TextControl,
	ButtonGroup
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Mail, Phone, Globe, GraduationCap } from 'lucide-react';
import { SkeletonAvatar } from '../../../components/skeletons';

import './editor.scss';
import './style.scss';

registerBlockType('ria/profile-card', {
	edit: ({ attributes, setAttributes }) => {
		const { layout,
			photoId,
			photoUrl,
			photoShape,
			photoSize,
			name,
			credentials,
			title,
			organization,
			bio,
			bioLength,
			customBioLength,
			email,
			phone,
			website,
			academicProfile,
			researchTopics,
			showPhoto,
			showCredentials,
			showTitle,
			showOrganization,
			showBio,
			showEmail,
			showPhone,
			showWebsite,
			showAcademicProfile,
			showResearchTopics,
			linkToProfile,
			profileUrl,
			textAlignment,
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
			hoverAnimation, variant, customBackgroundColor, customBorderColor } = attributes;

		// Image loading state for skeleton
		const [imageLoading, setImageLoading] = useState(!!photoUrl);

		const blockProps = useBlockProps({
			className: `ria-person-profile layout-${layout} align-${textAlignment} shadow-${boxShadow} variant-${variant}`,
			style: {
				...(variant === 'custom' && customBackgroundColor ? { backgroundColor: customBackgroundColor } : {}),
				borderWidth: `${borderWidth}px`,
				borderStyle,
				...(variant === 'custom' && customBorderColor ? { borderColor: customBorderColor } : {}),
				borderRadius: `${borderRadius}px`
			}
		});

		// Truncate bio based on bioLength setting
		const getTruncatedBio = () => {
			if (!bio) return '';
			if (bioLength === 'full') return bio;
			if (bioLength === 'excerpt') {
				return bio.length > 150 ? bio.substring(0, 150) + '...' : bio;
			}
			if (bioLength === 'custom') {
				return bio.length > customBioLength ? bio.substring(0, customBioLength) + '...' : bio;
			}
			return bio;
		};

		return (
			<>
				<InspectorControls>
					{/* Layout Settings */}
					<PanelBody title={__('Layout Settings', 'ria-person-profile')}>
						<SelectControl
							label={__('Layout Style', 'ria-person-profile')}
							value={layout}
							options={[
								{ label: __('Vertical (Centered)', 'ria-person-profile'), value: 'vertical' },
								{ label: __('Horizontal (Side-by-side)', 'ria-person-profile'), value: 'horizontal' },
								{ label: __('Compact (Small)', 'ria-person-profile'), value: 'compact' },
								{ label: __('Card (Elevated)', 'ria-person-profile'), value: 'card' }
							]}
							onChange={(value) => setAttributes({ layout: value })}
							help={__('Choose how the profile is displayed', 'ria-person-profile')}
						/>
						<SelectControl
							label={__('Text Alignment', 'ria-person-profile')}
							value={textAlignment}
							options={[
								{ label: __('Left', 'ria-person-profile'), value: 'left' },
								{ label: __('Center', 'ria-person-profile'), value: 'center' },
								{ label: __('Right', 'ria-person-profile'), value: 'right' }
							]}
							onChange={(value) => setAttributes({ textAlignment: value })}
						/>
					</PanelBody>

					{/* Photo Settings */}
					<PanelBody title={__('Photo Settings', 'ria-person-profile')} initialOpen={false}>
						<ToggleControl
							label={__('Show Photo', 'ria-person-profile')}
							checked={showPhoto}
							onChange={(value) => setAttributes({ showPhoto: value })}
						/>
						{showPhoto && (
							<>
								<SelectControl
									label={__('Photo Shape', 'ria-person-profile')}
									value={photoShape}
									options={[
										{ label: __('Circle', 'ria-person-profile'), value: 'circle' },
										{ label: __('Square', 'ria-person-profile'), value: 'square' },
										{ label: __('Rounded', 'ria-person-profile'), value: 'rounded' }
									]}
									onChange={(value) => setAttributes({ photoShape: value })}
								/>
								<RangeControl
									label={__('Photo Size (px)', 'ria-person-profile')}
									value={photoSize}
									onChange={(value) => setAttributes({ photoSize: value })}
									min={60}
									max={300}
									step={10}
									help={__('Recommended: 150-200px', 'ria-person-profile')}
								/>
							</>
						)}
					</PanelBody>

					{/* Display Options */}
					<PanelBody title={__('Display Options', 'ria-person-profile')} initialOpen={false}>
						<ToggleControl
							label={__('Show Credentials', 'ria-person-profile')}
							checked={showCredentials}
							onChange={(value) => setAttributes({ showCredentials: value })}
							help={__('e.g., Ph.D., M.A., Researcher', 'ria-person-profile')}
						/>
						<ToggleControl
							label={__('Show Title', 'ria-person-profile')}
							checked={showTitle}
							onChange={(value) => setAttributes({ showTitle: value })}
							help={__('Job title or position', 'ria-person-profile')}
						/>
						<ToggleControl
							label={__('Show Organization', 'ria-person-profile')}
							checked={showOrganization}
							onChange={(value) => setAttributes({ showOrganization: value })}
						/>
						<ToggleControl
							label={__('Show Bio', 'ria-person-profile')}
							checked={showBio}
							onChange={(value) => setAttributes({ showBio: value })}
						/>
						{showBio && (
							<>
								<SelectControl
									label={__('Bio Length', 'ria-person-profile')}
									value={bioLength}
									options={[
										{ label: __('Full Bio', 'ria-person-profile'), value: 'full' },
										{ label: __('Excerpt (150 chars)', 'ria-person-profile'), value: 'excerpt' },
										{ label: __('Custom Length', 'ria-person-profile'), value: 'custom' }
									]}
									onChange={(value) => setAttributes({ bioLength: value })}
								/>
								{bioLength === 'custom' && (
									<RangeControl
										label={__('Custom Length (characters)', 'ria-person-profile')}
										value={customBioLength}
										onChange={(value) => setAttributes({ customBioLength: value })}
										min={50}
										max={500}
										step={10}
									/>
								)}
							</>
						)}
						<ToggleControl
							label={__('Show Email', 'ria-person-profile')}
							checked={showEmail}
							onChange={(value) => setAttributes({ showEmail: value })}
						/>
						<ToggleControl
							label={__('Show Phone', 'ria-person-profile')}
							checked={showPhone}
							onChange={(value) => setAttributes({ showPhone: value })}
						/>
						<ToggleControl
							label={__('Show Website', 'ria-person-profile')}
							checked={showWebsite}
							onChange={(value) => setAttributes({ showWebsite: value })}
						/>
						<ToggleControl
							label={__('Show Academic Profile', 'ria-person-profile')}
							checked={showAcademicProfile}
							onChange={(value) => setAttributes({ showAcademicProfile: value })}
							help={__('Link to Google Scholar, ORCID, etc.', 'ria-person-profile')}
						/>
						<ToggleControl
							label={__('Show Research Topics', 'ria-person-profile')}
							checked={showResearchTopics}
							onChange={(value) => setAttributes({ showResearchTopics: value })}
						/>
					</PanelBody>

					{/* Profile Link */}
					<PanelBody title={__('Profile Link', 'ria-person-profile')} initialOpen={false}>
						<ToggleControl
							label={__('Link to Full Profile', 'ria-person-profile')}
							checked={linkToProfile}
							onChange={(value) => setAttributes({ linkToProfile: value })}
							help={__('Make profile clickable', 'ria-person-profile')}
						/>
						{linkToProfile && (
							<TextControl
								label={__('Profile URL', 'ria-person-profile')}
								value={profileUrl}
								onChange={(value) => setAttributes({ profileUrl: value })}
								placeholder="https://example.com/profile"
								type="url"
							/>
						)}
					</PanelBody>

					{/* Colors */}
					<PanelBody title={__('Colors', 'ria-person-profile')} initialOpen={false}>
						<SelectControl
							label={__('Color Variant', 'ria-person-profile')}
							value={variant}
							options={[
								{ label: __('Primary', 'ria-person-profile'), value: 'primary' },
								{ label: __('Secondary', 'ria-person-profile'), value: 'secondary' },
								{ label: __('Accent', 'ria-person-profile'), value: 'accent' },
								{ label: __('Neutral', 'ria-person-profile'), value: 'neutral' },
								{ label: __('Custom', 'ria-person-profile'), value: 'custom' }
							]}
							onChange={(value) => setAttributes({ variant: value })}
							help={__('Choose a color scheme. Select "Custom" to set your own colors.', 'ria-person-profile')}
						/>
						{variant === 'custom' && (
							<>
								<p><strong>{__('Background Color', 'ria-person-profile')}</strong></p>
								<ColorPalette
									value={customBackgroundColor}
									onChange={(value) => setAttributes({ customBackgroundColor: value || '#ffffff' })}
								/>
								<p><strong>{__('Border Color', 'ria-person-profile')}</strong></p>
								<ColorPalette
									value={customBorderColor}
									onChange={(value) => setAttributes({ customBorderColor: value || '#e5e7eb' })}
								/>
							</>
						)}
					</PanelBody>

					{/* Borders & Shadows */}
					<PanelBody title={__('Borders & Shadows', 'ria-person-profile')} initialOpen={false}>
						<RangeControl
							label={__('Border Width', 'ria-person-profile')}
							value={borderWidth}
							onChange={(value) => setAttributes({ borderWidth: value })}
							min={0}
							max={10}
							step={1}
						/>
						<SelectControl
							label={__('Border Style', 'ria-person-profile')}
							value={borderStyle}
							options={[
								{ label: __('None', 'ria-person-profile'), value: 'none' },
								{ label: __('Solid', 'ria-person-profile'), value: 'solid' },
								{ label: __('Dashed', 'ria-person-profile'), value: 'dashed' },
								{ label: __('Dotted', 'ria-person-profile'), value: 'dotted' }
							]}
							onChange={(value) => setAttributes({ borderStyle: value })}
						/>
						<RangeControl
							label={__('Border Radius', 'ria-person-profile')}
							value={borderRadius}
							onChange={(value) => setAttributes({ borderRadius: value })}
							min={0}
							max={50}
							step={1}
						/>
						<SelectControl
							label={__('Box Shadow', 'ria-person-profile')}
							value={boxShadow}
							options={[
								{ label: __('None', 'ria-person-profile'), value: 'none' },
								{ label: __('Small', 'ria-person-profile'), value: 'small' },
								{ label: __('Medium', 'ria-person-profile'), value: 'medium' },
								{ label: __('Large', 'ria-person-profile'), value: 'large' }
							]}
							onChange={(value) => setAttributes({ boxShadow: value })}
						/>
						<SelectControl
							label={__('Hover Shadow', 'ria-person-profile')}
							value={hoverShadow}
							options={[
								{ label: __('None', 'ria-person-profile'), value: 'none' },
								{ label: __('Small', 'ria-person-profile'), value: 'small' },
								{ label: __('Medium', 'ria-person-profile'), value: 'medium' },
								{ label: __('Large', 'ria-person-profile'), value: 'large' }
							]}
							onChange={(value) => setAttributes({ hoverShadow: value })}
						/>
					</PanelBody>

					{/* Animation Settings */}
					<PanelBody title={__('Animation Settings', 'ria-person-profile')} initialOpen={false}>
						<ToggleControl
							label={__('Enable Animation', 'ria-person-profile')}
							checked={animationEnabled}
							onChange={(value) => setAttributes({ animationEnabled: value })}
						/>
						{animationEnabled && (
							<>
								<SelectControl
									label={__('Animation Type', 'ria-person-profile')}
									value={animationType}
									options={[
										{ label: __('Fade In Up', 'ria-person-profile'), value: 'fadeInUp' },
										{ label: __('Fade In', 'ria-person-profile'), value: 'fadeIn' },
										{ label: __('Fade In Down', 'ria-person-profile'), value: 'fadeInDown' },
										{ label: __('Slide In Up', 'ria-person-profile'), value: 'slideInUp' },
										{ label: __('Zoom In', 'ria-person-profile'), value: 'zoomIn' }
									]}
									onChange={(value) => setAttributes({ animationType: value })}
								/>
								<RangeControl
									label={__('Animation Duration (seconds)', 'ria-person-profile')}
									value={animationDuration}
									onChange={(value) => setAttributes({ animationDuration: value })}
									min={0.3}
									max={2}
									step={0.1}
								/>
								<RangeControl
									label={__('Animation Delay (seconds)', 'ria-person-profile')}
									value={animationDelay}
									onChange={(value) => setAttributes({ animationDelay: value })}
									min={0}
									max={2}
									step={0.1}
								/>
								<SelectControl
									label={__('Animation Easing', 'ria-person-profile')}
									value={animationEasing}
									options={[
										{ label: __('Ease Out', 'ria-person-profile'), value: 'ease-out' },
										{ label: __('Ease In', 'ria-person-profile'), value: 'ease-in' },
										{ label: __('Ease In Out', 'ria-person-profile'), value: 'ease-in-out' },
										{ label: __('Linear', 'ria-person-profile'), value: 'linear' }
									]}
									onChange={(value) => setAttributes({ animationEasing: value })}
								/>
								<SelectControl
									label={__('Hover Animation', 'ria-person-profile')}
									value={hoverAnimation}
									options={[
										{ label: __('None', 'ria-person-profile'), value: 'none' },
										{ label: __('Lift', 'ria-person-profile'), value: 'lift' },
										{ label: __('Grow', 'ria-person-profile'), value: 'grow' }
									]}
									onChange={(value) => setAttributes({ hoverAnimation: value })}
								/>
							</>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{/* Photo Section */}
					{showPhoto && (
						<div className={`person-photo photo-${photoShape}`} style={{ width: `${photoSize}px`, height: `${photoSize}px` }}>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										setAttributes({ photoUrl: media.url, photoId: media.id });
										setImageLoading(true);
									}}
									allowedTypes={['image']}
									value={photoId}
									render={({ open }) => (
										photoUrl ? (
											<div className="photo-wrapper">
												{imageLoading && <SkeletonAvatar size={photoSize} />}
												<img
													src={photoUrl}
													alt={name || __('Profile photo', 'ria-person-profile')}
													onLoad={() => setImageLoading(false)}
													onError={() => setImageLoading(false)}
													style={{ display: imageLoading ? 'none' : 'block' }}
												/>
												<Button onClick={open} className="change-photo" variant="secondary">
													{__('Change', 'ria-person-profile')}
												</Button>
											</div>
										) : (
											<Button onClick={open} className="upload-photo" variant="secondary">
												{__('Upload Photo', 'ria-person-profile')}
											</Button>
										)
									)}
								/>
							</MediaUploadCheck>
						</div>
					)}

					{/* Content Section */}
					<div className="person-content">
						{/* Name */}
						<RichText
							tagName="h3"
							className="person-name"
							value={name}
							onChange={(value) => setAttributes({ name: value })}
							placeholder={__('Person Name', 'ria-person-profile')}
						/>

						{/* Credentials */}
						{showCredentials && (
							<RichText
								tagName="p"
								className="person-credentials"
								value={credentials}
								onChange={(value) => setAttributes({ credentials: value })}
								placeholder={__('Ph.D., Researcher', 'ria-person-profile')}
							/>
						)}

						{/* Title */}
						{showTitle && (
							<RichText
								tagName="p"
								className="person-title"
								value={title}
								onChange={(value) => setAttributes({ title: value })}
								placeholder={__('Senior Research Fellow', 'ria-person-profile')}
							/>
						)}

						{/* Organization */}
						{showOrganization && (
							<RichText
								tagName="p"
								className="person-organization"
								value={organization}
								onChange={(value) => setAttributes({ organization: value })}
								placeholder={__('Research Institute Name', 'ria-person-profile')}
							/>
						)}

						{/* Bio */}
						{showBio && (
							<RichText
								tagName="p"
								className="person-bio"
								value={bio}
								onChange={(value) => setAttributes({ bio: value })}
								placeholder={__('Brief biography and research interests...', 'ria-person-profile')}
							/>
						)}

						{/* Contact Information */}
						<div className="person-contact">
							{/* Email */}
							{showEmail && (
								<div className="contact-item contact-email">
									<span className="contact-icon"><Mail size={16} /></span>
									<TextControl
										value={email}
										onChange={(value) => setAttributes({ email: value })}
										placeholder="email@example.com"
									/>
								</div>
							)}

							{/* Phone */}
							{showPhone && (
								<div className="contact-item contact-phone">
									<span className="contact-icon"><Phone size={16} /></span>
									<TextControl
										value={phone}
										onChange={(value) => setAttributes({ phone: value })}
										placeholder="+1 (555) 123-4567"
									/>
								</div>
							)}

							{/* Website */}
							{showWebsite && (
								<div className="contact-item contact-website">
									<span className="contact-icon"><Globe size={16} /></span>
									<TextControl
										value={website}
										onChange={(value) => setAttributes({ website: value })}
										placeholder="https://example.com"
									/>
								</div>
							)}

							{/* Academic Profile */}
							{showAcademicProfile && (
								<div className="contact-item contact-academic">
									<span className="contact-icon"><GraduationCap size={16} /></span>
									<TextControl
										value={academicProfile}
										onChange={(value) => setAttributes({ academicProfile: value })}
										placeholder="Google Scholar, ORCID, etc."
									/>
								</div>
							)}
						</div>

						{/* Research Topics */}
						{showResearchTopics && researchTopics && researchTopics.length > 0 && (
							<div className="person-research-topics">
								<p className="topics-label">{__('Research Topics:', 'ria-person-profile')}</p>
								<div className="topics-list">
									{researchTopics.map((topic, index) => (
										<span key={index} className="topic-tag">{topic}</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			layout,
			photoUrl,
			photoShape,
			photoSize,
			name,
			credentials,
			title,
			organization,
			bio,
			bioLength,
			customBioLength,
			email,
			phone,
			website,
			academicProfile,
			researchTopics,
			showPhoto,
			showCredentials,
			showTitle,
			showOrganization,
			showBio,
			showEmail,
			showPhone,
			showWebsite,
			showAcademicProfile,
			showResearchTopics,
			linkToProfile,
			profileUrl,
			textAlignment,
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
			customBackgroundColor,
			customBorderColor
		} = attributes;

		// Truncate bio based on bioLength setting
		const getTruncatedBio = () => {
			if (!bio) return '';
			if (bioLength === 'full') return bio;
			if (bioLength === 'excerpt') {
				return bio.length > 150 ? bio.substring(0, 150) + '...' : bio;
			}
			if (bioLength === 'custom') {
				return bio.length > customBioLength ? bio.substring(0, customBioLength) + '...' : bio;
			}
			return bio;
		};

		const blockProps = useBlockProps.save({
			className: `ria-person-profile layout-${layout} align-${textAlignment} shadow-${boxShadow} hover-shadow-${hoverShadow} hover-${hoverAnimation} variant-${variant}`,
			style: {
				...(variant === 'custom' && customBackgroundColor ? { backgroundColor: customBackgroundColor } : {}),
				borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
				borderStyle: borderWidth > 0 ? borderStyle : undefined,
				...(variant === 'custom' && customBorderColor ? { borderColor: customBorderColor } : {}),
				borderRadius: `${borderRadius}px`
			},
			...(animationEnabled && {
				'data-animation': animationType,
				'data-duration': animationDuration,
				'data-delay': animationDelay,
				'data-easing': animationEasing
			})
		});

		const ProfileContent = () => (
			<>
				{/* Photo Section */}
				{showPhoto && photoUrl && (
					<div className={`person-photo photo-${photoShape}`} style={{ width: `${photoSize}px`, height: `${photoSize}px` }}>
						<img src={photoUrl} alt={name || ''} />
					</div>
				)}

				{/* Content Section */}
				<div className="person-content">
					{/* Name */}
					{name && <RichText.Content tagName="h3" className="person-name" value={name} />}

					{/* Credentials */}
					{showCredentials && credentials && (
						<RichText.Content tagName="p" className="person-credentials" value={credentials} />
					)}

					{/* Title */}
					{showTitle && title && (
						<RichText.Content tagName="p" className="person-title" value={title} />
					)}

					{/* Organization */}
					{showOrganization && organization && (
						<RichText.Content tagName="p" className="person-organization" value={organization} />
					)}

					{/* Bio */}
					{showBio && bio && (
						<RichText.Content tagName="p" className="person-bio" value={getTruncatedBio()} />
					)}

					{/* Contact Information */}
					<div className="person-contact">
						{/* Email */}
						{showEmail && email && (
							<div className="contact-item contact-email">
								<span className="contact-icon" data-icon="mail"></span>
								<a href={`mailto:${email}`}>{email}</a>
							</div>
						)}

						{/* Phone */}
						{showPhone && phone && (
							<div className="contact-item contact-phone">
								<span className="contact-icon" data-icon="phone"></span>
								<a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
							</div>
						)}

						{/* Website */}
						{showWebsite && website && (
							<div className="contact-item contact-website">
								<span className="contact-icon" data-icon="globe"></span>
								<a href={website} target="_blank" rel="noopener noreferrer">
									{website.replace(/^https?:\/\//, '')}
								</a>
							</div>
						)}

						{/* Academic Profile */}
						{showAcademicProfile && academicProfile && (
							<div className="contact-item contact-academic">
								<span className="contact-icon" data-icon="graduation-cap"></span>
								<a href={academicProfile} target="_blank" rel="noopener noreferrer">
									{academicProfile.replace(/^https?:\/\//, '')}
								</a>
							</div>
						)}
					</div>

					{/* Research Topics */}
					{showResearchTopics && researchTopics && researchTopics.length > 0 && (
						<div className="person-research-topics">
							<p className="topics-label">{__('Research Topics:', 'ria-person-profile')}</p>
							<div className="topics-list">
								{researchTopics.map((topic, index) => (
									<span key={index} className="topic-tag">{topic}</span>
								))}
							</div>
						</div>
					)}
				</div>
			</>
		);

		return (
			<div {...blockProps}>
				{linkToProfile && profileUrl ? (
					<a href={profileUrl} className="profile-wrapper">
						<ProfileContent />
					</a>
				) : (
					<ProfileContent />
				)}
			</div>
		);
	}
});
