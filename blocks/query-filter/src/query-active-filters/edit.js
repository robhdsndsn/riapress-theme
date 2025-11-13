import {__} from '@wordpress/i18n';
/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */
import {PanelBody, Placeholder, ColorPalette} from '@wordpress/components';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {useBlockProps, InspectorControls, useSetting} from '@wordpress/block-editor';

import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({attributes, setAttributes, context}) {
    // Respect default if not set
    const filterBadgeTextColor = attributes.filterBadgeTextColor;
    const filterBadgeBgColor = attributes.filterBadgeBgColor || 'var(--wp--custom--colors--primary-50)';
    const blockProps = useBlockProps();
    const hasQueryContext = context && context.queryId;
    const hasDefaultQueryTypeContext = context && context.query.inherit;
    // Get theme color palette
    const themeColors = useSetting ? useSetting('color.palette') : undefined;

    if (!hasQueryContext) {
        return (
            <Placeholder
                label={__('Query Active Filters - This block must be inside a Query block to display active filters.', 'gregius-query-filter')}
            />
        );
    }
    if (hasDefaultQueryTypeContext) {
        return (
            <Placeholder
                label={__('Query Active Filters - You must select Custom in Query Type for the "Query Loop" block', 'gregius-query-filter')}
            />
        );
    }

    // Inline style for .filter-badge
    const filterBadgeStyle = {
        color: filterBadgeTextColor || undefined,
        backgroundColor: filterBadgeBgColor || undefined,
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Badge Colors', 'gregius-query-filter')}>
                    <div style={{ marginBottom: '1em' }}>
                        <strong>{__('Text Color', 'gregius-query-filter')}</strong>
                        <ColorPalette
                            value={filterBadgeTextColor}
                            onChange={(color) => setAttributes({ filterBadgeTextColor: color })}
                            colors={themeColors}
                            disableCustomColors={false}
                        />
                    </div>
                    <div>
                        <strong>{__('Background Color', 'gregius-query-filter')}</strong>
                        <ColorPalette
                            value={filterBadgeBgColor}
                            onChange={(color) => setAttributes({ filterBadgeBgColor: color })}
                            colors={themeColors}
                            disableCustomColors={false}
                        />
                    </div>
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div className="active-filters-editor-preview">
                    <span className="filter-badge keyword" style={filterBadgeStyle}>
                        Keyword: example <span className="remove">×</span>
                    </span>
                    <span className="filter-badge taxonomy" style={filterBadgeStyle}>
                        Taxonomy <span className="remove">×</span>
                    </span>
                </div>
            </div>
        </>
    );
}
