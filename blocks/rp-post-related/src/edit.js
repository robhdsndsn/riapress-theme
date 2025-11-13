import { _x } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { format, dateI18n, __experimentalGetSettings } from '@wordpress/date';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	QueryControls,
	ToolbarDropdownMenu,
	Icon,
	RangeControl,
	Button,
	TextControl,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const {
		postType,
		numberOfPosts,
		displayFeaturedImage,
		displayExcerpt,
		displayMeta,
		order,
		orderBy,
		categories,
		headingLevel,
		columns,
		className,
		selectedPosts,
		selectedTaxonomy,
		selectedTaxonomies,
		currentPostTaxonomies,
		variant = 'default',
		customColor,
		customBackgroundColor,
		customBorderColor,
	} = attributes;

	// State for post search
	const [postSearchTerm, setPostSearchTerm] = useState('');
	const [isSearching, setIsSearching] = useState(false);

	const catIDs =
		categories && categories.length > 0
			? categories.map((cat) => cat.id)
			: [];

	const posts = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', postType, {
				per_page: numberOfPosts,
				_embed: true,
				order,
				orderby: orderBy,
				categories: catIDs,
			});
		},
		[postType, numberOfPosts, order, orderBy, categories]
	);

	const allCats = useSelect(() => {
		return wp.data
			.select('core')
			.getEntityRecords('taxonomy', 'category', { per_page: -1 });
	}, []);

	// Search for posts to add to selection
	const searchResults = useSelect(
		(select) => {
			if (!postSearchTerm || postSearchTerm.length < 3) {
				return [];
			}
			return select('core').getEntityRecords('postType', postType, {
				search: postSearchTerm,
				per_page: 10,
				_embed: true,
			}) || [];
		},
		[postSearchTerm, postType]
	);

	// Get selected posts details
	const selectedPostsData = useSelect(
		(select) => {
			if (!selectedPosts || selectedPosts.length === 0) {
				return [];
			}
			return selectedPosts.map(postId => {
				return select('core').getEntityRecord('postType', postType, postId);
			}).filter(Boolean);
		},
		[selectedPosts, postType]
	);

	// Get current post data and meta field
	const currentPost = useSelect((select) => {
		return select('core/editor').getCurrentPost();
	}, []);

	// Track taxonomy terms in real-time and sync with block attribute
	const livePostTaxonomies = useSelect((select) => {
		const { getCurrentPostId, getCurrentPostType } = select('core/editor');
		const { getEditedEntityRecord } = select('core');
		
		// Get current post ID and type
		const postId = getCurrentPostId();
		const postType = getCurrentPostType();
		
		// Get the edited entity record which includes current taxonomy terms
		const editedPostData = getEditedEntityRecord('postType', postType, postId);
		
		// Get taxonomy terms for all relevant taxonomies
		const taxonomies = [
			'clri-projects',
			'clri-site',
			'format',
			'fltca-alignment',
			'page-type',
			'primary-role',
			'topic'
		];
		
		const termData = {};
		taxonomies.forEach(taxonomy => {
			// Get terms from the edited post data - these are the current editor state terms
			const terms = editedPostData?.[taxonomy] || [];
			termData[taxonomy] = terms;
		});
		
		return termData;
	}, []);

	// Auto-populate selectedPosts from meta field on first load
	useEffect(() => {
		// Only auto-populate if selectedPosts is empty, we have current post data, and meta field has data
		if (selectedPosts.length === 0 && currentPost && currentPost.meta) {
			const metaRelatedPosts = currentPost.meta._rp_resource_related_resources;
			
			// Check if meta field has data and is an array
			if (metaRelatedPosts && Array.isArray(metaRelatedPosts) && metaRelatedPosts.length > 0) {
				// Convert to integers and filter out invalid IDs
				const validPostIds = metaRelatedPosts
					.map(id => parseInt(id, 10))
					.filter(id => id > 0);
				
				if (validPostIds.length > 0) {
					setAttributes({ selectedPosts: validPostIds });
				}
			}
		}
	}, [currentPost]); // Only run when currentPost changes

	// Save selectedPosts back to meta field when it changes
	useEffect(() => {
		// Only update meta if we have selected posts and current post
		if (selectedPosts.length > 0 && currentPost) {
			// Use wp.data to update the post meta
			wp.data.dispatch('core/editor').editPost({
				meta: {
					...currentPost.meta,
					_rp_resource_related_resources: selectedPosts
				}
			});
		} else if (selectedPosts.length === 0 && currentPost && currentPost.meta && currentPost.meta._rp_resource_related_resources) {
			// Clear meta field if selectedPosts is empty but meta field has data
			wp.data.dispatch('core/editor').editPost({
				meta: {
					...currentPost.meta,
					_rp_resource_related_resources: []
				}
			});
		}
	}, [selectedPosts]); // Run whenever selectedPosts changes

	// Sync taxonomy terms with block attribute for real-time server-side rendering
	useEffect(() => {
		// Update the block attribute whenever taxonomy terms change
		if (livePostTaxonomies && typeof livePostTaxonomies === 'object') {
			// Check if the taxonomy data has actually changed to avoid unnecessary updates
			const currentAttributeData = attributes.currentPostTaxonomies || {};
			const hasChanged = JSON.stringify(currentAttributeData) !== JSON.stringify(livePostTaxonomies);
				if (hasChanged) {
				setAttributes({ currentPostTaxonomies: livePostTaxonomies });
			}
		}
	}, [livePostTaxonomies, setAttributes]); // Run whenever livePostTaxonomies changes

	const catSuggestions = {};

	if (allCats) {
		for (let i = 0; i < allCats.length; i++) {
			const cat = allCats[i];
			catSuggestions[cat.name] = cat;
		}
	}

	const onDisplayFeaturedImageChange = (value) => {
		setAttributes({ displayFeaturedImage: value });
	};

	const onDisplayExcerptChange = (value) => {
		setAttributes({ displayExcerpt: value });
	};

	const onDisplayMetaChange = (value) => {
		setAttributes({ displayMeta: value });
	};

	const onNumberOfItemsChange = (value) => {
		setAttributes({ numberOfPosts: value });
	};

	const onOrderByChange = (value) => {
		setAttributes({ orderBy: value });
	};

	const onOrderChange = (value) => {
		setAttributes({ order: value });
	};

	const onCategoryChange = (values) => {
		const hasNoSuggestions = values.some(
			(value) => typeof value === 'string' && !catSuggestions[value]
		);
		if (hasNoSuggestions) return;
		const updatedCats = values.map((token) => {
			return typeof token === 'string' ? catSuggestions[token] : token;
		});
		setAttributes({ categories: updatedCats });
	};

	// Heading level
	const onChangeHeadingLevel = (newLevel) => {
		setAttributes({ headingLevel: newLevel });
	};

	const Heading = ({ level, className, children }) => {
		const Tag = `h${level}`;
		return <Tag className={className}>{children}</Tag>;
	};

	// Columns
	const onChangeColumns = (newColumns) => {
		setAttributes({ columns: newColumns });
	};

	// Post selection handlers
	const onAddPost = (postId) => {
		const currentPosts = selectedPosts || [];
		if (!currentPosts.includes(postId)) {
			setAttributes({ 
				selectedPosts: [...currentPosts, postId] 
			});
		}
		setPostSearchTerm(''); // Clear search after adding
	};

	const onRemovePost = (postId) => {
		const currentPosts = selectedPosts || [];
		setAttributes({ 
			selectedPosts: currentPosts.filter(id => id !== postId) 
		});
	};

	// Post reordering handlers
	const movePost = (fromIndex, toIndex) => {
		const currentPosts = selectedPosts || [];
		
		// Boundary checks
		if (toIndex < 0 || toIndex >= currentPosts.length) {
			return;
		}
		
		// Create new array with reordered posts
		const newPosts = [...currentPosts];
		const [movedPost] = newPosts.splice(fromIndex, 1);
		newPosts.splice(toIndex, 0, movedPost);
		
		setAttributes({ selectedPosts: newPosts });
	};

	// Taxonomy reordering handlers
	const moveTaxonomy = (fromIndex, toIndex) => {
		const currentTaxonomies = selectedTaxonomies || [];
		
		// Boundary checks
		if (toIndex < 0 || toIndex >= currentTaxonomies.length) {
			return;
		}
		
		// Create new array with reordered taxonomies
		const newTaxonomies = [...currentTaxonomies];
		const [movedTaxonomy] = newTaxonomies.splice(fromIndex, 1);
		newTaxonomies.splice(toIndex, 0, movedTaxonomy);
		
		setAttributes({ selectedTaxonomies: newTaxonomies });
	};

	// Taxonomy display names
	const getTaxonomyDisplayName = (taxonomySlug) => {
		const taxonomyNames = {
			'clri-projects': 'CLRI Projects',
			'clri-site': 'CLRI Sites',
			'format': 'Formats',
			'fltca-alignment': 'FLTCA Alignment',
			'page-type': 'Page Types',
			'primary-role': 'Primary Roles',
			'topic': 'Topics'
		};
		return taxonomyNames[taxonomySlug] || taxonomySlug;
	};

	const classes = ['wp-block-rp-post-related'];
	if (variant !== 'default') {
		classes.push(`has-${variant}-variant`);
	}
	if (variant === 'custom' && (customColor || customBackgroundColor || customBorderColor)) {
		classes.push('has-custom-colors');
	}

	return (
		<div {...useBlockProps({
			className: classes.join(' '),
			style: variant === 'custom' ? {
				'--custom-color': customColor || undefined,
				'--custom-background-color': customBackgroundColor || undefined,
				'--custom-border-color': customBorderColor || undefined,
			} : {},
		})}>
			<BlockControls>
				<ToolbarDropdownMenu
					className="heading-level-dropdown"
					label={_x('Heading Level', 'Post Latest - Title', 'post-related')}
					icon={<Icon icon={() => `H${headingLevel}`} />}
					controls={[1, 2, 3, 4, 5, 6].map((level) => ({
						// title: `H${level}`,
						icon: <Icon icon={() => `H${level}`} />,
						isActive: headingLevel === level,
						onClick: () => onChangeHeadingLevel(level),
					}))}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={_x('Color Settings', 'Post Related - Title', 'post-related')} initialOpen={false}>
					<SelectControl
						label={_x('Color Variant', 'Post Related - Label', 'post-related')}
						value={variant}
						options={[
							{ label: _x('Default', 'Post Related - Option', 'post-related'), value: 'default' },
							{ label: _x('Primary', 'Post Related - Option', 'post-related'), value: 'primary' },
							{ label: _x('Secondary', 'Post Related - Option', 'post-related'), value: 'secondary' },
							{ label: _x('Accent', 'Post Related - Option', 'post-related'), value: 'accent' },
							{ label: _x('Neutral', 'Post Related - Option', 'post-related'), value: 'neutral' },
							{ label: _x('Custom', 'Post Related - Option', 'post-related'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ variant: value })}
					/>
				</PanelBody>

				{variant === 'custom' && (
					<PanelColorSettings
						title={_x('Custom Colors', 'Post Related - Title', 'post-related')}
						colorSettings={[
							{
								value: customColor,
								onChange: (value) => setAttributes({ customColor: value }),
								label: _x('Text Color', 'Post Related - Label', 'post-related')
							},
							{
								value: customBackgroundColor,
								onChange: (value) => setAttributes({ customBackgroundColor: value }),
								label: _x('Background Color', 'Post Related - Label', 'post-related')
							},
							{
								value: customBorderColor,
								onChange: (value) => setAttributes({ customBorderColor: value }),
								label: _x('Border Color', 'Post Related - Label', 'post-related')
							}
						]}
					/>
				)}

				<PanelBody
					title={_x(
						'Post Selection',
						'Post Related - Title',
						'post-related'
					)}
					initialOpen={true}
				>
					<p>{_x(
						'Selected posts will override algorithm selection.',
						'Post Related - Description',
						'post-related'
					)}</p>
					
					{/* Selected Posts List */}
					{selectedPostsData && selectedPostsData.length > 0 && (
						<div style={{ marginBottom: '16px' }}>
							<strong>{_x('Selected Posts:', 'Post Related - Label', 'post-related')}</strong>
							{selectedPostsData.map((post, index) => (
								<div 
									key={post.id} 
									style={{ 
										padding: '12px',
										border: '1px solid #ddd',
										borderRadius: '4px',
										marginTop: '8px',
										backgroundColor: 'white'
									}}
								>
									{/* Title Row */}
									<div style={{ 
										display: 'flex', 
										alignItems: 'center', 
										marginBottom: '8px'
									}}>
										<span style={{ 
											display: 'inline-block',
											width: '20px',
											height: '20px',
											borderRadius: '50%',
											backgroundColor: '#666',
											color: 'white',
											fontSize: '12px',
											textAlign: 'center',
											lineHeight: '20px',
											marginRight: '8px',
											fontWeight: 'bold',
											flexShrink: 0
										}}>
											{index + 1}
										</span>
										<span style={{ 
											fontSize: '14px',
											fontWeight: '500',
											wordBreak: 'break-word'
										}}>
											{post.title.rendered}
										</span>
									</div>

									{/* Controls Row */}
									<div style={{ 
										display: 'flex',
										gap: '6px'
									}}>
										<Button
											variant="secondary"
											isSmall
											onClick={() => movePost(index, index - 1)}
											disabled={index === 0}
											title={_x('Move up', 'Post Related - Button', 'post-related')}
											style={{ minWidth: '32px' }}
										>
											↑
										</Button>
										<Button
											variant="secondary"
											isSmall
											onClick={() => movePost(index, index + 1)}
											disabled={index === selectedPostsData.length - 1}
											title={_x('Move down', 'Post Related - Button', 'post-related')}
											style={{ minWidth: '32px' }}
										>
											↓
										</Button>
										<Button
											variant="secondary"
											isSmall
											onClick={() => onRemovePost(post.id)}
											title={_x('Remove', 'Post Related - Button', 'post-related')}
											style={{ minWidth: '65px' }}
										>
											{_x('Remove', 'Post Related - Button', 'post-related')}
										</Button>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Post Search */}
					<TextControl
						label={_x('Search Posts', 'Post Related - Label', 'post-related')}
						value={postSearchTerm}
						onChange={setPostSearchTerm}
						placeholder={_x('Type to search posts...', 'Post Related - Placeholder', 'post-related')}
						help={_x('Type at least 3 characters to search', 'Post Related - Help', 'post-related')}
					/>

					{/* Search Results */}
					{postSearchTerm.length >= 3 && (
						<div style={{ marginTop: '12px' }}>
							{searchResults.length > 0 ? (
								<div>
									<strong>{_x('Search Results:', 'Post Related - Label', 'post-related')}</strong>
									{searchResults.map((post) => (
										<div 
											key={post.id}
											style={{ 
												display: 'flex', 
												justifyContent: 'space-between', 
												alignItems: 'center',
												padding: '8px',
												border: '1px solid #f0f0f0',
												borderRadius: '4px',
												marginTop: '4px'
											}}
										>
											<span>{post.title.rendered}</span>
											<Button
												variant="primary"
												isSmall
												onClick={() => onAddPost(post.id)}
												disabled={selectedPosts?.includes(post.id)}
											>
												{selectedPosts?.includes(post.id) 
													? _x('Added', 'Post Related - Button', 'post-related')
													: _x('Add', 'Post Related - Button', 'post-related')
												}
											</Button>
										</div>
									))}
								</div>
							) : (
								<p>{_x('No posts found', 'Post Related - Message', 'post-related')}</p>
							)}
						</div>
					)}
				</PanelBody>

				<PanelBody
					title={_x(
						'Taxonomy Priority',
						'Post Related - Title',
						'post-related'
					)}
					initialOpen={false}
				>
					<p>{_x(
						'Use ↑↓ buttons to reorder. First taxonomy will be checked first by the algorithm.',
						'Post Related - Description',
						'post-related'
					)}</p>
					
					{/* Taxonomy Priority List */}
					{selectedTaxonomies && selectedTaxonomies.length > 0 && (
						<div style={{ marginBottom: '16px' }}>
							{selectedTaxonomies.map((taxonomy, index) => (
								<div 
									key={taxonomy} 
									style={{ 
										padding: '12px',
										border: '1px solid #ddd',
										borderRadius: '4px',
										marginTop: '8px',
										backgroundColor: 'white'
									}}
								>
									{/* Taxonomy Name Row */}
									<div style={{ 
										display: 'flex', 
										alignItems: 'center', 
										marginBottom: '8px'
									}}>
										<span style={{ 
											display: 'inline-block',
											width: '20px',
											height: '20px',
											borderRadius: '50%',
											backgroundColor: '#666',
											color: 'white',
											fontSize: '12px',
											textAlign: 'center',
											lineHeight: '20px',
											marginRight: '8px',
											fontWeight: 'bold',
											flexShrink: 0
										}}>
											{index + 1}
										</span>
										<span style={{ 
											fontSize: '14px',
											fontWeight: '500',
											wordBreak: 'break-word'
										}}>
											{getTaxonomyDisplayName(taxonomy)}
										</span>
									</div>

									{/* Controls Row */}
									<div style={{ 
										display: 'flex', 
										justifyContent: 'flex-end',
										gap: '6px'
									}}>
										<Button
											variant="secondary"
											isSmall
											onClick={() => moveTaxonomy(index, index - 1)}
											disabled={index === 0}
											title={_x('Move up', 'Post Related - Button', 'post-related')}
											style={{ minWidth: '32px' }}
										>
											↑
										</Button>
										<Button
											variant="secondary"
											isSmall
											onClick={() => moveTaxonomy(index, index + 1)}
											disabled={index === selectedTaxonomies.length - 1}
											title={_x('Move down', 'Post Related - Button', 'post-related')}
											style={{ minWidth: '32px' }}
										>
											↓
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</PanelBody>

				<PanelBody
					title={_x(
						'Display Settings',
						'Post Latest - Title',
						'post-related'
					)}
				>
					<ToggleControl
						label={_x(
							'Display Featured Image',
							'Post Latest - Label',
							'post-related'
						)}
						checked={displayFeaturedImage}
						onChange={onDisplayFeaturedImageChange}
					/>

					<ToggleControl
						label={_x(
							'Display Meta',
							'Post Latest - Label',
							'post-related'
						)}
						checked={displayMeta}
						onChange={onDisplayMetaChange}
					/>

					<ToggleControl
						label={_x(
							'Display Excerpt',
							'Post Latest - Label',
							'post-related'
						)}
						checked={displayExcerpt}
						onChange={onDisplayExcerptChange}
					/>
				</PanelBody>

				<PanelBody
					title={_x(
						'Query Settings',
						'Post Related - Title',
						'post-related'
					)}
				>
					<QueryControls
						numberOfItems={numberOfPosts}
						onNumberOfItemsChange={onNumberOfItemsChange}
						maxItems={10}
						minItems={1}
					/>
				</PanelBody>

				<PanelBody
					title={_x(
						'Layout Settings',
						'Latest- Ti  Postsle',
						'post-related'
					)}>
					<RangeControl
						label={_x('Columns', 'Post Latest - Label', 'post-related')}
						min={1}
						max={3}
						onChange={onChangeColumns}
						value={columns}
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender
				block="zp/post-related"
				attributes={{
					...attributes,
					currentPostTaxonomies: currentPostTaxonomies || {}
				}}
				key={JSON.stringify(currentPostTaxonomies)}
			/>
		</div>
	);
}
