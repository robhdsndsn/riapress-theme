# RIA Skeleton Loader

A standalone Gutenberg block for displaying skeleton loading placeholders and prototyping content layouts.

## Description

The RIA Skeleton Loader block provides placeholder loading states for various content types. It's perfect for:
- Prototyping page layouts before content is ready
- Showing loading states for dynamic content
- Creating placeholder designs for content areas
- Testing responsive layouts

## Features

- **Multiple Skeleton Types**: Text, Image, Avatar, Button, and Card
- **Flexible Configuration**: Control count, size, layout, and appearance
- **Responsive Design**: Works seamlessly across all device sizes
- **Animation Support**: Includes shimmer animation for realistic loading effect
- **Type-Specific Settings**: Customizable options for each skeleton type

## Skeleton Types

### Text
- Control number of lines (1-10)
- Choose size (small, medium, large, xlarge)

### Image
- Set custom aspect ratio (16/9, 4/3, 1/1, etc.)
- Specify height

### Avatar
- Choose size (small, medium, large, xlarge)
- Circular placeholder for profile images

### Button
- Select size preset
- Set custom width

### Card
- Toggle image display
- Toggle button display
- Choose vertical or horizontal layout
- Complete card placeholder with all elements

## Usage

1. Add the "RIA Skeleton Loader" block to your page
2. Select skeleton type from Inspector Controls
3. Configure type-specific settings
4. Set display count (1-10 instances)
5. Customize border radius, animations, etc.

## Technical Details

- **Block Name**: `ria/skeleton`
- **Category**: Widgets
- **Dependencies**: Shared skeleton components from `components/skeletons`
- **Styles**: Imports shared `skeletons.scss` for consistent appearance

## Attributes

- `skeletonType`: Type of skeleton (text, image, avatar, button, card)
- `lines`: Number of text lines (for text type)
- `width`: Custom width (for button type)
- `height`: Custom height (for image type)
- `aspectRatio`: Aspect ratio (for image type)
- `size`: Size preset (small, medium, large, xlarge)
- `showImage`: Show/hide image (for card type)
- `showButton`: Show/hide button (for card type)
- `layout`: Vertical or horizontal (for card type)
- `count`: Number of skeleton instances (1-10)

Plus all standard animation and border attributes.

## Development

```bash
# Install dependencies
npm install

# Start development mode (watch)
npm run start

# Build for production
npm run build

# Lint JavaScript
npm run lint:js

# Lint CSS
npm run lint:css
```

## Examples

**Simple text skeleton:**
- Type: Text
- Lines: 3
- Size: Medium
- Count: 1

**Loading card grid:**
- Type: Card
- Show Image: Yes
- Show Button: Yes
- Layout: Vertical
- Count: 3

**Avatar list:**
- Type: Avatar
- Size: Large
- Count: 5

## Version

1.0.0

## Author

Rob Hudson

## License

GPL-2.0-or-later
