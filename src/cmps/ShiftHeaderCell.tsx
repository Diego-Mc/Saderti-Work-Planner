import React from 'react'
import { DateRangePicker } from 'rsuite'
import { DateRange } from 'rsuite/esm/DateRangePicker'
import { ShiftTableRow } from '../types'

interface ShiftHeaderCellProps {
  row?: ShiftTableRow
  title: string
}

export const ShiftHeaderCell: React.FC<ShiftHeaderCellProps> = ({
  row,
  title,
}) => {
  // const [value, setValue] = React.useState<[Date, Date] | null>([
  //   new Date(row.date.from),
  //   new Date(row.date.to),
  // ])

  const handleSetDate = (date: DateRange | null) => {
    if (!date) return
    console.log(date)
    // setValue(date)
    // setDate({
    //   scheduleId: params.scheduleId,
    //   date: { from: +moment(date[0]), to: +moment(date[1]) },
    // })
  }

  return (
    <div className="cell cell-title">
      <span className="title">{title}</span>
      <div className="info">
        {/* <DateRangePicker
          showOneCalendar
          cleanable={false}
          size="lg"
          character=" - "
          editable={false}
          appearance="subtle"
          format="dd/MM/yyyy"
          readOnly
          plaintext
          value={value}
          onChange={handleSetDate}
        /> */}
      </div>
    </div>
  )
}
