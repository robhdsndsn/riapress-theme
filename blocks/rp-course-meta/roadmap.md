# rp-course-meta — Roadmap

Purpose: Add a small family of Course Meta blocks, starting with a single block that outputs the course “Duration” meta. Scaffold and conventions mirror `blocks/rp-event-meta` so we can add more course meta blocks later.

## MVP Block

- Name (human): Course Duration
- Slug (block.json `name`): `zp/course-duration`
- Text domain: `course-meta`
- Post types: only `course`
- Uses Context: `postId`, `postType`
- Data source: custom post meta key `_rp_course_time`
- Rendering: dynamic (server-rendered) via `render.php` (same pattern as `rp-event-meta`)

## Requirements

1) Read and display the value of `_rp_course_time` for the current Course post.
2) Configurable label string with default `"Duration:"`.
3) Toggle to show/hide the label. When hidden, still render the label but with class `screen-reader-text` (so it’s accessible).
4) Strings use `_x()` for translation, e.g. `_x("Duration", "Course Meta - Label", "course-meta")`.

## Block API (attributes)

- `label` (string):
  - default: `"Duration:"`
  - description: editable text for the label shown before the meta value.
- `showLabel` (boolean):
  - default: `true`
  - description: whether to show the label visually; when `false`, add `screen-reader-text` to the label wrapper.

## Editor Behavior

- In the editor, show the live meta value if available (when editing a Course). If no value is set yet, show a placeholder (e.g., `_x('Course Duration', 'Course duration placeholder', 'course-meta')`).
- Provide Inspector Controls:
  - TextControl: Label (binds to `attributes.label`).
  - ToggleControl: Show Label (binds to `attributes.showLabel`).
- Restrict inserter to Course post type using `block.json` `postTypes: ["course"]`.

## Server Rendering (render.php)

- Fetch meta via `get_post_meta( $post_id, '_rp_course_time', true )`.
- If empty, render nothing (or a minimal placeholder if desired in future).
- Output structure example:

```html
<div class="rp-course-duration wp-block-rp-course-duration">
  <span class="rp-course-duration__label {maybe-screen-reader-text}">Duration:</span>
  <span class="rp-course-duration__value">20 minutes</span>
</div>
```

- Apply `screen-reader-text` class to the label when `showLabel` is false; otherwise render normally.

## Styles

- Minimal default styles, matching theme typography.
- Class names (BEM):
  - `.wp-block-rp-course-duration` root
  - `&__label`
  - `&__value`

## Files & Scaffold (mirrors `rp-event-meta`)

```
blocks/
  rp-course-meta/
    course-meta.php               # Registers block(s) via RP_Custom_Block
    src/
      course-duration/
        block.json
        edit.js
        save.js                   # returns null (dynamic)
        render.php
        editor.scss
        style.scss
    package.json                  # copy from `rp-event-meta` and adjust names
    readme.txt                    # basic block readme
```

## i18n

- Use `_x()` for all user-facing strings, context-rich where appropriate.
- Domain: `course-meta`.

## Testing Checklist

- Editor: Inserter shows block only for `course` post type.
- Inspector: Label text editable; Show Label toggle works.
- Frontend: Renders value of `_rp_course_time` with label behavior.
- Accessibility: When Show Label is false, label remains for screen readers.

## Future Extensions

- Additional blocks for other course meta fields (e.g., Course Type, Course URL, Enrollment Form ID).
- Shared `course-meta.php` registering multiple blocks, similar to `rp-event-meta` multi-register example.
- Optional formatting helpers (e.g., time normalization).
