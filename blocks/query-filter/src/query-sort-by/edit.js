import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls } from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  ToolbarGroup,
  ToolbarButton
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  const {
    sortOrder,
    sortBy,
    label,
    showLabel,
    boldLabel
  } = attributes;

  // Create wrapper props without border styles
  const { style: blockStyle, className, ...wrapperProps } = blockProps;
  const wrapperStyle = blockStyle ? { ...blockStyle } : {};
  if (wrapperStyle.border) delete wrapperStyle.border;
  if (wrapperStyle.borderRadius) delete wrapperStyle.borderRadius;
  if (wrapperStyle.borderColor) delete wrapperStyle.borderColor;
  if (wrapperStyle.borderWidth) delete wrapperStyle.borderWidth;

  // Also remove any CSS custom properties for border color
  Object.keys(wrapperStyle).forEach(key => {
    if (key.startsWith('--wp--preset--color') || key.startsWith('--wp-custom--colors') || key.includes('border')) {
      delete wrapperStyle[key];
    }
  });

  // Remove border-related classes from className and extract them for select
  let cleanClassName = className || '';
  let selectClasses = [];

  // Extract border color classes
  const borderColorMatches = cleanClassName.match(/has-[a-z0-9-]*-border-color/g);
  if (borderColorMatches) {
    selectClasses.push(...borderColorMatches);
    cleanClassName = cleanClassName.replace(/has-[a-z0-9-]*-border-color/g, '');
  }

  // Extract general border color class
  if (cleanClassName.includes('has-border-color')) {
    selectClasses.push('has-border-color');
    cleanClassName = cleanClassName.replace(/has-border-color/g, '');
  }

  cleanClassName = cleanClassName.replace(/\s+/g, ' ').trim();

  const finalWrapperProps = {
    ...wrapperProps,
    ...(cleanClassName ? { className: cleanClassName } : {}),
    ...(Object.keys(wrapperStyle).length > 0 ? { style: wrapperStyle } : {})
  };

  // Get fontSize class from block props
  const fontSizeClass = blockProps.className ? blockProps.className.match(/has-[a-z-]+-font-size/) : null;
  const baseLabelClasses = `wp-block-query-filter-sort-by__label wp-block-query-filter__label${fontSizeClass ? ` ${fontSizeClass[0]}` : ''}`;
  const labelClasses = showLabel ? baseLabelClasses : `${baseLabelClasses} screen-reader-text`;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === 'date-desc') setAttributes({ sortBy: 'date', sortOrder: 'desc' });
    if (value === 'date-asc') setAttributes({ sortBy: 'date', sortOrder: 'asc' });
    if (value === 'title-asc') setAttributes({ sortBy: 'title', sortOrder: 'asc' });
    if (value === 'title-desc') setAttributes({ sortBy: 'title', sortOrder: 'desc' });
  };

  let selected = `${sortBy}-${sortOrder}`;

  // Extract border styles from blockProps for the select element
  const selectStyle = {};
  if (blockProps.style) {
    if (blockProps.style.border) selectStyle.border = blockProps.style.border;
    if (blockProps.style.borderRadius) selectStyle.borderRadius = blockProps.style.borderRadius;
    if (blockProps.style.borderColor) selectStyle.borderColor = blockProps.style.borderColor;
    if (blockProps.style.borderWidth) selectStyle.borderWidth = blockProps.style.borderWidth;

    // Also include CSS custom properties for colors
    Object.keys(blockProps.style).forEach(key => {
      if (key.startsWith('--wp--preset--color') || key.startsWith('--wp-custom--colors')) {
        selectStyle[key] = blockProps.style[key];
      }
    });
  }

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon="editor-bold"
            label={__('Bold', 'gregius-query-filter')}
            isPressed={!!boldLabel}
            onClick={() => setAttributes({ boldLabel: !boldLabel })}
          />
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <PanelBody title={__('Sort Settings', 'gregius-query-filter')}>
          <ToggleControl
            label={__('Show Label', 'gregius-query-filter')}
            checked={showLabel}
            onChange={(showLabel) => setAttributes({ showLabel })}
          />
        </PanelBody>
      </InspectorControls>
      <div {...finalWrapperProps}>
        {boldLabel ? (
          <label className={labelClasses} htmlFor="query-sort-by-select">
            <strong>
              {label}
            </strong>
          </label>
        ) : (
          <label className={labelClasses} htmlFor="query-sort-by-select">
            {label}
          </label>
        )}
        <select
          id="query-sort-by-select"
          value={selected}
          onChange={handleChange}
          style={selectStyle}
          className={selectClasses.join(' ')}
        >
          <option value="date-desc">{__('Newest - Oldest', 'gregius')}</option>
          <option value="date-asc">{__('Oldest - Newest', 'gregius')}</option>
          <option value="title-asc">{__('A - Z', 'gregius')}</option>
          <option value="title-desc">{__('Z - A', 'gregius')}</option>
        </select>
      </div>
    </>
  );
}

