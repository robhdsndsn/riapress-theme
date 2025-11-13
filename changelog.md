# Changelog
Template: https://keepachangelog.com/en/1.0.0/

## [4.0.0] - 2022-05-19
- Initial release

## [4.0.0] - 2023-01-11
- Add Readme.md
- Add Changelog.md

## [4.0.0] - 2023-01-12
- Site Editor support
- Theme.json support Typography: font-face, fluid, html font styles
- Parts, templates, and patterns support1
- Functions, remove settings that are now set in theme.json
- Styles, remove styles that are now set in theme.json
- Block accordion add accordion.js to "npm run start"

## [4.1.0] - 2023-04-28
- Add @wordpress/scripts as task runner
- Remove Gulp

## [4.2.0] - 2024-03-07
- Gutenberg support - Update function allowed_block_types_all to target blocks per post types and template parts
- Post type 'Event' added
- Added zp/blocks, address, event meta, media & text, search, and testimonials
- Deprecated zp/blocks, cover, links, post archive
- Extend and filter core blocks
- Add Archive, archive event, home templates

## [4.3.0] - 2024-06-25
- Theme.json support for custom spacing values
- Theme.json support for core/heading custom font sizes

## [4.4.0] - 2025-04-14
- updated changelog to show 4.x.x versions to match with RIAPress4's main version
- added GA tracking code support, using a new hook and WP_ENVIRONMENT_TYPE

## [4.5.0] - 2025-10-31
### Added
- Phase 1: Universal Spacing System - Native padding support enabled for 9 blocks
  - RIA Button, Hero, Heading, Icon, Badge, Image, Separator, Social Link
  - Accordions (added both margin and padding support)
- Comprehensive block audit report (BLOCK_AUDIT_REPORT.md)
- Alignment audit report (ALIGNMENT_AUDIT_REPORT.md)
- Phase 2 animation system design document (PHASE_2_ANIMATION_SYSTEM_DESIGN.md)

### Fixed
- Hero Section: Paragraph elements now center properly (added margin auto)
- CTA Section: Content now centers vertically and horizontally (flexbox alignment)
- Alignment issues: Systematic audit and fix of max-width centering across blocks

### Documentation
- Created PHASE_1_COMPLETION_REPORT.md
- Created ALIGNMENT_AUDIT_REPORT.md
- Created PHASE_2_ANIMATION_SYSTEM_DESIGN.md
- Updated BLOCK_AUDIT_REPORT.md with spacing enhancement findings