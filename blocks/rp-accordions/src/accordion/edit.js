import { _x } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";

export default function Edit({ attributes, setAttributes, context, clientId }) {
	const { intro, headingLevel, fontSize, ariaControls, ariaLabelledby } = attributes;

	// Use parent's heading level from context if available, fallback to local attr or 3
	const headingLevelTagName = `h${context['zp/accordions/headingLevel'] || headingLevel || 3}`;

	// open all accordions by default from parent context
	const openAllByDefault = context['zp/accordions/openAllByDefault'];
	const [isActive, setIsActive] = useState(!!openAllByDefault);

	const blockProps = useBlockProps();

	// Apply font size coming from parent context
	useEffect(() => {
		const contextFontSize = context['zp/accordions/fontSize'];
		if (contextFontSize !== undefined) {
			setAttributes({ fontSize: contextFontSize });
		}
	}, [context['zp/accordions/fontSize'], setAttributes]);

	// Update local headingLevel attribute when parent context changes
	useEffect(() => {
		if (context['zp/accordions/headingLevel']) {
			setAttributes({ headingLevel: context['zp/accordions/headingLevel'] });
		}
	}, [context['zp/accordions/headingLevel'], setAttributes]);

	// Keep isActive synced to parent's openAllByDefault unless user toggles manually
	useEffect(() => {
		setIsActive(!!openAllByDefault);
	}, [openAllByDefault]);

	// Generate aria IDs if not present
	useEffect(() => {
		if (!ariaControls) {
			setAttributes({ ariaControls: `rp-accordion-aria-controls-${clientId}` });
		}
	}, [ariaControls, setAttributes, clientId]);

	useEffect(() => {
		if (!ariaLabelledby) {
			setAttributes({ ariaLabelledby: `rp-accordion-aria-labelledby-${clientId}` });
		}
	}, [ariaLabelledby, setAttributes, clientId]);

	const toggleAccordion = () => setIsActive(!isActive);

	// Use fontSize from attributes (which gets updated from parent context)
	const fontSizeStyle = fontSize ? { fontSize: fontSize } : undefined;

	return (
		<div {...useBlockProps()}>
			<div className={`accordion`}>
				<button
					aria-expanded={isActive}
					id={ariaLabelledby}
					aria-controls={ariaControls}
					className={`accordion-toggle ${isActive ? "is-active" : ""}`}
					style={fontSizeStyle}
				>
					<span className="accordion-icon" onClick={toggleAccordion} />
					<RichText
						placeholder={_x(
							"Enter accordion intro here…",
							"Block accordions - RichText",
							"accordions"
						)}
						className={`accordion-intro`}
						tagName={headingLevelTagName}
						allowedFormats={["core/bold", "core/italic"]}
						onChange={(value) => setAttributes({ intro: value })}
						value={intro}
						style={fontSizeStyle}
					/>
				</button>

				{intro && (
					<div
						className={`accordion-content ${isActive ? "is-active" : ""}`}
						id={ariaControls}
						role="region"
						aria-labelledby={ariaLabelledby}
					>
						<InnerBlocks
							allowedBlocks={[
								"core/buttons",
								"core/columns",
								"core/embed",
								"core/group",
								"core/heading",
								"core/html",
								"core/image",
								"core/list",
								"core/paragraph",
								"core/table",
							]}
							orientation="vertical"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
