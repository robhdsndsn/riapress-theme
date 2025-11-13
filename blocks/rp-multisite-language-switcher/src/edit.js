import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings
} from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import ServerSideRender from '@wordpress/server-side-render';

import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
	const {
		variant = 'default',
		customColor,
		customBackgroundColor,
		customBorderColor,
	} = attributes;

	const classes = ['wp-block-rp-multisite-language-switcher'];
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
				<ServerSideRender block="zp/multisite-language-switcher" />
			</div>
		</>
	);
}

