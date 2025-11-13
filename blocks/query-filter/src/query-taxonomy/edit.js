import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    ToggleControl,
    Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Edit({ attributes, setAttributes }) {
    const { taxonomy, emptyLabel, label, showLabel, presentation } = attributes;
    const blockProps = useBlockProps();

    const { taxonomies, isLoading } = useSelect(
        (select) => {
            const coreTaxonomies = select('core')?.getTaxonomies?.({ per_page: 100 });

            if (!coreTaxonomies) {
                return {
                    taxonomies: [],
                    isLoading: true
                };
            }

            const results = coreTaxonomies.filter(
                (tax) => tax?.visibility?.publicly_queryable
            );

            if (results?.length > 0 && !taxonomy) {
                setAttributes({
                    taxonomy: results[0].slug,
                    label: results[0].name,
                });
            }

            return {
                taxonomies: results || [],
                isLoading: false
            };
        },
        [taxonomy]
    );

    const terms = useSelect(
        (select) => {
            if (!taxonomy) return [];

            return select('core')?.getEntityRecords?.('taxonomy', taxonomy, {
                number: 50,
            }) || [];
        },
        [taxonomy]
    );

    if (isLoading) {
        return (
            <div {...blockProps}>
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Taxonomy Settings', 'gregius-query-filter')}>
                    <SelectControl
                        label={__('Select Taxonomy', 'gregius-query-filter')}
                        value={taxonomy}
                        options={(taxonomies || []).map((tax) => ({
                            label: tax.name,
                            value: tax.slug,
                        }))}
                        onChange={(newTaxonomy) => {
                            const selectedTaxonomy = taxonomies.find(
                                (tax) => tax.slug === newTaxonomy
                            );
                            setAttributes({
                                taxonomy: newTaxonomy,
                                label: selectedTaxonomy?.name || '',
                            });
                        }}
                    />
                    <TextControl
                        label={__('Label', 'gregius-query-filter')}
                        value={label}
                        help={__('If empty then no label will be shown', 'gregius-query-filter')}
                        onChange={(label) => setAttributes({ label })}
                    />
                    <ToggleControl
                        label={__('Show Label', 'gregius-query-filter')}
                        checked={showLabel}
                        onChange={(showLabel) => setAttributes({ showLabel })}
                    />
                    <SelectControl
                        label={__('Presentation', 'gregius-query-filter')}
                        value={presentation}
                        options={[
                            {
                                label: __('Dropdown', 'gregius-query-filter'),
                                value: 'select',
                            },
                            {
                                label: __('Checkboxes', 'gregius-query-filter'),
                                value: 'checkbox',
                            },
                        ]}
                        onChange={(presentation) => setAttributes({ presentation })}
                    />
                    {presentation === 'select' && (
                        <TextControl
                            label={__('Empty Choice Label', 'gregius-query-filter')}
                            value={emptyLabel}
                            placeholder={__('All', 'gregius-query-filter')}
                            onChange={(emptyLabel) => setAttributes({ emptyLabel })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                {showLabel && (
                    <label className="wp-block-query-filter-taxonomy__label wp-block-query-filter__label">
                        {label}
                    </label>
                )}
                {presentation === 'select' ? (
                    <select
                        className="wp-block-query-filter-taxonomy__select wp-block-query-filter__select"
                        inert
                    >
                        <option>{emptyLabel || __('All', 'gregius-query-filter')}</option>
                        {(terms || []).map((term) => (
                            <option key={term.slug}>{term.name}</option>
                        ))}
                    </select>
                ) : (
                    <div className="wp-block-query-filter-taxonomy__checkboxes">
                        {(terms || []).map((term) => (
                            <div
                                key={term.slug}
                                className="wp-block-query-filter-taxonomy__checkbox-item"
                            >
                                <input
                                    type="checkbox"
                                    id={`tax-${term.slug}`}
                                    inert
                                />
                                <label htmlFor={`tax-${term.slug}`}>
                                    {term.name}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
