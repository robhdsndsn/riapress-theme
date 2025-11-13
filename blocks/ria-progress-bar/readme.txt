=== RIA Progress Bar Block ===
Contributors: Rob Hudson
Tags: progress, bar, skill, percentage, indicator, meter, chart
Requires at least: 6.0
Tested up to: 6.7
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Display progress bars, skill levels, or percentage indicators with animated fills and customizable styling.

== Description ==

The RIA Progress Bar block is a powerful and flexible WordPress Gutenberg block for displaying progress indicators, skill levels, completion percentages, and other metrics in a visually appealing way.

= Key Features =

**Multiple Progress Bars**
* Add unlimited progress bars in a single block
* Each bar can have individual colors and percentages
* Easy management interface for adding/removing bars

**Layout Options**
* 5 layout styles: Default, Thin, Thick, Rounded, Minimal
* Customizable bar height (8px to 60px)
* Flexible label and percentage positioning

**Visual Customization**
* Solid colors or gradient effects
* Horizontal, vertical, or diagonal gradients
* Striped pattern with optional animation
* Border controls (width, style, color, radius)
* Box shadow effects with hover variations

**Animations**
* Smooth scroll-triggered progress fill animation
* Customizable animation duration, delay, and easing
* Container animations (fade, slide, zoom, etc.)
* Stagger effect for multiple bars
* Hover animations (lift, grow, glow, pulse, etc.)

**Display Options**
* Show/hide labels and percentages
* Multiple positioning options for labels (above, below, inside, left, right)
* Multiple positioning options for percentages (inside, right, above, below)
* Icon support (Lucide icons)

**Accessibility**
* WCAG 2.1 AA compliant
* Proper ARIA labels and roles
* Keyboard navigation support
* Respects prefers-reduced-motion settings
* High contrast mode support

**Responsive Design**
* Mobile-first approach
* Breakpoints at 768px and 480px
* Intelligent layout stacking on mobile
* Optimized text sizes for small screens

== Installation ==

This block is part of the RIAPress theme and is automatically available when the theme is activated.

== Usage ==

1. Add the "RIA Progress Bar" block to your page
2. Use the sidebar controls to add and configure progress bars
3. Customize layout, colors, and animations
4. Publish and view the animated progress bars on your site

= Configuring Progress Bars =

**Adding Bars:**
1. Click "Add Progress Bar" in the sidebar
2. Enter a label and percentage for each bar
3. Optionally customize the color per bar

**Editing Bars:**
1. Select a bar from the list in the sidebar
2. Edit the label, percentage, and color
3. Changes are reflected in real-time in the editor

**Removing Bars:**
Click the trash icon next to any bar in the sidebar list

= Layout Settings =

**Layout Styles:**
* Default: Standard progress bar (24px height)
* Thin: Minimal profile (8px height)
* Thick: Bold and prominent (48px height)
* Rounded: Pill-shaped bars with full border radius
* Minimal: Transparent with bottom border only

**Height:**
Customize the exact height from 8px to 60px

= Color Settings =

**Basic Colors:**
* Bar Color: Default color for all bars (can be overridden per bar)
* Background Color: Color of the empty portion
* Text Color: Labels and percentages outside the bar
* Inside Text Color: Text displayed inside the progress bar

**Gradients:**
1. Enable "Use Gradient"
2. Choose start and end colors
3. Select direction (horizontal, vertical, diagonal)
4. Gradients apply to all bars

= Animation Settings =

**Progress Fill Animation:**
* Enable "Animate on Scroll" for fill animation
* Duration: 0.3 to 5 seconds
* Delay: 0 to 2 seconds
* Easing: Linear, Ease, Ease-In, Ease-Out, Ease-In-Out

**Container Animation:**
* Enable container animation for entrance effects
* Choose from 15+ animation types
* Stagger effect animates multiple bars sequentially

**Hover Effects:**
* Lift, Grow, Shrink, Rotate, Tilt
* Glow, Pulse, Bounce
* Combined with shadow transitions

= Advanced Features =

**Striped Pattern:**
1. Enable "Striped Pattern"
2. Optionally enable "Animated Stripes" for moving effect
3. Stripes are diagonal at 45 degrees

**Shadows:**
* Box shadow: 7 preset sizes or inner shadow
* Hover shadow: Changes on hover
* Smooth transitions

**Borders:**
* Width: 0 to 10px
* Style: None, Solid, Dashed, Dotted, Double, Groove, Ridge
* Custom color and radius

== Frequently Asked Questions ==

= Can I use different colors for each bar? =

Yes! Each bar in the bars array can have its own color. The default bar color serves as a template for new bars.

= How do I make the bars fill automatically on page load? =

Enable "Animate on Scroll" in the Progress Animation settings. Bars will fill when they enter the viewport.

= Can I disable animations for performance? =

Yes, set "Animate on Scroll" to false, and the bars will display at their full percentage immediately. The block also respects the prefers-reduced-motion accessibility setting.

= How do I add icons to the progress bars? =

Enable "Show Icon" in Display Options, then enter a Lucide icon name (e.g., "trophy", "check-circle"). Icons appear next to labels.

= What's the difference between container animation and progress animation? =

* Progress Animation: The filling of the bar from 0% to target percentage
* Container Animation: The entrance animation of the entire block (fade in, slide in, etc.)

= Can I use gradients with individual bar colors? =

When gradients are enabled, they override individual bar colors and use the global gradient settings (start color, end color, direction).

= How do I position labels inside the progress bar? =

Select "Inside" from the Label Position dropdown. Labels will appear within the filled portion of the bar with the Inside Text Color.

= Are there mobile-specific considerations? =

Yes, the block automatically adjusts for mobile:
* Horizontal layouts stack vertically on tablets
* Text sizes reduce on small screens
* Padding adjusts for touch targets

= How do I make progress bars stagger their animation? =

The block automatically staggers multiple bars with a 100ms delay between each when "Animate on Scroll" is enabled.

= Can I export/import bar configurations? =

Bar configurations are stored as block attributes in the WordPress editor. You can copy the entire block to reuse configurations.

== Changelog ==

= 1.0.0 =
* Initial release
* Multiple progress bars support
* 5 layout variants
* Gradient effects
* Striped patterns with animation
* Scroll-triggered animations
* Full accessibility support
* Responsive design
* Border and shadow controls
* Hover effects

== Technical Details ==

**Block Attributes:** 45+ configurable attributes
* bars: Array of bar objects (label, percentage, color)
* layout: default | thin | thick | rounded | minimal
* showLabel, labelPosition: Label display controls
* showPercentage, percentagePosition: Percentage display controls
* height: Bar height in pixels
* Colors: barColor, backgroundColor, textColor, insideTextColor
* Gradients: useGradient, gradientStart, gradientEnd, gradientDirection
* Effects: stripedPattern, animated
* Progress Animation: animateOnScroll, animationDuration, animationDelay, easing
* Icons: showIcon, icon, iconPosition
* Borders: borderWidth, borderStyle, borderColor, borderRadius
* Shadows: boxShadow, hoverShadow
* Container Animation: animationEnabled, animationType, containerAnimationDuration, etc.

**Frontend JavaScript:**
* Intersection Observer API for scroll detection
* CSS transitions for smooth animations
* Respects prefers-reduced-motion
* ARIA live regions for screen reader updates
* MutationObserver for dynamic content

**Styling:**
* CSS custom properties for theming
* Mobile-first responsive design
* High contrast mode support
* Dark mode compatible (via theme support)
* RTL language support (auto-generated)

== Support ==

For support, bug reports, or feature requests, please contact the RIA Too development team.

== Credits ==

Developed by Rob Hudson for the RIA Too project.
Uses WordPress Gutenberg block editor components.
Animations powered by CSS transitions and Intersection Observer API.
