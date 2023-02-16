import { WorkerList } from '../cmps/WorkerList'
import { Table } from '../cmps/Table'

import React, { useEffect } from 'react'
import {
  useGetScheduleQuery,
  usePlaceWorkerMutation,
  useSetDateMutation,
} from '../features/schedules/schedulesSlice'
import { useParams } from 'react-router-dom'

import { DateRangePicker } from 'rsuite'
import { DateRange } from 'rsuite/esm/DateRangePicker'
import moment from 'moment'
import { useGetStatisticsQuery } from '../features/statistics/statisticsSlice'

interface Props {}

export const ScheduleEdit: React.FC<Props> = ({}) => {
  const params = useParams()

  const { data: schedule, isLoading } = useGetScheduleQuery(
    params.scheduleId as string
  )

  const [value, setValue] = React.useState<[Date, Date] | null>()

  const [setDate] = useSetDateMutation()

  const [placeWorker] = usePlaceWorkerMutation()

  const { data: statistics } = useGetStatisticsQuery()

  const handleAutoFill = async () => {
    // start by time
    //start by most important machine
    //start by least used worker in that machine
    //sum(amount of time not worked in machine * machine's importance) === permutation rating!

    if (!schedule || !statistics) return

    console.log(schedule)
    console.log(statistics)
  }

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
    <div className="schedule-edit-view">
      <section className="schedule-edit-header">
        <div className="title">
          <h2>סידור שבועי לתאריכים </h2>
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
        </div>
        <div className="btns">
          <button className="pill-btn">ייצוא לאקסל</button>
          <button className="pill-btn danger">מחיקה</button>
        </div>
      </section>

      {schedule ? <Table table={schedule.table} /> : null}
      <button className="btn primary" onClick={handleAutoFill}>
        מילוי אוטומטי
      </button>
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
