import React, { Children } from 'react'
import { TableRow } from '../types'
import { Cell } from './Cell'

interface TableProps {
  headers: string[]
  children: React.ReactNode
}

type workerDetailsProps = {
  machine: string
  shiftTime: string
  idx: number
}

export type moveWorkerFn = (
  drag: workerDetailsProps,
  drop: workerDetailsProps
) => void

export type setToggleLockFn = (details: workerDetailsProps) => void

export const MachineScheduleTable: React.FC<TableProps> = ({
  headers,
  children,
}) => {
  return (
    <div className="main-table">
      <div className="row row-header">
        {headers.map((title) => (
          <div className="cell cell-header" key={title}>
            {title}
          </div>
        ))}
      </div>
      {children}
      {/* {table.map((row) => (
        <div className="row" key={row.machine._id}>
          {RowHeaderCell ? <RowHeaderCell row={row} /> : null}
          <Cell
            data={row.data.morning}
            locked={row.locked.morning}
            details={{ machineId: row.machine._id, shiftTime: 'morning' }}
          />
          <Cell
            data={row.data.evening}
            locked={row.locked.evening}
            details={{ machineId: row.machine._id, shiftTime: 'evening' }}
          />
          <Cell
            data={row.data.night}
            locked={row.locked.night}
            details={{ machineId: row.machine._id, shiftTime: 'night' }}
          />
        </div>
      ))} */}
    </div>
  )
}
export default MachineScheduleTable
