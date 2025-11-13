import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    Placeholder,
    ToolbarGroup,
    ToolbarButton
} from '@wordpress/components';


import './editor.scss';

export default function Edit({ attributes, setAttributes, context }) {
    const { label, isBold, isItalic, isUnderline } = attributes;
    const hasQueryContext = context && context.queryId;
    const hasDefaultQueryTypeContext = context && context.query && context.query.inherit;

    if (!hasQueryContext) {
        return (
            <Placeholder
                label={__('Query Clear - This block must be inside a Query block to display the clear button.', 'gregius-query-filter')}
            />
        );
    }
    if (hasDefaultQueryTypeContext) {
        return (
            <Placeholder
                label={__('Query Clear - You must select Custom in Query Type for the "Query Loop" block', 'gregius-query-filter')}
            />
        );
    }

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="editor-bold"
                        label={__('Bold', 'gregius-query-filter')}
                        isPressed={!!isBold}
                        onClick={() => setAttributes({ isBold: !isBold })}
                    />
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="editor-italic"
                        label={__('Italic', 'gregius-query-filter')}
                        isPressed={!!isItalic}
                        onClick={() => setAttributes({ isItalic: !isItalic })}
                    />
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="editor-underline"
                        label={__('Underline', 'gregius-query-filter')}
                        isPressed={!!isUnderline}
                        onClick={() => setAttributes({ isUnderline: !isUnderline })}
                    />
                </ToolbarGroup>
            </BlockControls>
            <InspectorControls>
                <PanelBody title={__('Button Settings', 'gregius-query-filter')}>
                    <TextControl
                        label={__('Button Label', 'gregius-query-filter')}
                        value={label}
                        onChange={(label) => setAttributes({ label })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps()}>
                <button
                    type="button"
                    className="wp-block-gregius-query-clear__button"
                    disabled
                    style={{
                        fontWeight: isBold ? 'bold' : undefined,
                        fontStyle: isItalic ? 'italic' : undefined,
                        textDecoration: isUnderline ? 'underline' : undefined
                    }}
                >
                    {label}
                </button>
            </div>
        </>
    );
}
