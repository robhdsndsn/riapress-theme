import { _x } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { columns } = attributes;

	const onChangeColumns = ( newColumns ) => {
		setAttributes( { columns: newColumns } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<RangeControl
						label={ _x( 'Columns', 'Block - Cards', 'cards' ) }
						min={ 1 }
						max={ 6 }
						onChange={ onChangeColumns }
						value={ columns }
					/>
				</PanelBody>
			</InspectorControls>
			<div
				{ ...useBlockProps( {
					className: `has-${ columns }-columns`,
				} ) }
			>
				<div className="metrics">
					<InnerBlocks
						allowedBlocks={ [ 'zp/metric' ] }
						template={ [ [ 'zp/metric' ], [ 'zp/metric' ], [ 'zp/metric' ] ] }
						orientation="horizontal"
					/>
				</div> 
			</div>
		</>
	);
}
