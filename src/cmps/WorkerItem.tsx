import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../constants'
import { moveWorkerFn } from './Table'

interface details {
  machine: string
  shiftTime: string
  idx: number
}

interface WorkerItemProps {
  worker: string | null
  isLocked: boolean
  details: details
  moveWorker: moveWorkerFn
}

export const WorkerItem: React.FC<WorkerItemProps> = ({
  worker,
  isLocked,
  details,
  moveWorker,
}) => {
  const ref = useRef<HTMLElement>(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.WORKER,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    item: () => {
      return details
    },
    canDrag() {
      return !isLocked
    },
  }))
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.WORKER,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    canDrop() {
      return !isLocked
    },
    drop(item: any) {
      if (!ref.current) {
        return
      }
      // Don't replace items with themselves
      if (
        item.idx === details.idx &&
        item.machine === details.machine &&
        item.shiftTime === details.shiftTime
      ) {
        return
      }

      moveWorker(details, item)
    },
  }))
  drag(drop(ref))
  return (
    <article
      ref={ref}
      className={`worker-item
      ${worker ? '' : 'empty'}
      ${isLocked ? 'locked' : ''}
      ${isDragging ? 'drag' : ''}`}>
      {worker}
      {isLocked ? (
        <span className="material-symbols-outlined icon-lock icon">lock</span>
      ) : null}
    </article>
  )
}
