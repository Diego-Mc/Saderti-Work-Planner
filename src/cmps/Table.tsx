import React from 'react'
import { Cell } from './Cell'

export type row = {
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
  table: row[]
  setTable: React.Dispatch<React.SetStateAction<row[]>>
}

type moveWorkerProps = {
  machine: string
  shiftTime: string
  idx: number
}

export type moveWorkerFn = (
  drag: moveWorkerProps,
  drop: moveWorkerProps
) => void

export const Table: React.FC<TableProps> = ({ table, setTable }) => {
  const moveWorker: moveWorkerFn = (details, detailsTo) => {
    if (!details || !detailsTo) return
    const { machine, shiftTime, idx } = details
    const { machine: machineTo, shiftTime: shiftTimeTo, idx: idxTo } = detailsTo
    setTable((currTable) => {
      const temp: typeof currTable = structuredClone(currTable)
      const from = temp.find((row) => row.machine === machine)
      const to = temp.find((row) => row.machine === machineTo)
      if (to && from) {
        ;[from.data[shiftTime][idx], to.data[shiftTimeTo][idxTo]] = [
          to.data[shiftTimeTo][idxTo],
          from.data[shiftTime][idx],
        ]
      }
      return temp
    })
  }
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
            moveWorker={moveWorker}
          />
          <Cell
            data={row.data.evening}
            locked={row.locked.evening}
            details={{ machine: row.machine, shiftTime: 'evening' }}
            moveWorker={moveWorker}
          />
          <Cell
            data={row.data.night}
            locked={row.locked.night}
            details={{ machine: row.machine, shiftTime: 'night' }}
            moveWorker={moveWorker}
          />
        </div>
      ))}
    </div>
  )
}
