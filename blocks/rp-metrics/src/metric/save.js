import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const {
		countUpAnimated,
		countUpStart,
		countUpEnd,
		countUpDuration,
		countUpPrefix,
		countUpSuffix,
		description,
		ariaLabel,
		ariaDescription,
	} = attributes;

	const renderAriaDescription = countUpAnimated ? (ariaDescription || description) : null;

	return (
		<div {...useBlockProps.save()}>
			<div className="content-container">
				<div
					id={`count-up`}
					data-count-animated={countUpAnimated}
					data-count-start={countUpStart}
					data-count-end={countUpEnd}
					data-count-duration={countUpDuration}
					className="counter"
					{...(countUpAnimated && { 'aria-live': "polite" })}
					{...(ariaLabel && countUpAnimated ? { 'aria-label': ariaLabel } : {})}
					{...(renderAriaDescription ? { 'aria-describedby': "count-description" } : {})}
				>
					<RichText.Content className="prefix" tagName="span" value={countUpPrefix} />
					<RichText.Content className="metric" tagName="span" value={countUpEnd} />
					<RichText.Content className="suffix" tagName="span" value={countUpSuffix} />
				</div>
				{renderAriaDescription && (
					<span id="count-description" className="screen-reader-text">{renderAriaDescription}</span>
				)}
				{description && (
					<RichText.Content className="description" tagName="p" value={description} />
				)}
			</div>
		</div>
	);
}
