import React from 'react'
import { moveWorkerFn, setToggleLockFn } from './Table'
import { WorkerItem } from './WorkerItem'

interface CellProps {
  data: (string | null)[]
  locked: boolean[]
  details: { machine: string; shiftTime: string }
  moveWorker: moveWorkerFn
  setToggleLock: setToggleLockFn
}

export const Cell: React.FC<CellProps> = ({
  data,
  locked,
  details,
  moveWorker,
  setToggleLock,
}) => {
  return (
    <div className="cell">
      {data.map((worker, idx) => (
        <WorkerItem
          worker={worker}
          isLocked={locked[idx]}
          details={{ ...details, idx }}
          moveWorker={moveWorker}
          setToggleLock={setToggleLock}
          key={worker}
        />
      ))}
    </div>
  )
}
