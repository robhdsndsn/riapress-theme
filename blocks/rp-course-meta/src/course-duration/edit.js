import { _x } from "@wordpress/i18n";
import { useEntityProp } from "@wordpress/core-data";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl, ToggleControl } from "@wordpress/components";
import "./editor.scss";

export default function Edit({ attributes, setAttributes, context: { postType, postId } }) {
	const { label, showLabel } = attributes;

	// Restrict behavior to Course post type; Site Editor may lack post context.
	const hasPostContext = postType && postId;
	const isCourse = hasPostContext && postType === "course";

	const [meta] = hasPostContext
		? useEntityProp("postType", postType, "meta", postId)
		: [{}, () => {}];

	const duration = meta && meta._rp_course_time ? meta._rp_course_time : "";

	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={_x("Course Duration Settings", "Course Meta - Panel title", "course-meta")}>
					<TextControl
						label={_x("Label", "Course Meta - Label field", "course-meta")}
						value={label}
						onChange={(value) => setAttributes({ label: value })}
					/>
					<ToggleControl
						label={_x("Show Label", "Course Meta - Toggle", "course-meta")}
						checked={!!showLabel}
						onChange={(value) => setAttributes({ showLabel: !!value })}
					/>
				</PanelBody>
			</InspectorControls>

			{isCourse && duration ? (
				<div className="wp-block-rp-course-duration">
					<span className={`wp-block-rp-course-duration__label ${showLabel ? "" : "screen-reader-text"}`}>
						{label}
					</span>{" "}
					<span className="wp-block-rp-course-duration__value">{duration}</span>
				</div>
			) : (
				<span className="wp-block-rp-course-duration__placeholder">
					{_x("Course Duration", "Course duration placeholder", "course-meta")}
				</span>
			)}
		</div>
	);
}
