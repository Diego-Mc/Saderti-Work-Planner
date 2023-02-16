import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useParams } from 'react-router-dom'
import { ItemTypes } from '../constants'
import {
  useMoveWorkersMutation,
  usePlaceWorkerMutation,
  useToggleLockMutation,
} from '../features/schedules/schedulesSlice'
import { WorkerIdentifier } from '../types'

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

  const params = useParams()

  const [moveWorkers] = useMoveWorkersMutation()
  const [toggleLock] = useToggleLockMutation()
  const [placeWorker] = usePlaceWorkerMutation()

  const handleOver = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (isLocked) return
    setShowLock(true)
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (isLocked) return
    setShowLock(false)
  }
  const handleLockToggle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    toggleLock({ workerDetails: details, scheduleId: params.scheduleId })
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.WORKER,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      item: () => {
        return { ...details, name: worker }
      },
      canDrag() {
        return !isLocked && !!worker
      },
    }),
    [isLocked, worker]
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
        console.log('HEYY!!', item, details)
        if ('_id' in item) {
          //the item is a worker
          placeWorker({
            destinationDetails: details,
            worker: item,
            scheduleId: params.scheduleId,
          })
          return
        }

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

        moveWorkers({ from: details, to: item, scheduleId: params.scheduleId })
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
