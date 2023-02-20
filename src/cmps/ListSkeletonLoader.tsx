import React from 'react'

interface ListSkeletonLoaderProps {}

export const ListSkeletonLoader: React.FC<ListSkeletonLoaderProps> = ({}) => {
  return (
    <div className="list-skeleton">
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
    </div>
  )
}
