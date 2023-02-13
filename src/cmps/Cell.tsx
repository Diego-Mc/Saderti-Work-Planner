import React from 'react'
import { WorkerType } from '../types'
import { moveWorkerFn, setToggleLockFn } from './Table'
import { WorkerItem } from './WorkerItem'

interface CellProps {
  data: (WorkerType | null)[]
  locked: boolean[]
  details: { machineId: string; shiftTime: string }
}

export const Cell: React.FC<CellProps> = ({ data, locked, details }) => {
  return (
    <div className="cell">
      {data.map((worker, idx) => (
        <WorkerItem
          worker={worker ? worker.name : null}
          isLocked={locked[idx]}
          details={{ ...details, idx }}
          key={
            worker
              ? worker._id
              : `${details.machineId}-${details.shiftTime} -${idx}`
          }
        />
      ))}
    </div>
  )
}
