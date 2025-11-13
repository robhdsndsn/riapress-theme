import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { intro, headingLevel } = attributes;
	const headingLevelTagName = `h${headingLevel}`;

	// Return null so the block is rendered server-side via render.php
	return <InnerBlocks.Content />;
}
