/**
 * RIA Tooltip Block
 *
 * Display contextual information on hover or focus
 */

import './style.scss';
import './editor.scss';

import { registerBlockType } from '@wordpress/blocks';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	PanelColorSettings
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	ToggleControl,
	RangeControl,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Edit Component
 */
function Edit( { attributes, setAttributes } ) {
	const {
		tooltipText,
		position,
		align,
		showArrow,
		delayDuration,
		colorScheme,
		sideOffset,
		maxWidth,
		ariaLabel,
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor
	} = attributes;

	const blockProps = useBlockProps( {
		className: `tooltip-wrapper position-${position} scheme-${colorScheme} ${variant && variant !== 'custom' ? `has-${variant}-variant` : ''} ${variant === 'custom' ? 'has-custom-colors' : ''}`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Tooltip Settings', 'riapress' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Tooltip Text', 'riapress' ) }
						value={ tooltipText }
						onChange={ ( value ) => setAttributes( { tooltipText: value } ) }
						help={ __( 'Text to display in the tooltip', 'riapress' ) }
					/>

					<SelectControl
						label={ __( 'Position', 'riapress' ) }
						value={ position }
						options={ [
							{ label: 'Top', value: 'top' },
							{ label: 'Right', value: 'right' },
							{ label: 'Bottom', value: 'bottom' },
							{ label: 'Left', value: 'left' },
						] }
						onChange={ ( value ) => setAttributes( { position: value } ) }
						help={ __( 'Where the tooltip appears relative to the trigger', 'riapress' ) }
					/>

					<SelectControl
						label={ __( 'Alignment', 'riapress' ) }
						value={ align }
						options={ [
							{ label: 'Start', value: 'start' },
							{ label: 'Center', value: 'center' },
							{ label: 'End', value: 'end' },
						] }
						onChange={ ( value ) => setAttributes( { align: value } ) }
						help={ __( 'Alignment along the edge', 'riapress' ) }
					/>

					<RangeControl
						label={ __( 'Distance from Trigger (px)', 'riapress' ) }
						value={ sideOffset }
						onChange={ ( value ) => setAttributes( { sideOffset: value } ) }
						min={ 0 }
						max={ 50 }
						step={ 1 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Appearance', 'riapress' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Color Variant', 'riapress' ) }
						value={ variant || 'default' }
						options={ [
							{ label: __('Default', 'riapress'), value: 'default' },
							{ label: __('Primary', 'riapress'), value: 'primary' },
							{ label: __('Secondary', 'riapress'), value: 'secondary' },
							{ label: __('Accent', 'riapress'), value: 'accent' },
							{ label: __('Neutral', 'riapress'), value: 'neutral' },
							{ label: __('Custom', 'riapress'), value: 'custom' }
						] }
						onChange={ ( value ) => setAttributes( { variant: value } ) }
						help={ __( 'Select a predefined color scheme or use custom colors', 'riapress' ) }
					/>

					<SelectControl
						label={ __( 'Color Scheme (Legacy)', 'riapress' ) }
						value={ colorScheme }
						options={ [
							{ label: 'Dark', value: 'dark' },
							{ label: 'Light', value: 'light' },
						] }
						onChange={ ( value ) => setAttributes( { colorScheme: value } ) }
					/>

					<ToggleControl
						label={ __( 'Show Arrow', 'riapress' ) }
						checked={ showArrow }
						onChange={ ( value ) => setAttributes( { showArrow: value } ) }
					/>

					<TextControl
						label={ __( 'Max Width', 'riapress' ) }
						value={ maxWidth }
						onChange={ ( value ) => setAttributes( { maxWidth: value } ) }
						help={ __( 'Maximum width of tooltip (e.g., 300px, 20rem)', 'riapress' ) }
					/>
				</PanelBody>

				{(variant === 'custom') && (
					<PanelColorSettings
						title={ __( 'Custom Colors', 'riapress' ) }
						colorSettings={ [
							{
								value: customColor,
								onChange: ( value ) => setAttributes( { customColor: value } ),
								label: __( 'Text Color', 'riapress' )
							},
							{
								value: customBackgroundColor,
								onChange: ( value ) => setAttributes( { customBackgroundColor: value } ),
								label: __( 'Background Color', 'riapress' )
							},
							{
								value: customBorderColor,
								onChange: ( value ) => setAttributes( { customBorderColor: value } ),
								label: __( 'Border Color', 'riapress' )
							}
						] }
					/>
				)}

				<PanelBody title={ __( 'Behavior', 'riapress' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Delay Duration (ms)', 'riapress' ) }
						value={ delayDuration }
						onChange={ ( value ) => setAttributes( { delayDuration: value } ) }
						min={ 0 }
						max={ 2000 }
						step={ 100 }
						help={ __( 'Wait time before showing tooltip', 'riapress' ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Accessibility', 'riapress' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'ARIA Label', 'riapress' ) }
						value={ ariaLabel }
						onChange={ ( value ) => setAttributes( { ariaLabel: value } ) }
						help={ __( 'Optional label for screen readers (overrides tooltip text)', 'riapress' ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="tooltip-trigger-wrapper">
					<div className="tooltip-trigger">
						<InnerBlocks
							allowedBlocks={ [ 'core/button', 'core/paragraph', 'core/heading', 'core/image', 'ria/button', 'ria/badge' ] }
							template={ [
								[ 'core/paragraph', { placeholder: 'Add trigger content (hover to see tooltip)' } ]
							] }
						/>
					</div>
					<div
						className={ `tooltip-content scheme-${colorScheme} position-${position} ${variant === 'custom' ? 'has-custom-colors' : ''}` }
						style={ variant === 'custom' ? {
							color: customColor,
							backgroundColor: customBackgroundColor,
							borderColor: customBorderColor
						} : {} }
					>
						{ showArrow && <span className="tooltip-arrow" /> }
						<span className="tooltip-text">{ tooltipText }</span>
					</div>
				</div>
				<div className="tooltip-preview-note" style={{
					fontSize: '12px',
					color: '#666',
					marginTop: '8px',
					fontStyle: 'italic'
				}}>
					💡 Tooltip: "{ tooltipText }" ({ position })
				</div>
			</div>
		</>
	);
}

/**
 * Save Component
 */
function Save( { attributes } ) {
	const {
		tooltipText,
		position,
		align,
		showArrow,
		delayDuration,
		colorScheme,
		sideOffset,
		maxWidth,
		ariaLabel,
		variant,
		customColor,
		customBackgroundColor,
		customBorderColor
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `tooltip-wrapper position-${position} scheme-${colorScheme} ${variant && variant !== 'custom' ? `has-${variant}-variant` : ''} ${variant === 'custom' ? 'has-custom-colors' : ''}`,
		'data-tooltip-config': JSON.stringify( {
			position,
			align,
			showArrow,
			delayDuration,
			sideOffset,
			maxWidth
		} )
	} );

	return (
		<div { ...blockProps }>
			<div className="tooltip-trigger"
				aria-describedby="tooltip-content"
				data-tooltip-trigger="true">
				<InnerBlocks.Content />
			</div>
			<div
				id="tooltip-content"
				className={ `tooltip-content scheme-${colorScheme} position-${position} ${variant === 'custom' ? 'has-custom-colors' : ''}` }
				role="tooltip"
				aria-label={ ariaLabel || tooltipText }
				data-position={ position }
				data-align={ align }
				style={{
					maxWidth: maxWidth,
					...(variant === 'custom' ? {
						color: customColor,
						backgroundColor: customBackgroundColor,
						borderColor: customBorderColor
					} : {})
				}}
			>
				{ showArrow && <span className="tooltip-arrow" data-position={ position } /> }
				<span className="tooltip-text">{ tooltipText }</span>
			</div>
		</div>
	);
}

/**
 * Register Block
 */
registerBlockType( 'ria/tooltip', {
	edit: Edit,
	save: Save,
} );
