/**
 * RIA Resource Card Block
 *
 * Displays a downloadable resource with thumbnail, file type icon, topics, and download/link button.
 */
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

import './editor.scss';
import './style.scss';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: Save
});
