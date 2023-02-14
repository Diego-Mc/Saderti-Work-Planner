import { WorkerList } from '../cmps/WorkerList'
import { Table } from '../cmps/Table'

import React, { useEffect } from 'react'
import {
  useGetScheduleQuery,
  useSetDateMutation,
} from '../features/schedules/schedulesSlice'
import { useParams } from 'react-router-dom'

import { DateRangePicker } from 'rsuite'
import { DateRange } from 'rsuite/esm/DateRangePicker'
import moment from 'moment'

interface WorkersTableProps {}

export const WorkersTable: React.FC<WorkersTableProps> = ({}) => {
  const params = useParams()

  const { data: schedule, isLoading } = useGetScheduleQuery(
    params.scheduleId as string
  )

  const [value, setValue] = React.useState<[Date, Date] | null>()

  const [setDate] = useSetDateMutation()

  const handleSetDate = (date: DateRange | null) => {
    if (!date) return
    console.log(date)
    setValue(date)
    setDate({
      scheduleId: params.scheduleId,
      date: { from: +moment(date[0]), to: +moment(date[1]) },
    })
  }

  useEffect(() => {
    if (!schedule) return
    setValue([new Date(schedule.date.from), new Date(schedule.date.to)])
  }, [schedule])

  return (
    <div className="workers-table">
      <h2>
        סידור שבועי לתאריכים{' '}
        <DateRangePicker
          showOneCalendar
          cleanable={false}
          size="lg"
          character=" - "
          editable={false}
          appearance="subtle"
          format="dd/MM/yyyy"
          value={value}
          onChange={handleSetDate}
        />
      </h2>

      {schedule ? <Table table={schedule.table} /> : null}
      <button className="btn outlined">מילוי אוטומטי</button>
      {schedule ? <WorkerList workers={schedule.workers} /> : null}
    </div>
  )
}
//every worker has a rating per machine
//rating:
//if not worked in machine over 8 weeks = 100
//if worked in machine in last x weeks = x

//every worker has a rating per timeShift
//rating:
//every timeShift will timeShift++ in an array
//for every round of [1,1,1] (or higher) reduce by 1 all

//every machine has a rating for workers
//rating:
//if machine is rated x, x-1, x-2 ... => this is the order by which workers will be assigned(based on their own ratings for that specific machine)

//workers are pre-assigned their timeShift (//TODO: add this step)

//TODO LIST:
//1. add lock mechanism to cells
//2. add logic for generating the time shifts for the workers
//3. connect to the backend & add authentication to the app (maybe use SQL??)
