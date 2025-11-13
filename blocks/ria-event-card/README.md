# RIA Event Card Block

Display comprehensive event information with dates, location, registration, metadata, and multiple layout options.

## Version
1.0.0 - Production Ready

## Features

### Core Event Information
- **Title & Description**: Rich text editing for event name and details
- **Dates & Time**: Start/end dates with time support and timezone
- **Location**: Support for in-person, virtual, and hybrid events
- **Featured Image**: Media upload with alt text support
- **Registration**: URL with customizable button text and deadline tracking

### Metadata
- **Speakers**: Add multiple speakers with name, title, and bio
- **Organizers**: List organizers with name, role, and email
- **Topics**: Tag events with relevant topics (displayed as badges)
- **Cost**: Display event pricing or "Free"
- **Capacity**: Track total capacity and spots remaining

### Status & Badges
- **Event Status**: Upcoming, Ongoing, Past, Cancelled (color-coded)
- **Signature Event**: Mark flagship events with gold badge
- **Featured Event**: Highlight important events

### Layout Options
1. **Card Layout** (Default): Standard card with vertical content flow
2. **Compact Layout**: Horizontal layout with smaller image
3. **Featured Layout**: Large hero image with overlaid badges
4. **List Layout**: Horizontal layout optimized for list displays

### Styling Options
- Background color customization
- Accent color for buttons and highlights
- Border width, style, color, and radius controls
- Box shadow options (none, small, medium, large, xlarge, 2xlarge)
- Hover shadow effects
- 4 button styles (primary, secondary, tertiary, ghost)

### Animations
- 15+ entrance animations (fade, slide, zoom, bounce, rotate, flip)
- Animation duration, delay, and easing controls
- Hover animations (lift, grow, glow)
- Respects user's reduced motion preferences

## Block Attributes (60+)

### Layout & Display
- `layout`: card | compact | featured | list
- `showImage`, `showDate`, `showTime`, `showLocation`
- `showCost`, `showCapacity`, `showStatusBadge`
- `showOrganizers`, `showSpeakers`, `showTopics`

### Event Details
- `title`, `description`
- `startDate`, `endDate`, `startTime`, `endTime`, `timezone`
- `dateFormat`: short | long | custom
- `customDateFormat`: PHP date format string

### Location
- `locationType`: in-person | virtual | hybrid
- `locationName`, `locationAddress`
- `virtualUrl`: For virtual/hybrid events

### Registration
- `registrationUrl`, `registrationButtonText`
- `registrationDeadline`: Auto-closes registration when passed
- `showRegistrationButton`
- `buttonStyle`: primary | secondary | tertiary | ghost

### Capacity & Cost
- `cost`: Free text (e.g., "Free", "$25", "$10-$50")
- `capacity`: Total event capacity (number)
- `spotsRemaining`: Remaining spots (displays "Sold Out" if 0)

### Status & Flags
- `eventStatus`: upcoming | ongoing | past | cancelled
- `isSignatureEvent`: Boolean for flagship events
- `isFeatured`: Boolean for featured events

### Metadata Arrays
- `organizers`: Array of {name, role, email}
- `speakers`: Array of {name, title, bio}
- `topics`: Array of strings

### Styling
- `backgroundColor`, `accentColor`
- `borderWidth`, `borderStyle`, `borderColor`, `borderRadius`
- `boxShadow`, `hoverShadow`

### Animations
- `animationEnabled`, `animationType`, `animationDuration`
- `animationDelay`, `animationEasing`, `hoverAnimation`

## Editor Controls

### InspectorControls Panels
1. **Layout**: Choose layout variant
2. **Event Details**: Cost and capacity settings
3. **Dates & Time**: Date pickers, time inputs, format options
4. **Location**: Location type, name, address, virtual URL
5. **Featured Image**: Media upload
6. **Registration**: URL, button text, deadline
7. **Status & Badges**: Event status, signature/featured flags
8. **Metadata**: Organizers, speakers, topics (add/remove interface)
9. **Button Style**: Primary/secondary/tertiary/ghost
10. **Colors**: Background and accent color pickers
11. **Borders & Shadows**: Complete border and shadow controls
12. **Animation**: Animation type, duration, delay, easing, hover effects

## Special Features

### Smart Registration
- Automatically shows "Registration Closed" if deadline has passed
- Supports external registration URLs

### Location Types with Icons
- 📍 In-Person: Shows location name and address
- 💻 Virtual: Shows "Virtual Event" indicator
- 🔀 Hybrid: Shows both physical and virtual details

### Capacity Tracking
- Shows "X spots remaining" when spots are available
- Shows "Sold Out" when spotsRemaining = 0
- Optional display (can be hidden)

### Status Badges (Color-Coded)
- **Upcoming**: Green (#4caf50)
- **Ongoing**: Blue (#2196f3)
- **Past**: Gray (#9e9e9e)
- **Cancelled**: Red (#f44336)

### Signature Event Badge
- Gold gradient background (#ffd700 to #ffed4e)
- Special border and top accent stripe
- Star icon (⭐)

### Date Formatting
- **Short**: "Jan 15" (month abbreviation + day)
- **Long**: "January 15, 2025" (full month + day + year)
- **Custom**: Use PHP date format string (e.g., "F j, Y")

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px
- Compact and List layouts stack vertically on mobile
- Featured layout reduces image height on mobile
- Registration button goes full-width on mobile

## File Structure

```
ria-event-card/
├── event-card.php              # PHP registration (15 lines)
├── package.json                # NPM dependencies & scripts
├── README.md                   # This file
├── src/                        # Source files (before build)
│   ├── block.json             # Block metadata (60+ attributes)
│   ├── index.js               # Main entry point
│   ├── edit.js                # Editor component (850+ lines)
│   ├── save.js                # Frontend component (280+ lines)
│   ├── editor.scss            # Editor styles (388 lines)
│   └── style.scss             # Frontend styles (680+ lines)
├── build/                      # Compiled output (production)
│   ├── block.json             # Final metadata
│   ├── index.js               # Compiled JavaScript (32 KB)
│   ├── index.css              # Compiled editor styles (6.4 KB)
│   ├── style-index.css        # Compiled frontend styles (12 KB)
│   ├── index-rtl.css          # RTL editor styles (6.4 KB)
│   ├── style-index-rtl.css    # RTL frontend styles (12 KB)
│   └── index.asset.php        # Auto-generated dependencies
└── node_modules/               # NPM packages (1664 packages)
```

## Build Stats
- **Total Source**: ~2,200 lines of code
- **JavaScript Bundle**: 32 KB (minified)
- **Editor CSS**: 6.4 KB
- **Frontend CSS**: 12 KB
- **Total Package**: ~50 KB (excluding node_modules)

## Usage Examples

### Basic Event Card
```php
<!-- wp:ria/event-card {
  "title":"RIA Annual Conference 2025",
  "startDate":"2025-06-15",
  "startTime":"9:00 AM",
  "endTime":"5:00 PM",
  "timezone":"EST",
  "locationType":"in-person",
  "locationName":"Convention Center",
  "cost":"$199",
  "registrationUrl":"https://example.com/register"
} /-->
```

### Featured Signature Event
```php
<!-- wp:ria/event-card {
  "layout":"featured",
  "isSignatureEvent":true,
  "isFeatured":true,
  "title":"Research Innovation Summit",
  "showSpeakers":true,
  "speakers":[
    {"name":"Dr. Jane Smith","title":"Lead Researcher","bio":"Expert in..."}
  ],
  "topics":["Research","Innovation","Technology"]
} /-->
```

### Virtual Event with Topics
```php
<!-- wp:ria/event-card {
  "layout":"compact",
  "locationType":"virtual",
  "virtualUrl":"https://zoom.us/j/123456789",
  "showTopics":true,
  "topics":["Webinar","Training","Networking"],
  "cost":"Free",
  "capacity":100,
  "spotsRemaining":25
} /-->
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE 11+ (with polyfills)
- Mobile browsers (iOS Safari, Chrome Android)

## Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Respects `prefers-reduced-motion`
- Color contrast WCAG AA compliant

## Performance
- Optimized bundle size (32 KB total)
- CSS-based animations (GPU accelerated)
- Lazy image loading support
- Minimal JavaScript (display-only, no frontend JS needed)

## Dependencies
- WordPress 5.8+
- @wordpress/scripts ^27.0.0
- @wordpress/block-editor ^13.1.0
- @wordpress/blocks ^13.1.0
- @wordpress/components ^28.1.0

## Build Commands

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start

# Production build
npm run build

# Code formatting
npm run format

# Lint CSS
npm run lint:css

# Lint JavaScript
npm run lint:js
```

## Registration

Block is registered using the RIA Too standard pattern:

```php
new RP_Custom_Block( 'ria-event-card', 'ria-event-card/build/', 'ria-event-card' );
```

Must be registered in `gutenberg-support.php`:

```php
// MOLECULES (Functional Components)
require_once get_template_directory() . '/blocks/ria-event-card/event-card.php';
```

And added to allowed blocks array:

```php
$allowed_blocks = array(
  // ... other blocks
  'ria/event-card',
);
```

## Notes
- This is a display-only block (no frontend JavaScript)
- Animations handled by theme's ria-animations-v2.js
- Uses WordPress DateTimePicker for date selection
- MediaUpload for featured image
- All 60+ attributes are optional (sensible defaults)
- Registration deadline automatically closes registration when passed
- Capacity tracking shows "Sold Out" when spotsRemaining = 0

## Future Enhancements (Potential)
- iCal export for "Add to Calendar"
- Google Maps integration for location
- Social sharing buttons
- RSVP tracking (requires backend)
- Recurring event support
- Multiple session times
- Waitlist functionality

## Author
Rob Hudson - RIA Too Development

## License
GPL-2.0-or-later
