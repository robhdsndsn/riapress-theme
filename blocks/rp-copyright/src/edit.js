import { _x } from "@wordpress/i18n";
import { useBlockProps, InspectorControls, PanelColorSettings } from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
	const {
		siteTitle,
		fontSizeClass,
		variant = 'default',
		customColor,
		customBackgroundColor,
		customBorderColor,
	} = attributes;
	const currentYear = new Date().getFullYear();

	const siteInfo = wp.data.select("core").getSite();
	if (siteInfo && siteInfo.title) {
		setAttributes({ siteTitle: siteInfo.title });
	}

	const onChangeFontSizeClass = (newFontSizeClass) => {
		setAttributes({ fontSizeClass: newFontSizeClass });
	};

	console.log(siteTitle);

	const classes = ['wp-block-rp-copyright', fontSizeClass];
	if (variant !== 'default') {
		classes.push(`has-${variant}-variant`);
	}
	if (variant === 'custom' && (customColor || customBackgroundColor || customBorderColor)) {
		classes.push('has-custom-colors');
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={_x(
					"Color Settings",
					"Block copyright - Panel body title",
					"copyright")} initialOpen={false}>
					<SelectControl
						label={_x("Color Variant", "Block copyright - Select control", "copyright")}
						value={variant}
						options={[
							{ label: _x("Default", "Block copyright - Select control", "copyright"), value: "default" },
							{ label: _x("Primary", "Block copyright - Select control", "copyright"), value: "primary" },
							{ label: _x("Secondary", "Block copyright - Select control", "copyright"), value: "secondary" },
							{ label: _x("Accent", "Block copyright - Select control", "copyright"), value: "accent" },
							{ label: _x("Neutral", "Block copyright - Select control", "copyright"), value: "neutral" },
							{ label: _x("Custom", "Block copyright - Select control", "copyright"), value: "custom" }
						]}
						onChange={(value) => setAttributes({ variant: value })}
					/>
				</PanelBody>

				{variant === 'custom' && (
					<PanelColorSettings
						title={_x("Custom Colors", "Block copyright - Panel title", "copyright")}
						colorSettings={[
							{
								value: customColor,
								onChange: (value) => setAttributes({ customColor: value }),
								label: _x("Text Color", "Block copyright - Color label", "copyright")
							},
							{
								value: customBackgroundColor,
								onChange: (value) => setAttributes({ customBackgroundColor: value }),
								label: _x("Background Color", "Block copyright - Color label", "copyright")
							},
							{
								value: customBorderColor,
								onChange: (value) => setAttributes({ customBorderColor: value }),
								label: _x("Border Color", "Block copyright - Color label", "copyright")
							}
						]}
					/>
				)}

				<PanelBody title={_x(
					"Typography",
					"Block address - Panel body title",
					"copyright")}>
					<SelectControl
						label="Font Size"
						value={fontSizeClass}
						options={[
							{
								label: _x(
									"Small",
									"Block copyright - Select control",
									"copyright"),
								value: "has-small-font-size",
							},
							{
								label: _x(
									"Medium",
									"Block copyright - Select control",
									"copyright"),
								value: "has-medium-font-size",
							},
							// ... other size options
						]}
						onChange={onChangeFontSizeClass}
					/>
				</PanelBody>
			</InspectorControls>
			<p {...useBlockProps({
				className: classes.join(' '),
				style: variant === 'custom' ? {
					'--custom-color': customColor || undefined,
					'--custom-background-color': customBackgroundColor || undefined,
					'--custom-border-color': customBorderColor || undefined,
				} : {},
			})}>
				<span className="current-year">@ {currentYear}</span>{" "}
				<span className="site-name">{siteTitle}</span>
			</p>
		</>
	);
}
