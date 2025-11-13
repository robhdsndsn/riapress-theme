# RIA Press WordPress Theme

A professional WordPress block theme featuring atomic design principles, performance optimization, and a comprehensive design system.

**Version:** 0.1.0
**Author:** Rob Hudson
**License:** GPL v2 or later

## Overview

RIA Press is a modern WordPress block theme built with Full Site Editing (FSE) support, offering 16 custom Gutenberg blocks organized by atomic design principles.

## Requirements

- WordPress: 6.1+
- PHP: 7.4+
- Node.js: 14.18.3+
- @wordpress/scripts: 23.1.0+

## Features

### Design System
- **16 Custom Blocks** organized by atomic design
- **Color Variant System** with 8 semantic variants
- **Animation System** with 12 animation types
- **Performance Optimized** (8-15KB per block)
- **Accessibility Ready** (WCAG 2.1 AA)
- **Responsive Design** (mobile-first approach)

### Block Library

**Atoms (9):** Avatar, Breadcrumb, Button, Icon, Icon Box, Image, Image Box, Rating, Tag

**Molecules (2):** Event Card, Resource Card

**Organisms (2):** Modal, Popover

**Templates (3):** Call To Action, Hero, Pricing Grid

### Technical Features
- Settings export/import functionality
- Shared icon library (25 SVG icons)
- theme.json configuration
- Zero heavy dependencies
- Optimized bundle sizes

## Installation

### For Users

1. Go to Appearance > Themes > Add New
2. Click Upload Theme
3. Choose the theme .zip file
4. Click Install Now, then Activate

### For Developers

```bash
# Navigate to theme directory
cd wp-content/themes/riapress

# Install dependencies (for asset building)
cd assets
npm install

# Development mode (hot reload)
npm run start

# Production build
npm run build
```

## Block Development

Each block follows WordPress best practices:

```bash
# Navigate to a block
cd blocks/ria-button

# Install dependencies
npm install

# Development
npm run start

# Production build
npm run build
```

## Color Variant System

All blocks support the unified color variant system:
- Primary
- Secondary
- Tertiary
- Neutral
- Success
- Warning
- Error
- Info
- Custom (with color picker override)

## Animation System

Blocks support 12 animation types with configurable duration, delay, easing, scroll triggers, and stagger effects.

## Performance

Optimized for speed:
- Bundle sizes: 8-15KB per block
- No heavy dependencies
- Lazy loading where appropriate
- Efficient CSS architecture
- 98.6% reduction in icon bundle sizes

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Accessibility

- WCAG 2.1 AA compliant
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly

## Documentation

- **readme.txt** - WordPress.org standard readme
- **changelog.md** - Complete version history
- Block-specific documentation in individual block folders

## License

This theme is licensed under GPL v2 or later.
http://www.gnu.org/licenses/gpl-2.0.html

## Credits

- Designed and developed by Rob Hudson
- Icons adapted from Lucide (MIT License)
- Built with WordPress coding standards

## Changelog

### Version 0.1.0 (November 13, 2025)
- Initial release
- 16 custom Gutenberg blocks
- Color variant system
- Animation system
- Performance optimization
- Settings export/import
- Shared icon library
- Full accessibility compliance

See changelog.md for complete version history.
