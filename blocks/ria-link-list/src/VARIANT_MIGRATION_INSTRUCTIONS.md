# Variant Migration - Manual Steps for index.js

The script has updated imports and attribute destructuring, but you need to manually:

## 1. Find the Color Picker Section

Look for a `<PanelBody>` with "Color", "Colors", or "Style Settings" in the title.
It will have multiple `ColorGradientControl` or `ColorPicker` components.

## 2. Replace with Variant Controls

Replace that entire `<PanelBody>` section with:

```jsx

<PanelBody title={__('Color Scheme', 'ria-link-list')} initialOpen={true}>
  <SelectControl
    label={__('Variant', 'ria-link-list')}
    value={variant}
    options={[
      { label: __('Primary (Navy)', 'ria-link-list'), value: 'primary' },
      { label: __('Secondary (Green)', 'ria-link-list'), value: 'secondary' },
      { label: __('Tertiary (Orange)', 'ria-link-list'), value: 'tertiary' },
      { label: __('Neutral (Gray)', 'ria-link-list'), value: 'neutral' },
      { label: __('Custom', 'ria-link-list'), value: 'custom' }
    ]}
    onChange={(value) => setAttributes({ variant: value })}
    help={__('Choose a color scheme or use custom colors', 'ria-link-list')}
  />
</PanelBody>

{variant === 'custom' && (
  <PanelColorSettings
    title={__('Custom Colors', 'ria-link-list')}
    colorSettings={[
      {
        value: customIconColor,
        onChange: (color) => setAttributes({ customIconColor: color }),
        label: __('Icon Color', 'ria-link-list')
      },
      {
        value: customLinkColor,
        onChange: (color) => setAttributes({ customLinkColor: color }),
        label: __('Link Color', 'ria-link-list')
      },
      {
        value: customLinkHoverColor,
        onChange: (color) => setAttributes({ customLinkHoverColor: color }),
        label: __('Link Hover Color', 'ria-link-list')
      },
      {
        value: customBackgroundColor,
        onChange: (color) => setAttributes({ customBackgroundColor: color }),
        label: __('Background Color', 'ria-link-list')
      },
      {
        value: customItemBackgroundColor,
        onChange: (color) => setAttributes({ customItemBackgroundColor: color }),
        label: __('Item Background Color', 'ria-link-list')
      },
      {
        value: customItemHoverBackground,
        onChange: (color) => setAttributes({ customItemHoverBackground: color }),
        label: __('Item Hover Background', 'ria-link-list')
      },
      {
        value: customDividerColor,
        onChange: (color) => setAttributes({ customDividerColor: color }),
        label: __('Divider Color', 'ria-link-list')
      },
      {
        value: customBorderColor,
        onChange: (color) => setAttributes({ customBorderColor: color }),
        label: __('Border Color', 'ria-link-list')
      }
    ]}
  />
)}

```

## 3. Update Inline Styles

Find where inline styles are set (usually in `blockProps` or `style` prop).

Update to conditionally apply custom colors when `variant === 'custom'`:

```jsx
style: variant === 'custom' ? {
  '--custom-bg-color': customBackgroundColor,
  '--custom-card-bg': customCardBackgroundColor,
  // ... add all custom color variables
  ...otherStyles
} : {
  ...otherStyles
}
```

## 4. Remove Old Color Attributes

Delete these from attribute destructuring:
iconColor, linkColor, linkHoverColor, backgroundColor, itemBackgroundColor, itemHoverBackground, dividerColor, borderColor

## 5. Build and Test

```bash
npm run build
```

Then test all 4 standard variants + custom variant in WordPress editor.
