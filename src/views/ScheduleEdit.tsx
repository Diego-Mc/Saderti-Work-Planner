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

import { interpolateWarm } from 'd3-scale-chromatic'
import { useScheduleHandlers } from '../hooks/useScheduleHandlers'

interface Props {}

export const ScheduleEdit: React.FC<Props> = ({}) => {
  const params = useParams()

  const { data: schedule, isLoading } = useGetScheduleQuery(
    params.scheduleId as string
  )

  const [value, setValue] = React.useState<[Date, Date] | null>()

  const [setDate] = useSetDateMutation()

  const { handleDelete, handleToExcel } = useScheduleHandlers()

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

    // Map - workerId -> [{machineId: rating}]

    const machinesMap: {
      [key: string]: { [key: string]: [{ score: number; workerId: string }] }
    } = {}

    console.log(moment(schedule.date.from).diff(1677347047390, 'days'))

    const workers = schedule.workers.unused.map((w) => {
      const machineDates = statistics.amountWorkedInMachinePerWorker?.[w._id]
      const machineInfo = schedule.table.map(
        (r) => [r.machine._id, r.machine.importance] as [string, number]
      )

      const machinesData = machineInfo.map(([mId, mImportance]) => {
        const workDiff = (i: number) =>
          moment(schedule.date.from).diff(machineDates?.[mId]?.[i], 'days')
        let diffIdx = 0

        //find the latest work date (idx of dates arr) that was before the current schedule "from" date
        while (workDiff(diffIdx) < 0 || diffIdx < machineDates?.[mId]?.length)
          diffIdx++

        const score = (machineDates?.[mId]?.[diffIdx] || 99) * mImportance

        //add to machinesMap
        if (!machinesMap[mId]) machinesMap[mId] = {}
        if (!machinesMap[mId][w.shiftTime || 'unassigned'])
          machinesMap[mId][w.shiftTime || 'unassigned'] = [
            { score, workerId: w._id },
          ]
        else
          machinesMap[mId][w.shiftTime || 'unassigned'].push({
            score,
            workerId: w._id,
          })

        return {
          [mId]: score,
        }
      })

      return {
        [w._id]: machinesData,
      }
    })

    // console.log('workers', workers)
    // console.log('machines', machinesMap)

    //iterate through table & times, by importance, take the best fit and then remove it from the Map! (each time we sort by rating the Map inner array to always get the best fit)

    const table = structuredClone(schedule.table).sort(
      (row1, row2) => row2.machine.importance - row1.machine.importance
    )

    const usedWorkers = new Set()

    const placeWorkerCalls: any[] = []

    table.forEach((row) => {
      const machineId = row.machine._id
      ;['morning', 'evening', 'night'].forEach((time) => {
        row.data[time].forEach((cell, cellIdx) => {
          if (cell !== null) return
          if (row.locked[time][cellIdx] === true) return

          const availableWorkers = machinesMap[machineId][time]
            .filter(({ workerId }) => !usedWorkers.has(workerId))
            .sort((a, b) => b.score - a.score)
            .concat(
              machinesMap[machineId]['unassigned']
                .filter(({ workerId }) => !usedWorkers.has(workerId))
                .sort((a, b) => b.score - a.score)
            )

          const bestWorkerId = availableWorkers[0]?.workerId

          const bestWorker = schedule.workers.unused.find(
            (w) => w._id === bestWorkerId
          )

          if (!bestWorker) return

          placeWorkerCalls.push({
            destinationDetails: { machineId, shiftTime: time, idx: cellIdx },
            scheduleId: schedule._id,
            worker: bestWorker,
          })

          usedWorkers.add(bestWorkerId)
        })
      })
    })

    // placeWorkerCalls.forEach(async (call) => await placeWorker(call).unwrap())

    for (let call of placeWorkerCalls) {
      await placeWorker(call).unwrap()
    }
    console.log(placeWorkerCalls)
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
        {schedule ? (
          <div className="actions">
            <button className="pill-btn" onClick={handleAutoFill}>
              מילוי אוטומטי
            </button>
            <button
              className="pill-btn"
              onClick={() => handleToExcel(schedule)}>
              ייצוא לאקסל
            </button>
            <button className="pill-btn danger" onClick={handleDelete}>
              מחיקה
            </button>
          </div>
        ) : null}
      </section>

      <main>
        <aside className="workers-list-section">
          {schedule ? <WorkerList workers={schedule.workers} /> : null}
        </aside>
        <section className="table-section">
          {schedule ? <Table table={schedule.table} /> : null}
        </section>
      </main>
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
