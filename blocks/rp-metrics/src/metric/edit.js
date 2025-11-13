import { useState } from '@wordpress/element';
import { _x } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
	InspectorControls
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl
} from '@wordpress/components';

function Edit({ attributes, setAttributes }) {
	const { description, countUpAnimated, countUpStart, countUpEnd, countUpDuration, countUpPrefix, countUpSuffix, ariaLabel, ariaDescription } = attributes;

	const onChangeDescription = (newDescription) => {
		setAttributes({ description: newDescription });
	};

	const onChangeAriaLabel = (newAriaLabel) => {
		setAttributes({
			ariaLabel: newAriaLabel,
		});
	}

	const onChangeAriaDescription = (newAriaDescription) => {
		setAttributes({
			ariaDescription: newAriaDescription,
		});
	}

	// Metrics
	const onChangeCountUpAnimated = (newCountUpAnimated) => {
		setAttributes({
			countUpAnimated: newCountUpAnimated,
		});
	};

	const onChangeCountUpStart = (newCountUpStart) => {
		setAttributes({
			countUpStart: newCountUpStart,
		});
	};
	const onChangeCountUpEnd = (newCountUpEnd) => {
		setAttributes({
			countUpEnd: newCountUpEnd,
		});
	};

	const onChangeCountUpDuration = (newCountUpDuration) => {
		setAttributes({
			countUpDuration: newCountUpDuration,
		});
	};

	const onChangeCountUpPrefix = (newCountUpPrefix) => {
		setAttributes({
			countUpPrefix: newCountUpPrefix,
		});
	};

	const onChangeCountUpSuffix = (newCountUpSuffix) => {
		setAttributes({
			countUpSuffix: newCountUpSuffix,
		});
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={_x('Metric Settings', 'Block - Metric', 'metrics')}>
					<ToggleControl
						label="Is metric animated?"
						help={countUpAnimated ? "Yes" : "No"}
						checked={countUpAnimated}
						onChange={onChangeCountUpAnimated}
					/>
					{countUpAnimated ? (
						<>
							<TextControl
								label={_x('Prefix', 'Block - Metric', 'metrics')}
								onChange={onChangeCountUpPrefix}
								value={countUpPrefix}
							/>
							<TextControl
								label={_x('Suffix', 'Block - Metric', 'metrics')}
								onChange={onChangeCountUpSuffix}
								value={countUpSuffix}
							/>
							<TextControl
								label={_x('Count Starts', 'Block - Metric', 'metrics')}
								onChange={onChangeCountUpStart}
								value={countUpStart}
							/>
							<TextControl
								label={_x('Count Ends', 'Block - Metric', 'metrics')}
								onChange={onChangeCountUpEnd}
								value={countUpEnd}
							/>
							<TextControl
								label={_x('Duration', 'Block - Metric', 'metrics')}
								onChange={onChangeCountUpDuration}
								value={countUpDuration}
							/>
						</>
					) : null}
				</PanelBody>

				{countUpAnimated ? (
					<PanelBody title={_x('Accessibility Settings', 'Block - Metric', 'metric')}>
						<TextControl
							label={_x('Aria Label', 'Block - Metric', 'metric')}
							onChange={onChangeAriaLabel}
							value={ariaLabel}
						/>

						<TextControl
							label={_x('Aria Description', 'Block - Metric', 'metric')}
							onChange={onChangeAriaDescription}
							value={ariaDescription}
						/>
					</PanelBody>
				) : null}
			</InspectorControls>
			<div {...useBlockProps()}>
				<div className="content-container">
					<div id="count-up" className="counter">
						<RichText
							tagName="span"
							className="prefix"
							onChange={onChangeCountUpPrefix}
							value={countUpPrefix}
							allowedFormats={[]}
						/>
						<RichText
							placeholder={_x('1000', 'Block - Metric', 'metrics')}
							tagName="span"
							className="metric"
							onChange={onChangeCountUpEnd}
							value={countUpEnd}
							allowedFormats={[]}
						/>
						<RichText
							tagName="span"
							className="suffix"
							onChange={onChangeCountUpSuffix}
							value={countUpSuffix}
							allowedFormats={[]}
						/>
					</div>
					<RichText
						placeholder={_x('Description...', 'Block - Metric', 'metrics')}
						tagName="p"
						className="description"
						onChange={onChangeDescription}
						value={description}
						allowedFormats={["core/bold", "core/italic", "core/link"]}
					/>
				</div>
			</div>
		</>
	);
}

export default Edit;
