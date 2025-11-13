# RIA Modal/Popup Block

A production-ready WordPress Gutenberg block for creating customizable modal dialogs with various trigger types, content types, and accessibility features.

## Features

### Trigger Types
- **Button** - Customizable button with 4 styles (primary, secondary, tertiary, ghost)
- **Link** - Text link trigger
- **Image** - Click image to open modal
- **Icon** - Icon/emoji trigger with circular background

### Trigger Options
- Button styles: Primary, Secondary, Tertiary, Ghost
- Button sizes: Small, Medium, Large
- Icon support with left/right positioning
- Alignment: Left, Center, Right
- Custom borders and shadows
- Hover animations: Lift, Grow, Pulse

### Modal Content Types
- **Custom Content** - Use InnerBlocks for any content
- **Video Embed** - YouTube or Vimeo URL support
- **Image** - Full-size image display
- **Form** - Form plugin integration (ID-based)

### Modal Options
- Sizes: Small (400px), Medium (600px), Large (800px), XLarge (1000px), Full Screen
- Customizable title with show/hide option
- Border radius control (0-50px)
- Box shadow options (none, small, medium, large, xlarge, 2xlarge)
- Overlay color picker with alpha transparency

### Close Options
- Click outside to close (toggleable)
- Escape key to close (toggleable)
- Close button with 3 styles (default, minimal, circle)
- Show/hide close button

### Styling Options
- Custom border width, style, and color
- Border radius control
- Box shadows (trigger and modal)
- Hover shadow effects
- Custom overlay colors

### Animations
- 5 animation types: Fade In, Fade In Up, Fade In Down, Slide In Up, Zoom In
- Configurable duration (0.1-3s)
- Configurable delay (0-2s)
- 5 easing options: Linear, Ease, Ease In, Ease Out, Ease In Out
- Hover animations for triggers

### Accessibility Features
- WCAG 2.1 AA compliant
- ARIA labels and roles (dialog, modal, haspopup)
- Keyboard navigation (Tab, Shift+Tab, Escape)
- Focus trap inside modal
- Focus restoration after close
- Respects `prefers-reduced-motion` setting
- Screen reader friendly

## File Structure

```
ria-modal/
├── modal.php                # PHP registration (do not modify)
├── package.json             # NPM dependencies
├── README.md                # This file
├── src/                     # Source files
│   ├── block.json          # Block metadata and attributes
│   ├── index.js            # Edit and Save components (React)
│   ├── view.js             # Frontend JavaScript
│   ├── editor.scss         # Editor-only styles
│   └── style.scss          # Frontend styles
├── build/                   # Compiled production files
│   ├── block.json          # Copied block metadata
│   ├── index.js            # Compiled React bundle (17.3 KB)
│   ├── index.css           # Compiled editor styles
│   ├── index.asset.php     # WordPress dependencies
│   ├── style-index.css     # Compiled frontend styles
│   ├── view.js             # Compiled frontend script (3.62 KB)
│   └── view.asset.php      # View script dependencies
└── node_modules/            # Dependencies (not committed)
```

## Build Stats

- **index.js**: 17.3 KB (minified)
- **index.css**: 5.14 KB
- **style-index.css**: 7.81 KB
- **view.js**: 3.62 KB (minified)
- **Total**: ~34 KB

## Development

### Install Dependencies
```bash
npm install
```

### Watch Mode (Development)
```bash
npm run start
```

### Production Build
```bash
npm run build
```

### Lint Code
```bash
npm run lint:js
npm run lint:css
```

## Usage

### Basic Modal with Button
1. Add the "RIA Modal/Popup" block to your page
2. Set the trigger text (default: "Open Modal")
3. Add content using InnerBlocks
4. Customize button style and size as needed

### Video Modal
1. Add the block
2. Set Trigger Type to "Button" or "Link"
3. Set Content Type to "Video Embed"
4. Enter YouTube or Vimeo URL in sidebar
5. Adjust modal size to "Large" or "XLarge" for better viewing

### Image Lightbox
1. Add the block
2. Set Trigger Type to "Image"
3. Upload trigger image (thumbnail)
4. Set Content Type to "Image"
5. Upload full-size image for modal

### Form Modal
1. Add the block
2. Set Content Type to "Form"
3. Enter your form plugin's form ID
4. Style the trigger as needed

## Programmatic API

The block provides a JavaScript API for programmatic control:

```javascript
// Open a specific modal by selector or element
window.RIAModal.open('.my-modal');
window.RIAModal.open(document.querySelector('.my-modal'));

// Close the currently active modal
window.RIAModal.close();

// Get the currently active modal element
const activeModal = window.RIAModal.getActive();
```

### Custom Events

The block emits custom events you can listen to:

```javascript
// Modal opened
block.addEventListener('riaModalOpen', (e) => {
  console.log('Modal opened:', e.detail);
});

// Modal closed
block.addEventListener('riaModalClose', (e) => {
  console.log('Modal closed:', e.detail);
});
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Accessibility Notes

- Modal uses semantic HTML (`role="dialog"`, `aria-modal="true"`)
- Focus is trapped inside modal when open
- Focus returns to trigger button on close
- Escape key closes modal (unless disabled)
- Close button has proper ARIA label
- Respects user's reduced motion preferences
- All interactive elements are keyboard accessible

## Video URL Formats Supported

**YouTube:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID` (already embedded)

**Vimeo:**
- `https://vimeo.com/VIDEO_ID`
- `https://player.vimeo.com/video/VIDEO_ID` (already embedded)

## Technical Details

### WordPress Components Used
- `InspectorControls` - Sidebar controls
- `MediaUpload` / `MediaUploadCheck` - Image uploads
- `InnerBlocks` - Custom content
- `RichText` - Editable text fields
- `PanelBody` - Collapsible panels
- `SelectControl` - Dropdowns
- `RangeControl` - Sliders
- `ToggleControl` - Switches
- `ColorPicker` - Color selection
- `TextControl` - Text inputs

### JavaScript Features
- Intersection Observer API (for responsive behavior)
- Mutation Observer (for dynamic modals)
- Focus management
- Keyboard event handling
- Custom events
- Video URL parsing (YouTube/Vimeo)

### CSS Techniques
- Mobile-first responsive design
- Flexbox layout
- CSS Grid (where applicable)
- Custom properties for theming
- Smooth animations with keyframes
- Media queries for breakpoints (480px, 768px)
- Print styles (hide modals when printing)

## Version History

### 1.0.0 (Current)
- Initial production release
- 30+ attributes for complete customization
- 4 trigger types (button, link, image, icon)
- 4 content types (custom, video, image, form)
- Full accessibility compliance
- Keyboard navigation
- Focus trap
- Responsive design
- Animation support
- Custom events API

## Credits

- **Author**: Rob Hudson
- **Project**: RIA Too
- **Block Type**: Molecule (Atomic Design)
- **License**: GPL-2.0-or-later

## Support

For issues or questions, contact the development team or refer to the RIA Too project documentation.
