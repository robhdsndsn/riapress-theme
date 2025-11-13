# RP Posts Related Block - Quality Assurance Criteria

## 📋 **Testing Overview**

This document defines the quality assurance criteria for the RIAPress Posts Related Block, focusing on end-to-end testing by human editors using the WordPress block editor. All criteria must be met before User Acceptance.

**Block Name**: `zp/post-related` (Related Resources)  
**Target Post Type**: `rp_resource`
**Default Display Count**: 3 posts  
**Supported Taxonomies**: 6 taxonomies (FLTCA Alignment, Resource Audience, Resource Category, Resource Organization, Resource Topic, Resource Type)

---

## 🎯 **Core Functionality Criteria**

### 1. Block Registration & Loading
**QA-001: Block Installation**
- [x] Block appears in WordPress editor block inserter under "Widgets" category
- [x] Block loads without JavaScript console errors
- [x] Block loads without PHP errors in debug log
- [x] Block builds successfully using `npm run build`
- [x] Block icon displays correctly (admin-post icon)

**Acceptance Criteria**: Block loads cleanly in editor with no errors

---

### 2. Manual Post Selection System
**QA-002: Post Search & Selection**
- [x] Post search field allows type-ahead search for `rp_resource` posts
- [x] Search results are accurate and relevant to search terms
- [x] Selected posts appear in "Selected Posts" list with post titles
- [ ] ~~Maximum 10 posts can be selected manually~~
- [x] Only published posts appear in search results

**QA-003: Post Reordering**
- [x] Up/down arrow buttons appear for each selected post
- [x] Up arrow moves post higher in priority (disabled for first post)
- [x] Down arrow moves post lower in priority (disabled for last post)
- [x] Visual position indicators show numbered badges (1, 2, 3...)
- [x] Post order changes reflect immediately in block preview

**QA-004: Post Removal**
- [x] Remove button (X) appears for each selected post
- [x] Remove button works for all posts including the last remaining post
- [x] Removing posts updates the preview immediately
- [ ] No race conditions when removing the last post

**Acceptance Criteria**: Manual post selection provides full CRUD operations with immediate visual feedback

---

### 3. Taxonomy Priority System
**QA-005: Taxonomy Display**
- [x] All 6 taxonomies display in alphabetical order by default:
  1. FLTCA Alignment
  2. Resource Audience  
  3. Resource Category
  4. Resource Organization
  5. Resource Topic
  6. Resource Type
- [x] Each taxonomy shows name and reorder controls
- [x] Two-row layout: taxonomy name + up/down controls

**QA-006: Taxonomy Reordering**
- [x] Up/down arrows allow reordering of taxonomy priority
- [x] Visual position indicators show numbered badges
- [ ] ~~First taxonomy (#1) has blue highlighting~~
- [x] Taxonomy order changes affect algorithm results
- [x] No add/remove functionality (simple reordering only)

**Acceptance Criteria**: Taxonomy priority system provides clear visual hierarchy and affects algorithm behavior

---

### 4. Real-time Preview Updates
**QA-007: Manual Selection Preview**
- [x] Block preview updates immediately when posts are added
- [x] Block preview updates immediately when posts are removed
- [x] Block preview updates immediately when posts are reordered
- [x] Preview shows correct post titles and order
- [x] Preview respects `numberOfPosts` setting

**QA-008: Taxonomy Changes Preview**
- [x] Block preview updates when taxonomy terms are added in editor
- [x] Block preview updates when taxonomy terms are removed in editor
- [x] Preview updates work for all 6 supported taxonomies
- [x] Related posts change to reflect new taxonomy relationships
- [x] No excessive API calls or performance issues

**QA-009: Settings Changes Preview**
- [x] Preview updates when `numberOfPosts` is changed
- [x] Preview updates when display options are modified
- [x] Changes apply immediately without page refresh

**Acceptance Criteria**: All changes trigger immediate, accurate preview updates

---

### 5. 4-Level Algorithm System
**QA-010: Priority 1 - Manual Selection**
- [x] Manually selected posts always appear first in exact order
- [x] Manual posts take priority over all algorithmic selections
- [x] Works with 1-10 manually selected posts
- [x] Duplicate prevention: manual posts don't appear twice

**QA-011: Priority 2 - Taxonomy-Based Smart Matching**
- [x] Algorithm finds posts with ALL current post's taxonomy terms (exact match)
- [x] If no exact matches, finds posts with ANY shared terms (partial match)
- [x] Results are weighted by number of shared terms
- [x] Uses taxonomy priority order set by editor
- [x] ~~Skips taxonomies where current post has no terms~~ Deterministic selection from taxonomy hierarchy

**QA-012: Priority 3 - Taxonomy Fallback**
- [x] Triggered when Priority 2 doesn't find enough posts
- [x] Uses first available taxonomy from current post's terms
- [x] Provides deterministic, consistent results
- [x] Excludes current post and already selected posts

**QA-013: Priority 4 - Recent Posts Fallback**
- [x] Triggered when all taxonomy-based searches fail
- [x] Selects recent posts from same post type (`rp_resource`)
- [x] Excludes current post and duplicates
- [x] Ensures block always displays content

**Acceptance Criteria**: Algorithm fills remaining slots intelligently with proper fallback hierarchy

---

### 6. Meta Field Synchronization
**QA-014: Backward Compatibility**
- [x] Existing posts with `_rp_resource_related_resources` meta field data auto-populate in block
- [x] Meta field posts appear as selected posts in Inspector
- [x] Block changes update meta field in real-time
- [x] Meta field remains source of truth for data persistence

**QA-015: Data Synchronization**
- [x] Adding posts updates meta field immediately `_rp_resource_related_resources": []`
- [x] Removing posts updates meta field immediately `_rp_resource_related_resources": []`
- [x] Reordering posts updates meta field order
- [x] Only valid, published post IDs are synced
- [x] Invalid post IDs are filtered out

**Acceptance Criteria**: Seamless integration with existing meta field data and real-time synchronization

---

## 🎨 **User Experience Criteria**

### 7. Inspector Panel Usability
**QA-016: Interface Design**
- [x] Clean, professional appearance consistent with WordPress UI
- [x] Clear section headers: "Selected Posts" and "Taxonomy Priority"
- [x] Logical grouping of related controls
- [x] Adequate spacing and visual hierarchy
- [x] No UI elements overlap or appear broken

**QA-017: Visual Feedback**
- [x] Numbered badges clearly show priority order
- [ ] ~~Blue highlighting indicates #1 priority items~~
- [x] Button states (enabled/disabled) are clear
- [x] Loading states during search are apparent
- [x] Error states are user-friendly

**QA-018: Responsive Design**
- [x] Interface works on different screen sizes
- [x] Controls remain accessible on mobile devices
- [x] Text remains readable at all sizes
- [x] No horizontal scrolling required

**Acceptance Criteria**: Interface is intuitive, accessible, and provides clear visual feedback

---

### 8. Performance & Reliability
**QA-019: Search Performance**
- [x] Post search responds within 2 seconds
- [x] Search handles large numbers of posts (500+)
- [x] No memory leaks during extended use
- [x] Smooth scrolling through search results

**QA-020: Algorithm Performance**
- [x] Related posts load within 3 seconds
- [x] Algorithm handles posts with many taxonomy terms
- [x] No timeouts or server errors under normal load
- [x] Consistent performance across different post types

**QA-021: Real-time Updates Performance**
- [x] Preview updates complete within 1 second
- [x] No excessive server requests during editing
- [x] Smooth user experience during rapid changes
- [x] No browser freezing or unresponsiveness

**Acceptance Criteria**: System performs well under normal and stress conditions

---

## 🔧 **Technical Criteria**

### 9. WordPress Standards Compliance
**QA-022: Code Quality**
- [x] No PHP errors or warnings in debug log
- [x] No JavaScript console errors
- [x] Follows WordPress coding standards
- [x] Proper escaping and sanitization
- [x] Secure handling of user input

**QA-023: Data Integrity**
- [x] Post IDs are validated before processing
- [x] Taxonomy terms are properly sanitized
- [x] Database queries are optimized and secure
- [x] No SQL injection vulnerabilities
- [x] Proper error handling for edge cases

**Acceptance Criteria**: Code meets WordPress security and performance standards

---

### 10. Browser Compatibility
**QA-024: Cross-Browser Testing**
- [x] Works in Chrome (latest 2 versions)
- [x] Works in Firefox (latest 2 versions)
- [x] Works in Safari (latest 2 versions)
- [x] Works in Edge (latest 2 versions)
- [x] Graceful degradation in older browsers

**QA-025: Device Testing**
- [x] Functions on desktop computers
- [x] Functions on tablets
- [x] Functions on mobile phones
- [x] Touch interactions work properly
- [x] Keyboard navigation is accessible

**Acceptance Criteria**: Consistent functionality across all supported browsers and devices

---

## 🚨 **Edge Cases & Error Handling**

### 11. Data Edge Cases
**QA-026: Empty Data Scenarios**
- [x] Graceful handling when no posts exist
- [x] Graceful handling when no taxonomy terms exist
- [x] Proper fallback when search returns no results. Ultimate fallback: Recent posts from same post type
- [x] Clear messaging for empty states

**QA-027: Invalid Data Scenarios**
- [x] Handles deleted posts gracefully
- [x] Handles posts changed to draft status
- [x] Handles invalid taxonomy terms
- [x] Handles corrupted meta field data

**QA-028: Boundary Conditions**
- [x] Works with maximum number of posts (10 manual + algorithmic)
- [x] Works with posts having many taxonomy terms (20+)
- [x] Works with posts having no taxonomy terms
- [x] Handles very long post titles

**Acceptance Criteria**: System handles all edge cases without errors or data loss

---

### 12. Algorithm Edge Cases
**QA-029: Deterministic Behavior**
- [x] Same post + same settings = same related posts (consistency)
- [x] Results don't change on page reload
- [x] Results don't change when block is removed and re-added
- [x] Tie-breaking is deterministic and consistent

**QA-030: Duplicate Prevention**
- [x] No duplicate posts appear in results
- [x] Current post never appears in related posts
- [x] Manual selection doesn't duplicate algorithmic results
- [x] Works correctly with partial overlaps

**Acceptance Criteria**: Algorithm behavior is predictable and prevents all duplicate scenarios

---

## 📊 **Acceptance Testing Workflows**

### Workflow 1: New Content Editor Setup
1. Add RP Posts Related block to new `rp_resource` post
2. Search and select 2 manual posts
3. Reorder taxonomy priorities
4. Verify preview shows correct related posts
5. Save post and verify persistence

**Expected Result**: Block works immediately for new users without training

### Workflow 2: Existing Content Migration
1. Open existing post with `_rp_resource_related_resources` meta field
2. Add RP Posts Related block
3. Verify existing related posts auto-populate
4. Make changes to selection
5. Verify meta field updates correctly

**Expected Result**: Seamless migration from existing related posts system

### Workflow 3: Taxonomy-Driven Content Discovery
1. Create new post with specific taxonomy terms
2. Add RP Posts Related block with no manual selection
3. Modify taxonomy terms in editor
4. Verify related posts update in real-time
5. Reorder taxonomy priorities and verify changes

**Expected Result**: Smart algorithm provides relevant recommendations based on content

### Workflow 4: High-Volume Content Testing
1. Test with 500+ posts in system
2. Test with posts having 10+ taxonomy terms each
3. Verify search performance remains acceptable
4. Verify algorithm performance under load
5. Test concurrent editing scenarios

**Expected Result**: System performs well with realistic content volumes

---

## ✅ **Sign-off Criteria**

**Development Sign-off**:
- [ ] All QA criteria pass
- [x] No critical or high-priority bugs remain
- [x] Performance meets benchmarks
- [x] Code review completed

**Content Team Sign-off**:
- [x] User workflows tested successfully
- [x] Interface is intuitive and learnable
- [x] Meets content management requirements
- [ ] Migration path is clear

**Technical Sign-off**:
- [x] Security review passed
- [x] WordPress standards compliance verified
- [x] Browser compatibility confirmed
- [x] Performance benchmarks met

**Final Production Readiness**:
- [ ] All sign-offs obtained
- [ ] Documentation complete
- [ ] Training materials prepared
- [ ] Deployment plan approved

---

## 📝 **Testing Notes**

**Test Environment**: WordPress 6.0+ with Gutenberg editor  
**Test Data**: Minimum 50 `rp_resource` posts with varied taxonomy terms  
**Test Browsers**: Chrome, Firefox, Safari, Edge (latest versions)  
**Test Devices**: Desktop, tablet, mobile  

**Performance Benchmarks**:
- Post search: < 2 seconds
- Algorithm execution: < 3 seconds  
- Preview updates: < 1 second
- Block loading: < 2 seconds

**Critical Path**: Manual selection → Taxonomy priority → Real-time updates → Meta field sync → Algorithm fallback

This QA criteria document ensures comprehensive testing of all implemented features and provides clear success metrics for production deployment.
