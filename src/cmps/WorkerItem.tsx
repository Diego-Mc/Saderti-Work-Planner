import React, { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../constants'
import {
  moveWorkers,
  toggleLock,
  useMoveWorkersMutation,
  useToggleLockMutation,
} from '../features/schedules/schedulesSlice'
import { useAppDispatch } from '../hooks'
import { WorkerIdentifier } from '../types'
import { moveWorkerFn, setToggleLockFn } from './Table'

interface WorkerItemProps {
  worker: string | null
  isLocked: boolean
  details: WorkerIdentifier
}

export const WorkerItem: React.FC<WorkerItemProps> = ({
  worker,
  isLocked,
  details,
}) => {
  const ref = useRef<HTMLElement>(null)
  const [showLock, setShowLock] = useState(isLocked)

  const [moveWorkers] = useMoveWorkersMutation()
  const [toggleLock] = useToggleLockMutation()

  const handleOver = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (isLocked) return
    setShowLock(true)
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (isLocked) return
    setShowLock(false)
  }
  const handleLockToggle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    toggleLock(details)
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
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
    }),
    [isLocked]
  )
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.WORKER,
      collect(monitor) {
        return {
          isOver: !!monitor.isOver() && !isLocked,
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
          item.machineId === details.machineId &&
          item.shiftTime === details.shiftTime
        ) {
          return
        }

        moveWorkers({ from: details, to: item })
      },
    }),
    [isLocked]
  )

  drag(drop(ref))

  return (
    <article
      ref={ref}
      onMouseOver={handleOver}
      onMouseLeave={handleMouseLeave}
      className={`worker-item
      ${worker ? '' : 'empty'}
      ${isLocked ? 'locked' : ''}
      ${isOver ? 'over' : ''}
      ${isDragging ? 'drag' : ''}`}>
      {worker}
      {showLock ? (
        <span
          className={`material-symbols-outlined icon-lock icon ${
            isLocked ? 'active' : ''
          }`}
          onClick={handleLockToggle}>
          lock
        </span>
      ) : null}
    </article>
  )
}
