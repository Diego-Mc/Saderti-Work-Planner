import React from 'react'
import { rowType } from '../main'
import { Cell } from './Cell'

interface TableProps {
  table: rowType[]
  setTable: React.Dispatch<React.SetStateAction<rowType[]>>
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

  const setToggleLock: setToggleLockFn = (details) => {
    if (!details) return
    const { machine, shiftTime, idx } = details
    setTable((currTable) =>
      currTable.map((row) => {
        if (row.machine !== machine) return row
        const updatedLockedInShiftTime = row.locked[shiftTime].map(
          (val, _idx) => (_idx === idx ? !val : val)
        )
        return {
          ...row,
          locked: { ...row.locked, [shiftTime]: updatedLockedInShiftTime },
        }
      })
    )
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
            setToggleLock={setToggleLock}
          />
          <Cell
            data={row.data.evening}
            locked={row.locked.evening}
            details={{ machine: row.machine, shiftTime: 'evening' }}
            moveWorker={moveWorker}
            setToggleLock={setToggleLock}
          />
          <Cell
            data={row.data.night}
            locked={row.locked.night}
            details={{ machine: row.machine, shiftTime: 'night' }}
            moveWorker={moveWorker}
            setToggleLock={setToggleLock}
          />
        </div>
      ))}
    </div>
  )
}
