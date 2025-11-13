# How to Add Icons to the Shared Icon Library

## Quick Reference

**File Location:** `/shared/icons.js`

**Current Icons:** 25 icons (ChevronRight, Star, Heart, Tag, etc.)

## Adding a New Icon - 3 Steps

### Step 1: Find the SVG Path

Visit [Lucide Icons](https://lucide.dev/icons/) or any SVG icon source and copy the SVG paths.

Example for "Bell" icon from Lucide:
```html
<svg>
  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
</svg>
```

### Step 2: Add to icons.js

Open `/shared/icons.js` and add your icon function before the `export default` at the bottom:

```javascript
export const Bell = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' }),
		createElement('path', { key: 2, d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' })
	]
});
```

**For single path icons:**
```javascript
export const Search = (props) => Icon({
	...props,
	children: createElement('path', { d: 'm21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z' })
});
```

### Step 3: Add to Export Object

Scroll to the bottom of `icons.js` and add your icon to the default export:

```javascript
export default {
	// Navigation
	ChevronRight,
	ChevronLeft,
	ArrowRight,
	// ... existing icons ...

	// YOUR NEW ICONS
	Bell,
	Search,
};
```

## Using Your New Icon

### In Block Edit.js:
```javascript
import * as Icons from '../../../shared/icons';

// Then use it:
<Icons.Bell size={20} className="notification-icon" />
```

### In Block Save.js:
```javascript
import * as Icons from '../../../shared/icons';

// If using dynamic selection:
const iconMap = {
	'Bell': Icons.Bell,
	'Search': Icons.Search,
	// ... other icons
};

const MyIcon = iconMap[iconName];
if (MyIcon) {
	return <MyIcon size={24} />;
}
```

## Icon Component Props

All icons accept these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | number | 24 | Icon size in pixels |
| `className` | string | '' | Additional CSS classes |
| `fill` | string | 'none' | Fill color |
| `stroke` | string | 'currentColor' | Stroke color (inherits from CSS color) |
| `strokeWidth` | number | 2 | Stroke width |

## Examples

### Basic Usage:
```jsx
<Icons.Star size={16} />
```

### Custom Colors:
```jsx
<Icons.Heart
	size={24}
	fill="red"
	stroke="darkred"
/>
```

### With CSS Classes:
```jsx
<Icons.Tag className="my-custom-icon hover:text-blue-500" />
```

### Recolor via CSS:
```css
.my-icon {
	color: blue; /* Changes stroke color */
}
```

## Converting Complex Icons

For icons with multiple shapes (circles, rects, etc.):

```javascript
// Example: Camera icon
export const Camera = (props) => Icon({
	...props,
	children: [
		createElement('path', {
			key: 1,
			d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z'
		}),
		createElement('circle', {
			key: 2,
			cx: '12',
			cy: '13',
			r: '3'
		})
	]
});
```

## Best Practices

1. **Name Consistently:** Use PascalCase (e.g., `ChevronRight`, not `chevron_right`)
2. **Group Logically:** Keep similar icons together in the file
3. **Test First:** Add icon and test in one block before using everywhere
4. **Document Usage:** If icon has special meaning, add a comment
5. **Keep it Light:** Only add icons you actually use

## Current Icon Groups

- **Navigation:** ChevronRight, ChevronLeft, ArrowRight
- **Shapes:** Circle, Diamond
- **Symbols:** Plus, Minus, X, Check, Hash, Info
- **Rating:** Star, Heart, Award, ThumbsUp
- **Objects:** Tag, Image, Camera, Shield, Lock, Settings
- **Communication:** Megaphone, Lightbulb, Cloud, Users, BarChart3

## Troubleshooting

**Icon not showing?**
- Check you exported it: `export const MyIcon = ...`
- Check it's in default export object
- Verify import path: `import * as Icons from '../../../shared/icons'`

**Icon looks wrong?**
- Verify SVG paths copied correctly
- Check viewBox is `0 0 24 24` (standard)
- Test with larger `size` prop first

**Need to update all blocks?**
- Just rebuild: `npm run build` in each block folder
- No code changes needed in blocks (they auto-import)

## File Size

Current library: ~8KB (25 icons)
Each icon adds: ~200-500 bytes
Target limit: Keep under 20KB total (~50-60 icons)
