import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Star, Heart, Check, Shield, Lock, Lightbulb, BarChart3, Camera, Cloud, Users, Settings, Megaphone, ThumbsUp, Award } from 'lucide-react';

export default function save({ attributes }) {
	const {
		variant,
		customBackgroundColor,
		customBorderColor,
		iconName,
		iconSize,
		iconColor,
		heading,
		description,
		textAlign,
		iconPosition,
		linkUrl,
		linkTarget,
		backgroundColor,
		showBackground,
		borderRadius,
		borderWidth,
		borderStyle,
		borderColor,
		boxShadow,
		hoverShadow,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		hoverAnimation,
	} = attributes;

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
	};

	// Get the icon component
	const IconComponent = iconMap[iconName] || Star;

	const blockProps = useBlockProps.save({
		className: `icon-box icon-position-${iconPosition} text-align-${textAlign} shadow-${boxShadow} hover-shadow-${hoverShadow} hover-${hoverAnimation}`,
		style: {
			backgroundColor: showBackground ? backgroundColor : 'transparent',
			borderRadius: borderRadius + 'px',
			borderWidth: borderWidth + 'px',
			borderStyle: borderStyle,
			borderColor: borderColor,
			textAlign: textAlign,
		},
		'data-animation': animationEnabled ? animationType : '',
		'data-animation-duration': animationEnabled ? animationDuration : '',
		'data-animation-delay': animationEnabled ? animationDelay : '',
		'data-animation-easing': animationEnabled ? animationEasing : '',
	});

	const content = (
		<div className="icon-box-inner">
			<div className="icon-box-icon" style={{ fontSize: iconSize + 'px', color: iconColor }}>
				<IconComponent size={iconSize} color={iconColor} />
			</div>
			<div className="icon-box-content">
				<RichText.Content
					tagName="h3"
					className="icon-box-heading"
					value={heading}
				/>
				<RichText.Content
					tagName="p"
					className="icon-box-description"
					value={description}
				/>
			</div>
		</div>
	);

	if (linkUrl) {
		return (
			<div {...blockProps}>
				<a
					href={linkUrl}
					target={linkTarget ? '_blank' : '_self'}
					rel={linkTarget ? 'noopener noreferrer' : undefined}
					className="icon-box-link"
				>
					{content}
				</a>
			</div>
		);
	}

	return <div {...blockProps}>{content}</div>;
}
