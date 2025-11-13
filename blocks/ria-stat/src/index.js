import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	ColorPalette,
	SelectControl,
	Button,
	Dropdown,
	TextControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

// Lucide icon library (subset of commonly used icons for stats)
const iconLibrary = {
	TrendingUp: 'M22 7 13.5 15.5 8.5 10.5 2 17 M16 7h6v6',
	TrendingDown: 'M22 17l-8.5-8.5-5 5L2 7 M16 17h6v-6',
	BarChart: 'M12 20V10M18 20V4M6 20v-4',
	PieChart: 'M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z',
	Activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
	Star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
	Heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
	Award: 'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M8.21 13.89 7 23l5-3 5 3-1.21-9.11',
	Target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
	Users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
	DollarSign: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
	Check: 'M20 6 9 17l-5-5',
	CheckCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3',
	ArrowUp: 'm5 12 7-7 7 7 M12 19V5',
	ArrowDown: 'M12 5v14 m-7-7 7 7 7-7',
	Plus: 'M5 12h14 M12 5v14',
	Minus: 'M5 12h14',
	Zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
	Calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
	Clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
	Globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
	ShoppingCart: 'M9 2 1 9l8 7 M1 9l3 9h15a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-5',
	Package: 'm16.5 9.4-9-5.19 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96 12 12.01l8.73-5.05 M12 22.08V12',
	Briefcase: 'M5 21h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3',
	CreditCard: 'M3 10h18M3 6h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M7 15h.01',
	Smile: 'M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
};

// Icon component for rendering SVG
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
		<div className="ria-stat-icon-picker">
			<TextControl
				placeholder={__('Search icons...', 'ria-stat')}
				value={searchTerm}
				onChange={setSearchTerm}
				autoComplete="off"
			/>
			<div className="ria-stat-icon-picker__grid">
				{filteredIcons.map((iconName) => (
					<Button
						key={iconName}
						className={`ria-stat-icon-picker__button ${
							value === iconName ? 'is-selected' : ''
						}`}
						onClick={() => onChange(iconName)}
						title={iconName}
					>
						<Icon name={iconName} size={20} strokeWidth={2} />
						<span className="ria-stat-icon-picker__name">{iconName}</span>
					</Button>
				))}
				{filteredIcons.length === 0 && (
					<p className="ria-stat-icon-picker__no-results">
						{__('No icons found.', 'ria-stat')}
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
			value,
			label,
			valueColor,
			labelColor,
			valueFontSize,
			labelFontSize,
			animateValue,
			showIcon,
			iconName,
			iconSize,
			iconColor,
			iconPosition,
		} = attributes;

		const groupStyle = context['ria/statsGroupStyle'] || 'default';
		const groupAlignment = context['ria/statsGroupAlignment'] || 'center';

		const blockProps = useBlockProps({
			className: `ria-stat align-${groupAlignment} icon-${iconPosition} ${attributes.variant && attributes.variant !== 'custom' ? `has-${attributes.variant}-variant` : ''} ${attributes.variant === 'custom' ? 'has-custom-colors' : ''}`,
			style: {
				'--value-color': valueColor || undefined,
				'--label-color': labelColor || undefined,
				'--value-font-size': `${valueFontSize}px`,
				'--label-font-size': `${labelFontSize}px`,
				'--icon-color': iconColor || undefined,
				'--icon-size': `${iconSize}px`,
				...(attributes.variant === 'custom' ? {
					color: attributes.customColor,
					backgroundColor: attributes.customBackgroundColor,
					borderColor: attributes.customBorderColor
				} : {})
			},
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Color Settings', 'ria-stat')} initialOpen={true}>
						<SelectControl
							label={__('Color Variant', 'ria-stat')}
							value={attributes.variant || 'default'}
							options={[
								{ label: __('Default', 'ria-stat'), value: 'default' },
								{ label: __('Primary', 'ria-stat'), value: 'primary' },
								{ label: __('Secondary', 'ria-stat'), value: 'secondary' },
								{ label: __('Accent', 'ria-stat'), value: 'accent' },
								{ label: __('Neutral', 'ria-stat'), value: 'neutral' },
								{ label: __('Custom', 'ria-stat'), value: 'custom' }
							]}
							onChange={(value) => setAttributes({ variant: value })}
							help={__('Select a predefined color scheme or use custom colors', 'ria-stat')}
						/>
					</PanelBody>

					{(attributes.variant === 'custom') && (
						<PanelColorSettings
							title={__('Custom Colors', 'ria-stat')}
							colorSettings={[
								{
									value: attributes.customColor,
									onChange: (value) => setAttributes({ customColor: value }),
									label: __('Text Color', 'ria-stat')
								},
								{
									value: attributes.customBackgroundColor,
									onChange: (value) => setAttributes({ customBackgroundColor: value }),
									label: __('Background Color', 'ria-stat')
								},
								{
									value: attributes.customBorderColor,
									onChange: (value) => setAttributes({ customBorderColor: value }),
									label: __('Border Color', 'ria-stat')
								}
							]}
						/>
					)}

					<PanelBody title={__('Content Settings', 'ria-stat')} initialOpen={false}>
						<RangeControl
							label={__('Value Font Size', 'ria-stat')}
							value={valueFontSize}
							onChange={(newSize) => setAttributes({ valueFontSize: newSize })}
							min={24}
							max={120}
							step={4}
						/>
						<RangeControl
							label={__('Label Font Size', 'ria-stat')}
							value={labelFontSize}
							onChange={(newSize) => setAttributes({ labelFontSize: newSize })}
							min={12}
							max={48}
							step={2}
						/>
					</PanelBody>

					<PanelBody title={__('Icon Settings', 'ria-stat')} initialOpen={false}>
						<ToggleControl
							label={__('Show Icon', 'ria-stat')}
							checked={showIcon}
							onChange={(value) => setAttributes({ showIcon: value })}
						/>
						{showIcon && (
							<VStack spacing={3}>
								<Dropdown
									contentClassName="ria-stat-icon-picker__dropdown"
									popoverProps={{ placement: 'left-start' }}
									renderToggle={({ isOpen, onToggle }) => (
										<Button
											onClick={onToggle}
											aria-expanded={isOpen}
											variant="secondary"
											className="ria-stat-icon-picker__toggle"
										>
											<Icon name={iconName} size={24} strokeWidth={2} />
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
									label={__('Icon Size', 'ria-stat')}
									value={iconSize}
									onChange={(newSize) => setAttributes({ iconSize: newSize })}
									min={16}
									max={80}
									step={4}
								/>
								<SelectControl
									label={__('Icon Position', 'ria-stat')}
									value={iconPosition}
									options={[
										{ label: __('Top', 'ria-stat'), value: 'top' },
										{ label: __('Left of Value', 'ria-stat'), value: 'left' },
									]}
									onChange={(newPosition) =>
										setAttributes({ iconPosition: newPosition })
									}
								/>
							</VStack>
						)}
					</PanelBody>

					<PanelBody title={__('Colors', 'ria-stat')} initialOpen={false}>
						<p>
							<strong>{__('Value Color', 'ria-stat')}</strong>
						</p>
						<ColorPalette
							value={valueColor}
							onChange={(color) => setAttributes({ valueColor: color })}
						/>
						<p>
							<strong>{__('Label Color', 'ria-stat')}</strong>
						</p>
						<ColorPalette
							value={labelColor}
							onChange={(color) => setAttributes({ labelColor: color })}
						/>
						{showIcon && (
							<>
								<p>
									<strong>{__('Icon Color', 'ria-stat')}</strong>
								</p>
								<ColorPalette
									value={iconColor}
									onChange={(color) => setAttributes({ iconColor: color })}
								/>
							</>
						)}
					</PanelBody>

					<PanelBody title={__('Animation', 'ria-stat')} initialOpen={false}>
						<ToggleControl
							label={__('Animate Value', 'ria-stat')}
							checked={animateValue}
							onChange={(value) => setAttributes({ animateValue: value })}
							help={__(
								'Animate counting up when the stat enters the viewport',
								'ria-stat'
							)}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{showIcon && iconPosition === 'top' && (
						<div className="stat-icon">
							<Icon
								name={iconName}
								size={iconSize}
								color={iconColor || valueColor}
								strokeWidth={2}
							/>
						</div>
					)}
					<div
						className="stat-value-wrapper"
						style={{
							display: iconPosition === 'left' && showIcon ? 'flex' : 'block',
							alignItems: 'center',
							gap: '8px',
						}}
					>
						{showIcon && iconPosition === 'left' && (
							<div className="stat-icon">
								<Icon
									name={iconName}
									size={iconSize}
									color={iconColor || valueColor}
									strokeWidth={2}
								/>
							</div>
						)}
						<RichText
							tagName="div"
							className="stat-value"
							value={value}
							onChange={(newValue) => setAttributes({ value: newValue })}
							placeholder={__('100+', 'ria-stat')}
							allowedFormats={[]}
						/>
					</div>
					<RichText
						tagName="div"
						className="stat-label"
						value={label}
						onChange={(newLabel) => setAttributes({ label: newLabel })}
						placeholder={__('Stat Label', 'ria-stat')}
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const {
			value,
			label,
			valueColor,
			labelColor,
			valueFontSize,
			labelFontSize,
			animateValue,
			showIcon,
			iconName,
			iconSize,
			iconColor,
			iconPosition,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `ria-stat icon-${iconPosition} ${attributes.variant && attributes.variant !== 'custom' ? `has-${attributes.variant}-variant` : ''} ${attributes.variant === 'custom' ? 'has-custom-colors' : ''}`,
			style: {
				'--value-color': valueColor || undefined,
				'--label-color': labelColor || undefined,
				'--value-font-size': `${valueFontSize}px`,
				'--label-font-size': `${labelFontSize}px`,
				'--icon-color': iconColor || undefined,
				'--icon-size': `${iconSize}px`,
				...(attributes.variant === 'custom' ? {
					color: attributes.customColor,
					backgroundColor: attributes.customBackgroundColor,
					borderColor: attributes.customBorderColor
				} : {})
			},
			'data-animate': animateValue,
		});

		return (
			<div {...blockProps}>
				{showIcon && iconPosition === 'top' && (
					<div className="stat-icon">
						<Icon
							name={iconName}
							size={iconSize}
							color={iconColor || valueColor}
							strokeWidth={2}
						/>
					</div>
				)}
				<div
					className="stat-value-wrapper"
					style={{
						display: iconPosition === 'left' && showIcon ? 'flex' : 'block',
						alignItems: 'center',
						gap: '8px',
					}}
				>
					{showIcon && iconPosition === 'left' && (
						<div className="stat-icon">
							<Icon
								name={iconName}
								size={iconSize}
								color={iconColor || valueColor}
								strokeWidth={2}
							/>
						</div>
					)}
					<RichText.Content tagName="div" className="stat-value" value={value} />
				</div>
				<RichText.Content tagName="div" className="stat-label" value={label} />
			</div>
		);
	},
});
