import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
import metadata from './block.json';

// Lucide icon library - Alert/notification relevant icons
const iconLibrary = {
	Terminal: 'M4 17l6-6-6-6M12 19h8',
	AlertCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 8v4 M12 16h.01',
	CheckCircle2: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9 12l2 2 4-4',
	Info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01',
	XCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M15 9l-6 6 M9 9l6 6',
	AlertTriangle: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z M12 9v4 M12 17h.01',
	X: 'M18 6 6 18 M6 6l12 12',
};

// Icon component
const Icon = ({ name, size = 20, strokeWidth = 2, className = '' }) => {
	const pathData = iconLibrary[name];
	if (!pathData) return null;

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
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

// Get default icon for variant
const getDefaultIcon = (variant) => {
	const iconMap = {
		default: 'Terminal',
		destructive: 'AlertCircle',
		success: 'CheckCircle2',
		warning: 'AlertTriangle',
		info: 'Info',
	};
	return iconMap[variant] || 'Info';
};

// Edit component
function Edit({ attributes, setAttributes }) {
	const {
		variant,
		title,
		message,
		showIcon,
		iconName,
		isDismissible,
		borderRadius,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		customColor,
		customBackgroundColor,
		customBorderColor,
	} = attributes;

	const blockProps = useBlockProps({
		className: `ria-alert ria-alert-${variant} ${isDismissible ? 'is-dismissible' : ''} ${variant === 'custom' ? 'has-custom-colors' : ''} border-radius-${borderRadius}`,
		'data-animation': animationEnabled && animationType !== 'none' ? animationType : undefined,
		'data-duration': animationEnabled ? animationDuration / 1000 : undefined,
		'data-delay': animationEnabled ? animationDelay / 1000 : undefined,
		'data-easing': animationEnabled ? animationEasing : undefined,
		style: variant === 'custom' ? {
			color: customColor,
			backgroundColor: customBackgroundColor,
			borderColor: customBorderColor
		} : {}
	});

	const currentIcon = iconName === 'auto' ? getDefaultIcon(variant) : iconName;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Alert Settings', 'ria-notification')} initialOpen={true}>
					<VStack spacing={4}>
						<SelectControl
							label={__('Variant', 'ria-notification')}
							value={variant}
							options={[
								{ label: __('Default', 'ria-notification'), value: 'default' },
								{ label: __('Destructive', 'ria-notification'), value: 'destructive' },
								{ label: __('Success', 'ria-notification'), value: 'success' },
								{ label: __('Warning', 'ria-notification'), value: 'warning' },
								{ label: __('Info', 'ria-notification'), value: 'info' },
								{ label: __('Custom', 'ria-notification'), value: 'custom' },
							]}
							onChange={(value) => setAttributes({ variant: value })}
							help={__('Choose the alert type/severity or use custom colors', 'ria-notification')}
						/>

						<ToggleControl
							label={__('Show Icon', 'ria-notification')}
							checked={showIcon}
							onChange={(value) => setAttributes({ showIcon: value })}
						/>

						{showIcon && (
							<SelectControl
								label={__('Icon', 'ria-notification')}
								value={iconName}
								options={[
									{ label: __('Auto (based on variant)', 'ria-notification'), value: 'auto' },
									{ label: __('Terminal', 'ria-notification'), value: 'Terminal' },
									{ label: __('Alert Circle', 'ria-notification'), value: 'AlertCircle' },
									{ label: __('Check Circle', 'ria-notification'), value: 'CheckCircle2' },
									{ label: __('Info', 'ria-notification'), value: 'Info' },
									{ label: __('X Circle', 'ria-notification'), value: 'XCircle' },
									{ label: __('Alert Triangle', 'ria-notification'), value: 'AlertTriangle' },
								]}
								onChange={(value) => setAttributes({ iconName: value })}
							/>
						)}

						<ToggleControl
							label={__('Dismissible', 'ria-notification')}
							checked={isDismissible}
							onChange={(value) => setAttributes({ isDismissible: value })}
							help={__('Allow users to close this alert', 'ria-notification')}
						/>

						<SelectControl
							label={__('Border Radius', 'ria-notification')}
							value={borderRadius}
							options={[
								{ label: __('None', 'ria-notification'), value: 'none' },
								{ label: __('Small', 'ria-notification'), value: 'small' },
								{ label: __('Medium', 'ria-notification'), value: 'medium' },
								{ label: __('Large', 'ria-notification'), value: 'large' },
								{ label: __('Full', 'ria-notification'), value: 'full' },
							]}
							onChange={(value) => setAttributes({ borderRadius: value })}
						/>
					</VStack>
				</PanelBody>

				{variant === 'custom' && (
					<PanelColorSettings
						title={__('Custom Colors', 'ria-notification')}
						colorSettings={[
							{
								value: customColor,
								onChange: (value) => setAttributes({ customColor: value }),
								label: __('Text Color', 'ria-notification')
							},
							{
								value: customBackgroundColor,
								onChange: (value) => setAttributes({ customBackgroundColor: value }),
								label: __('Background Color', 'ria-notification')
							},
							{
								value: customBorderColor,
								onChange: (value) => setAttributes({ customBorderColor: value }),
								label: __('Border Color', 'ria-notification')
							}
						]}
					/>
				)}

				<PanelBody title={__('Animation Settings', 'ria-notification')} initialOpen={false}>
					<VStack spacing={4}>
						<ToggleControl
							label={__('Enable Animation', 'ria-notification')}
							checked={animationEnabled}
							onChange={(value) => setAttributes({ animationEnabled: value })}
						/>

						{animationEnabled && (
							<>
								<SelectControl
									label={__('Animation Type', 'ria-notification')}
									value={animationType}
									options={[
										{ label: __('None', 'ria-notification'), value: 'none' },
										{ label: __('Fade In', 'ria-notification'), value: 'fadeIn' },
										{ label: __('Fade In Up', 'ria-notification'), value: 'fadeInUp' },
										{ label: __('Fade In Down', 'ria-notification'), value: 'fadeInDown' },
										{ label: __('Fade In Left', 'ria-notification'), value: 'fadeInLeft' },
										{ label: __('Fade In Right', 'ria-notification'), value: 'fadeInRight' },
										{ label: __('Slide In Up', 'ria-notification'), value: 'slideInUp' },
										{ label: __('Slide In Down', 'ria-notification'), value: 'slideInDown' },
										{ label: __('Slide In Left', 'ria-notification'), value: 'slideInLeft' },
										{ label: __('Slide In Right', 'ria-notification'), value: 'slideInRight' },
										{ label: __('Zoom In', 'ria-notification'), value: 'zoomIn' },
									]}
									onChange={(value) => setAttributes({ animationType: value })}
								/>

								<RangeControl
									label={__('Duration (ms)', 'ria-notification')}
									value={animationDuration}
									onChange={(value) => setAttributes({ animationDuration: value })}
									min={100}
									max={2000}
									step={100}
								/>

								<RangeControl
									label={__('Delay (ms)', 'ria-notification')}
									value={animationDelay}
									onChange={(value) => setAttributes({ animationDelay: value })}
									min={0}
									max={2000}
									step={100}
								/>

								<SelectControl
									label={__('Easing', 'ria-notification')}
									value={animationEasing}
									options={[
										{ label: __('Linear', 'ria-notification'), value: 'linear' },
										{ label: __('Ease', 'ria-notification'), value: 'ease' },
										{ label: __('Ease In', 'ria-notification'), value: 'ease-in' },
										{ label: __('Ease Out', 'ria-notification'), value: 'ease-out' },
										{ label: __('Ease In Out', 'ria-notification'), value: 'ease-in-out' },
									]}
									onChange={(value) => setAttributes({ animationEasing: value })}
								/>
							</>
						)}
					</VStack>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{showIcon && (
					<div className="ria-alert-icon">
						<Icon name={currentIcon} size={20} />
					</div>
				)}

				<div className="ria-alert-content">
					{title && (
						<RichText
							tagName="div"
							className="ria-alert-title"
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder={__('Alert title (optional)', 'ria-notification')}
						/>
					)}

					<RichText
						tagName="div"
						className="ria-alert-description"
						value={message}
						onChange={(value) => setAttributes({ message: value })}
						placeholder={__('Alert message', 'ria-notification')}
					/>
				</div>

				{isDismissible && (
					<button className="ria-alert-dismiss" aria-label={__('Dismiss', 'ria-notification')}>
						<Icon name="X" size={16} />
					</button>
				)}
			</div>
		</>
	);
}

// Save component
function save({ attributes }) {
	const {
		variant,
		title,
		message,
		showIcon,
		iconName,
		isDismissible,
		borderRadius,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		customColor,
		customBackgroundColor,
		customBorderColor,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `ria-alert ria-alert-${variant} ${isDismissible ? 'is-dismissible' : ''} ${variant === 'custom' ? 'has-custom-colors' : ''} border-radius-${borderRadius}`,
		'data-animation': animationEnabled && animationType !== 'none' ? animationType : undefined,
		'data-duration': animationEnabled ? animationDuration / 1000 : undefined,
		'data-delay': animationEnabled ? animationDelay / 1000 : undefined,
		'data-easing': animationEnabled ? animationEasing : undefined,
		style: variant === 'custom' ? {
			color: customColor,
			backgroundColor: customBackgroundColor,
			borderColor: customBorderColor
		} : {}
	});

	const currentIcon = iconName === 'auto' ? getDefaultIcon(variant) : iconName;

	return (
		<div {...blockProps}>
			{showIcon && (
				<div className="ria-alert-icon">
					<Icon name={currentIcon} size={20} />
				</div>
			)}

			<div className="ria-alert-content">
				{title && (
					<RichText.Content tagName="div" className="ria-alert-title" value={title} />
				)}

				<RichText.Content tagName="div" className="ria-alert-description" value={message} />
			</div>

			{isDismissible && (
				<button className="ria-alert-dismiss" aria-label={__('Dismiss', 'ria-notification')}>
					<Icon name="X" size={16} />
				</button>
			)}
		</div>
	);
}

// Register block
registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
