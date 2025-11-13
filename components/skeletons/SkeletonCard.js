/**
 * Skeleton Card Component
 * Composite skeleton loader for card layouts
 */

import SkeletonImage from './SkeletonImage';
import SkeletonText from './SkeletonText';
import SkeletonButton from './SkeletonButton';

export const SkeletonCard = ({
	showImage = true,
	showButton = true,
	imageHeight = '200px',
	imageAspectRatio = null,
	padding = '24px',
	borderRadius = '8px',
	layout = 'vertical'
}) => {
	const isHorizontal = layout === 'horizontal';

	return (
		<div
			className="skeleton-card"
			style={{
				display: 'flex',
				flexDirection: isHorizontal ? 'row' : 'column',
				gap: isHorizontal ? '16px' : '0',
				borderRadius,
				overflow: 'hidden',
				backgroundColor: 'var(--wp--preset--color--white, #fff)',
				border: '1px solid var(--wp--preset--color--neutral-200, #ccc)',
			}}
		>
			{showImage && (
				<div style={{ flex: isHorizontal ? '0 0 40%' : '1' }}>
					<SkeletonImage
						width="100%"
						height={imageHeight}
						aspectRatio={imageAspectRatio}
						borderRadius={isHorizontal ? '8px 0 0 8px' : '8px 8px 0 0'}
					/>
				</div>
			)}

			<div
				className="skeleton-card-content"
				style={{
					padding,
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					gap: '16px'
				}}
			>
				{/* Title */}
				<SkeletonText size="large" width="70%" />

				{/* Body text */}
				<SkeletonText lines={3} lastLineWidth="60%" />

				{/* Button */}
				{showButton && (
					<div style={{ marginTop: 'auto' }}>
						<SkeletonButton />
					</div>
				)}
			</div>
		</div>
	);
};

export default SkeletonCard;
