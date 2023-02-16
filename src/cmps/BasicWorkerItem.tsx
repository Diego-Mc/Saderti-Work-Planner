import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'

import { ItemTypes } from '../constants'
import { usePlaceWorkerMutation } from '../features/schedules/schedulesSlice'
import { ScheduleWorker } from '../types'

interface BasicWorkerItemProps {
  worker: ScheduleWorker
  isUsed?: boolean
}

export const BasicWorkerItem: React.FC<BasicWorkerItemProps> = ({
  worker,
  isUsed,
}) => {
  const ref = useRef<HTMLElement>(null)
  const [isLocked, setIsLocked] = useState(!!isUsed)

  const [placeWorker] = usePlaceWorkerMutation()

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.WORKER,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      item: () => {
        return {
          _id: worker._id,
          shiftTime: worker.shiftTime,
          name: worker.name,
        }
      },
      canDrag() {
        return !isLocked
      },
      end(draggedItem, monitor) {
        if (isLocked) return
        setIsLocked(monitor.didDrop())
      },
    }),
    [isUsed, isLocked]
  )

  drag(ref)

  return (
    <>
      <article
        ref={ref}
        className={`worker-item
        ${worker.name ? '' : 'empty'}
        ${isLocked ? 'locked' : ''}
        ${isDragging ? 'drag' : ''}`}>
        {worker.name}
      </article>
    </>
  )
}
