/**
 * Skeleton Text Component
 * Displays skeleton loader for text lines with various sizes
 */

import SkeletonBase from './SkeletonBase';

export const SkeletonText = ({
	lines = 1,
	width = '100%',
	lastLineWidth = '80%',
	size = 'medium',
	gap = '12px'
}) => {
	const heights = {
		small: '12px',
		medium: '16px',
		large: '20px',
		xlarge: '24px',
	};

	const height = heights[size] || heights.medium;

	if (lines === 1) {
		return <SkeletonBase width={width} height={height} />;
	}

	return (
		<div className="skeleton-text" style={{ display: 'flex', flexDirection: 'column', gap }}>
			{Array.from({ length: lines }).map((_, index) => (
				<SkeletonBase
					key={index}
					width={index === lines - 1 ? lastLineWidth : width}
					height={height}
				/>
			))}
		</div>
	);
};

export default SkeletonText;
