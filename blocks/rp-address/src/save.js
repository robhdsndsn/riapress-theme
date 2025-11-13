import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const {
		variant = 'default',
		customColor,
		customBackgroundColor,
		customBorderColor,
	} = attributes;

	// Build class names
	const classes = [];
	if (variant !== 'default') classes.push(`has-${variant}-variant`);
	if (variant === 'custom' && (customColor || customBackgroundColor || customBorderColor)) {
		classes.push('has-custom-colors');
	}

	const blockProps = useBlockProps.save({
		tagName: 'address',
		className: classes.join(' '),
		style: variant === 'custom' ? {
			'--custom-color': customColor || undefined,
			'--custom-background-color': customBackgroundColor || undefined,
			'--custom-border-color': customBorderColor || undefined,
		} : {},
	});

	return (
		<address {...blockProps}>
			<InnerBlocks.Content />
		</address>
	);
}
