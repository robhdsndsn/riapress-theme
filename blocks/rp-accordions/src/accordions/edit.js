import { _x } from "@wordpress/i18n";
import {
	useBlockProps,
	InnerBlocks,
	BlockControls,
	InspectorControls,
} from "@wordpress/block-editor";
import {
	ToolbarDropdownMenu,
	Icon,
	PanelBody,
	ToggleControl,
	FontSizePicker,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import "./editor.scss";
import metadata from "./block.json";

export default function Edit({ attributes, setAttributes }) {
	const { topSpacing, bottomSpacing, blockSpacing, headingLevel, openAllByDefault, fontSize } = attributes;

	const availableFontSizes = useSelect(
		(select) => select("core/block-editor").getSettings().fontSizes,
		[]
	);

	const onChangeHeadingLevel = (newLevel) => {
		setAttributes({ headingLevel: newLevel });
	};

	const onChangeOpenAllByDefault = (value) => {
		setAttributes({ openAllByDefault: value });
	};

	const onFontSizeChange = (newFontSize) => {
		if (newFontSize === null || newFontSize === undefined) {
			// Reset to default fontSize from block.json
			setAttributes({
				fontSize: metadata.attributes.fontSize.default,
			});
		} else {
			setAttributes({
				fontSize: newFontSize,
			});
		}
	};

	return (
		<div {...useBlockProps()} >
			<>
				<BlockControls>
					<ToolbarDropdownMenu
						className="heading-level-dropdown"
						label="Heading level"
						icon={<Icon icon={() => `H${headingLevel}`} />}
						controls={[1, 2, 3, 4, 5, 6].map((level) => ({
							icon: <Icon icon={() => `H${level}`} />,
							isActive: headingLevel === level,
							onClick: () => onChangeHeadingLevel(level),
						}))}
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody title={_x('Accordion Settings', 'Accordions - Panel', 'rp-accordions')}>
						<ToggleControl
							label={_x('Open all accordions by default', 'Accordions - Label', 'rp-accordions')}
							checked={!!openAllByDefault}
							onChange={onChangeOpenAllByDefault}
						/>
					</PanelBody>
				</InspectorControls>


				<InspectorControls group="styles">
					<PanelBody title={_x('Typography', 'Accordions - Panel', 'rp-accordions')}>
						<FontSizePicker
							fontSizes={availableFontSizes}
							value={fontSize || undefined}
							onChange={onFontSizeChange}
						/>
					</PanelBody>
				</InspectorControls>
				<InnerBlocks
					allowedBlocks={["zp/accordion"]}
					template={[["zp/accordion"], ["zp/accordion"]]}
					headingLevel={`h3`}
				/>
			</>
		</div>
	);
}
