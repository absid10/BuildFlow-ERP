import React from 'react';
import { Skeleton } from 'antd';

interface LoadingSkeletonProps {
  active?: boolean;
  avatar?: boolean;
  paragraph?: { rows: number };
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ active = true, avatar = false, paragraph = { rows: 3 } }) => {
  return <Skeleton active={active} avatar={avatar} paragraph={paragraph} />;
};

export default LoadingSkeleton;
