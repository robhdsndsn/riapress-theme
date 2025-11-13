import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps, URLInput, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './style.scss';
import metadata from './block.json';
import { Star, Heart, Check, Shield, Lock, Lightbulb, BarChart3, Camera, Cloud, Users, Settings, Megaphone, ThumbsUp, Award, ArrowRight, Download, ExternalLink, ChevronRight, Plus, Minus, X, Menu, Search, Bell, Mail, Phone, MapPin, Calendar, Clock, Home, User, LogIn, LogOut, Upload, Trash2, Edit, Eye, EyeOff, Info, AlertCircle, CheckCircle, XCircle, HelpCircle, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react';

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			text,
			url,
			buttonVariant,
			size,
			icon,
			iconPosition,
			openInNewTab,
			customBackgroundColor,
			customTextColor,
			customBorderColor
		} = attributes;

		const blockProps = useBlockProps();

		// Icon mapping from dashicon names to Lucide components
		const iconMap = {
			'star-filled': Star,
			'heart': Heart,
			'yes': Check,
			'shield': Shield,
			'lock': Lock,
			'lightbulb': Lightbulb,
			'chart-bar': BarChart3,
			'camera': Camera,
			'cloud': Cloud,
			'admin-users': Users,
			'admin-tools': Settings,
			'admin-settings': Settings,
			'megaphone': Megaphone,
			'thumbs-up': ThumbsUp,
			'awards': Award,
			'arrow-right': ArrowRight,
			'download': Download,
			'external': ExternalLink,
			'arrow-right-alt2': ChevronRight,
			'plus': Plus,
			'minus': Minus,
			'no': X,
			'menu': Menu,
			'search': Search,
			'bell': Bell,
			'email': Mail,
			'phone': Phone,
			'location': MapPin,
			'calendar': Calendar,
			'clock': Clock,
			'admin-home': Home,
			'admin-users': Users,
			'admin-generic': User,
			'migrate': LogIn,
			'exit': LogOut,
			'upload': Upload,
			'trash': Trash2,
			'edit': Edit,
			'visibility': Eye,
			'hidden': EyeOff,
			'info': Info,
			'warning': AlertCircle,
			'yes-alt': CheckCircle,
			'dismiss': XCircle,
			'editor-help': HelpCircle,
			'arrow-left-alt2': ChevronLeft,
			'arrow-up-alt2': ChevronUp,
			'arrow-down-alt2': ChevronDown,
		};

		// Icon options for dropdown
		const iconOptions = [
			{ label: __('No Icon', 'riapress'), value: '' },
			{ label: __('Arrow Right', 'riapress'), value: 'arrow-right' },
			{ label: __('Download', 'riapress'), value: 'download' },
			{ label: __('External Link', 'riapress'), value: 'external' },
			{ label: __('Chevron Right', 'riapress'), value: 'arrow-right-alt2' },
			{ label: __('Plus', 'riapress'), value: 'plus' },
			{ label: __('Search', 'riapress'), value: 'search' },
			{ label: __('Star', 'riapress'), value: 'star-filled' },
			{ label: __('Heart', 'riapress'), value: 'heart' },
			{ label: __('Check', 'riapress'), value: 'yes' },
			{ label: __('Shield', 'riapress'), value: 'shield' },
			{ label: __('Lock', 'riapress'), value: 'lock' },
			{ label: __('Lightbulb', 'riapress'), value: 'lightbulb' },
			{ label: __('Chart', 'riapress'), value: 'chart-bar' },
			{ label: __('Camera', 'riapress'), value: 'camera' },
			{ label: __('Cloud', 'riapress'), value: 'cloud' },
			{ label: __('Users', 'riapress'), value: 'admin-users' },
			{ label: __('Settings', 'riapress'), value: 'admin-settings' },
			{ label: __('Megaphone', 'riapress'), value: 'megaphone' },
			{ label: __('Thumbs Up', 'riapress'), value: 'thumbs-up' },
			{ label: __('Award', 'riapress'), value: 'awards' },
			{ label: __('Mail', 'riapress'), value: 'email' },
			{ label: __('Phone', 'riapress'), value: 'phone' },
			{ label: __('Location', 'riapress'), value: 'location' },
			{ label: __('Calendar', 'riapress'), value: 'calendar' },
			{ label: __('Clock', 'riapress'), value: 'clock' },
			{ label: __('Home', 'riapress'), value: 'admin-home' },
			{ label: __('User', 'riapress'), value: 'admin-generic' },
			{ label: __('Login', 'riapress'), value: 'migrate' },
			{ label: __('Logout', 'riapress'), value: 'exit' },
			{ label: __('Upload', 'riapress'), value: 'upload' },
			{ label: __('Trash', 'riapress'), value: 'trash' },
			{ label: __('Edit', 'riapress'), value: 'edit' },
			{ label: __('Eye', 'riapress'), value: 'visibility' },
			{ label: __('Info', 'riapress'), value: 'info' },
		];

		// Get the icon component
		const IconComponent = icon ? iconMap[icon] : null;

		// Build button classes
		const buttonClasses = [
			'ria-button',
			`ria-button--${buttonVariant}`,
			`ria-button--${size}`,
			iconPosition !== 'none' && icon ? `ria-button--icon-${iconPosition}` : ''
		].filter(Boolean).join(' ');

		// Build custom styles for custom variant
		const buttonStyles = {};
		if (buttonVariant === 'custom') {
			if (customBackgroundColor) buttonStyles.backgroundColor = customBackgroundColor;
			if (customTextColor) buttonStyles.color = customTextColor;
			if (customBorderColor) buttonStyles.borderColor = customBorderColor;
		}

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Button Settings', 'riapress')} initialOpen={true}>
						<TextControl
							label={__('Button Text', 'riapress')}
							value={text}
							onChange={(value) => setAttributes({ text: value })}
							help={__('The text displayed on the button', 'riapress')}
						/>

						<div className="ria-button-url-input">
							<label>{__('Button URL', 'riapress')}</label>
							<URLInput
								value={url}
								onChange={(value) => setAttributes({ url: value })}
								autoFocus={false}
							/>
						</div>

						<ToggleControl
							label={__('Open in new tab', 'riapress')}
							checked={openInNewTab}
							onChange={(value) => setAttributes({ openInNewTab: value })}
						/>
					</PanelBody>

					<PanelBody title={__('Button Style', 'riapress')} initialOpen={true}>
						<SelectControl
							label={__('Color Variant', 'riapress')}
							value={buttonVariant}
							options={[
								{ label: __('Primary (Navy)', 'riapress'), value: 'primary' },
								{ label: __('Secondary (Green)', 'riapress'), value: 'secondary' },
								{ label: __('Tertiary (Orange)', 'riapress'), value: 'tertiary' },
								{ label: __('Outline Primary', 'riapress'), value: 'outline-primary' },
								{ label: __('Outline Secondary', 'riapress'), value: 'outline-secondary' },
								{ label: __('Outline Tertiary', 'riapress'), value: 'outline-tertiary' },
								{ label: __('Ghost', 'riapress'), value: 'ghost' },
								{ label: __('Link Style', 'riapress'), value: 'link' },
								{ label: __('Custom Colors', 'riapress'), value: 'custom' }
							]}
							onChange={(value) => setAttributes({ buttonVariant: value })}
							help={__('Choose the button color variant from your theme', 'riapress')}
						/>

						<SelectControl
							label={__('Size', 'riapress')}
							value={size}
							options={[
								{ label: __('Small', 'riapress'), value: 'small' },
								{ label: __('Medium', 'riapress'), value: 'medium' },
								{ label: __('Large', 'riapress'), value: 'large' }
							]}
							onChange={(value) => setAttributes({ size: value })}
						/>

						<SelectControl
							label={__('Icon Position', 'riapress')}
							value={iconPosition}
							options={[
								{ label: __('No Icon', 'riapress'), value: 'none' },
								{ label: __('Left', 'riapress'), value: 'left' },
								{ label: __('Right', 'riapress'), value: 'right' }
							]}
							onChange={(value) => setAttributes({ iconPosition: value })}
						/>

						{iconPosition !== 'none' && (
							<SelectControl
								label={__('Icon', 'riapress')}
								value={icon}
								options={iconOptions}
								onChange={(value) => setAttributes({ icon: value })}
								help={__('Choose an icon from the dropdown', 'riapress')}
							/>
						)}
					</PanelBody>

					{buttonVariant === 'custom' && (
						<PanelColorSettings
							title={__('Custom Button Colors', 'riapress')}
							initialOpen={true}
							colorSettings={[
								{
									value: customBackgroundColor,
									onChange: (value) => setAttributes({ customBackgroundColor: value }),
									label: __('Background Color', 'riapress')
								},
								{
									value: customTextColor,
									onChange: (value) => setAttributes({ customTextColor: value }),
									label: __('Text Color', 'riapress')
								},
								{
									value: customBorderColor,
									onChange: (value) => setAttributes({ customBorderColor: value }),
									label: __('Border Color', 'riapress')
								}
							]}
						/>
					)}
				</InspectorControls>

				<div {...blockProps}>
					<a
						href={url || '#'}
						className={buttonClasses}
						style={Object.keys(buttonStyles).length > 0 ? buttonStyles : undefined}
						target={openInNewTab ? '_blank' : undefined}
						rel={openInNewTab ? 'noopener noreferrer' : undefined}
					>
						{iconPosition === 'left' && icon && (
							<span className="ria-button__icon ria-button__icon--left">
								<span className={`dashicons dashicons-${icon}`}></span>
							</span>
						)}
						<span className="ria-button__text">{text}</span>
						{iconPosition === 'right' && icon && (
							<span className="ria-button__icon ria-button__icon--right">
								<span className={`dashicons dashicons-${icon}`}></span>
							</span>
						)}
					</a>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			text,
			url,
			buttonVariant,
			size,
			icon,
			iconPosition,
			openInNewTab,
			customBackgroundColor,
			customTextColor,
			customBorderColor
		} = attributes;

		const blockProps = useBlockProps.save();

		// Icon mapping from dashicon names to Lucide components
		const iconMap = {
			'star-filled': Star,
			'heart': Heart,
			'yes': Check,
			'shield': Shield,
			'lock': Lock,
			'lightbulb': Lightbulb,
			'chart-bar': BarChart3,
			'camera': Camera,
			'cloud': Cloud,
			'admin-users': Users,
			'admin-tools': Settings,
			'admin-settings': Settings,
			'megaphone': Megaphone,
			'thumbs-up': ThumbsUp,
			'awards': Award,
			'arrow-right': ArrowRight,
			'download': Download,
			'external': ExternalLink,
			'arrow-right-alt2': ChevronRight,
			'plus': Plus,
			'minus': Minus,
			'no': X,
			'menu': Menu,
			'search': Search,
			'bell': Bell,
			'email': Mail,
			'phone': Phone,
			'location': MapPin,
			'calendar': Calendar,
			'clock': Clock,
			'admin-home': Home,
			'admin-users': Users,
			'admin-generic': User,
			'migrate': LogIn,
			'exit': LogOut,
			'upload': Upload,
			'trash': Trash2,
			'edit': Edit,
			'visibility': Eye,
			'hidden': EyeOff,
			'info': Info,
			'warning': AlertCircle,
			'yes-alt': CheckCircle,
			'dismiss': XCircle,
			'editor-help': HelpCircle,
			'arrow-left-alt2': ChevronLeft,
			'arrow-up-alt2': ChevronUp,
			'arrow-down-alt2': ChevronDown,
		};

		// Get the icon component
		const IconComponent = icon ? iconMap[icon] : null;

		// Build button classes
		const buttonClasses = [
			'ria-button',
			`ria-button--${buttonVariant}`,
			`ria-button--${size}`,
			iconPosition !== 'none' && icon ? `ria-button--icon-${iconPosition}` : ''
		].filter(Boolean).join(' ');

		// Build custom styles for custom variant
		const buttonStyles = {};
		if (buttonVariant === 'custom') {
			if (customBackgroundColor) buttonStyles.backgroundColor = customBackgroundColor;
			if (customTextColor) buttonStyles.color = customTextColor;
			if (customBorderColor) buttonStyles.borderColor = customBorderColor;
		}

		return (
			<div {...blockProps}>
				<a
					href={url || '#'}
					className={buttonClasses}
					style={Object.keys(buttonStyles).length > 0 ? buttonStyles : undefined}
					target={openInNewTab ? '_blank' : undefined}
					rel={openInNewTab ? 'noopener noreferrer' : undefined}
				>
					{iconPosition === 'left' && IconComponent && (
						<span className="ria-button__icon ria-button__icon--left">
							<IconComponent size={20} />
						</span>
					)}
					<span className="ria-button__text">{text}</span>
					{iconPosition === 'right' && IconComponent && (
						<span className="ria-button__icon ria-button__icon--right">
							<IconComponent size={20} />
						</span>
					)}
				</a>
			</div>
		);
	}
});
