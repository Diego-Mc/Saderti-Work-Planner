import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'

import { ItemTypes } from '../constants'
import { usePlaceWorkerMutation } from '../features/schedules/schedulesSlice'
import { WorkerState } from '../types'
import { WorkerItem } from './WorkerItem'

interface BasicWorkerItemProps {
  worker: WorkerState | null
  isUsed?: boolean
}

export const BasicWorkerItem: React.FC<BasicWorkerItemProps> = ({
  worker,
  isUsed,
}) => {
  // const ref = useRef<HTMLElement>(null)
  // const [isLocked, setIsLocked] = useState(!!isUsed)

  // const [placeWorker] = usePlaceWorkerMutation()

  // const [{ isDragging }, drag, preview] = useDrag(
  //   () => ({
  //     type: ItemTypes.WORKER,
  //     collect: (monitor) => ({
  //       isDragging: !!monitor.isDragging(),
  //     }),
  //     item: () => {
  //       if (!worker) return
  //       return {
  //         _id: worker._id,
  //         shiftTime: worker.shiftTime,
  //         name: worker.name,
  //       }
  //     },
  //     canDrag() {
  //       return !isLocked
  //     },
  //     end(draggedItem, monitor) {
  //       if (isLocked) return
  //       setIsLocked(monitor.didDrop())
  //     },
  //   }),
  //   [isUsed, isLocked]
  // )

  // drag(ref)

  return (
    <WorkerItem
      isLocked={!!isUsed}
      worker={worker}
      disableLock
      disableRemove
      enableFirstDropLock
      disableDrop
    />
    // <>
    //   <article
    //     ref={ref}
    //     className={`worker-item
    //     ${worker?.name ? '' : 'empty'}
    //     ${isLocked ? 'locked' : ''}
    //     ${isDragging ? 'drag' : ''}`}>
    //     {worker?.name}
    //   </article>
    // </>
  )
}
