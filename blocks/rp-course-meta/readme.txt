=== rp-course-meta ===
Contributors: Zeitguys
Tags: block, gutenberg, course, duration
Requires at least: 6.0
Tested up to: 6.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A set of Course Meta blocks. Initial block outputs the Course Duration from custom meta `_rp_course_time`.

== Blocks ==

= Course Duration =
- Displays `_rp_course_time` for the current Course post.
- Attributes:
  - `label` (string) — defaults to `"Duration:"`
  - `showLabel` (boolean) — defaults to `true`; if `false`, label has `screen-reader-text` class.

== Development ==

- Build: run `npm install` then `npm run start` inside `blocks/rp-course-meta`.
- Strings use `_x()` with textdomain `course-meta`.
