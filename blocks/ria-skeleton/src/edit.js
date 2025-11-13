import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RadioControl, RangeControl, SelectControl, ToggleControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Import skeleton components
import {
	SkeletonText,
	SkeletonImage,
	SkeletonAvatar,
	SkeletonButton,
	SkeletonCard,
} from '../../../components/skeletons';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const {
		skeletonType,
		lines,
		width,
		height,
		aspectRatio,
		size,
		showImage,
		showButton,
		layout,
		count,
		animationType,
		animationDelay,
		borderRadius,
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor,
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

	const blockProps = useBlockProps({
		className: `ria-skeleton-loader ${variantClass} ${customColorClass}`.trim(),
		'data-animation': animationType,
		'data-delay': animationDelay,
		style: { ...customStyles, borderRadius: borderRadius ? `${borderRadius}px` : undefined },
	});

	// Render skeleton based on type
	const renderSkeleton = (index = 0) => {
		const key = `skeleton-${index}`;

		switch (skeletonType) {
			case 'text':
				return <SkeletonText key={key} lines={lines} size={size} />;
			case 'image':
				return <SkeletonImage key={key} aspectRatio={aspectRatio} height={height} />;
			case 'avatar':
				return <SkeletonAvatar key={key} size={size} />;
			case 'button':
				return <SkeletonButton key={key} size={size} width={width} />;
			case 'card':
				return (
					<SkeletonCard
						key={key}
						showImage={showImage}
						showButton={showButton}
						layout={layout}
					/>
				);
			default:
				return <SkeletonCard key={key} />;
		}
	};

	// Render multiple instances based on count
	const renderSkeletons = () => {
		const skeletons = [];
		for (let i = 0; i < count; i++) {
			skeletons.push(renderSkeleton(i));
		}
		return skeletons;
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Skeleton Type', 'ria-skeleton')} initialOpen={true}>
					<RadioControl
						label={__('Type', 'ria-skeleton')}
						selected={skeletonType}
						options={[
							{ label: __('Text', 'ria-skeleton'), value: 'text' },
							{ label: __('Image', 'ria-skeleton'), value: 'image' },
							{ label: __('Avatar', 'ria-skeleton'), value: 'avatar' },
							{ label: __('Button', 'ria-skeleton'), value: 'button' },
							{ label: __('Card', 'ria-skeleton'), value: 'card' },
						]}
						onChange={(value) => setAttributes({ skeletonType: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Type Settings', 'ria-skeleton')} initialOpen={true}>
					{skeletonType === 'text' && (
						<>
							<RangeControl
								label={__('Lines', 'ria-skeleton')}
								value={lines}
								onChange={(value) => setAttributes({ lines: value })}
								min={1}
								max={10}
								help={__('Number of text lines to show', 'ria-skeleton')}
							/>
							<SelectControl
								label={__('Size', 'ria-skeleton')}
								value={size}
								options={[
									{ label: __('Small', 'ria-skeleton'), value: 'small' },
									{ label: __('Medium', 'ria-skeleton'), value: 'medium' },
									{ label: __('Large', 'ria-skeleton'), value: 'large' },
									{ label: __('X-Large', 'ria-skeleton'), value: 'xlarge' },
								]}
								onChange={(value) => setAttributes({ size: value })}
							/>
						</>
					)}

					{skeletonType === 'image' && (
						<>
							<TextControl
								label={__('Aspect Ratio', 'ria-skeleton')}
								value={aspectRatio}
								onChange={(value) => setAttributes({ aspectRatio: value })}
								help={__('e.g., 16/9, 4/3, 1/1', 'ria-skeleton')}
							/>
							<TextControl
								label={__('Height', 'ria-skeleton')}
								value={height}
								onChange={(value) => setAttributes({ height: value })}
								help={__('e.g., 200px, auto', 'ria-skeleton')}
							/>
						</>
					)}

					{skeletonType === 'avatar' && (
						<SelectControl
							label={__('Size', 'ria-skeleton')}
							value={size}
							options={[
								{ label: __('Small', 'ria-skeleton'), value: 'small' },
								{ label: __('Medium', 'ria-skeleton'), value: 'medium' },
								{ label: __('Large', 'ria-skeleton'), value: 'large' },
								{ label: __('X-Large', 'ria-skeleton'), value: 'xlarge' },
							]}
							onChange={(value) => setAttributes({ size: value })}
						/>
					)}

					{skeletonType === 'button' && (
						<>
							<SelectControl
								label={__('Size', 'ria-skeleton')}
								value={size}
								options={[
									{ label: __('Small', 'ria-skeleton'), value: 'small' },
									{ label: __('Medium', 'ria-skeleton'), value: 'medium' },
									{ label: __('Large', 'ria-skeleton'), value: 'large' },
									{ label: __('X-Large', 'ria-skeleton'), value: 'xlarge' },
								]}
								onChange={(value) => setAttributes({ size: value })}
							/>
							<TextControl
								label={__('Width', 'ria-skeleton')}
								value={width}
								onChange={(value) => setAttributes({ width: value })}
								help={__('e.g., 100px, 50%', 'ria-skeleton')}
							/>
						</>
					)}

					{skeletonType === 'card' && (
						<>
							<ToggleControl
								label={__('Show Image', 'ria-skeleton')}
								checked={showImage}
								onChange={(value) => setAttributes({ showImage: value })}
							/>
							<ToggleControl
								label={__('Show Button', 'ria-skeleton')}
								checked={showButton}
								onChange={(value) => setAttributes({ showButton: value })}
							/>
							<SelectControl
								label={__('Layout', 'ria-skeleton')}
								value={layout}
								options={[
									{ label: __('Vertical', 'ria-skeleton'), value: 'vertical' },
									{ label: __('Horizontal', 'ria-skeleton'), value: 'horizontal' },
								]}
								onChange={(value) => setAttributes({ layout: value })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Display Settings', 'ria-skeleton')} initialOpen={false}>
					<RangeControl
						label={__('Count', 'ria-skeleton')}
						value={count}
						onChange={(value) => setAttributes({ count: value })}
						min={1}
						max={10}
						help={__('Number of skeleton instances to display', 'ria-skeleton')}
					/>
				</PanelBody>

				<PanelBody title={__('Color Settings', 'riapress')} initialOpen={false}>
					<SelectControl
						label={__('Color Variant', 'riapress')}
						value={variant || 'default'}
						options={[
							{ label: __('Default', 'riapress'), value: 'default' },
							{ label: __('Primary', 'riapress'), value: 'primary' },
							{ label: __('Secondary', 'riapress'), value: 'secondary' },
							{ label: __('Accent', 'riapress'), value: 'accent' },
							{ label: __('Neutral', 'riapress'), value: 'neutral' },
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
			</InspectorControls>

			<div {...blockProps}>
				{renderSkeletons()}
			</div>
		</>
	);
}
