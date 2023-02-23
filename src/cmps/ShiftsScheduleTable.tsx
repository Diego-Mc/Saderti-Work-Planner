import React from 'react'
import { ShiftTableRow } from '../types'
import { Cell } from './Cell'
import { ShiftCell } from './ShiftCell'

interface TableProps {
  table: ShiftTableRow[]
  headers: string[]
  RowHeaderCell?: React.FC<{ row: ShiftTableRow; title: string }>
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

export const ShiftsScheduleTable: React.FC<TableProps> = ({
  table,
  RowHeaderCell,
  headers,
}) => {
  const titles = [
    'סידור לפני אחרון',
    'סידור אחרון',
    'סידור נוכחי',
    'סידור עתידי (צפי)',
  ]
  return (
    <div className="main-table">
      <div className="row row-header">
        {headers.map((title) => (
          <div className="cell cell-header" key={title}>
            {title}
          </div>
        ))}
      </div>
      {table.map((row, idx) => (
        <div className="row" key={`cell-${idx}`}>
          {RowHeaderCell ? (
            <RowHeaderCell
              row={row}
              title={titles[(table.length + idx) % titles.length]}
            />
          ) : null}
          <ShiftCell data={row.data.morning} />
          <ShiftCell data={row.data.evening} />
          <ShiftCell data={row.data.night} />
        </div>
      ))}
    </div>
  )
}
export default ShiftsScheduleTable
