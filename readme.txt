=== RIA Press ===
Contributors: robhdsndsn
Tags: block-theme, full-site-editing, blocks, custom-colors, accessibility-ready, flexible-header, responsive-layout, wide-blocks
Requires at least: 6.1
Tested up to: 6.5
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A professional WordPress block theme featuring atomic design principles, performance optimization, and a comprehensive design system.

== Description ==

RIA Press is a modern WordPress block theme built with performance and flexibility in mind. Designed to support the latest WordPress Full Site Editing (FSE) capabilities, it provides a robust foundation for creating beautiful, accessible websites.

= Key Features =

* **16 Custom Gutenberg Blocks** organized by atomic design principles
* **Color Variant System** with 8 semantic color schemes (primary, secondary, tertiary, neutral, success, warning, error, info)
* **Animation System** featuring 12 animation types with scroll triggers
* **Performance Optimized** with bundle sizes ranging from 8-15KB per block
* **Accessibility Ready** following WCAG 2.1 AA standards
* **Settings Export/Import** for easy configuration backup and migration
* **Shared Icon Library** with 25 scalable SVG icons
* **Responsive Design** with mobile-first approach
* **theme.json Support** for comprehensive editor configuration

= Block Library =

**Atoms (9 blocks):**
* Avatar - User profile images with size variants
* Breadcrumb - Navigation breadcrumbs with customizable separators
* Button - Call-to-action buttons with hover effects
* Icon - Standalone icon component
* Icon Box - Icon with title and description
* Image - Responsive images with lazy loading
* Image Box - Image with content overlay
* Rating - Star/heart/circle ratings
* Tag - Content tags with icons

**Molecules (2 blocks):**
* Event Card - Event information display
* Resource Card - Resource/document cards

**Organisms (2 blocks):**
* Modal - Accessible modal dialogs
* Popover - Tooltip popovers

**Templates (3 blocks):**
* Call To Action - CTA sections
* Hero - Hero sections
* Pricing Grid - Pricing tables

= Design System =

The theme includes a unified design system accessible through the WordPress admin:
* Design tokens management
* Performance monitoring
* Theme hooks reference
* Typography configuration

= Performance =

All custom blocks are optimized for performance:
* Minimal bundle sizes (8-15KB per block)
* Lazy loading where appropriate
* No heavy external dependencies
* Efficient CSS architecture

= Browser Support =

* Chrome (latest 2)
* Firefox (latest 2)
* Safari (latest 2)
* Edge (latest 2)

== Installation ==

1. In your admin panel, go to Appearance > Themes and click the Add New button.
2. Click Upload Theme and Choose File, then select the theme's .zip file. Click Install Now.
3. Click Activate to use your new theme right away.

== Building Blocks (For Developers) ==

If you're developing custom blocks for this theme:

1. Navigate to the block directory
2. Install dependencies: `npm install`
3. For development: `npm run start`
4. For production: `npm run build`

Requires Node v14.18.3+ and @wordpress/scripts v23.1.0+

== Frequently Asked Questions ==

= Does this theme support Full Site Editing? =

Yes! RIA Press is built from the ground up to support WordPress Full Site Editing (FSE).

= Can I customize the colors? =

Absolutely. The theme includes a color variant system with 8 pre-defined semantic variants, plus support for custom colors through the WordPress editor.

= Is the theme accessible? =

Yes. RIA Press follows WCAG 2.1 AA accessibility standards with proper ARIA labels, keyboard navigation, and screen reader support.

= Can I use this theme for commercial projects? =

Yes! RIA Press is licensed under GPL v2 or later, so you can use it for any project, including commercial ones.

= How do I add custom blocks? =

The theme follows WordPress block development best practices. Refer to the WordPress Block Editor Handbook for guidance on creating custom blocks.

== Changelog ==

= 0.1.0 - November 13, 2025 =
* Initial release
* 16 custom Gutenberg blocks
* Color variant system with 8 semantic variants
* Animation system with 12 animation types
* Performance optimization (98.6% bundle size reduction for icon-dependent blocks)
* Settings export/import functionality
* Shared icon library with 25 SVG icons
* WCAG 2.1 AA accessibility compliance
* Mobile-first responsive design

== Upgrade Notice ==

= 0.1.0 =
Initial release of RIA Press theme.

== Credits ==

* Designed and developed by Rob Hudson
* Built with WordPress block development best practices
* Follows atomic design principles
* Icons adapted from Lucide icon library (MIT License)

== Theme Support ==

* Accessibility Ready
* Block Editor Patterns
* Block Editor Styles
* Custom Background
* Custom Colors
* Custom Header
* Custom Logo
* Custom Menu
* Editor Style
* Featured Images
* Full Site Editing
* Responsive Layout
* Sticky Post
* Theme Options
* Threaded Comments
* Translation Ready
* Wide Blocks

== Resources ==

* WordPress Block Editor Handbook: https://developer.wordpress.org/block-editor/
* theme.json Documentation: https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/
* Lucide Icons: https://lucide.dev/ (MIT License)
