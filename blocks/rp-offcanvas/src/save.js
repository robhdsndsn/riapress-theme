import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

export default function Save({ attributes }) {
	const {
		variant = 'default',
		customColor,
		customBackgroundColor,
		customBorderColor,
	} = attributes;

	const classes = ['wp-block-rp-offcanvas'];
	if (variant !== 'default') {
		classes.push(`has-${variant}-variant`);
	}
	if (variant === 'custom' && (customColor || customBackgroundColor || customBorderColor)) {
		classes.push('has-custom-colors');
	}

	return (
		<div {...useBlockProps.save({
			className: classes.join(' '),
			style: variant === 'custom' ? {
				'--custom-color': customColor || undefined,
				'--custom-background-color': customBackgroundColor || undefined,
				'--custom-border-color': customBorderColor || undefined,
			} : {},
		})}>
			<InnerBlocks.Content />
		</div>
	);
}