import moment from 'moment'
import React, { Suspense, useState } from 'react'

interface ShiftsEditProps {}

import { lazy, useRef } from 'react'
import { useParams } from 'react-router-dom'

const Table = lazy(() => import('../cmps/Table'))

import { DateRangePicker } from 'rsuite'
import { DateRange } from 'rsuite/esm/DateRangePicker'
import { ShiftCell } from '../cmps/ShiftCell'
import { ShiftHeaderCell } from '../cmps/ShiftHeaderCell'
import { WorkerItem } from '../cmps/WorkerItem'
import {
  useGetScheduleQuery,
  useGetSchedulesQuery,
} from '../features/schedules/schedulesSlice'
import { useGetWorkersQuery } from '../features/workers/workersSlice'
import { useWorkersFromSchedule } from '../hooks/useWorkersFromSchedule'
import { scheduleService } from '../services/schedule.service'
import { ScheduleState, ShiftTableRow } from '../types'

interface Props {}
export const ShiftsEdit: React.FC<ShiftsEditProps> = ({}) => {
  const viewRef = useRef<HTMLDivElement>(null)

  const nextDates = scheduleService.getNextDates()
  const [value, setValue] = useState<[Date, Date]>([
    new Date(nextDates.from),
    new Date(nextDates.to),
  ])

  const { data: workers } = useGetWorkersQuery()

  const { data: schedules } = useGetSchedulesQuery()

  const params = useParams()

  // const [currScheduleRow, setCurrScheduleRow] = useState<ShiftTableRow>({
  //   date: { from: +moment(value[0]), to: +moment(value[1]) },
  //   data: { morning: [], evening: [], night: [] },
  // })

  const prevScheduleIdx = schedules?.findIndex(
    (s) => s.date.from < +moment(value[0])
  )

  //TODO: edge case - not enough schedules
  // const prevScheduleRow = useWorkersFromSchedule(prevSchedule)
  // const prevPrevScheduleRow = useWorkersFromSchedule(prevPrevSchedule)
  const prevScheduleRow =
    prevScheduleIdx !== undefined && schedules?.[prevScheduleIdx].workers
  const prevPrevScheduleRow =
    prevScheduleIdx !== undefined && schedules?.[prevScheduleIdx + 1].workers

  const currSchedule = schedules?.find((s) => s._id === params.scheduleId)

  const currScheduleRow = currSchedule?.workers

  console.log(prevScheduleRow, prevPrevScheduleRow)

  const handleSetDate = (date: DateRange | null) => {
    if (!date) return
    console.log(date)
    setValue(date)
    // setDate({
    //   scheduleId: params.scheduleId,
    //   date: { from: +moment(date[0]), to: +moment(date[1]) },
    // })
  }

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
        <div className="actions">
          <button className="pill-btn">מילוי אוטומטי</button>
          <button className="pill-btn">ייצוא לאקסל</button>
          <button className="pill-btn danger">מחיקה</button>
        </div>
      </section>

      <main>
        <aside className="workers-list-section">
          <Suspense>
            <div className="worker-list">
              <h2 className="worker-list-title">רשימת עובדים</h2>
              <div className="list-section-list">
                {workers?.map((w) => (
                  <WorkerItem
                    key={w._id}
                    isLocked={false}
                    worker={w}
                    disableLock
                    disableRemove
                    disableDrop
                  />
                ))}
              </div>
            </div>
          </Suspense>
        </aside>
        <section className="table-section">
          <Suspense>
            {/* <ShiftsScheduleTable
              table={table}
              RowHeaderCell={ShiftHeaderCell}
              headers={['תאריך סידור', 'בוקר', 'ערב', 'לילה']}
            /> */}
            <Table headers={['תאריך סידור', 'בוקר', 'ערב', 'לילה']}>
              {prevScheduleRow && historyRow(prevScheduleRow)}
              {prevPrevScheduleRow && historyRow(prevPrevScheduleRow)}
              {currScheduleRow &&
                editableRow(currScheduleRow, params.scheduleId as string)}
            </Table>
          </Suspense>
        </section>
      </main>
    </div>
  )
}

const historyRow = (row: ScheduleState['workers']) => {
  console.log(row, 'sd')

  const workers = row.unused
    .concat(row.used)
    .sort((a, b) => b.name.localeCompare(a.name))
    .reduce(
      (acc, curr) => {
        acc[curr.shiftTime || 'unassigned'].push(curr)
        return acc
      },
      { morning: [], evening: [], night: [], unassigned: [] } as any
    )
  return (
    <div className="row">
      {ShiftHeaderCell ? <ShiftHeaderCell title="היסטוריה" /> : null}
      <ShiftCell
        shift="morning"
        data={workers.morning}
        options={{ disableDrag: true, disableRemove: true }}
      />
      <ShiftCell
        shift="evening"
        data={workers.evening}
        options={{ disableDrag: true, disableRemove: true }}
      />
      <ShiftCell
        shift="night"
        data={workers.night}
        options={{ disableDrag: true, disableRemove: true }}
      />
    </div>
  )
}

const editableRow = (row: ScheduleState['workers'], scheduleId: string) => {
  console.log(row, 'ed')

  const workers = row.unused
    .concat(row.used)
    .sort((a, b) => b.name.localeCompare(a.name))
    .reduce(
      (acc, curr) => {
        acc[curr.shiftTime || 'unassigned'].push(curr)
        return acc
      },
      { morning: [], evening: [], night: [], unassigned: [] } as any
    )
  return (
    <div className="row">
      {ShiftHeaderCell ? <ShiftHeaderCell title="סידור חדש" /> : null}
      <ShiftCell
        scheduleId={scheduleId}
        droppable
        shift="morning"
        data={workers.morning}
      />
      <ShiftCell
        scheduleId={scheduleId}
        droppable
        shift="evening"
        data={workers.evening}
      />
      <ShiftCell
        scheduleId={scheduleId}
        droppable
        shift="night"
        data={workers.night}
      />
    </div>
  )
}
