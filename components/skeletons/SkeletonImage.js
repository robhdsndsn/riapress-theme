/**
 * Skeleton Image Component
 * Displays skeleton loader for images with aspect ratio support
 */

import SkeletonBase from './SkeletonBase';

export const SkeletonImage = ({
	width = '100%',
	height = '200px',
	aspectRatio = null,
	borderRadius = '8px'
}) => {
	const style = aspectRatio
		? { width, aspectRatio, height: 'auto' }
		: { width, height };

	return (
		<SkeletonBase
			width={style.width}
			height={style.height}
			borderRadius={borderRadius}
			style={aspectRatio ? { aspectRatio } : {}}
		/>
	);
};

export default SkeletonImage;
