import React, { lazy, Suspense, useEffect, useRef } from 'react'

const WorkerList = lazy(() => import('../cmps/WorkerList'))
const Table = lazy(() => import('../cmps/Table'))

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

import { useScheduleHandlers } from '../hooks/useScheduleHandlers'
import { MachineHeaderCell } from '../cmps/MachineHeaderCell'
import { Cell } from '../cmps/Cell'

interface Props {}

export const ScheduleEdit: React.FC<Props> = ({}) => {
  const params = useParams()

  const { data: schedule, isLoading } = useGetScheduleQuery(
    params.scheduleId as string
  )

  const viewRef = useRef<HTMLDivElement>(null)

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

    // console.log(schedule)
    // console.log(statistics)

    // Map - workerId -> [{machineId: rating}]

    const machinesMap: {
      [key: string]: { score: number; workerId: string }[]
    } = {}

    const workers = schedule.workers.unused.map((w) => {
      const machineDates = statistics.amountWorkedInMachinePerWorker?.[w._id]
      const machineInfo = schedule.table.map(
        (r) => [r.machine._id, r.machine.importance] as [string, number]
      )

      const machinesData = machineInfo.map(([mId, mImportance]) => {
        console.log(
          machineDates,
          w.name,
          machineDates?.[mId],
          moment(schedule.date.from).diff(machineDates?.[mId]?.[0], 'days')
        )
        const workDiff = (i: number) =>
          moment(schedule.date.from).diff(machineDates?.[mId]?.[i], 'days')
        let diffIdx = 0

        //find the latest work date (idx of dates arr) that was before the current schedule "from" date
        while (workDiff(diffIdx) <= 0 && diffIdx < machineDates?.[mId]?.length)
          diffIdx++

        const score = (workDiff(diffIdx) || 99) * mImportance

        //add to machinesMap
        if (!machinesMap[mId]) machinesMap[mId] = []
        machinesMap[mId].push({
          score,
          workerId: w._id,
        })

        return {
          // [mId]: score,
          machineId: mId,
          score,
        }
      })

      return {
        // [w._id]: machinesData,
        workerId: w._id,
        machineScore: machinesData,
      }
    })

    console.log('workers', workers)
    // console.log('machines', machinesMap)
    // return

    //iterate through table & times, by importance, take the best fit and then remove it from the Map! (each time we sort by rating the Map inner array to always get the best fit)

    const table = structuredClone(schedule.table).sort(
      (row1, row2) => row2.machine.importance - row1.machine.importance
    )

    const usedWorkers = new Set()

    const placeWorkerCalls: any[] = []

    const unassigned = {} as {
      [key: string]: {
        score: number
        workerId: string
      }[]
    }

    table.forEach((row) => {
      const machineId = row.machine._id
      const availableWorkers = machinesMap[machineId]
        ?.filter((w) => !usedWorkers.has(w.workerId))
        ?.sort((a, b) => b.score - a.score)
      for (let i = 0; i < availableWorkers.length; i++) {
        const { workerId, score } = availableWorkers[i]
        const time = schedule.workers.unused.find(
          (w) => w._id === workerId
        )?.shiftTime
        if (!time) {
          if (!unassigned[machineId]) unassigned[machineId] = []
          unassigned[machineId].push({ workerId, score })
          continue
        }
        row.data[time].some((cell, cellIdx) => {
          if (cell !== null) return
          if (row.locked[time][cellIdx] === true) return

          const bestWorker = schedule.workers.unused.find(
            (w) => w._id === workerId
          )

          if (!bestWorker) return

          placeWorkerCalls.push({
            destinationDetails: { machineId, shiftTime: time, idx: cellIdx },
            scheduleId: schedule._id,
            worker: bestWorker,
          })

          usedWorkers.add(workerId)
          row.locked[time][cellIdx] = true
          return true
        })
      }

      const filteredUnassigned = unassigned[machineId]
        ?.filter((w) => !usedWorkers.has(w.workerId))
        ?.sort((a, b) => b.score - a.score)
      for (let i = 0; i < filteredUnassigned?.length; i++) {
        const { workerId, score } = filteredUnassigned[i]
        ;['morning', 'evening', 'night'].some((time) => {
          return row.data[time].some((cell, cellIdx) => {
            if (cell !== null) return
            if (row.locked[time][cellIdx] === true) return

            const bestWorker = schedule.workers.unused.find(
              (w) => w._id === workerId
            )

            if (!bestWorker) return

            placeWorkerCalls.push({
              destinationDetails: { machineId, shiftTime: time, idx: cellIdx },
              scheduleId: schedule._id,
              worker: bestWorker,
            })

            usedWorkers.add(workerId)
            row.locked[time][cellIdx] = true
            return true
          })
        })
      }
      // ;['morning', 'evening', 'night'].forEach((time) => {
      //   row.data[time].forEach((cell, cellIdx) => {
      //     if (cell !== null) return
      //     if (row.locked[time][cellIdx] === true) return

      //     const bestWorkerId = availableWorkers[0]?.workerId

      //     const bestWorker = schedule.workers.unused.find(
      //       (w) => w._id === bestWorkerId
      //     )

      //     if (!bestWorker) return

      //     placeWorkerCalls.push({
      //       destinationDetails: { machineId, shiftTime: time, idx: cellIdx },
      //       scheduleId: schedule._id,
      //       worker: bestWorker,
      //     })

      //     usedWorkers.add(bestWorkerId)
      //   })
      // })

      console.log(unassigned)
    })

    // placeWorkerCalls.forEach(async (call) => await placeWorker(call).unwrap())

    //TODO: optimize and maybe add recursion w/backtracking
    //small change to improve alot - create a dictionary for worker's time shifts first instead of using "find" every time!
    for (let call of placeWorkerCalls) {
      await placeWorker(call).unwrap()
    }
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
    <div className="schedule-edit-view" ref={viewRef}>
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
          {schedule ? (
            <Suspense>
              <WorkerList workers={schedule.workers} />
            </Suspense>
          ) : null}
        </aside>
        <section className="table-section">
          {schedule ? (
            <Suspense>
              <Table headers={['מכונות', 'בוקר', 'ערב', 'לילה']}>
                {schedule.table.map((row) => (
                  <div className="row" key={row.machine._id}>
                    {MachineHeaderCell ? <MachineHeaderCell row={row} /> : null}
                    <Cell
                      data={row.data.morning}
                      locked={row.locked.morning}
                      details={{
                        machineId: row.machine._id,
                        shiftTime: 'morning',
                      }}
                    />
                    <Cell
                      data={row.data.evening}
                      locked={row.locked.evening}
                      details={{
                        machineId: row.machine._id,
                        shiftTime: 'evening',
                      }}
                    />
                    <Cell
                      data={row.data.night}
                      locked={row.locked.night}
                      details={{
                        machineId: row.machine._id,
                        shiftTime: 'night',
                      }}
                    />
                  </div>
                ))}
              </Table>
            </Suspense>
          ) : null}
        </section>
      </main>
    </div>
  )
}

export default ScheduleEdit
