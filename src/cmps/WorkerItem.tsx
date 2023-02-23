import deepEqual from 'deep-equal'
import React, { useRef, useState } from 'react'
import { useDrag, useDragLayer, useDrop } from 'react-dnd'
import { ItemTypes } from '../constants'
import { WorkerIdentifier, WorkerItemType, WorkerState } from '../types'

//TODO: improve TS - make conditional!!
interface WorkerItemProps {
  worker: WorkerState | null
  isLocked: boolean
  details?: WorkerIdentifier
  disableLock?: boolean
  disableRemove?: boolean
  disableDrag?: boolean
  disableDrop?: boolean
  enableFirstDropLock?: boolean
  onLockItem?: (details: WorkerIdentifier) => void
  onRemoveItem?: (worker: WorkerState, details?: WorkerIdentifier) => void
  onPlaceItem?: (
    item: WorkerItemType,
    details: WorkerItemType['details']
  ) => void
  onMoveItem?: (
    item: WorkerItemType,
    details: WorkerItemType['details']
  ) => void
}

// type toggleLock

export const WorkerItem: React.FC<WorkerItemProps> = ({
  worker,
  isLocked,
  details,
  disableLock = false,
  disableRemove = false,
  disableDrag = false,
  disableDrop = false,
  enableFirstDropLock = false,
  onLockItem,
  onRemoveItem,
  onMoveItem,
  onPlaceItem,
}) => {
  let ref = useRef<HTMLElement>(null)
  const [showLock, setShowLock] = useState(isLocked)

  const handleOver = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (isLocked) return
    setShowLock(true)
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (isLocked) return
    setShowLock(false)
  }
  const handleLockToggle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (disableLock || !onLockItem || !details) return
    onLockItem(details)
  }
  const handleRemove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (disableRemove || !onRemoveItem || !worker) return
    onRemoveItem(worker, details)
  }

  const accType = details ? ItemTypes.WORKER_IDENTIFIER : ItemTypes.WORKER
  const accDetails = details ? details : worker

  const x = useDragLayer((monitor) => ({ x: monitor.getItem() }))

  // console.log(x?.x?.details)

  const currDragId = x?.x?.details._id

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: accType,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      item: () => {
        return {
          details: accDetails,
          type: accType,
        }
      },
      canDrag() {
        return !isLocked && !!worker
      },
      end(draggedItem, monitor) {
        if (showLock) return
        if (!enableFirstDropLock) return

        setShowLock(monitor.didDrop())
      },
    }),
    [isLocked, details, worker]
  )
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.WORKER, ItemTypes.WORKER_IDENTIFIER],
      collect(monitor) {
        return {
          isOver: !!monitor.isOver() && !isLocked && !disableDrop,
          handlerId: monitor.getHandlerId(),
        }
      },
      canDrop() {
        return !isLocked
      },
      drop(item: any) {
        if (!ref.current) return

        // Don't replace items with themselves
        if (deepEqual(item.details, details)) return

        if (!accDetails) return

        if (onPlaceItem && item.type === ItemTypes.WORKER)
          onPlaceItem(item, accDetails)
        else if (onMoveItem) onMoveItem(item, accDetails)
      },
    }),
    [isLocked]
  )

  let dropRef = disableDrop ? ref : drop(ref)
  disableDrag ? dropRef : drag(dropRef)

  return (
    <article
      ref={ref}
      onMouseOver={handleOver}
      onMouseLeave={handleMouseLeave}
      className={`worker-item
      ${worker ? '' : 'empty'}
      ${isLocked && showLock ? 'locked' : ''}
      ${currDragId === worker?._id ? 'locked' : ''}
      ${isOver ? 'over' : ''}
      ${disableDrag ? 'no-drag' : ''}
      ${isDragging ? 'drag' : ''}`}>
      {worker?.name}
      {!disableLock && showLock ? (
        <span
          className={`material-symbols-outlined thick icon-lock icon ${
            isLocked ? 'active' : ''
          }`}
          onClick={handleLockToggle}>
          lock
        </span>
      ) : null}
      {!disableRemove ? (
        <span
          className="material-symbols-outlined thick icon-remove icon"
          onClick={handleRemove}>
          &#xe5cd;
        </span>
      ) : null}
    </article>
  )
}
