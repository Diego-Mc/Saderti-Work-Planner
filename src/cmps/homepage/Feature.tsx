import React from 'react'

interface FeatureProps {
  title: string
  text: string
  icon: string
}

export const Feature: React.FC<FeatureProps> = ({ title, text, icon }) => {
  return (
    <article className="feature">
      <span className="material-symbols-outlined outlined icon">{icon}</span>
      <h3 className="title">{title}</h3>
      <p className="text">{text}</p>
    </article>
  )
}
