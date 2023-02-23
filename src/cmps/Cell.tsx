import React from 'react'
import { useParams } from 'react-router-dom'
import {
  useMoveWorkersMutation,
  usePlaceWorkerMutation,
  useToggleLockMutation,
  useUnplaceWorkerMutation,
} from '../features/schedules/schedulesSlice'
import { WorkerIdentifier, WorkerItemType, WorkerState } from '../types'
import { WorkerItem } from './WorkerItem'

interface CellProps {
  data: (WorkerState | null)[]
  locked: boolean[]
  details: Omit<WorkerIdentifier, 'idx' | 'name'>
}

export const Cell: React.FC<CellProps> = ({ data, locked, details }) => {
  const [moveWorkers] = useMoveWorkersMutation()
  const [toggleLock] = useToggleLockMutation()
  const [placeWorker] = usePlaceWorkerMutation()
  const [unplaceWorker] = useUnplaceWorkerMutation()
  const params = useParams()

  const onMoveItem = (item: WorkerItemType, details: WorkerIdentifier) => {
    moveWorkers({
      from: details,
      to: item.details,
      scheduleId: params.scheduleId,
    })
  }
  const onPlaceItem = (item: WorkerItemType, details: WorkerIdentifier) => {
    placeWorker({
      destinationDetails: details,
      worker: item.details,
      scheduleId: params.scheduleId,
    })
  }
  const onRemoveItem = (worker: WorkerState, details: WorkerIdentifier) => {
    unplaceWorker({
      destinationDetails: details,
      worker,
      scheduleId: params.scheduleId,
    })
  }
  const onLockItem = (details: WorkerIdentifier) => {
    toggleLock({ workerDetails: details, scheduleId: params.scheduleId })
  }

  const updatedDetails = (worker: WorkerState | null, idx: number) => {
    const res: WorkerIdentifier = { ...details, idx }
    if (worker) res.name = worker.name
    return res
  }

  return (
    <div className="cell">
      {data.map((worker, idx) => (
        <WorkerItem
          worker={worker}
          isLocked={locked[idx]}
          details={updatedDetails(worker, idx)}
          key={`${details.machineId}-${details.shiftTime} -${idx}`}
          onLockItem={onLockItem}
          onMoveItem={onMoveItem}
          onPlaceItem={onPlaceItem}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  )
}
