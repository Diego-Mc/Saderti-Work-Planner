import React, { useRef } from 'react'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../constants'
import { usePlaceShiftWorkerMutation } from '../features/schedules/schedulesSlice'
import { WorkerIdentifier, WorkerItemType, WorkerState } from '../types'
import { WorkerItem } from './WorkerItem'

interface ShiftCellProps {
  data: (WorkerState | null)[]
  droppable?: boolean
  options?: {
    disableRemove?: boolean
    disableDrag?: boolean
  }
  scheduleId?: string
  shift: 'morning' | 'evening' | 'night'
}

export const ShiftCell: React.FC<ShiftCellProps> = ({
  data,
  options = { disableRemove: false, disableDrag: false },
  droppable = false,
  scheduleId,
  shift,
}) => {
  const [placeShiftWorker] = usePlaceShiftWorkerMutation()

  const onRemoveItem = (worker: WorkerState) => {
    placeShiftWorker({
      details: {
        worker,
        newTime: '',
      },
      scheduleId,
    })
  }
  const onPlaceItem = (item: WorkerItemType) => {
    placeShiftWorker({
      details: {
        worker: item.details,
        newTime: shift,
      },
      scheduleId,
    })
  }

  const ref = useRef(null)

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.WORKER,
      collect(monitor) {
        return {
          isOver: !!monitor.isOver(),
          handlerId: monitor.getHandlerId(),
        }
      },
      drop(item: any) {
        if (!ref.current) return

        // Don't replace items with themselves
        // if (deepEqual(item.details, details)) return
        if (data.includes(item.details)) return //TODO:

        //TODO: call RTK to place worker by changing his shiftTime

        onPlaceItem(item)

        // if (item.type === ItemTypes.WORKER) onPlaceItem(item, details)
        // else if (onMoveItem) onMoveItem(item, details)
      },
    }),
    []
  )

  if (droppable) drop(ref)

  return (
    <div className={`cell ${isOver ? 'over' : ''} `} ref={ref}>
      {data.map((worker, idx) => (
        <WorkerItem
          isLocked={false}
          key={`${idx}-${worker?._id}`}
          worker={worker}
          disableLock
          disableDrop
          onPlaceItem={onPlaceItem}
          onRemoveItem={onRemoveItem}
          {...options}
        />
      ))}
    </div>
  )
}
