/**
 * Skeleton Avatar Component
 * Displays circular skeleton loader for avatars/profile images
 */

import SkeletonBase from './SkeletonBase';

export const SkeletonAvatar = ({
	size = '48px'
}) => {
	return (
		<SkeletonBase
			width={size}
			height={size}
			borderRadius="50%"
		/>
	);
};

export default SkeletonAvatar;
