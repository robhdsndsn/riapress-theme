import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		variant,
		customBackgroundColor,
		customBorderColor,
		number,
		label,
		description,
		numberColor,
		numberSize,
		prefix,
		suffix,
		textAlign,
		backgroundColor,
		showBackground,
		borderRadius,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		hoverAnimation,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `number-box text-align-${textAlign} hover-${hoverAnimation}`,
		style: {
			backgroundColor: showBackground ? backgroundColor : 'transparent',
			borderRadius: borderRadius + 'px',
			textAlign: textAlign,
		},
		'data-animation': animationEnabled ? animationType : '',
		'data-animation-duration': animationEnabled ? animationDuration : '',
		'data-animation-delay': animationEnabled ? animationDelay : '',
		'data-animation-easing': animationEnabled ? animationEasing : '',
	});

	return (
		<div {...blockProps}>
			<div className="number-box-inner">
				<div className="number-box-number" style={{ fontSize: numberSize + 'px', color: numberColor }}>
					{prefix && <span className="number-prefix">{prefix}</span>}
					<span className="number-value">{number}</span>
					{suffix && <span className="number-suffix">{suffix}</span>}
				</div>
				<div className="number-box-content">
					<RichText.Content
						tagName="h4"
						className="number-box-label"
						value={label}
					/>
					<RichText.Content
						tagName="p"
						className="number-box-description"
						value={description}
					/>
				</div>
			</div>
		</div>
	);
}
