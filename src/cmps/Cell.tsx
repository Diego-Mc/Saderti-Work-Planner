import React from 'react'
import { WorkerType } from '../types'
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
          worker={worker}
          isLocked={locked[idx]}
          details={{ ...details, idx }}
          key={`${details.machineId}-${details.shiftTime} -${idx}`}
        />
      ))}
    </div>
  )
}
