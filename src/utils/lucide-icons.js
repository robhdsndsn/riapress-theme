/**
 * RIAPress Lucide Icons Utility
 * Centralized icon library for all RIAPress blocks
 *
 * This utility provides:
 * - Standardized icon imports
 * - Icon rendering helpers for React and vanilla JS
 * - Icon categorization for easy discovery
 * - Consistent icon sizing and styling
 *
 * @package RIAPress
 * @since 4.4.0
 */

import {
	// Common UI
	Link,
	Mail,
	Phone,
	Globe,
	MapPin,
	Map,
	Calendar,
	CalendarDays,
	Clock,
	Search,
	Filter,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
	ChevronFirst,
	ChevronLast,
	ChevronsUpDown,
	Plus,
	Minus,
	X,
	Check,
	Edit,
	Trash,
	Trash2,
	Copy,
	Share,
	Share2,
	Download,
	Upload,
	ExternalLink,

	// Status & Alerts
	Info,
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	CheckCircle2,
	XCircle,
	HelpCircle,

	// Files & Documents
	File,
	FileText,
	FileCode,
	FileImage,
	FileVideo,
	FileAudio,
	FileArchive,
	Files,
	Folder,
	FolderOpen,
	Archive,

	// Academic & Research
	GraduationCap,
	BookOpen,
	Book,
	BookMarked,
	Library,
	Microscope,
	FlaskConical,
	TestTube,
	Atom,

	// Business & Professional
	Briefcase,
	Building,
	Building2,
	User,
	Users,
	UserPlus,
	UserMinus,
	UserCheck,
	BadgeCheck,
	Award,
	Target,
	TrendingUp,
	TrendingDown,
	BarChart,
	BarChart2,
	BarChart3,
	PieChart,
	LineChart,

	// Communication & Social
	MessageCircle,
	MessageSquare,
	Mail as MailIcon,
	Send,
	Smartphone,
	Monitor,
	Laptop,
	Tablet,
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
	Youtube,
	Github,

	// Media & Content
	Image as ImageIcon,
	Video,
	Music,
	Headphones,
	Mic,
	Camera,
	Film,
	PlayCircle,
	PauseCircle,
	Volume2,
	VolumeX,

	// Development & Code
	Code,
	Code2,
	Terminal,
	Braces,
	FileCode2,
	GitBranch,
	GitCommit,
	GitPullRequest,
	Package,
	Database,
	Server,

	// Navigation & Layout
	Home,
	Menu,
	MoreHorizontal,
	MoreVertical,
	Grid,
	List,
	Layers,
	Columns,
	Rows,
	Layout,
	LayoutGrid,
	LayoutList,
	Sidebar,
	PanelLeft,
	PanelRight,

	// Shapes & Design
	Square,
	Circle,
	Triangle,
	Star,
	Heart,
	Zap,
	Sparkles,
	Droplet,
	Flame,

	// Actions & Controls
	Settings,
	Sliders,
	ToggleLeft,
	ToggleRight,
	Power,
	Lock,
	Unlock,
	Eye,
	EyeOff,
	Maximize,
	Minimize,
	ZoomIn,
	ZoomOut,
	RotateCw,
	RotateCcw,
	RefreshCw,
	Save,

	// Hardware & Devices
	HardDrive,
	Cpu,
	Wifi,
	WifiOff,
	Battery,
	Bluetooth,
	Printer,

	// Location & Travel
	MapPinned,
	Navigation,
	Compass,
	Plane,
	Car,
	Train,

	// Time & Date
	Timer,
	Hourglass,
	Sunrise,
	Sunset,
	Moon,
	Sun,

	// Weather
	Cloud,
	CloudRain,
	CloudSnow,
	CloudLightning,

	// Misc
	Tag,
	Tags,
	Bookmark,
	Bell,
	BellOff,
	Flag,
	Gift,
	Key,
	Lightbulb,
	Shield,
	ShieldCheck,
	Anchor,
	Paperclip,
	AtSign,
	Hash,
	Percent,
	DollarSign,

} from 'lucide-react';

/**
 * Icon Map - Easy reference for all available icons
 * Organized by category for better discovery
 */
export const ICON_MAP = {
	// Common UI
	'link': Link,
	'mail': Mail,
	'phone': Phone,
	'globe': Globe,
	'map-pin': MapPin,
	'map': Map,
	'calendar': Calendar,
	'calendar-days': CalendarDays,
	'clock': Clock,
	'search': Search,
	'filter': Filter,
	'chevron-down': ChevronDown,
	'chevron-up': ChevronUp,
	'chevron-left': ChevronLeft,
	'chevron-right': ChevronRight,
	'chevron-first': ChevronFirst,
	'chevron-last': ChevronLast,
	'chevrons-up-down': ChevronsUpDown,
	'plus': Plus,
	'minus': Minus,
	'x': X,
	'check': Check,
	'edit': Edit,
	'trash': Trash,
	'trash-2': Trash2,
	'copy': Copy,
	'share': Share,
	'share-2': Share2,
	'download': Download,
	'upload': Upload,
	'external-link': ExternalLink,

	// Status & Alerts
	'info': Info,
	'alert-circle': AlertCircle,
	'alert-triangle': AlertTriangle,
	'check-circle': CheckCircle,
	'check-circle-2': CheckCircle2,
	'x-circle': XCircle,
	'help-circle': HelpCircle,

	// Files & Documents
	'file': File,
	'file-text': FileText,
	'file-code': FileCode,
	'file-image': FileImage,
	'file-video': FileVideo,
	'file-audio': FileAudio,
	'file-archive': FileArchive,
	'files': Files,
	'folder': Folder,
	'folder-open': FolderOpen,
	'archive': Archive,

	// Academic & Research
	'graduation-cap': GraduationCap,
	'book-open': BookOpen,
	'book': Book,
	'book-marked': BookMarked,
	'library': Library,
	'microscope': Microscope,
	'flask-conical': FlaskConical,
	'test-tube': TestTube,
	'atom': Atom,

	// Business & Professional
	'briefcase': Briefcase,
	'building': Building,
	'building-2': Building2,
	'user': User,
	'users': Users,
	'user-plus': UserPlus,
	'user-minus': UserMinus,
	'user-check': UserCheck,
	'badge-check': BadgeCheck,
	'award': Award,
	'target': Target,
	'trending-up': TrendingUp,
	'trending-down': TrendingDown,
	'bar-chart': BarChart,
	'bar-chart-2': BarChart2,
	'bar-chart-3': BarChart3,
	'pie-chart': PieChart,
	'line-chart': LineChart,

	// Communication & Social
	'message-circle': MessageCircle,
	'message-square': MessageSquare,
	'send': Send,
	'smartphone': Smartphone,
	'monitor': Monitor,
	'laptop': Laptop,
	'tablet': Tablet,
	'facebook': Facebook,
	'twitter': Twitter,
	'linkedin': Linkedin,
	'instagram': Instagram,
	'youtube': Youtube,
	'github': Github,

	// Media & Content
	'image': ImageIcon,
	'video': Video,
	'music': Music,
	'headphones': Headphones,
	'mic': Mic,
	'camera': Camera,
	'film': Film,
	'play-circle': PlayCircle,
	'pause-circle': PauseCircle,
	'volume-2': Volume2,
	'volume-x': VolumeX,

	// Development & Code
	'code': Code,
	'code-2': Code2,
	'terminal': Terminal,
	'braces': Braces,
	'file-code-2': FileCode2,
	'git-branch': GitBranch,
	'git-commit': GitCommit,
	'git-pull-request': GitPullRequest,
	'package': Package,
	'database': Database,
	'server': Server,

	// Navigation & Layout
	'home': Home,
	'menu': Menu,
	'more-horizontal': MoreHorizontal,
	'more-vertical': MoreVertical,
	'grid': Grid,
	'list': List,
	'layers': Layers,
	'columns': Columns,
	'rows': Rows,
	'layout': Layout,
	'layout-grid': LayoutGrid,
	'layout-list': LayoutList,
	'sidebar': Sidebar,
	'panel-left': PanelLeft,
	'panel-right': PanelRight,

	// Shapes & Design
	'square': Square,
	'circle': Circle,
	'triangle': Triangle,
	'star': Star,
	'heart': Heart,
	'zap': Zap,
	'sparkles': Sparkles,
	'droplet': Droplet,
	'flame': Flame,

	// Actions & Controls
	'settings': Settings,
	'sliders': Sliders,
	'toggle-left': ToggleLeft,
	'toggle-right': ToggleRight,
	'power': Power,
	'lock': Lock,
	'unlock': Unlock,
	'eye': Eye,
	'eye-off': EyeOff,
	'maximize': Maximize,
	'minimize': Minimize,
	'zoom-in': ZoomIn,
	'zoom-out': ZoomOut,
	'rotate-cw': RotateCw,
	'rotate-ccw': RotateCcw,
	'refresh-cw': RefreshCw,
	'save': Save,

	// Hardware & Devices
	'hard-drive': HardDrive,
	'cpu': Cpu,
	'wifi': Wifi,
	'wifi-off': WifiOff,
	'battery': Battery,
	'bluetooth': Bluetooth,
	'printer': Printer,

	// Location & Travel
	'map-pinned': MapPinned,
	'navigation': Navigation,
	'compass': Compass,
	'plane': Plane,
	'car': Car,
	'train': Train,

	// Time & Date
	'timer': Timer,
	'hourglass': Hourglass,
	'sunrise': Sunrise,
	'sunset': Sunset,
	'moon': Moon,
	'sun': Sun,

	// Weather
	'cloud': Cloud,
	'cloud-rain': CloudRain,
	'cloud-snow': CloudSnow,
	'cloud-lightning': CloudLightning,

	// Misc
	'tag': Tag,
	'tags': Tags,
	'bookmark': Bookmark,
	'bell': Bell,
	'bell-off': BellOff,
	'flag': Flag,
	'gift': Gift,
	'key': Key,
	'lightbulb': Lightbulb,
	'shield': Shield,
	'shield-check': ShieldCheck,
	'anchor': Anchor,
	'paperclip': Paperclip,
	'at-sign': AtSign,
	'hash': Hash,
	'percent': Percent,
	'dollar-sign': DollarSign,
};

/**
 * Icon Categories for Organized Selection
 */
export const ICON_CATEGORIES = {
	'common': {
		label: 'Common',
		icons: ['link', 'mail', 'phone', 'globe', 'calendar', 'clock', 'search', 'plus', 'check', 'x']
	},
	'files': {
		label: 'Files & Documents',
		icons: ['file', 'file-text', 'file-code', 'file-image', 'folder', 'archive', 'download', 'upload']
	},
	'academic': {
		label: 'Academic & Research',
		icons: ['graduation-cap', 'book-open', 'book', 'library', 'microscope', 'atom']
	},
	'business': {
		label: 'Business',
		icons: ['briefcase', 'building', 'user', 'users', 'target', 'bar-chart', 'pie-chart']
	},
	'social': {
		label: 'Social Media',
		icons: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'github']
	},
	'media': {
		label: 'Media',
		icons: ['image', 'video', 'music', 'camera', 'play-circle', 'pause-circle']
	},
	'status': {
		label: 'Status & Alerts',
		icons: ['info', 'alert-circle', 'alert-triangle', 'check-circle', 'x-circle', 'help-circle']
	},
	'navigation': {
		label: 'Navigation',
		icons: ['home', 'menu', 'chevron-down', 'chevron-up', 'chevron-left', 'chevron-right', 'grid', 'list']
	},
	'shapes': {
		label: 'Shapes',
		icons: ['square', 'circle', 'triangle', 'star', 'heart', 'zap']
	},
	'all': {
		label: 'All Icons',
		icons: Object.keys(ICON_MAP)
	}
};

/**
 * Get React Icon Component by name
 *
 * @param {string} iconName - The icon name (e.g., 'mail', 'phone')
 * @param {number} size - Icon size in pixels (default: 16)
 * @param {object} props - Additional props to pass to the icon component
 * @returns {JSX.Element} React icon component
 *
 * @example
 * import { getIcon } from '../utils/lucide-icons';
 *
 * const MyComponent = () => (
 *   <div>
 *     {getIcon('mail', 24, { className: 'my-icon' })}
 *   </div>
 * );
 */
export const getIcon = (iconName, size = 16, props = {}) => {
	const IconComponent = ICON_MAP[iconName] || Link;
	return <IconComponent size={size} {...props} />;
};

/**
 * Get icon SVG string for vanilla JS / innerHTML usage
 *
 * @param {string} iconName - The icon name (e.g., 'mail', 'phone')
 * @param {number} size - Icon size in pixels (default: 16)
 * @param {string} className - Optional CSS class
 * @returns {string} SVG string
 *
 * @example
 * // In vanilla JavaScript or view.js
 * import { getIconSVG } from '../utils/lucide-icons';
 *
 * element.innerHTML = getIconSVG('mail', 20, 'icon-class');
 */
export const getIconSVG = (iconName, size = 16, className = '') => {
	const iconPaths = {
		'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',
		'mail': '<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>',
		'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
		'globe': '<circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path>',
		'calendar': '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>',
		'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
		'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
		'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
		'hard-drive': '<line x1="22" x2="2" y1="12" y2="12"></line><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" x2="6.01" y1="16" y2="16"></line><line x1="10" x2="10.01" y1="16" y2="16"></line>',
		'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path>',
		'x-circle': '<circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path>',
		'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
		'info': '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>',
		'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>',
		'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
		'briefcase': '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect>',
		'building': '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>',
		'twitter': '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>',
		'facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
		'linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle>',
		'monitor': '<rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line>',
		'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>',
		'archive': '<rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path>',
		'bar-chart': '<line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line>',
		'code': '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
		'target': '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
		'book-marked': '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path><path d="m10 2 4 8 4-8"></path>',
	};

	const path = iconPaths[iconName] || iconPaths['link'];
	const classAttr = className ? ` class="${className}"` : '';

	return `<svg${classAttr} xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
};

/**
 * Get all icon names
 * @returns {string[]} Array of icon names
 */
export const getAllIconNames = () => Object.keys(ICON_MAP);

/**
 * Get icons by category
 * @param {string} category - Category name
 * @returns {string[]} Array of icon names in category
 */
export const getIconsByCategory = (category) => {
	return ICON_CATEGORIES[category]?.icons || [];
};

/**
 * Check if icon exists
 * @param {string} iconName - Icon name to check
 * @returns {boolean} True if icon exists
 */
export const iconExists = (iconName) => {
	return ICON_MAP.hasOwnProperty(iconName);
};

// Export individual icons for direct import
export {
	// Re-export commonly used icons for convenience
	Link,
	Mail,
	Phone,
	Globe,
	Calendar,
	User,
	FileText,
	CheckCircle,
	XCircle,
	AlertTriangle,
	Info,
	GraduationCap,
	BookOpen,
	Briefcase,
	Building,
	Twitter,
	Facebook,
	Linkedin,
};
