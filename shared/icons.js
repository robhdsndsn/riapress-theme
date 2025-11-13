/**
 * RIA Shared Icon Library
 *
 * Lightweight SVG icon components for all RIA blocks.
 * Zero external dependencies, fully recolorable, ~3KB total.
 *
 * Usage:
 *   import { ChevronRight, Star } from '../../shared/icons';
 *   <ChevronRight size={20} className="my-icon" />
 */

import { createElement } from 'react';

/**
 * Base Icon component
 * @param {Object} props - Icon props
 * @param {number} props.size - Icon size in pixels (default: 24)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fill - Fill color (default: 'none')
 * @param {string} props.stroke - Stroke color (default: 'currentColor')
 * @param {number} props.strokeWidth - Stroke width (default: 2)
 * @param {Array} props.children - SVG path elements
 */
const Icon = ({
	size = 24,
	className = '',
	fill = 'none',
	stroke = 'currentColor',
	strokeWidth = 2,
	children
}) => createElement(
	'svg',
	{
		xmlns: 'http://www.w3.org/2000/svg',
		width: size,
		height: size,
		viewBox: '0 0 24 24',
		fill,
		stroke,
		strokeWidth,
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
		className: `ria-icon ${className}`.trim()
	},
	children
);

// Navigation Icons
export const ChevronRight = (props) => Icon({
	...props,
	children: createElement('path', { d: 'm9 18 6-6-6-6' })
});

export const ChevronLeft = (props) => Icon({
	...props,
	children: createElement('path', { d: 'm15 18-6-6 6-6' })
});

export const ArrowRight = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M5 12h14' }),
		createElement('path', { key: 2, d: 'm12 5 7 7-7 7' })
	]
});

// Shapes
export const Circle = (props) => Icon({
	...props,
	children: createElement('circle', { cx: '12', cy: '12', r: '10' })
});

export const Diamond = (props) => Icon({
	...props,
	children: createElement('path', { d: 'M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z' })
});

// Symbols
export const Plus = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M5 12h14' }),
		createElement('path', { key: 2, d: 'M12 5v14' })
	]
});

export const Minus = (props) => Icon({
	...props,
	children: createElement('path', { d: 'M5 12h14' })
});

export const X = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M18 6 6 18' }),
		createElement('path', { key: 2, d: 'm6 6 12 12' })
	]
});

export const Check = (props) => Icon({
	...props,
	children: createElement('path', { d: 'M20 6 9 17l-5-5' })
});

export const Hash = (props) => Icon({
	...props,
	children: [
		createElement('line', { key: 1, x1: '4', x2: '20', y1: '9', y2: '9' }),
		createElement('line', { key: 2, x1: '4', x2: '20', y1: '15', y2: '15' }),
		createElement('line', { key: 3, x1: '10', x2: '8', y1: '3', y2: '21' }),
		createElement('line', { key: 4, x1: '16', x2: '14', y1: '3', y2: '21' })
	]
});

export const Info = (props) => Icon({
	...props,
	children: [
		createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
		createElement('path', { key: 2, d: 'M12 16v-4' }),
		createElement('path', { key: 3, d: 'M12 8h.01' })
	]
});

// Rating & Status
export const Star = (props) => Icon({
	...props,
	children: createElement('polygon', {
		points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
	})
});

export const Heart = (props) => Icon({
	...props,
	children: createElement('path', {
		d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'
	})
});

export const Award = (props) => Icon({
	...props,
	children: [
		createElement('circle', { key: 1, cx: '12', cy: '8', r: '6' }),
		createElement('path', { key: 2, d: 'M15.477 12.89 17 22l-5-3-5 3 1.523-9.11' })
	]
});

export const ThumbsUp = (props) => Icon({
	...props,
	children: createElement('path', {
		d: 'M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z'
	})
});

// Objects & Tools
export const Tag = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z' }),
		createElement('path', { key: 2, d: 'M7 7h.01' })
	]
});

export const Image = (props) => Icon({
	...props,
	children: [
		createElement('rect', { key: 1, width: '18', height: '18', x: '3', y: '3', rx: '2', ry: '2' }),
		createElement('circle', { key: 2, cx: '9', cy: '9', r: '2' }),
		createElement('path', { key: 3, d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' })
	]
});

export const Camera = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z' }),
		createElement('circle', { key: 2, cx: '12', cy: '13', r: '3' })
	]
});

export const Shield = (props) => Icon({
	...props,
	children: createElement('path', {
		d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
	})
});

export const Lock = (props) => Icon({
	...props,
	children: [
		createElement('rect', { key: 1, width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }),
		createElement('path', { key: 2, d: 'M7 11V7a5 5 0 0 1 10 0v4' })
	]
});

export const Settings = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }),
		createElement('circle', { key: 2, cx: '12', cy: '12', r: '3' })
	]
});

// Communication & Media
export const Megaphone = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'm3 11 18-5v12L3 14v-3z' }),
		createElement('path', { key: 2, d: 'M11.6 16.8a3 3 0 1 1-5.8-1.6' })
	]
});

export const Lightbulb = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' }),
		createElement('path', { key: 2, d: 'M9 18h6' }),
		createElement('path', { key: 3, d: 'M10 22h4' })
	]
});

export const Cloud = (props) => Icon({
	...props,
	children: createElement('path', {
		d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'
	})
});

export const Users = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
		createElement('circle', { key: 2, cx: '9', cy: '7', r: '4' }),
		createElement('path', { key: 3, d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
		createElement('path', { key: 4, d: 'M16 3.13a4 4 0 0 1 0 7.75' })
	]
});

export const BarChart3 = (props) => Icon({
	...props,
	children: [
		createElement('path', { key: 1, d: 'M3 3v18h18' }),
		createElement('path', { key: 2, d: 'M18 17V9' }),
		createElement('path', { key: 3, d: 'M13 17V5' }),
		createElement('path', { key: 4, d: 'M8 17v-3' })
	]
});

// Export all icons as a single object for convenience
export default {
	// Navigation
	ChevronRight,
	ChevronLeft,
	ArrowRight,
	// Shapes
	Circle,
	Diamond,
	// Symbols
	Plus,
	Minus,
	X,
	Check,
	Hash,
	Info,
	// Rating & Status
	Star,
	Heart,
	Award,
	ThumbsUp,
	// Objects & Tools
	Tag,
	Image,
	Camera,
	Shield,
	Lock,
	Settings,
	// Communication & Media
	Megaphone,
	Lightbulb,
	Cloud,
	Users,
	BarChart3
};
