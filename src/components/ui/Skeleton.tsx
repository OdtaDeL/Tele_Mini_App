import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({
  width = '100%',
  height = '16px',
  borderRadius = 'var(--radius-sm, 10px)',
  className = '',
  style,
}: SkeletonProps) {
  return (
    <div
      className={`a-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.02)',
        ...style,
      }}
    />
  );
}
