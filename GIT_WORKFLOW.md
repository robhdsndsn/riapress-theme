# RIA Press Theme - Git Workflow & Versioning Strategy

**Theme Name:** RIA Press
**Current Version:** 0.1 - Janus
**Repository:** https://github.com/robhdsndsn/riapress-theme

---

## Version Naming Convention

Versions are named after Roman Gods and Goddesses, reflecting the mythological foundation:

### Released Versions
- **v0.1 - Janus** (Current) - God of beginnings, transitions, doorways, and passages
  - Initial release with design system foundation
  - Color variant system
  - Settings export/import
  - Performance optimizations

### Planned Major Versions
- **v1.0 - Minerva** - Goddess of wisdom, strategic warfare, and crafts
  - First stable production release
  - Complete block library
  - Full documentation

- **v2.0 - Apollo** - God of knowledge, music, arts, and prophecy
  - Enhanced design capabilities
  - Advanced animations
  - Template library expansion

- **v3.0 - Diana** - Goddess of the hunt, wilderness, and childbirth
  - Advanced user customization
  - Theme builder interface
  - Dynamic content features

- **v4.0 - Mars** - God of war and guardian of agriculture
  - Performance and security hardening
  - Advanced caching
  - Enterprise features

- **v5.0 - Venus** - Goddess of love, beauty, and prosperity
  - UI/UX refinements
  - Design polish
  - Accessibility enhancements

### Future Expansion
Continue with: Neptune, Jupiter, Mercury, Vulcan, Saturn, Ceres, Bacchus, Pluto, Juno, Vesta, etc.

---

## Semantic Versioning

Format: `vMAJOR.MINOR.PATCH-CODENAME`

- **MAJOR** (0, 1, 2, 3...): Breaking changes, new godname
- **MINOR** (0.1, 0.2, 0.3...): New features, backward compatible
- **PATCH** (0.1.1, 0.1.2...): Bug fixes, performance improvements

**Examples:**
- `v0.1.0-janus` - Initial release
- `v0.1.1-janus` - Bug fixes
- `v0.2.0-janus` - New features added
- `v1.0.0-minerva` - Major release (first stable)

---

## Git Branch Structure

### Main Branches

**`main`**
- **Purpose:** Stable, production-ready releases only
- **Protection:** Protected branch, requires PR from development
- **Tags:** Every merge to main gets a version tag
- **Deploy:** Auto-deploys to production via webhook
- **Rule:** Never commit directly to main

**`development`**
- **Purpose:** Active development and testing
- **Protection:** Semi-protected, can commit directly for minor work
- **Testing:** Deploys to staging57.the-ria.ca
- **Rule:** All features tested here before merging to main

### Supporting Branches (Optional)

**`feature/[feature-name]`**
- Branch from: `development`
- Merge back to: `development`
- Naming: `feature/block-search`, `feature/animation-library`
- Purpose: Large features requiring multiple commits

**`hotfix/[issue]`**
- Branch from: `main`
- Merge back to: `main` AND `development`
- Naming: `hotfix/critical-color-bug`, `hotfix/security-xss`
- Purpose: Critical production fixes

**`experiment/[name]`**
- Branch from: `development`
- Merge back to: `development` (if successful)
- Naming: `experiment/new-icon-system`, `experiment/gsap-animations`
- Purpose: Testing new ideas without affecting development

---

## Workflow Diagram

```
main (production)
  ↑
  │ (merge via PR, tag version)
  │
development (staging)
  ↑
  │ (merge when feature complete)
  │
feature/new-block
```

---

## Development Workflow

### Daily Development

1. **Start work in development branch:**
   ```bash
   git checkout development
   git pull origin development
   ```

2. **Make changes, commit regularly:**
   ```bash
   git add [files]
   git commit -m "type: description"
   git push origin development
   ```

3. **Test on staging:** Changes auto-deploy to staging57.the-ria.ca

### For Large Features

1. **Create feature branch:**
   ```bash
   git checkout development
   git checkout -b feature/advanced-grid-system
   ```

2. **Develop and commit:**
   ```bash
   git add [files]
   git commit -m "feat: add grid column controls"
   ```

3. **Merge back to development when ready:**
   ```bash
   git checkout development
   git merge feature/advanced-grid-system
   git push origin development
   ```

4. **Delete feature branch:**
   ```bash
   git branch -d feature/advanced-grid-system
   git push origin --delete feature/advanced-grid-system
   ```

### Releasing to Production

1. **Ensure development is stable and tested**

2. **Create pull request:** development → main

3. **Review changes in PR**

4. **Merge PR to main**

5. **Tag the release:**
   ```bash
   git checkout main
   git pull origin main
   git tag -a v0.2.0-janus -m "Version 0.2.0 - Janus: Add advanced animation controls"
   git push origin v0.2.0-janus
   ```

6. **Verify production deployment**

---

## Commit Message Convention

Format: `type: description`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `perf:` - Performance improvement
- `refactor:` - Code refactoring (no functional change)
- `style:` - CSS/design changes
- `docs:` - Documentation changes
- `test:` - Testing changes
- `chore:` - Build/tooling changes

**Examples:**
```bash
git commit -m "feat: add color variant support to button block"
git commit -m "fix: resolve icon alignment in breadcrumb block"
git commit -m "perf: reduce bundle sizes by 98.6% with shared icon library"
git commit -m "docs: add HOW_TO_ADD_ICONS.md guide"
git commit -m "style: update spacing in card blocks"
```

---

## Hotfix Workflow

For critical production bugs:

1. **Create hotfix branch from main:**
   ```bash
   git checkout main
   git checkout -b hotfix/critical-render-bug
   ```

2. **Fix the issue:**
   ```bash
   git add [files]
   git commit -m "fix: resolve critical render bug in rating block"
   ```

3. **Merge to main:**
   ```bash
   git checkout main
   git merge hotfix/critical-render-bug
   git tag -a v0.1.1-janus -m "Version 0.1.1 - Janus: Hotfix for render bug"
   git push origin main
   git push origin v0.1.1-janus
   ```

4. **Merge to development:**
   ```bash
   git checkout development
   git merge hotfix/critical-render-bug
   git push origin development
   ```

5. **Delete hotfix branch:**
   ```bash
   git branch -d hotfix/critical-render-bug
   git push origin --delete hotfix/critical-render-bug
   ```

---

## Version History

### v0.1.0-janus (2025-11-13)
**"The Foundation"**

Initial release of RIA Press theme with complete design system foundation.

**Features:**
- Complete atomic design system (16 blocks)
- Color variant system with 8 semantic variants
- Animation system with 12 animation types
- Settings export/import functionality
- Shared icon library (25 SVG icons)
- Performance optimizations (98.6% bundle size reduction)

**Blocks:**
- Atoms: Avatar, Breadcrumb, Button, Icon, Icon Box, Image, Image Box, Rating, Tag
- Molecules: Event Card, Resource Card
- Organisms: Modal, Popover
- Templates: Call To Action, Hero, Pricing Grid

**Technical:**
- Bundle sizes: 8-15KB per block
- Zero heavy dependencies
- Fully accessible (WCAG 2.1 AA)
- Mobile-first responsive design
- WordPress 6.0+ compatible

---

## Changelog Location

Full changelog maintained in: `/CHANGELOG.md`

Format:
```markdown
## [0.1.0] - 2025-11-13 - Janus

### Added
- Initial release with 16 blocks
- Color variant system

### Changed
- N/A

### Fixed
- N/A
```

---

## Tag Management

### List all tags:
```bash
git tag -l
```

### View tag details:
```bash
git show v0.1.0-janus
```

### Delete a tag (local):
```bash
git tag -d v0.1.0-janus
```

### Delete a tag (remote):
```bash
git push origin --delete v0.1.0-janus
```

---

## Branch Protection Rules

### Main Branch
- ✅ Require pull request before merging
- ✅ Require status checks to pass
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing above settings
- ❌ Do not allow force pushes
- ❌ Do not allow deletions

### Development Branch
- ✅ Allow direct commits for minor work
- ✅ Require PR for major features
- ❌ Do not allow force pushes (except for cleanup)
- ❌ Do not allow deletions

---

## Emergency Procedures

### Rollback Production
If main has a critical issue:

```bash
# Find last good commit
git log --oneline

# Reset main to that commit
git checkout main
git reset --hard [good-commit-hash]
git push origin main --force

# Or revert the bad commit
git revert [bad-commit-hash]
git push origin main
```

### Clean Local Branches
Remove stale branches:

```bash
# Delete local branches already merged
git branch --merged | grep -v "main\|development" | xargs git branch -d

# Delete remote tracking branches that no longer exist
git fetch --prune
```

---

## Best Practices

1. **Commit Often:** Small, focused commits are better than large ones
2. **Write Clear Messages:** Future you will thank you
3. **Test Before Merging:** Always test in development first
4. **Tag Releases:** Every production release gets a tag
5. **Document Changes:** Update CHANGELOG.md with each release
6. **Never Force Push:** to main or development (except emergency)
7. **Pull Before Push:** Avoid merge conflicts
8. **Review Your Diffs:** Before committing, review what changed

---

## Quick Reference

```bash
# Start new day
git checkout development && git pull

# Work on feature
git add . && git commit -m "feat: description"
git push origin development

# Release to production
# (Create PR: development → main)
# (Merge PR)
git checkout main && git pull
git tag -a v0.2.0-janus -m "Version 0.2.0"
git push origin v0.2.0-janus

# Check status
git status
git log --oneline -10
git branch -a

# Clean up
git fetch --prune
git branch --merged | grep -v "main\|development" | xargs git branch -d
```

---

**Remember:** main = stable, development = active work, feature/* = experiments

**The Janus philosophy:** Like the two-faced god looking both to the past and future, we maintain a clean history (past) while enabling rapid development (future).
