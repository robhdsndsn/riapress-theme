import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, Button, TextControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import * as Icons from '../../../shared/icons';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const {
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor,
		items,
		separator,
		separatorIcon,
		showHome,
		fontSize,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		animateOnScroll,
		staggerDelay,
	} = attributes;

	// Icon mapping - predefined set of common separator icons
	const iconMap = {
		'ChevronRight': ChevronRight,
		'ChevronLeft': ChevronLeft,
		'ArrowRight': ArrowRight,
		'Minus': Minus,
		'Circle': Circle,
		'Plus': Plus,
	};

	// Color variant classes
	const variantClass = variant && variant !== 'custom' ? `has-${variant}-variant` : '';
	const customColorClass = variant === 'custom' ? 'has-custom-colors' : '';

	// Custom color styles
	const customStyles = variant === 'custom' ? {
		color: customColor,
		backgroundColor: customBackgroundColor,
		borderColor: customBorderColor,
	} : {};

	const blockProps = useBlockProps({
		className: `ria-breadcrumb font-size-${fontSize} ${variantClass} ${customColorClass}`.trim(),
		'data-animation': animationType,
		'data-duration': animationDuration,
		'data-delay': animationDelay,
		'data-easing': animationEasing,
		'data-animate-on-scroll': animateOnScroll,
		'data-stagger-delay': staggerDelay,
		style: customStyles,
	});

	const updateItem = (index, field, value) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		setAttributes({ items: newItems });
	};

	const addItem = () => {
		setAttributes({ items: [...items, { label: 'New Item', url: '' }] });
	};

	const removeItem = (index) => {
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
	};

	// Get separator icon if specified
	const SeparatorIcon = separatorIcon && iconMap[separatorIcon] ? iconMap[separatorIcon] : null;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Breadcrumb Items', 'riapress')} initialOpen={true}>
					{items.map((item, index) => (
						<div key={index} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
							<TextControl
								label={__('Label', 'riapress')}
								value={item.label}
								onChange={(value) => updateItem(index, 'label', value)}
							/>
							<TextControl
								label={__('URL', 'riapress')}
								value={item.url}
								onChange={(value) => updateItem(index, 'url', value)}
								help={__('Leave empty for current page (not linked)', 'riapress')}
							/>
							<Button
								isDestructive
								isSmall
								onClick={() => removeItem(index)}
							>
								{__('Remove Item', 'riapress')}
							</Button>
						</div>
					))}
					<Button isPrimary onClick={addItem}>
						{__('Add Item', 'riapress')}
					</Button>
				</PanelBody>

				<PanelBody title={__('Appearance', 'riapress')} initialOpen={true}>
					<SelectControl
						label={__('Separator', 'riapress')}
						value={separator}
						options={[
							{ label: '/', value: '/' },
							{ label: '>', value: '>' },
							{ label: '›', value: '›' },
							{ label: '»', value: '»' },
							{ label: '•', value: '•' },
							{ label: '-', value: '-' },
						]}
						onChange={(value) => setAttributes({ separator: value })}
					/>
					<TextControl
						label={__('Separator Icon (Lucide)', 'riapress')}
						value={separatorIcon}
						onChange={(value) => setAttributes({ separatorIcon: value })}
						help={__('Overrides text separator. e.g., ChevronRight', 'riapress')}
					/>
					<SelectControl
						label={__('Font Size', 'riapress')}
						value={fontSize}
						options={[
							{ label: __('Small', 'riapress'), value: 'small' },
							{ label: __('Medium', 'riapress'), value: 'medium' },
							{ label: __('Large', 'riapress'), value: 'large' },
						]}
						onChange={(value) => setAttributes({ fontSize: value })}
					/>
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
							{ label: __('Slide Left', 'riapress'), value: 'slideLeft' },
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
							<ToggleControl
								label={__('Animate on Scroll', 'riapress')}
								checked={animateOnScroll}
								onChange={(value) => setAttributes({ animateOnScroll: value })}
							/>
							<RangeControl
								label={__('Stagger Delay (seconds)', 'riapress')}
								value={staggerDelay}
								onChange={(value) => setAttributes({ staggerDelay: value })}
								min={0}
								max={1}
								step={0.05}
								help={__('Delay between each breadcrumb item', 'riapress')}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<nav {...blockProps} aria-label={__('Breadcrumb', 'riapress')}>
				<ol className="ria-breadcrumb-list">
					{items.map((item, index) => (
						<li key={index} className="ria-breadcrumb-item">
							{item.url ? (
								<a href={item.url} className="ria-breadcrumb-link">{item.label}</a>
							) : (
								<span className="ria-breadcrumb-current">{item.label}</span>
							)}
							{index < items.length - 1 && (
								<span className="ria-breadcrumb-separator" aria-hidden="true">
									{SeparatorIcon ? (
										<SeparatorIcon size={14} />
									) : (
										separator
									)}
								</span>
							)}
						</li>
					))}
				</ol>
			</nav>
		</>
	);
}
