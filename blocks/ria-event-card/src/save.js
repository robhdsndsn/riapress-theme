import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		layout,
		title,
		description,
		startDate,
		endDate,
		startTime,
		endTime,
		timezone,
		showDate,
		showTime,
		dateFormat,
		customDateFormat,
		locationName,
		locationAddress,
		locationType,
		virtualUrl,
		showLocation,
		featuredImageUrl,
		featuredImageAlt,
		showImage,
		registrationUrl,
		registrationButtonText,
		registrationDeadline,
		showRegistrationButton,
		cost,
		capacity,
		spotsRemaining,
		showCost,
		showCapacity,
		eventStatus,
		showStatusBadge,
		isSignatureEvent,
		isFeatured,
		showSignatureBadge,
		organizers,
		speakers,
		topics,
		showOrganizers,
		showSpeakers,
		showTopics,
		buttonStyle,
		backgroundColor,
		accentColor,
		borderWidth,
		borderStyle,
		borderColor,
		borderRadius,
		boxShadow,
		hoverShadow,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationEasing,
		hoverAnimation,
	} = attributes;

	// Helper functions
	const formatDate = (date) => {
		if (!date) return '';
		const d = new Date(date);
		if (dateFormat === 'short') {
			return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		} else if (dateFormat === 'long') {
			return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
		}
		return d.toLocaleDateString();
	};

	const getStatusBadgeClass = () => {
		return `event-status-badge status-${eventStatus}`;
	};

	const getLocationIcon = () => {
		if (locationType === 'in-person') return 'map-pin';
		if (locationType === 'virtual') return 'monitor';
		if (locationType === 'hybrid') return 'shuffle';
		return '';
	};

	const isRegistrationClosed = () => {
		if (!registrationDeadline) return false;
		return new Date() > new Date(registrationDeadline);
	};

	const getCapacityText = () => {
		if (!capacity) return '';
		if (spotsRemaining <= 0) return 'Sold Out';
		return `${spotsRemaining} spots remaining`;
	};

	// Build shadow classes
	const shadowClass = boxShadow !== 'none' ? `shadow-${boxShadow}` : '';
	const hoverShadowClass = hoverShadow !== 'none' ? `hover-shadow-${hoverShadow}` : '';
	const hoverAnimClass = hoverAnimation !== 'none' ? `hover-${hoverAnimation}` : '';

	const blockProps = useBlockProps.save({
		className: `ria-event-card layout-${layout} status-${eventStatus}${isSignatureEvent ? ' signature-event' : ''}${isFeatured ? ' featured' : ''} ${shadowClass} ${hoverShadowClass} ${hoverAnimClass}`,
		style: {
			backgroundColor,
			borderWidth: borderWidth + 'px',
			borderStyle,
			borderColor,
			borderRadius: borderRadius + 'px',
			'--accent-color': accentColor,
		},
		'data-animation': animationEnabled ? animationType : 'none',
		'data-delay': animationDelay,
		'data-duration': animationDuration,
		'data-easing': animationEasing,
	});

	if (!title && !description) {
		return null;
	}

	return (
		<div {...blockProps}>
			<div className="event-card-inner">
				{/* Badges */}
				{(showStatusBadge || (isSignatureEvent && showSignatureBadge)) && (
					<div className="event-badges">
						{showStatusBadge && (
							<span className={getStatusBadgeClass()}>
								{eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
							</span>
						)}
						{isSignatureEvent && showSignatureBadge && (
							<span className="signature-badge">⭐ Signature Event</span>
						)}
					</div>
				)}

				{/* Featured Image */}
				{showImage && featuredImageUrl && (
					<div className="event-image">
						<img src={featuredImageUrl} alt={featuredImageAlt || title || 'Event'} />
					</div>
				)}

				{/* Event Content */}
				<div className="event-content">
					{/* Title */}
					{title && (
						<RichText.Content
							tagName="h3"
							className="event-title"
							value={title}
						/>
					)}

					{/* Date & Time */}
					{showDate && startDate && (
						<div className="event-datetime">
							<span className="event-date">
								<span className="date-icon" data-icon="calendar" aria-hidden="true"></span>
								<span className="date-text">
									{formatDate(startDate)}
									{endDate && ` - ${formatDate(endDate)}`}
								</span>
							</span>
							{showTime && startTime && (
								<span className="event-time">
									<span className="time-icon" aria-hidden="true">🕐</span>
									<span className="time-text">
										{startTime}
										{endTime && ` - ${endTime}`}
										{timezone && ` ${timezone}`}
									</span>
								</span>
							)}
						</div>
					)}

					{/* Location */}
					{showLocation && (locationName || virtualUrl) && (
						<div className={`event-location location-${locationType}`}>
							<span className="location-icon" data-icon={getLocationIcon()} aria-hidden="true"></span>
							<div className="location-details">
								{locationName && <div className="location-name">{locationName}</div>}
								{locationAddress && <div className="location-address">{locationAddress}</div>}
								{virtualUrl && (locationType === 'virtual' || locationType === 'hybrid') && (
									<div className="virtual-indicator">Virtual Event</div>
								)}
							</div>
						</div>
					)}

					{/* Description */}
					{description && (
						<RichText.Content
							tagName="div"
							className="event-description"
							value={description}
						/>
					)}

					{/* Topics */}
					{showTopics && topics.length > 0 && (
						<div className="event-topics">
							{topics.filter(t => t).map((topic, index) => (
								<span key={index} className="topic-badge">{topic}</span>
							))}
						</div>
					)}

					{/* Speakers */}
					{showSpeakers && speakers.length > 0 && speakers.some(s => s.name) && (
						<div className="event-speakers">
							<h4 className="speakers-title">Speakers</h4>
							<div className="speakers-list">
								{speakers.map((speaker, index) => (
									speaker.name && (
										<div key={index} className="speaker-item">
											<div className="speaker-name">{speaker.name}</div>
											{speaker.title && <div className="speaker-title">{speaker.title}</div>}
											{speaker.bio && <div className="speaker-bio">{speaker.bio}</div>}
										</div>
									)
								))}
							</div>
						</div>
					)}

					{/* Organizers */}
					{showOrganizers && organizers.length > 0 && organizers.some(o => o.name) && (
						<div className="event-organizers">
							<h4 className="organizers-title">Organizers</h4>
							<div className="organizers-list">
								{organizers.map((organizer, index) => (
									organizer.name && (
										<div key={index} className="organizer-item">
											<span className="organizer-name">{organizer.name}</span>
											{organizer.role && <span className="organizer-role"> ({organizer.role})</span>}
											{organizer.email && (
												<a href={`mailto:${organizer.email}`} className="organizer-email">
													{organizer.email}
												</a>
											)}
										</div>
									)
								))}
							</div>
						</div>
					)}

					{/* Event Details (Cost & Capacity) */}
					{(showCost && cost) || (showCapacity && capacity > 0) ? (
						<div className="event-details">
							{showCost && cost && (
								<span className="event-cost">
									<span className="cost-icon" aria-hidden="true">💰</span>
									<span className="cost-text">{cost}</span>
								</span>
							)}
							{showCapacity && capacity > 0 && (
								<span className={`event-capacity ${spotsRemaining <= 0 ? 'sold-out' : ''}`}>
									<span className="capacity-text">{getCapacityText()}</span>
								</span>
							)}
						</div>
					) : null}

					{/* Registration Button */}
					{showRegistrationButton && registrationUrl && (
						<div className="event-registration">
							{isRegistrationClosed() ? (
								<span className="registration-closed">Registration Closed</span>
							) : (
								<a
									href={registrationUrl}
									className={`registration-button btn-${buttonStyle}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									{registrationButtonText || 'Register Now'}
								</a>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
