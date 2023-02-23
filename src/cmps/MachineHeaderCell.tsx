import React from 'react'
import { useMachineHandlers } from '../hooks/useMachineHandlers'
import { useScheduleHandlers } from '../hooks/useScheduleHandlers'
import { TableRow } from '../types'

interface MachineHeaderCellProps {
  row: TableRow
}

export const MachineHeaderCell: React.FC<MachineHeaderCellProps> = ({
  row,
}) => {
  const { handleAmountOfWorkersChange } = useScheduleHandlers()
  const { handleImportanceChange } = useMachineHandlers()

  return (
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
  )
}
