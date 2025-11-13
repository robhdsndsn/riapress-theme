# RIAPress

RIAPress is a WordPress theme designed and developed by Rob Hudson to support an arrangement of the new design and development tools introduced in WordPress 6.1.

## Requirements
- Requires at least: 6.1
- Tested up to: 6.5
- Requires PHP: 5.6
- Requires Node: v14.18.3
- Requires @wordpress/scripts: v23.1.0
- Stable tag: 4
- License: GPLv2 or later
- License URI: http://www.gnu.org/licenses/gpl-2.0.html

## Theme.json
- Theme.json is "a new mechanism to configure the editor that enables a finer-grained control and introduces the first step in managing styles" and settings. [Docs](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/)

## Task Manager

### Install dependencies
```
cd /assets
```

### Install dependencies
```
npm install
```
### Developer build
```
npm run start
```

### Production build
```
npm run build
```

## Recent Enhancements (v4.5.0)

### Phase 1: Universal Spacing System ✅
- **9 blocks enhanced** with native WordPress padding controls
- Consistent spacing controls across Button, Hero, Heading, Icon, Badge, Image, Separator, Social Link, and Accordions blocks
- See [PHASE_1_COMPLETION_REPORT.md](PHASE_1_COMPLETION_REPORT.md) for details

### Alignment Fixes ✅
- **Hero Section**: Fixed paragraph element centering
- **CTA Section**: Implemented proper flexbox vertical/horizontal alignment
- Systematic audit of all 48 blocks for alignment issues
- See [ALIGNMENT_AUDIT_REPORT.md](ALIGNMENT_AUDIT_REPORT.md) for details

### Phase 2: Animation System 🎨
- Design phase complete
- IntersectionObserver-based scroll animations planned
- Zero-dependency vanilla JS + CSS approach
- See [PHASE_2_ANIMATION_SYSTEM_DESIGN.md](PHASE_2_ANIMATION_SYSTEM_DESIGN.md) for roadmap

## Documentation

### Block Enhancement Reports
- [BLOCK_AUDIT_REPORT.md](BLOCK_AUDIT_REPORT.md) - Comprehensive audit of all blocks
- [PHASE_1_COMPLETION_REPORT.md](PHASE_1_COMPLETION_REPORT.md) - Spacing system implementation
- [ALIGNMENT_AUDIT_REPORT.md](ALIGNMENT_AUDIT_REPORT.md) - Alignment issue audit and fixes
- [PHASE_2_ANIMATION_SYSTEM_DESIGN.md](PHASE_2_ANIMATION_SYSTEM_DESIGN.md) - Animation system design by Rob

### Version History
- [changelog.md](changelog.md) - Complete version history and changes

## GitHub Webhook Deployment Test