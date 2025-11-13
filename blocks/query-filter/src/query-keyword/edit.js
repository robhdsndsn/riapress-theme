import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    ToggleControl,
    Placeholder
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes, context }) {
    const { label, showLabel, placeholder } = attributes;

    const hasQueryContext = context && context.queryId;
    const hasDefaultQueryTypeContext = context && context.query.inherit;

    if (!hasQueryContext) {
        return (
            <Placeholder
                instructions={__('This block must be inside a Query block to display the keyword search.', 'gregius-query-filter')}
            />
        );
    }
    if (hasDefaultQueryTypeContext) {
        return (
            <Placeholder
                label={__('Query Keyword - You must select Custom in Query Type for the "Query Loop" block', 'gregius-query-filter')}
            />
        );
    }

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Search Settings', 'gregius-query-filter')}>
                    <TextControl
                        label={__('Label', 'gregius-query-filter')}
                        value={label}
                        onChange={(label) => setAttributes({ label })}
                    />
                    <ToggleControl
                        label={__('Show Label', 'gregius-query-filter')}
                        checked={showLabel}
                        onChange={(showLabel) => setAttributes({ showLabel })}
                    />
                    <TextControl
                        label={__('Placeholder', 'gregius-query-filter')}
                        value={placeholder}
                        onChange={(placeholder) => setAttributes({ placeholder })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps({ className: 'wp-block-query-filter' })}>

                {showLabel && (
                    <label className="wp-block-query-filter-keyword__label wp-block-query-filter__label">
                        {label}
                    </label>
                )}
                <input
                    type="search"
                    className="wp-block-query-filter-keyword__input"
                    placeholder={placeholder}
                    inert
                />
            </div>
        </>
    );
}