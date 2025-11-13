# Changelog

All notable changes to the RIA Press theme will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versions are named after Roman Gods and Goddesses to reflect the mythological foundation of the design system.

---

## [0.1.0] - 2025-11-13 - Janus

**"The Foundation"** - Named after Janus, Roman god of beginnings, transitions, doorways, and passages.

This release establishes the complete foundation for the RIA Press WordPress theme with a robust atomic design system.

### Design System

**Atomic Design Structure:**
- 9 Atom blocks
- 2 Molecule blocks
- 2 Organism blocks
- 3 Template blocks

**Color Variant System:**
- 8 semantic variants (primary, secondary, success, warning, error, info, light, dark)
- Custom color override support
- Consistent across all blocks
- CSS variable-based architecture

**Animation System:**
- 12 animation types (fade, slide, scale, rotate, bounce, flip, etc.)
- Configurable duration, delay, easing
- Scroll-triggered animations
- Stagger effects support

### Blocks Added

#### Atoms (9)
- **ria-avatar** - User avatars with size variants
- **ria-breadcrumb** - Navigation breadcrumbs with 6 separator icons
- **ria-button** - Call-to-action buttons
- **ria-icon** - Standalone icon component
- **ria-icon-box** - Icon with title and description
- **ria-image** - Responsive images with lazy loading
- **ria-image-box** - Image with content overlay
- **ria-rating** - Star/heart/circle ratings (5 icon options)
- **ria-tag** - Content tags with 7 icon options

#### Molecules (2)
- **ria-event-card** - Event information cards
- **ria-resource-card** - Resource/document cards

#### Organisms (2)
- **ria-modal** - Accessible modal dialogs
- **ria-popover** - Tooltip popovers

#### Templates (3)
- **ria-call-to-action** - CTA sections
- **ria-hero** - Hero sections
- **ria-pricing-grid** - Pricing tables

### Features Added

- **Admin Interface** - Custom RIA Press settings page in WordPress admin
- **Block Management** - Interface to manage block visibility and settings
- **Settings Export/Import** - JSON-based configuration backup and restore
- **Shared Icon Library** - 25 inline SVG icons (8KB total, fully recolorable)
- **Performance Optimizations** - 98.6% bundle size reduction in icon-dependent blocks
- **Accessibility** - WCAG 2.1 AA compliant throughout
- **Responsive Design** - Mobile-first approach with flexible grid system

### Performance

- Bundle sizes: 8-15KB per block (optimized)
- Total savings: 1.74MB in optimized blocks vs. initial implementation
- Removed heavy dependencies (eliminated 42MB lucide-react library)
- Zero runtime dependencies for icons

### Documentation

- GIT_WORKFLOW.md - Complete version control and workflow strategy
- PERFORMANCE_OPTIMIZATION_2025-11-13.md - Performance audit report
- /shared/HOW_TO_ADD_ICONS.md - Guide for extending the icon library

### Technical Specifications

- **WordPress:** 6.0+
- **PHP:** 7.4+
- **Framework:** React 18
- **Build System:** @wordpress/scripts (Webpack 5)
- **Standards:** WordPress coding standards, ESLint configured

### Git Workflow

- Established clean git history with single foundation commit
- Tagged release: v0.1.0-janus
- Created main branch for stable releases
- Created development branch for active development
- Implemented Roman god/goddess naming convention for versions

---

## Upcoming Versions

### [1.0.0] - Minerva (Planned)
**"Goddess of Wisdom"** - First stable production release

### [2.0.0] - Apollo (Planned)
**"God of Knowledge and Arts"** - Enhanced design capabilities

### Future Versions
- **[3.0.0] - Diana** - Advanced user customization
- **[4.0.0] - Mars** - Performance and security hardening
- **[5.0.0] - Venus** - UI/UX refinements

---

**Repository:** https://github.com/robhdsndsn/riapress-theme
