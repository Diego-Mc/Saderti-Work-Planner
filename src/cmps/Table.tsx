import React from 'react'
import { useMachineHandlers } from '../hooks/useMachineHandlers'
import { useScheduleHandlers } from '../hooks/useScheduleHandlers'
import { TableRow } from '../types'
import { Cell } from './Cell'

interface TableProps {
  table: TableRow[]
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
  // const { handleAmountOfWorkersChange, handleImportanceChange } =
  //   useMachineHandlers()

  const { handleAmountOfWorkersChange } = useScheduleHandlers()
  const { handleImportanceChange } = useMachineHandlers()

  return (
    <div className="main-table">
      <div className="row row-header">
        <div className="cell cell-header">מכונות</div>
        <div className="cell cell-header">בוקר</div>
        <div className="cell cell-header">ערב</div>
        <div className="cell cell-header">לילה</div>
      </div>
      {table.map((row) => (
        <div className="row" key={row.machine._id}>
          <div className="cell cell-title">
            <span className="title">{row.machine.name}</span>
            <div className="info">
              <span
                onClick={() => handleImportanceChange(row.machine)}
                className="importance">{`(${row.machine.importance})`}</span>
              <span
                onClick={() => handleAmountOfWorkersChange(row.machine)}
                className="workers">{`(${row.machine.amountOfWorkers})`}</span>
            </div>
          </div>
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
      ))}
    </div>
  )
}
export default Table
