# Variant Migration - Manual Steps for index.js

The script has updated imports and attribute destructuring, but you need to manually:

## 1. Find the Color Picker Section

Look for a `<PanelBody>` with "Color", "Colors", or "Style Settings" in the title.
It will have multiple `ColorGradientControl` or `ColorPicker` components.

## 2. Replace with Variant Controls

Replace that entire `<PanelBody>` section with:

```jsx

<PanelBody title={__('Color Scheme', 'ria-quote')} initialOpen={true}>
  <SelectControl
    label={__('Variant', 'ria-quote')}
    value={variant}
    options={[
      { label: __('Primary (Navy)', 'ria-quote'), value: 'primary' },
      { label: __('Secondary (Green)', 'ria-quote'), value: 'secondary' },
      { label: __('Tertiary (Orange)', 'ria-quote'), value: 'tertiary' },
      { label: __('Neutral (Gray)', 'ria-quote'), value: 'neutral' },
      { label: __('Custom', 'ria-quote'), value: 'custom' }
    ]}
    onChange={(value) => setAttributes({ variant: value })}
    help={__('Choose a color scheme or use custom colors', 'ria-quote')}
  />
</PanelBody>

{variant === 'custom' && (
  <PanelColorSettings
    title={__('Custom Colors', 'ria-quote')}
    colorSettings={[
      {
        value: customQuoteColor,
        onChange: (color) => setAttributes({ customQuoteColor: color }),
        label: __('Quote Color', 'ria-quote')
      },
      {
        value: customAuthorColor,
        onChange: (color) => setAttributes({ customAuthorColor: color }),
        label: __('Author Color', 'ria-quote')
      },
      {
        value: customBackgroundColor,
        onChange: (color) => setAttributes({ customBackgroundColor: color }),
        label: __('Background Color', 'ria-quote')
      },
      {
        value: customAccentColor,
        onChange: (color) => setAttributes({ customAccentColor: color }),
        label: __('Accent Color', 'ria-quote')
      },
      {
        value: customBorderColor,
        onChange: (color) => setAttributes({ customBorderColor: color }),
        label: __('Border Color', 'ria-quote')
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
quoteColor, authorColor, backgroundColor, accentColor, borderColor

## 5. Build and Test

```bash
npm run build
```

Then test all 4 standard variants + custom variant in WordPress editor.
