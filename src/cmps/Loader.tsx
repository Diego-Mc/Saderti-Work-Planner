import React from 'react'

interface LoaderProps {}

export const Loader: React.FC<LoaderProps> = ({}) => {
  return (
    <div className="center-body">
      <div className="loader-wrap">
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
