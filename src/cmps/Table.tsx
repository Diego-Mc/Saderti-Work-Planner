import React from 'react'
import { Cell } from './Cell'

export type rowType = {
  machine: string
  data: {
    [key: string]: (string | null)[]
    morning: (string | null)[]
    evening: (string | null)[]
    night: (string | null)[]
  }
  locked: {
    [key: string]: boolean[]
    morning: boolean[]
    evening: boolean[]
    night: boolean[]
  }
  workersAmount: number
}

interface TableProps {
  table: rowType[]
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

export const Table: React.FC<TableProps> = ({ table }) => {
  return (
    <div className="main-table">
      <div className="row row-header">
        <div className="cell cell-header">מכונות</div>
        <div className="cell cell-header">בוקר</div>
        <div className="cell cell-header">ערב</div>
        <div className="cell cell-header">לילה</div>
      </div>
      {table.map((row) => (
        <div className="row" key={row.machine}>
          <div className="cell cell-title">{row.machine}</div>
          <Cell
            data={row.data.morning}
            locked={row.locked.morning}
            details={{ machine: row.machine, shiftTime: 'morning' }}
          />
          <Cell
            data={row.data.evening}
            locked={row.locked.evening}
            details={{ machine: row.machine, shiftTime: 'evening' }}
          />
          <Cell
            data={row.data.night}
            locked={row.locked.night}
            details={{ machine: row.machine, shiftTime: 'night' }}
          />
        </div>
      ))}
    </div>
  )
}
