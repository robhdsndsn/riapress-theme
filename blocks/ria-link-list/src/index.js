import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	__experimentalLinkControl as LinkControl,
	PanelColorSettings
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	RangeControl,
	SelectControl,
	Button,
	ColorPalette,
	__experimentalBoxControl as BoxControl,
	__experimentalDivider as Divider,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

// Lucide icon paths (simplified for common icons)
const ICON_PATHS = {
	'arrow-right': 'M5 12h14M12 5l7 7-7 7',
	'external-link': 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3',
	'download': 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
	'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
	'link': 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
	'chevron-right': 'M9 18l6-6-6-6',
	'check': 'M20 6L9 17l-5-5',
	'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
};

// Icon component
const Icon = ({ name, size = 20, color = '#2563eb' }) => {
	const path = ICON_PATHS[name] || ICON_PATHS['link'];
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d={path} />
		</svg>
	);
};

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const { links,
			layout,
			columns,
			showIcons,
			iconPosition,
			iconSize,
			iconColor,
			showDescriptions,
			openInNewTab,
			linkStyle,
			linkSize,
			linkColor,
			linkHoverColor,
			itemBackgroundColor,
			itemHoverBackground,
			spacing,
			dividerStyle,
			dividerColor,
			alignment,
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
			staggerAnimation,
			staggerDelay,
			variant,
			customIconColor,
			customLinkColor,
			customLinkHoverColor,
			customBackgroundColor,
			customItemBackgroundColor,
			customItemHoverBackground,
			customDividerColor,
			customBorderColor
		} = attributes;

		const blockProps = useBlockProps({
			className: `ria-link-list layout-${layout} align-${alignment} link-style-${linkStyle} link-size-${linkSize}${layout === 'grid' ? ` columns-${columns}` : ''}`,
			style: {
				backgroundColor: customBackgroundColor || undefined,
				gap: layout !== 'vertical' ? `${spacing}px` : undefined,
			},
		});

		const addLink = () => {
			setAttributes({
				links: [
					...links,
					{
						title: '',
						url: '',
						description: '',
						icon: 'link',
					},
				],
			});
		};

		const updateLink = (index, field, value) => {
			const newLinks = [...links];
			newLinks[index] = { ...newLinks[index], [field]: value };
			setAttributes({ links: newLinks });
		};

		const removeLink = (index) => {
			const newLinks = links.filter((_, i) => i !== index);
			setAttributes({ links: newLinks });
		};

		const getLinkItemStyle = () => {
			const style = {
				padding: linkStyle === 'button' ? '12px 20px' : undefined,
				backgroundColor: itemBackgroundColor || undefined,
				borderWidth: borderWidth ? `${borderWidth}px` : undefined,
				borderStyle: borderWidth ? borderStyle : undefined,
				borderColor: borderWidth ? customBorderColor : undefined,
				borderRadius: `${borderRadius}px`,
				marginBottom: layout === 'vertical' && dividerStyle === 'none' ? `${spacing}px` : undefined,
			};

			// Add box shadow
			if (boxShadow !== 'none') {
				const shadows = {
					small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
					medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
					large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
					xlarge: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
					'2xlarge': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
					inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
				};
				style.boxShadow = shadows[boxShadow];
			}

			return style;
		};

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Links', 'ria-link-list')} initialOpen={true}>
						{links.map((link, index) => (
							<div key={index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
									<strong>{__('Link', 'ria-link-list')} {index + 1}</strong>
									<Button
										isDestructive
										isSmall
										onClick={() => removeLink(index)}
										icon="trash"
									>
										{__('Remove', 'ria-link-list')}
									</Button>
								</div>
								<TextControl
									label={__('Title', 'ria-link-list')}
									value={link.title}
									onChange={(value) => updateLink(index, 'title', value)}
									placeholder={__('Enter link title', 'ria-link-list')}
								/>
								<TextControl
									label={__('URL', 'ria-link-list')}
									value={link.url}
									onChange={(value) => updateLink(index, 'url', value)}
									placeholder="https://"
									type="url"
								/>
								{showDescriptions && (
									<TextareaControl
										label={__('Description', 'ria-link-list')}
										value={link.description}
										onChange={(value) => updateLink(index, 'description', value)}
										placeholder={__('Enter link description', 'ria-link-list')}
										rows={2}
									/>
								)}
								{showIcons && (
									<SelectControl
										label={__('Icon', 'ria-link-list')}
										value={link.icon}
										options={[
											{ label: __('Link', 'ria-link-list'), value: 'link' },
											{ label: __('Arrow Right', 'ria-link-list'), value: 'arrow-right' },
											{ label: __('External Link', 'ria-link-list'), value: 'external-link' },
											{ label: __('Download', 'ria-link-list'), value: 'download' },
											{ label: __('File', 'ria-link-list'), value: 'file-text' },
											{ label: __('Chevron Right', 'ria-link-list'), value: 'chevron-right' },
											{ label: __('Check', 'ria-link-list'), value: 'check' },
											{ label: __('Star', 'ria-link-list'), value: 'star' },
										]}
										onChange={(value) => updateLink(index, 'icon', value)}
									/>
								)}
							</div>
						))}
						<Button isPrimary onClick={addLink}>
							{__('Add Link', 'ria-link-list')}
						</Button>
					</PanelBody>

					<PanelBody title={__('Layout', 'ria-link-list')} initialOpen={false}>
						<SelectControl
							label={__('Layout Style', 'ria-link-list')}
							value={layout}
							options={[
								{ label: __('Vertical List', 'ria-link-list'), value: 'vertical' },
								{ label: __('Horizontal Row', 'ria-link-list'), value: 'horizontal' },
								{ label: __('Grid', 'ria-link-list'), value: 'grid' },
								{ label: __('Compact', 'ria-link-list'), value: 'compact' },
							]}
							onChange={(value) => setAttributes({ layout: value })}
							help={__('How links are arranged on the page', 'ria-link-list')}
						/>
						{layout === 'grid' && (
							<RangeControl
								label={__('Columns', 'ria-link-list')}
								value={columns}
								onChange={(value) => setAttributes({ columns: value })}
								min={1}
								max={4}
								help={__('Number of columns in grid layout', 'ria-link-list')}
							/>
						)}
						<SelectControl
							label={__('Alignment', 'ria-link-list')}
							value={alignment}
							options={[
								{ label: __('Left', 'ria-link-list'), value: 'left' },
								{ label: __('Center', 'ria-link-list'), value: 'center' },
								{ label: __('Right', 'ria-link-list'), value: 'right' },
							]}
							onChange={(value) => setAttributes({ alignment: value })}
						/>
					</PanelBody>

					<PanelBody title={__('Icons', 'ria-link-list')} initialOpen={false}>
						<ToggleControl
							label={__('Show Icons', 'ria-link-list')}
							checked={showIcons}
							onChange={(value) => setAttributes({ showIcons: value })}
						/>
						{showIcons && (
							<>
								<SelectControl
									label={__('Icon Position', 'ria-link-list')}
									value={iconPosition}
									options={[
										{ label: __('Left', 'ria-link-list'), value: 'left' },
										{ label: __('Right', 'ria-link-list'), value: 'right' },
										{ label: __('Top', 'ria-link-list'), value: 'top' },
									]}
									onChange={(value) => setAttributes({ iconPosition: value })}
								/>
								<RangeControl
									label={__('Icon Size (px)', 'ria-link-list')}
									value={iconSize}
									onChange={(value) => setAttributes({ iconSize: value })}
									min={12}
									max={48}
								/>
								<p>{__('Icon Color', 'ria-link-list')}</p>
								<ColorPalette
									value={iconColor}
									onChange={(value) => setAttributes({ iconColor: value || '#2563eb' })}
								/>
							</>
						)}
					</PanelBody>

					<PanelBody title={__('Display Options', 'ria-link-list')} initialOpen={false}>
						<ToggleControl
							label={__('Show Descriptions', 'ria-link-list')}
							checked={showDescriptions}
							onChange={(value) => setAttributes({ showDescriptions: value })}
							help={__('Display description text below link titles', 'ria-link-list')}
						/>
						<ToggleControl
							label={__('Open in New Tab', 'ria-link-list')}
							checked={openInNewTab}
							onChange={(value) => setAttributes({ openInNewTab: value })}
							help={__('Open all links in new browser tab', 'ria-link-list')}
						/>
						<SelectControl
							label={__('Link Style', 'ria-link-list')}
							value={linkStyle}
							options={[
								{ label: __('Default', 'ria-link-list'), value: 'default' },
								{ label: __('Button', 'ria-link-list'), value: 'button' },
								{ label: __('Minimal', 'ria-link-list'), value: 'minimal' },
								{ label: __('Underline', 'ria-link-list'), value: 'underline' },
								{ label: __('Arrow', 'ria-link-list'), value: 'arrow' },
							]}
							onChange={(value) => setAttributes({ linkStyle: value })}
							help={__('Visual style of link items', 'ria-link-list')}
						/>
						<SelectControl
							label={__('Link Size', 'ria-link-list')}
							value={linkSize}
							options={[
								{ label: __('Small', 'ria-link-list'), value: 'small' },
								{ label: __('Medium', 'ria-link-list'), value: 'medium' },
								{ label: __('Large', 'ria-link-list'), value: 'large' },
							]}
							onChange={(value) => setAttributes({ linkSize: value })}
						/>
					</PanelBody>

					<PanelBody title={__('Colors', 'ria-link-list')} initialOpen={false}>
						<p>{__('Link Color', 'ria-link-list')}</p>
						<ColorPalette
							value={linkColor}
							onChange={(value) => setAttributes({ linkColor: value || '#1a1a1a' })}
						/>
						<p>{__('Link Hover Color', 'ria-link-list')}</p>
						<ColorPalette
							value={linkHoverColor}
							onChange={(value) => setAttributes({ linkHoverColor: value || '#2563eb' })}
						/>
						<p>{__('Container Background', 'ria-link-list')}</p>
						<ColorPalette
							value={customBackgroundColor}
							onChange={(value) => setAttributes({ customBackgroundColor: value || '' })}
						/>
						<p>{__('Item Background', 'ria-link-list')}</p>
						<ColorPalette
							value={itemBackgroundColor}
							onChange={(value) => setAttributes({ itemBackgroundColor: value || '#ffffff' })}
						/>
						<p>{__('Item Hover Background', 'ria-link-list')}</p>
						<ColorPalette
							value={itemHoverBackground}
							onChange={(value) => setAttributes({ itemHoverBackground: value || '#f9fafb' })}
						/>
					</PanelBody>

					<PanelBody title={__('Spacing & Dividers', 'ria-link-list')} initialOpen={false}>
						<RangeControl
							label={__('Spacing (px)', 'ria-link-list')}
							value={spacing}
							onChange={(value) => setAttributes({ spacing: value })}
							min={0}
							max={40}
							help={__('Gap between link items', 'ria-link-list')}
						/>
						<SelectControl
							label={__('Divider Style', 'ria-link-list')}
							value={dividerStyle}
							options={[
								{ label: __('None', 'ria-link-list'), value: 'none' },
								{ label: __('Solid', 'ria-link-list'), value: 'solid' },
								{ label: __('Dashed', 'ria-link-list'), value: 'dashed' },
								{ label: __('Dotted', 'ria-link-list'), value: 'dotted' },
							]}
							onChange={(value) => setAttributes({ dividerStyle: value })}
							help={__('Line between link items', 'ria-link-list')}
						/>
						{dividerStyle !== 'none' && (
							<>
								<p>{__('Divider Color', 'ria-link-list')}</p>
								<ColorPalette
									value={dividerColor}
									onChange={(value) => setAttributes({ dividerColor: value || '#e5e7eb' })}
								/>
							</>
						)}
					</PanelBody>

					<PanelBody title={__('Borders', 'ria-link-list')} initialOpen={false}>
						<RangeControl
							label={__('Border Width (px)', 'ria-link-list')}
							value={borderWidth}
							onChange={(value) => setAttributes({ borderWidth: value })}
							min={0}
							max={10}
						/>
						{borderWidth > 0 && (
							<>
								<SelectControl
									label={__('Border Style', 'ria-link-list')}
									value={borderStyle}
									options={[
										{ label: __('Solid', 'ria-link-list'), value: 'solid' },
										{ label: __('Dashed', 'ria-link-list'), value: 'dashed' },
										{ label: __('Dotted', 'ria-link-list'), value: 'dotted' },
										{ label: __('Double', 'ria-link-list'), value: 'double' },
									]}
									onChange={(value) => setAttributes({ borderStyle: value })}
								/>
								<p>{__('Border Color', 'ria-link-list')}</p>
								<ColorPalette
									value={customBorderColor}
									onChange={(value) => setAttributes({ customBorderColor: value || '#e5e7eb' })}
								/>
							</>
						)}
						<RangeControl
							label={__('Border Radius (px)', 'ria-link-list')}
							value={borderRadius}
							onChange={(value) => setAttributes({ borderRadius: value })}
							min={0}
							max={50}
						/>
						<SelectControl
							label={__('Box Shadow', 'ria-link-list')}
							value={boxShadow}
							options={[
								{ label: __('None', 'ria-link-list'), value: 'none' },
								{ label: __('Small', 'ria-link-list'), value: 'small' },
								{ label: __('Medium', 'ria-link-list'), value: 'medium' },
								{ label: __('Large', 'ria-link-list'), value: 'large' },
								{ label: __('X-Large', 'ria-link-list'), value: 'xlarge' },
								{ label: __('2X-Large', 'ria-link-list'), value: '2xlarge' },
								{ label: __('Inner', 'ria-link-list'), value: 'inner' },
							]}
							onChange={(value) => setAttributes({ boxShadow: value })}
						/>
						<SelectControl
							label={__('Hover Shadow', 'ria-link-list')}
							value={hoverShadow}
							options={[
								{ label: __('None', 'ria-link-list'), value: 'none' },
								{ label: __('Small', 'ria-link-list'), value: 'small' },
								{ label: __('Medium', 'ria-link-list'), value: 'medium' },
								{ label: __('Large', 'ria-link-list'), value: 'large' },
								{ label: __('X-Large', 'ria-link-list'), value: 'xlarge' },
								{ label: __('2X-Large', 'ria-link-list'), value: '2xlarge' },
							]}
							onChange={(value) => setAttributes({ hoverShadow: value })}
						/>
					</PanelBody>

					<PanelBody title={__('Animation', 'ria-link-list')} initialOpen={false}>
						<ToggleControl
							label={__('Enable Animation', 'ria-link-list')}
							checked={animationEnabled}
							onChange={(value) => setAttributes({ animationEnabled: value })}
						/>
						{animationEnabled && (
							<>
								<SelectControl
									label={__('Animation Type', 'ria-link-list')}
									value={animationType}
									options={[
										{ label: __('Fade In', 'ria-link-list'), value: 'fadeIn' },
										{ label: __('Fade In Up', 'ria-link-list'), value: 'fadeInUp' },
										{ label: __('Fade In Down', 'ria-link-list'), value: 'fadeInDown' },
										{ label: __('Fade In Left', 'ria-link-list'), value: 'fadeInLeft' },
										{ label: __('Fade In Right', 'ria-link-list'), value: 'fadeInRight' },
										{ label: __('Slide In Up', 'ria-link-list'), value: 'slideInUp' },
										{ label: __('Zoom In', 'ria-link-list'), value: 'zoomIn' },
									]}
									onChange={(value) => setAttributes({ animationType: value })}
								/>
								<RangeControl
									label={__('Animation Duration (ms)', 'ria-link-list')}
									value={animationDuration}
									onChange={(value) => setAttributes({ animationDuration: value })}
									min={0}
									max={3000}
									step={100}
								/>
								<RangeControl
									label={__('Animation Delay (ms)', 'ria-link-list')}
									value={animationDelay}
									onChange={(value) => setAttributes({ animationDelay: value })}
									min={0}
									max={2000}
									step={100}
								/>
								<SelectControl
									label={__('Animation Easing', 'ria-link-list')}
									value={animationEasing}
									options={[
										{ label: __('Linear', 'ria-link-list'), value: 'linear' },
										{ label: __('Ease', 'ria-link-list'), value: 'ease' },
										{ label: __('Ease In', 'ria-link-list'), value: 'ease-in' },
										{ label: __('Ease Out', 'ria-link-list'), value: 'ease-out' },
										{ label: __('Ease In Out', 'ria-link-list'), value: 'ease-in-out' },
									]}
									onChange={(value) => setAttributes({ animationEasing: value })}
								/>
								<ToggleControl
									label={__('Stagger Animation', 'ria-link-list')}
									checked={staggerAnimation}
									onChange={(value) => setAttributes({ staggerAnimation: value })}
									help={__('Animate items one after another', 'ria-link-list')}
								/>
								{staggerAnimation && (
									<RangeControl
										label={__('Stagger Delay (ms)', 'ria-link-list')}
										value={staggerDelay}
										onChange={(value) => setAttributes({ staggerDelay: value })}
										min={0}
										max={500}
										step={50}
									/>
								)}
							</>
						)}
						<SelectControl
							label={__('Hover Animation', 'ria-link-list')}
							value={hoverAnimation}
							options={[
								{ label: __('None', 'ria-link-list'), value: 'none' },
								{ label: __('Lift', 'ria-link-list'), value: 'lift' },
								{ label: __('Grow', 'ria-link-list'), value: 'grow' },
								{ label: __('Shrink', 'ria-link-list'), value: 'shrink' },
								{ label: __('Pulse', 'ria-link-list'), value: 'pulse' },
							]}
							onChange={(value) => setAttributes({ hoverAnimation: value })}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{links.length === 0 && (
						<div className="ria-link-list-placeholder">
							<p>{__('No links added yet.', 'ria-link-list')}</p>
							<Button isPrimary onClick={addLink}>
								{__('Add Your First Link', 'ria-link-list')}
							</Button>
						</div>
					)}
					{links.map((link, index) => {
						const itemClasses = `link-item icon-position-${iconPosition}${dividerStyle !== 'none' && index < links.length - 1 ? ' has-divider' : ''}`;
						const itemStyle = {
							...getLinkItemStyle(),
							borderBottomWidth: dividerStyle !== 'none' && index < links.length - 1 ? '1px' : undefined,
							borderBottomStyle: dividerStyle !== 'none' && index < links.length - 1 ? dividerStyle : undefined,
							borderBottomColor: dividerStyle !== 'none' && index < links.length - 1 ? dividerColor : undefined,
						};

						return (
							<div key={index} className={itemClasses} style={itemStyle}>
								{showIcons && iconPosition === 'top' && (
									<div className="link-icon">
										<Icon name={link.icon} size={iconSize} color={iconColor} />
									</div>
								)}
								<div className="link-content">
									{showIcons && iconPosition === 'left' && (
										<span className="link-icon">
											<Icon name={link.icon} size={iconSize} color={iconColor} />
										</span>
									)}
									<div className="link-text">
										<span className="link-title" style={{ color: linkColor }}>
											{link.title || __('Untitled Link', 'ria-link-list')}
										</span>
										{showDescriptions && link.description && (
											<span className="link-description">{link.description}</span>
										)}
									</div>
									{showIcons && iconPosition === 'right' && (
										<span className="link-icon">
											<Icon name={link.icon} size={iconSize} color={iconColor} />
										</span>
									)}
									{linkStyle === 'arrow' && (
										<span className="link-arrow">→</span>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const { links,
			layout,
			columns,
			showIcons,
			iconPosition,
			iconSize,
			iconColor,
			showDescriptions,
			openInNewTab,
			linkStyle,
			linkSize,
			linkColor,
			linkHoverColor,
			itemBackgroundColor,
			itemHoverBackground,
			spacing,
			dividerStyle,
			dividerColor,
			alignment,
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
			staggerAnimation,
			staggerDelay,
			variant,
			customIconColor,
			customLinkColor,
			customLinkHoverColor,
			customBackgroundColor,
			customItemBackgroundColor,
			customItemHoverBackground,
			customDividerColor,
			customBorderColor
		} = attributes;

		if (links.length === 0) {
			return null;
		}

		const blockProps = useBlockProps.save({
			className: `ria-link-list layout-${layout} align-${alignment} link-style-${linkStyle} link-size-${linkSize}${layout === 'grid' ? ` columns-${columns}` : ''}${hoverAnimation !== 'none' ? ` hover-${hoverAnimation}` : ''}`,
			style: {
				'--link-color': linkColor,
				'--link-hover-color': linkHoverColor,
				'--icon-color': iconColor,
				'--icon-size': `${iconSize}px`,
				'--item-bg': itemBackgroundColor,
				'--item-hover-bg': itemHoverBackground,
				'--spacing': `${spacing}px`,
				'--border-radius': `${borderRadius}px`,
				'--divider-color': dividerColor,
				backgroundColor: customBackgroundColor || undefined,
			},
			...(animationEnabled && {
				'data-animation': animationType,
				'data-duration': animationDuration,
				'data-delay': animationDelay,
				'data-easing': animationEasing,
			}),
		});

		const getShadowClass = (shadow) => {
			return shadow !== 'none' ? `shadow-${shadow}` : '';
		};

		return (
			<div {...blockProps}>
				{links.map((link, index) => {
					if (!link.title && !link.url) return null;

					const itemClasses = `link-item icon-position-${iconPosition}${dividerStyle !== 'none' && index < links.length - 1 ? ' has-divider' : ''} ${getShadowClass(boxShadow)}${hoverShadow !== 'none' ? ` hover-shadow-${hoverShadow}` : ''}`;

					const itemStyle = {
						padding: linkStyle === 'button' ? '12px 20px' : undefined,
						borderWidth: borderWidth ? `${borderWidth}px` : undefined,
						borderStyle: borderWidth ? borderStyle : undefined,
						borderColor: borderWidth ? customBorderColor : undefined,
						...(dividerStyle !== 'none' && index < links.length - 1 && {
							borderBottomWidth: '1px',
							borderBottomStyle: dividerStyle,
						}),
						...(staggerAnimation && animationEnabled && {
							'--stagger-delay': `${index * staggerDelay}ms`,
						}),
					};

					const linkProps = {
						href: link.url || '#',
						className: 'link-content',
						...(openInNewTab && { target: '_blank', rel: 'noopener noreferrer' }),
						...(staggerAnimation && animationEnabled && {
							'data-animation': animationType,
							'data-delay': animationDelay + (index * staggerDelay),
						}),
					};

					return (
						<div key={index} className={itemClasses} style={itemStyle}>
							{showIcons && iconPosition === 'top' && (
								<div className="link-icon">
									<Icon name={link.icon} size={iconSize} color={iconColor} />
								</div>
							)}
							<a {...linkProps}>
								{showIcons && iconPosition === 'left' && (
									<span className="link-icon">
										<Icon name={link.icon} size={iconSize} color={iconColor} />
									</span>
								)}
								<div className="link-text">
									<span className="link-title">{link.title}</span>
									{showDescriptions && link.description && (
										<span className="link-description">{link.description}</span>
									)}
								</div>
								{showIcons && iconPosition === 'right' && (
									<span className="link-icon">
										<Icon name={link.icon} size={iconSize} color={iconColor} />
									</span>
								)}
								{linkStyle === 'arrow' && (
									<span className="link-arrow">→</span>
								)}
							</a>
						</div>
					);
				})}
			</div>
		);
	},
});
