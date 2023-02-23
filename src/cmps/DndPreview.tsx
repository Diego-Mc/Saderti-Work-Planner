import React from 'react'
import { usePreview } from 'react-dnd-preview'

interface DndPreviewProps {}

export const DndPreview: React.FC<DndPreviewProps> = ({}) => {
  const preview = usePreview()
  if (!preview.display) {
    return null
  }
  const { itemType, item, style } = preview
  return (
    <div
      className="worker-item"
      style={{ ...style, transition: 'all 0.01s', zIndex: 100 }}>
      {(item as { details: { name: string } }).details.name}
    </div>
  )
}
export default DndPreview
