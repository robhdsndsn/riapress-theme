# Variant Migration - Manual Steps for index.js

The script has updated imports and attribute destructuring, but you need to manually:

## 1. Find the Color Picker Section

Look for a `<PanelBody>` with "Color", "Colors", or "Style Settings" in the title.
It will have multiple `ColorGradientControl` or `ColorPicker` components.

## 2. Replace with Variant Controls

Replace that entire `<PanelBody>` section with:

```jsx

<PanelBody title={__('Color Scheme', 'ria-contact-info')} initialOpen={true}>
  <SelectControl
    label={__('Variant', 'ria-contact-info')}
    value={variant}
    options={[
      { label: __('Primary (Navy)', 'ria-contact-info'), value: 'primary' },
      { label: __('Secondary (Green)', 'ria-contact-info'), value: 'secondary' },
      { label: __('Tertiary (Orange)', 'ria-contact-info'), value: 'tertiary' },
      { label: __('Neutral (Gray)', 'ria-contact-info'), value: 'neutral' },
      { label: __('Custom', 'ria-contact-info'), value: 'custom' }
    ]}
    onChange={(value) => setAttributes({ variant: value })}
    help={__('Choose a color scheme or use custom colors', 'ria-contact-info')}
  />
</PanelBody>

{variant === 'custom' && (
  <PanelColorSettings
    title={__('Custom Colors', 'ria-contact-info')}
    colorSettings={[
      {
        value: customIconColor,
        onChange: (color) => setAttributes({ customIconColor: color }),
        label: __('Icon Color', 'ria-contact-info')
      },
      {
        value: customTextColor,
        onChange: (color) => setAttributes({ customTextColor: color }),
        label: __('Text Color', 'ria-contact-info')
      },
      {
        value: customLinkColor,
        onChange: (color) => setAttributes({ customLinkColor: color }),
        label: __('Link Color', 'ria-contact-info')
      },
      {
        value: customBackgroundColor,
        onChange: (color) => setAttributes({ customBackgroundColor: color }),
        label: __('Background Color', 'ria-contact-info')
      },
      {
        value: customBorderColor,
        onChange: (color) => setAttributes({ customBorderColor: color }),
        label: __('Border Color', 'ria-contact-info')
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
iconColor, textColor, linkColor, backgroundColor, borderColor

## 5. Build and Test

```bash
npm run build
```

Then test all 4 standard variants + custom variant in WordPress editor.
