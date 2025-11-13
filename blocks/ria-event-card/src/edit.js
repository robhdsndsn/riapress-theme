import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	ColorPalette,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	RangeControl,
	Button,
	DateTimePicker,
	TextareaControl,
	ColorPicker,
	Placeholder,
	Icon,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { calendar } from '@wordpress/icons';
import * as Icons from '../../../shared/icons';
import { SkeletonImage } from '../../../components/skeletons';

export default function Edit({ attributes, setAttributes }) {
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
		featuredImageId,
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
		variant,
		customBackgroundColor,
		customAccentColor,
		customBorderColor,
		borderWidth,
		borderStyle,
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

	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);
	const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
	const [imageLoading, setImageLoading] = useState(!!featuredImageUrl);

	const blockProps = useBlockProps({
		className: `ria-event-card layout-${layout} status-${eventStatus}${isSignatureEvent ? ' signature-event' : ''}${isFeatured ? ' featured' : ''} variant-${variant}`,
		style: variant === 'custom' ? {
			'--custom-bg-color': customBackgroundColor,
			'--custom-accent-color': customAccentColor,
			'--custom-border-color': customBorderColor,
			borderWidth: borderWidth + 'px',
			borderStyle,
			borderRadius: borderRadius + 'px',
		} : {
			borderWidth: borderWidth + 'px',
			borderStyle,
			borderRadius: borderRadius + 'px',
		}
	});

	// Helper functions
	const addOrganizer = () => {
		setAttributes({
			organizers: [...organizers, { name: '', role: '', email: '' }]
		});
	};

	const removeOrganizer = (index) => {
		const newOrganizers = organizers.filter((_, i) => i !== index);
		setAttributes({ organizers: newOrganizers });
	};

	const updateOrganizer = (index, field, value) => {
		const newOrganizers = [...organizers];
		newOrganizers[index][field] = value;
		setAttributes({ organizers: newOrganizers });
	};

	const addSpeaker = () => {
		setAttributes({
			speakers: [...speakers, { name: '', title: '', bio: '' }]
		});
	};

	const removeSpeaker = (index) => {
		const newSpeakers = speakers.filter((_, i) => i !== index);
		setAttributes({ speakers: newSpeakers });
	};

	const updateSpeaker = (index, field, value) => {
		const newSpeakers = [...speakers];
		newSpeakers[index][field] = value;
		setAttributes({ speakers: newSpeakers });
	};

	const addTopic = () => {
		setAttributes({
			topics: [...topics, '']
		});
	};

	const removeTopic = (index) => {
		const newTopics = topics.filter((_, i) => i !== index);
		setAttributes({ topics: newTopics });
	};

	const updateTopic = (index, value) => {
		const newTopics = [...topics];
		newTopics[index] = value;
		setAttributes({ topics: newTopics });
	};

	// Format date display
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

	// Get status badge class
	const getStatusBadgeClass = () => {
		return `event-status-badge status-${eventStatus}`;
	};

	// Get location icon (Lucide React components)
	const getLocationIcon = () => {
		if (locationType === 'in-person') return <MapPin size={16} />;
		if (locationType === 'virtual') return <Monitor size={16} />;
		if (locationType === 'hybrid') return <Shuffle size={16} />;
		return null;
	};

	// Check if registration is closed
	const isRegistrationClosed = () => {
		if (!registrationDeadline) return false;
		return new Date() > new Date(registrationDeadline);
	};

	// Get capacity text
	const getCapacityText = () => {
		if (!capacity) return '';
		if (spotsRemaining <= 0) return __('Sold Out', 'ria-event-card');
		return __(`${spotsRemaining} spots remaining`, 'ria-event-card');
	};

	return (
		<>
			<InspectorControls>
				{/* Layout Panel */}
				<PanelBody title={__('Layout', 'ria-event-card')} initialOpen={true}>
					<SelectControl
						label={__('Layout Style', 'ria-event-card')}
						value={layout}
						options={[
							{ label: __('Card', 'ria-event-card'), value: 'card' },
							{ label: __('Compact', 'ria-event-card'), value: 'compact' },
							{ label: __('Featured', 'ria-event-card'), value: 'featured' },
							{ label: __('List', 'ria-event-card'), value: 'list' },
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>
				</PanelBody>

				{/* Event Details Panel */}
				<PanelBody title={__('Event Details', 'ria-event-card')} initialOpen={true}>
					<ToggleControl
						label={__('Show Cost', 'ria-event-card')}
						checked={showCost}
						onChange={(value) => setAttributes({ showCost: value })}
					/>
					{showCost && (
						<TextControl
							label={__('Cost', 'ria-event-card')}
							value={cost}
							onChange={(value) => setAttributes({ cost: value })}
							placeholder={__('Free, $25, etc.', 'ria-event-card')}
							help={__('Enter "Free" for free events or price', 'ria-event-card')}
						/>
					)}
					<ToggleControl
						label={__('Show Capacity', 'ria-event-card')}
						checked={showCapacity}
						onChange={(value) => setAttributes({ showCapacity: value })}
					/>
					{showCapacity && (
						<>
							<TextControl
								label={__('Total Capacity', 'ria-event-card')}
								type="number"
								value={capacity}
								onChange={(value) => setAttributes({ capacity: parseInt(value) || 0 })}
							/>
							<TextControl
								label={__('Spots Remaining', 'ria-event-card')}
								type="number"
								value={spotsRemaining}
								onChange={(value) => setAttributes({ spotsRemaining: parseInt(value) || 0 })}
								help={__('Enter 0 for sold out events', 'ria-event-card')}
							/>
						</>
					)}
				</PanelBody>

				{/* Dates & Time Panel */}
				<PanelBody title={__('Dates & Time', 'ria-event-card')} initialOpen={false}>
					<ToggleControl
						label={__('Show Date', 'ria-event-card')}
						checked={showDate}
						onChange={(value) => setAttributes({ showDate: value })}
					/>
					{showDate && (
						<>
							<Button
								variant="secondary"
								onClick={() => setShowDatePicker(!showDatePicker)}
							>
								{startDate ? formatDate(startDate) : __('Select Start Date', 'ria-event-card')}
							</Button>
							{showDatePicker && (
								<DateTimePicker
									currentDate={startDate}
									onChange={(value) => {
										setAttributes({ startDate: value });
										setShowDatePicker(false);
									}}
								/>
							)}
							<div style={{ marginTop: '10px' }}>
								<Button
									variant="secondary"
									onClick={() => setShowEndDatePicker(!showEndDatePicker)}
								>
									{endDate ? formatDate(endDate) : __('Select End Date (Optional)', 'ria-event-card')}
								</Button>
							</div>
							{showEndDatePicker && (
								<DateTimePicker
									currentDate={endDate}
									onChange={(value) => {
										setAttributes({ endDate: value });
										setShowEndDatePicker(false);
									}}
								/>
							)}
							<SelectControl
								label={__('Date Format', 'ria-event-card')}
								value={dateFormat}
								options={[
									{ label: __('Short (Jan 15)', 'ria-event-card'), value: 'short' },
									{ label: __('Long (January 15, 2025)', 'ria-event-card'), value: 'long' },
									{ label: __('Custom', 'ria-event-card'), value: 'custom' },
								]}
								onChange={(value) => setAttributes({ dateFormat: value })}
							/>
							{dateFormat === 'custom' && (
								<TextControl
									label={__('Custom Date Format', 'ria-event-card')}
									value={customDateFormat}
									onChange={(value) => setAttributes({ customDateFormat: value })}
									help={__('Use PHP date format (F j, Y)', 'ria-event-card')}
								/>
							)}
						</>
					)}
					<ToggleControl
						label={__('Show Time', 'ria-event-card')}
						checked={showTime}
						onChange={(value) => setAttributes({ showTime: value })}
					/>
					{showTime && (
						<>
							<TextControl
								label={__('Start Time', 'ria-event-card')}
								value={startTime}
								onChange={(value) => setAttributes({ startTime: value })}
								placeholder={__('9:00 AM', 'ria-event-card')}
							/>
							<TextControl
								label={__('End Time (Optional)', 'ria-event-card')}
								value={endTime}
								onChange={(value) => setAttributes({ endTime: value })}
								placeholder={__('5:00 PM', 'ria-event-card')}
							/>
							<TextControl
								label={__('Timezone', 'ria-event-card')}
								value={timezone}
								onChange={(value) => setAttributes({ timezone: value })}
								placeholder={__('EST, PST, UTC, etc.', 'ria-event-card')}
							/>
						</>
					)}
				</PanelBody>

				{/* Location Panel */}
				<PanelBody title={__('Location', 'ria-event-card')} initialOpen={false}>
					<ToggleControl
						label={__('Show Location', 'ria-event-card')}
						checked={showLocation}
						onChange={(value) => setAttributes({ showLocation: value })}
					/>
					{showLocation && (
						<>
							<SelectControl
								label={__('Location Type', 'ria-event-card')}
								value={locationType}
								options={[
									{ label: __('In-Person', 'ria-event-card'), value: 'in-person' },
									{ label: __('Virtual', 'ria-event-card'), value: 'virtual' },
									{ label: __('Hybrid', 'ria-event-card'), value: 'hybrid' },
								]}
								onChange={(value) => setAttributes({ locationType: value })}
							/>
							{(locationType === 'in-person' || locationType === 'hybrid') && (
								<>
									<TextControl
										label={__('Location Name', 'ria-event-card')}
										value={locationName}
										onChange={(value) => setAttributes({ locationName: value })}
										placeholder={__('Conference Center', 'ria-event-card')}
									/>
									<TextareaControl
										label={__('Location Address', 'ria-event-card')}
										value={locationAddress}
										onChange={(value) => setAttributes({ locationAddress: value })}
										placeholder={__('123 Main St, City, State ZIP', 'ria-event-card')}
									/>
								</>
							)}
							{(locationType === 'virtual' || locationType === 'hybrid') && (
								<TextControl
									label={__('Virtual URL', 'ria-event-card')}
									value={virtualUrl}
									onChange={(value) => setAttributes({ virtualUrl: value })}
									placeholder={__('https://zoom.us/j/...', 'ria-event-card')}
									type="url"
								/>
							)}
						</>
					)}
				</PanelBody>

				{/* Featured Image Panel */}
				<PanelBody title={__('Featured Image', 'ria-event-card')} initialOpen={false}>
					<ToggleControl
						label={__('Show Image', 'ria-event-card')}
						checked={showImage}
						onChange={(value) => setAttributes({ showImage: value })}
					/>
					{showImage && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => {
									setAttributes({
										featuredImageId: media.id,
										featuredImageUrl: media.url,
										featuredImageAlt: media.alt,
									});
									setImageLoading(true);
								}}
								allowedTypes={['image']}
								value={featuredImageId}
								render={({ open }) => (
									<div>
										{featuredImageUrl ? (
											<>
												{imageLoading && <SkeletonImage aspectRatio="16/9" />}
												<img
													src={featuredImageUrl}
													alt={featuredImageAlt}
													style={{
														maxWidth: '100%',
														height: 'auto',
														display: imageLoading ? 'none' : 'block'
													}}
													onLoad={() => setImageLoading(false)}
													onError={() => setImageLoading(false)}
												/>
												<div style={{ marginTop: '10px' }}>
													<Button variant="secondary" onClick={open}>
														{__('Change Image', 'ria-event-card')}
													</Button>
													<Button
														variant="tertiary"
														onClick={() => setAttributes({
															featuredImageId: 0,
															featuredImageUrl: '',
															featuredImageAlt: ''
														})}
														style={{ marginLeft: '10px' }}
													>
														{__('Remove Image', 'ria-event-card')}
													</Button>
												</div>
											</>
										) : (
											<Button variant="primary" onClick={open}>
												{__('Select Image', 'ria-event-card')}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>
					)}
				</PanelBody>

				{/* Registration Panel */}
				<PanelBody title={__('Registration', 'ria-event-card')} initialOpen={false}>
					<ToggleControl
						label={__('Show Registration Button', 'ria-event-card')}
						checked={showRegistrationButton}
						onChange={(value) => setAttributes({ showRegistrationButton: value })}
					/>
					{showRegistrationButton && (
						<>
							<TextControl
								label={__('Registration URL', 'ria-event-card')}
								value={registrationUrl}
								onChange={(value) => setAttributes({ registrationUrl: value })}
								placeholder={__('https://...', 'ria-event-card')}
								type="url"
							/>
							<TextControl
								label={__('Button Text', 'ria-event-card')}
								value={registrationButtonText}
								onChange={(value) => setAttributes({ registrationButtonText: value })}
							/>
							<Button
								variant="secondary"
								onClick={() => setShowDeadlinePicker(!showDeadlinePicker)}
								style={{ marginTop: '10px' }}
							>
								{registrationDeadline ? formatDate(registrationDeadline) : __('Set Registration Deadline (Optional)', 'ria-event-card')}
							</Button>
							{showDeadlinePicker && (
								<DateTimePicker
									currentDate={registrationDeadline}
									onChange={(value) => {
										setAttributes({ registrationDeadline: value });
										setShowDeadlinePicker(false);
									}}
								/>
							)}
						</>
					)}
				</PanelBody>

				{/* Status & Badges Panel */}
				<PanelBody title={__('Status & Badges', 'ria-event-card')} initialOpen={false}>
					<SelectControl
						label={__('Event Status', 'ria-event-card')}
						value={eventStatus}
						options={[
							{ label: __('Upcoming', 'ria-event-card'), value: 'upcoming' },
							{ label: __('Ongoing', 'ria-event-card'), value: 'ongoing' },
							{ label: __('Past', 'ria-event-card'), value: 'past' },
							{ label: __('Cancelled', 'ria-event-card'), value: 'cancelled' },
						]}
						onChange={(value) => setAttributes({ eventStatus: value })}
					/>
					<ToggleControl
						label={__('Show Status Badge', 'ria-event-card')}
						checked={showStatusBadge}
						onChange={(value) => setAttributes({ showStatusBadge: value })}
					/>
					<ToggleControl
						label={__('Signature Event', 'ria-event-card')}
						checked={isSignatureEvent}
						onChange={(value) => setAttributes({ isSignatureEvent: value })}
						help={__('Mark as a signature/flagship event', 'ria-event-card')}
					/>
					{isSignatureEvent && (
						<ToggleControl
							label={__('Show Signature Badge', 'ria-event-card')}
							checked={showSignatureBadge}
							onChange={(value) => setAttributes({ showSignatureBadge: value })}
						/>
					)}
					<ToggleControl
						label={__('Featured Event', 'ria-event-card')}
						checked={isFeatured}
						onChange={(value) => setAttributes({ isFeatured: value })}
						help={__('Highlight this event', 'ria-event-card')}
					/>
				</PanelBody>

				{/* Metadata Panel */}
				<PanelBody title={__('Metadata', 'ria-event-card')} initialOpen={false}>
					{/* Organizers */}
					<ToggleControl
						label={__('Show Organizers', 'ria-event-card')}
						checked={showOrganizers}
						onChange={(value) => setAttributes({ showOrganizers: value })}
					/>
					{showOrganizers && (
						<div>
							<h4>{__('Organizers', 'ria-event-card')}</h4>
							{organizers.map((organizer, index) => (
								<div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px' }}>
									<TextControl
										label={__('Name', 'ria-event-card')}
										value={organizer.name}
										onChange={(value) => updateOrganizer(index, 'name', value)}
									/>
									<TextControl
										label={__('Role', 'ria-event-card')}
										value={organizer.role}
										onChange={(value) => updateOrganizer(index, 'role', value)}
									/>
									<TextControl
										label={__('Email', 'ria-event-card')}
										value={organizer.email}
										onChange={(value) => updateOrganizer(index, 'email', value)}
										type="email"
									/>
									<Button
										variant="secondary"
										isDestructive
										onClick={() => removeOrganizer(index)}
									>
										{__('Remove Organizer', 'ria-event-card')}
									</Button>
								</div>
							))}
							<Button variant="primary" onClick={addOrganizer}>
								{__('Add Organizer', 'ria-event-card')}
							</Button>
						</div>
					)}

					{/* Speakers */}
					<ToggleControl
						label={__('Show Speakers', 'ria-event-card')}
						checked={showSpeakers}
						onChange={(value) => setAttributes({ showSpeakers: value })}
						style={{ marginTop: '20px' }}
					/>
					{showSpeakers && (
						<div>
							<h4>{__('Speakers', 'ria-event-card')}</h4>
							{speakers.map((speaker, index) => (
								<div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px' }}>
									<TextControl
										label={__('Name', 'ria-event-card')}
										value={speaker.name}
										onChange={(value) => updateSpeaker(index, 'name', value)}
									/>
									<TextControl
										label={__('Title', 'ria-event-card')}
										value={speaker.title}
										onChange={(value) => updateSpeaker(index, 'title', value)}
									/>
									<TextareaControl
										label={__('Bio', 'ria-event-card')}
										value={speaker.bio}
										onChange={(value) => updateSpeaker(index, 'bio', value)}
									/>
									<Button
										variant="secondary"
										isDestructive
										onClick={() => removeSpeaker(index)}
									>
										{__('Remove Speaker', 'ria-event-card')}
									</Button>
								</div>
							))}
							<Button variant="primary" onClick={addSpeaker}>
								{__('Add Speaker', 'ria-event-card')}
							</Button>
						</div>
					)}

					{/* Topics */}
					<ToggleControl
						label={__('Show Topics', 'ria-event-card')}
						checked={showTopics}
						onChange={(value) => setAttributes({ showTopics: value })}
						style={{ marginTop: '20px' }}
					/>
					{showTopics && (
						<div>
							<h4>{__('Topics', 'ria-event-card')}</h4>
							{topics.map((topic, index) => (
								<div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
									<TextControl
										value={topic}
										onChange={(value) => updateTopic(index, value)}
										placeholder={__('Topic name', 'ria-event-card')}
										style={{ flex: 1 }}
									/>
									<Button
										variant="secondary"
										isDestructive
										onClick={() => removeTopic(index)}
									>
										{__('Remove', 'ria-event-card')}
									</Button>
								</div>
							))}
							<Button variant="primary" onClick={addTopic}>
								{__('Add Topic', 'ria-event-card')}
							</Button>
						</div>
					)}
				</PanelBody>

				{/* Button Style Panel */}
				<PanelBody title={__('Button Style', 'ria-event-card')} initialOpen={false}>
					<SelectControl
						label={__('Button Style', 'ria-event-card')}
						value={buttonStyle}
						options={[
							{ label: __('Primary', 'ria-event-card'), value: 'primary' },
							{ label: __('Secondary', 'ria-event-card'), value: 'secondary' },
							{ label: __('Tertiary', 'ria-event-card'), value: 'tertiary' },
							{ label: __('Ghost', 'ria-event-card'), value: 'ghost' },
						]}
						onChange={(value) => setAttributes({ buttonStyle: value })}
					/>
				</PanelBody>

				{/* Styling Panel */}
				<PanelBody title={__('Color Scheme', 'ria-event-card')} initialOpen={false}>
					<SelectControl
						label={__('Variant', 'ria-event-card')}
						value={variant}
						options={[
							{ label: __('Primary (Navy)', 'ria-event-card'), value: 'primary' },
							{ label: __('Secondary (Green)', 'ria-event-card'), value: 'secondary' },
							{ label: __('Accent (Orange)', 'ria-event-card'), value: 'accent' },
							{ label: __('Neutral (Gray)', 'ria-event-card'), value: 'neutral' },
							{ label: __('Custom', 'ria-event-card'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ variant: value })}
						help={__('Choose a color scheme or use custom colors', 'ria-event-card')}
					/>
				</PanelBody>

				{variant === 'custom' && (
					<PanelColorSettings
						title={__('Custom Colors', 'ria-event-card')}
						colorSettings={[
							{
								value: customBackgroundColor,
								onChange: (color) => setAttributes({ customBackgroundColor: color }),
								label: __('Background Color', 'ria-event-card')
							},
							{
								value: customAccentColor,
								onChange: (color) => setAttributes({ customAccentColor: color }),
								label: __('Accent Color', 'ria-event-card')
							},
							{
								value: customBorderColor,
								onChange: (color) => setAttributes({ customBorderColor: color }),
								label: __('Border Color', 'ria-event-card')
							}
						]}
					/>
				)}

				{/* Borders & Shadows Panel */}
				<PanelBody title={__('Borders & Shadows', 'ria-event-card')} initialOpen={false}>
					<RangeControl
						label={__('Border Width', 'ria-event-card')}
						value={borderWidth}
						onChange={(value) => setAttributes({ borderWidth: value })}
						min={0}
						max={10}
					/>
					<SelectControl
						label={__('Border Style', 'ria-event-card')}
						value={borderStyle}
						options={[
							{ label: __('None', 'ria-event-card'), value: 'none' },
							{ label: __('Solid', 'ria-event-card'), value: 'solid' },
							{ label: __('Dashed', 'ria-event-card'), value: 'dashed' },
							{ label: __('Dotted', 'ria-event-card'), value: 'dotted' },
							{ label: __('Double', 'ria-event-card'), value: 'double' },
						]}
						onChange={(value) => setAttributes({ borderStyle: value })}
					/>
					<RangeControl
						label={__('Border Radius', 'ria-event-card')}
						value={borderRadius}
						onChange={(value) => setAttributes({ borderRadius: value })}
						min={0}
						max={50}
					/>
					<SelectControl
						label={__('Box Shadow', 'ria-event-card')}
						value={boxShadow}
						options={[
							{ label: __('None', 'ria-event-card'), value: 'none' },
							{ label: __('Small', 'ria-event-card'), value: 'small' },
							{ label: __('Medium', 'ria-event-card'), value: 'medium' },
							{ label: __('Large', 'ria-event-card'), value: 'large' },
							{ label: __('X-Large', 'ria-event-card'), value: 'xlarge' },
							{ label: __('2X-Large', 'ria-event-card'), value: '2xlarge' },
						]}
						onChange={(value) => setAttributes({ boxShadow: value })}
					/>
					<SelectControl
						label={__('Hover Shadow', 'ria-event-card')}
						value={hoverShadow}
						options={[
							{ label: __('None', 'ria-event-card'), value: 'none' },
							{ label: __('Small', 'ria-event-card'), value: 'small' },
							{ label: __('Medium', 'ria-event-card'), value: 'medium' },
							{ label: __('Large', 'ria-event-card'), value: 'large' },
							{ label: __('X-Large', 'ria-event-card'), value: 'xlarge' },
							{ label: __('2X-Large', 'ria-event-card'), value: '2xlarge' },
						]}
						onChange={(value) => setAttributes({ hoverShadow: value })}
					/>
				</PanelBody>

				{/* Animation Panel */}
				<PanelBody title={__('Animation', 'ria-event-card')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Animation', 'ria-event-card')}
						checked={animationEnabled}
						onChange={(value) => setAttributes({ animationEnabled: value })}
					/>
					{animationEnabled && (
						<>
							<SelectControl
								label={__('Animation Type', 'ria-event-card')}
								value={animationType}
								options={[
									{ label: __('Fade In', 'ria-event-card'), value: 'fadeIn' },
									{ label: __('Fade In Up', 'ria-event-card'), value: 'fadeInUp' },
									{ label: __('Fade In Down', 'ria-event-card'), value: 'fadeInDown' },
									{ label: __('Fade In Left', 'ria-event-card'), value: 'fadeInLeft' },
									{ label: __('Fade In Right', 'ria-event-card'), value: 'fadeInRight' },
									{ label: __('Slide In Up', 'ria-event-card'), value: 'slideInUp' },
									{ label: __('Zoom In', 'ria-event-card'), value: 'zoomIn' },
								]}
								onChange={(value) => setAttributes({ animationType: value })}
							/>
							<RangeControl
								label={__('Animation Duration (ms)', 'ria-event-card')}
								value={animationDuration}
								onChange={(value) => setAttributes({ animationDuration: value })}
								min={100}
								max={3000}
								step={100}
							/>
							<RangeControl
								label={__('Animation Delay (ms)', 'ria-event-card')}
								value={animationDelay}
								onChange={(value) => setAttributes({ animationDelay: value })}
								min={0}
								max={2000}
								step={100}
							/>
							<SelectControl
								label={__('Animation Easing', 'ria-event-card')}
								value={animationEasing}
								options={[
									{ label: __('Linear', 'ria-event-card'), value: 'linear' },
									{ label: __('Ease', 'ria-event-card'), value: 'ease' },
									{ label: __('Ease In', 'ria-event-card'), value: 'ease-in' },
									{ label: __('Ease Out', 'ria-event-card'), value: 'ease-out' },
									{ label: __('Ease In Out', 'ria-event-card'), value: 'ease-in-out' },
								]}
								onChange={(value) => setAttributes({ animationEasing: value })}
							/>
						</>
					)}
					<SelectControl
						label={__('Hover Animation', 'ria-event-card')}
						value={hoverAnimation}
						options={[
							{ label: __('None', 'ria-event-card'), value: 'none' },
							{ label: __('Lift', 'ria-event-card'), value: 'lift' },
							{ label: __('Grow', 'ria-event-card'), value: 'grow' },
							{ label: __('Glow', 'ria-event-card'), value: 'glow' },
						]}
						onChange={(value) => setAttributes({ hoverAnimation: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{!title && !description ? (
					<Placeholder
						icon={<Icon icon={calendar} />}
						label={__('Event Card', 'ria-event-card')}
						instructions={__('Add event title and details using the sidebar controls or start typing below.', 'ria-event-card')}
					/>
				) : (
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
								{imageLoading && <SkeletonImage aspectRatio="16/9" />}
								<img
									src={featuredImageUrl}
									alt={featuredImageAlt || title}
									onLoad={() => setImageLoading(false)}
									onError={() => setImageLoading(false)}
									style={{ display: imageLoading ? 'none' : 'block' }}
								/>
							</div>
						)}

						{/* Event Content */}
						<div className="event-content">
							{/* Title */}
							<RichText
								tagName="h3"
								className="event-title"
								value={title}
								onChange={(value) => setAttributes({ title: value })}
								placeholder={__('Event Title', 'ria-event-card')}
							/>

							{/* Date & Time */}
							{showDate && startDate && (
								<div className="event-datetime">
									<span className="event-date">
										<Calendar size={16} /> {formatDate(startDate)}
										{endDate && ` - ${formatDate(endDate)}`}
									</span>
									{showTime && startTime && (
										<span className="event-time">
											🕐 {startTime}
											{endTime && ` - ${endTime}`}
											{timezone && ` ${timezone}`}
										</span>
									)}
								</div>
							)}

							{/* Location */}
							{showLocation && (locationName || virtualUrl) && (
								<div className="event-location">
									<span className="location-icon">{getLocationIcon()}</span>
									{locationName && <span className="location-name">{locationName}</span>}
									{locationAddress && <span className="location-address">{locationAddress}</span>}
									{virtualUrl && (locationType === 'virtual' || locationType === 'hybrid') && (
										<span className="virtual-url">Virtual Event</span>
									)}
								</div>
							)}

							{/* Description */}
							<RichText
								tagName="div"
								className="event-description"
								value={description}
								onChange={(value) => setAttributes({ description: value })}
								placeholder={__('Event description...', 'ria-event-card')}
							/>

							{/* Topics */}
							{showTopics && topics.length > 0 && (
								<div className="event-topics">
									{topics.filter(t => t).map((topic, index) => (
										<span key={index} className="topic-badge">{topic}</span>
									))}
								</div>
							)}

							{/* Speakers */}
							{showSpeakers && speakers.length > 0 && (
								<div className="event-speakers">
									<h4>{__('Speakers', 'ria-event-card')}</h4>
									{speakers.map((speaker, index) => (
										speaker.name && (
											<div key={index} className="speaker-item">
												<strong>{speaker.name}</strong>
												{speaker.title && <span> - {speaker.title}</span>}
											</div>
										)
									))}
								</div>
							)}

							{/* Organizers */}
							{showOrganizers && organizers.length > 0 && (
								<div className="event-organizers">
									<h4>{__('Organizers', 'ria-event-card')}</h4>
									{organizers.map((organizer, index) => (
										organizer.name && (
											<div key={index} className="organizer-item">
												{organizer.name}
												{organizer.role && ` (${organizer.role})`}
											</div>
										)
									))}
								</div>
							)}

							{/* Event Details */}
							<div className="event-details">
								{showCost && cost && (
									<span className="event-cost">💰 {cost}</span>
								)}
								{showCapacity && capacity > 0 && (
									<span className="event-capacity">{getCapacityText()}</span>
								)}
							</div>

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
											{registrationButtonText}
										</a>
									)}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}
