/**
 * Base Skeleton Component with shimmer animation
 * Provides the foundation for all skeleton loaders
 */

export const SkeletonBase = ({
	width = '100%',
	height = '20px',
	borderRadius = '4px',
	className = '',
	style = {}
}) => {
	return (
		<div
			className={`skeleton-base ${className}`}
			style={{
				width,
				height,
				borderRadius,
				backgroundColor: 'var(--wp--preset--color--neutral-100, #f0f0f0)',
				position: 'relative',
				overflow: 'hidden',
				...style
			}}
		>
			<div
				className="skeleton-shimmer"
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
					animation: 'skeleton-shimmer 1.5s infinite',
				}}
			/>
		</div>
	);
};

export default SkeletonBase;
