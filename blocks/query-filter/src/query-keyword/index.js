import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import './style.scss';
import Edit from './edit';

// Register the block
registerBlockType(metadata.name, {
    edit: Edit,
}); 