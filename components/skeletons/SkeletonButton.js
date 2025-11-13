/**
 * Skeleton Button Component
 * Displays skeleton loader for buttons
 */

import SkeletonBase from './SkeletonBase';

export const SkeletonButton = ({
	width = '120px',
	size = 'medium'
}) => {
	const heights = {
		small: '32px',
		medium: '40px',
		large: '48px',
	};

	const borderRadii = {
		small: '4px',
		medium: '6px',
		large: '8px',
	};

	return (
		<SkeletonBase
			width={width}
			height={heights[size] || heights.medium}
			borderRadius={borderRadii[size] || borderRadii.medium}
		/>
	);
};

export default SkeletonButton;
