import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
	Button,
	Dropdown,
	RangeControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

// Lucide icon library (badge-relevant subset)
const iconLibrary = {
	Tag: 'M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
	Check: 'M20 6 9 17l-5-5',
	CheckCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3',
	X: 'M18 6 6 18 M6 6l12 12',
	XCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M15 9l-6 6 M9 9l6 6',
	AlertCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 8v4 M12 16h.01',
	Info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01',
	Star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
	Heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
	Zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
	Clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
	Calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
	TrendingUp: 'M22 7 13.5 15.5 8.5 10.5 2 17 M16 7h6v6',
	TrendingDown: 'M22 17l-8.5-8.5-5 5L2 7 M16 17h6v-6',
	Award: 'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M8.21 13.89 7 23l5-3 5 3-1.21-9.11',
	Flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
	Bookmark: 'm19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
	Shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
	Lock: 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
	Unlock: 'M7 11V7a5 5 0 0 1 9.9-1M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
	Eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
	EyeOff: 'm17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M2 2l20 20',
	Users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
	Bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
	Mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
	Plus: 'M5 12h14 M12 5v14',
	Minus: 'M5 12h14',
};

// Icon component
const Icon = ({ name, size = 24, strokeWidth = 2, color, className = '' }) => {
	const pathData = iconLibrary[name];
	if (!pathData) return null;

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color || 'currentColor'}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			{pathData.split(' M').map((d, index) => (
				<path key={index} d={(index === 0 ? '' : 'M') + d} />
			))}
		</svg>
	);
};

// Icon picker component
const IconPicker = ({ value, onChange }) => {
	const [searchTerm, setSearchTerm] = useState('');

	const filteredIcons = Object.keys(iconLibrary).filter((iconName) =>
		iconName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="ria-badge-icon-picker">
			<TextControl
				placeholder={__('Search icons...', 'ria-badge')}
				value={searchTerm}
				onChange={setSearchTerm}
				autoComplete="off"
			/>
			<div className="ria-badge-icon-picker__grid">
				{filteredIcons.map((iconName) => (
					<Button
						key={iconName}
						className={`ria-badge-icon-picker__button ${
							value === iconName ? 'is-selected' : ''
						}`}
						onClick={() => onChange(iconName)}
						title={iconName}
					>
						<Icon name={iconName} size={20} strokeWidth={2} />
						<span className="ria-badge-icon-picker__name">{iconName}</span>
					</Button>
				))}
				{filteredIcons.length === 0 && (
					<p className="ria-badge-icon-picker__no-results">
						{__('No icons found.', 'ria-badge')}
					</p>
				)}
			</div>
		</div>
	);
};

registerBlockType(metadata.name, {
	...metadata,
	edit: ({ attributes, setAttributes, context }) => {
		const {
			text,
			variant,
			size,
			outlineVariant,
			showIcon,
			iconName,
			iconPosition,
			iconSize,
			showDot,
			dataSource,
			taxonomySlug,
			url,
			openInNewTab,
			dismissible,
		} = attributes;

		// Fetch available taxonomies
		const taxonomies = useSelect((select) => {
			const allTaxonomies = select('core').getTaxonomies({ per_page: -1 });
			return allTaxonomies
				? allTaxonomies
						.filter((tax) => tax.visibility.publicly_queryable)
						.map((tax) => ({
							label: tax.name,
							value: tax.slug,
						}))
				: [];
		}, []);

		// Fetch current post's taxonomy terms (for preview in editor)
		const currentPostId = useSelect((select) =>
			select('core/editor')?.getCurrentPostId()
		);

		const currentTerms = useSelect(
			(select) => {
				if (dataSource !== 'taxonomy' || !currentPostId || !taxonomySlug) {
					return null;
				}
				const post = select('core').getEntityRecord('postType', 'post', currentPostId);
				return post && post[taxonomySlug] ? post[taxonomySlug] : null;
			},
			[dataSource, taxonomySlug, currentPostId]
		);

		const blockClasses = [
			'ria-badge',
			`ria-badge--${variant}`,
			`ria-badge--${size}`,
			outlineVariant ? 'ria-badge--outline' : '',
			showIcon ? `ria-badge--icon-${iconPosition}` : '',
			showDot ? 'ria-badge--with-dot' : '',
			dismissible ? 'ria-badge--dismissible' : '',
			url ? 'ria-badge--linked' : '',
			variant === 'custom' ? 'has-custom-colors' : '',
		]
			.filter(Boolean)
			.join(' ');

		const badgeStyles = variant === 'custom' ? {
			color: attributes.customColor,
			backgroundColor: attributes.customBackgroundColor,
			borderColor: attributes.customBorderColor
		} : {};

		const blockProps = useBlockProps({
			className: 'wp-block-ria-badge',
		});

		const renderBadgeContent = () => {
			let displayText = text;

			// Show taxonomy preview in editor
			if (dataSource === 'taxonomy' && currentTerms && currentTerms.length > 0) {
				displayText = `[Taxonomy: ${taxonomySlug}]`;
			}

			return (
				<>
					{showDot && <span className="ria-badge__dot"></span>}
					{showIcon && iconPosition === 'left' && (
						<Icon name={iconName} size={iconSize} strokeWidth={2} className="ria-badge__icon" />
					)}
					<RichText
						tagName="span"
						value={dataSource === 'manual' ? displayText : displayText}
						onChange={(newText) => setAttributes({ text: newText })}
						placeholder={__('Badge text...', 'ria-badge')}
						allowedFormats={[]}
						className="ria-badge__text"
						disabled={dataSource === 'taxonomy'}
					/>
					{showIcon && iconPosition === 'right' && (
						<Icon name={iconName} size={iconSize} strokeWidth={2} className="ria-badge__icon" />
					)}
					{dismissible && (
						<button className="ria-badge__dismiss" aria-label={__('Dismiss', 'ria-badge')}>
							<Icon name="X" size={12} strokeWidth={2} />
						</button>
					)}
				</>
			);
		};

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Badge Settings', 'ria-badge')} initialOpen={true}>
						<SelectControl
							label={__('Variant', 'ria-badge')}
							value={variant}
							options={[
								{ label: __('Neutral', 'ria-badge'), value: 'neutral' },
								{ label: __('Info', 'ria-badge'), value: 'info' },
								{ label: __('Success', 'ria-badge'), value: 'success' },
								{ label: __('Warning', 'ria-badge'), value: 'warning' },
								{ label: __('Error', 'ria-badge'), value: 'error' },
								{ label: __('Custom', 'ria-badge'), value: 'custom' },
							]}
							onChange={(value) => setAttributes({ variant: value })}
						/>
						<SelectControl
							label={__('Size', 'ria-badge')}
							value={size}
							options={[
								{ label: __('Small', 'ria-badge'), value: 'small' },
								{ label: __('Medium', 'ria-badge'), value: 'medium' },
								{ label: __('Large', 'ria-badge'), value: 'large' },
							]}
							onChange={(value) => setAttributes({ size: value })}
						/>
						<ToggleControl
							label={__('Outline Variant', 'ria-badge')}
							checked={outlineVariant}
							onChange={(value) => setAttributes({ outlineVariant: value })}
							help={__('Use border instead of filled background', 'ria-badge')}
						/>
						<ToggleControl
							label={__('Show Dot Indicator', 'ria-badge')}
							checked={showDot}
							onChange={(value) => setAttributes({ showDot: value })}
						/>
					</PanelBody>

					<PanelBody title={__('Content Source', 'ria-badge')} initialOpen={true}>
						<SelectControl
							label={__('Data Source', 'ria-badge')}
							value={dataSource}
							options={[
								{ label: __('Manual Text', 'ria-badge'), value: 'manual' },
								{ label: __('Taxonomy Term', 'ria-badge'), value: 'taxonomy' },
							]}
							onChange={(value) => setAttributes({ dataSource: value })}
							help={
								dataSource === 'taxonomy'
									? __('Badge will display the post\'s taxonomy term(s)', 'ria-badge')
									: __('Manually enter badge text', 'ria-badge')
							}
						/>
						{dataSource === 'taxonomy' && taxonomies.length > 0 && (
							<SelectControl
								label={__('Taxonomy', 'ria-badge')}
								value={taxonomySlug}
								options={taxonomies}
								onChange={(value) => setAttributes({ taxonomySlug: value })}
							/>
						)}
					</PanelBody>

					{variant === 'custom' && (
						<PanelColorSettings
							title={__('Custom Colors', 'ria-badge')}
							colorSettings={[
								{
									value: attributes.customColor,
									onChange: (value) => setAttributes({ customColor: value }),
									label: __('Text Color', 'ria-badge')
								},
								{
									value: attributes.customBackgroundColor,
									onChange: (value) => setAttributes({ customBackgroundColor: value }),
									label: __('Background Color', 'ria-badge')
								},
								{
									value: attributes.customBorderColor,
									onChange: (value) => setAttributes({ customBorderColor: value }),
									label: __('Border Color', 'ria-badge')
								}
							]}
						/>
					)}

					<PanelBody title={__('Icon Settings', 'ria-badge')} initialOpen={false}>
						<ToggleControl
							label={__('Show Icon', 'ria-badge')}
							checked={showIcon}
							onChange={(value) => setAttributes({ showIcon: value })}
						/>
						{showIcon && (
							<VStack spacing={3}>
								<Dropdown
									contentClassName="ria-badge-icon-picker__dropdown"
									popoverProps={{ placement: 'left-start' }}
									renderToggle={({ isOpen, onToggle }) => (
										<Button
											onClick={onToggle}
											aria-expanded={isOpen}
											variant="secondary"
											className="ria-badge-icon-picker__toggle"
										>
											<Icon name={iconName} size={20} strokeWidth={2} />
											<span>{iconName}</span>
										</Button>
									)}
									renderContent={({ onClose }) => (
										<IconPicker
											value={iconName}
											onChange={(newIcon) => {
												setAttributes({ iconName: newIcon });
												onClose();
											}}
										/>
									)}
								/>
								<RangeControl
									label={__('Icon Size', 'ria-badge')}
									value={iconSize}
									onChange={(value) => setAttributes({ iconSize: value })}
									min={12}
									max={32}
									step={2}
								/>
								<SelectControl
									label={__('Icon Position', 'ria-badge')}
									value={iconPosition}
									options={[
										{ label: __('Left', 'ria-badge'), value: 'left' },
										{ label: __('Right', 'ria-badge'), value: 'right' },
									]}
									onChange={(value) => setAttributes({ iconPosition: value })}
								/>
							</VStack>
						)}
					</PanelBody>

					<PanelBody title={__('Link Settings', 'ria-badge')} initialOpen={false}>
						<TextControl
							label={__('URL', 'ria-badge')}
							value={url}
							onChange={(value) => setAttributes({ url: value })}
							placeholder={__('https://...', 'ria-badge')}
							help={__('Make the badge clickable', 'ria-badge')}
						/>
						{url && (
							<ToggleControl
								label={__('Open in New Tab', 'ria-badge')}
								checked={openInNewTab}
								onChange={(value) => setAttributes({ openInNewTab: value })}
							/>
						)}
					</PanelBody>

					<PanelBody title={__('Advanced', 'ria-badge')} initialOpen={false}>
						<ToggleControl
							label={__('Dismissible', 'ria-badge')}
							checked={dismissible}
							onChange={(value) => setAttributes({ dismissible: value })}
							help={__('Add close button to badge', 'ria-badge')}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{url ? (
						<a href={url} className={blockClasses} style={badgeStyles} target={openInNewTab ? '_blank' : undefined} rel={openInNewTab ? 'noopener noreferrer' : undefined}>
							{renderBadgeContent()}
						</a>
					) : (
						<span className={blockClasses} style={badgeStyles}>{renderBadgeContent()}</span>
					)}
				</div>
			</>
		);
	},
	save: () => {
		// Using dynamic render callback
		return null;
	},
});
