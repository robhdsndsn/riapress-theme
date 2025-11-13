/**
 * RIA Quote Block
 *
 * Displays a styled quote with author attribution, image, and extensive styling options.
 */
import { registerBlockType } from '@wordpress/blocks';
import { Quote } from 'lucide-react';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

import './editor.scss';
import './style.scss';

registerBlockType(metadata.name, {
	...metadata,
	icon: <Quote />,
	edit: Edit,
	save: Save,
});
