import React, { lazy, Suspense } from 'react'
const ShiftTimesSettingsList = lazy(
  () => import('../cmps/ShiftTimesSettingsList')
)
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useGetMachinesQuery } from '../features/machines/machinesSlice'
import { useAddScheduleMutation } from '../features/schedules/schedulesSlice'
import {
  useGetWorkersQuery,
  useResetShiftTimesMutation,
  useSetShiftTimeMutation,
} from '../features/workers/workersSlice'
import { BaseTableRow } from '../types'

interface Props {
  //   workers: Worker[]
  //   setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>
}

//render a list of workers with their assigned shift
//add a reset button that removes all assigned shifts
//TODO: if a worker is assigned a shift he will be shown as a round grayed out item with the selected icon for his shift
//TODO: to change a selected shift after being grayed out hover on the icon

export const ScheduleSettings: React.FC<Props> = ({}) => {
  const { data: workers } = useGetWorkersQuery()
  const { data: machines } = useGetMachinesQuery()
  const [setTimeShift] = useSetShiftTimeMutation()
  const [resetShiftTimes] = useResetShiftTimesMutation()
  const [addSchedule] = useAddScheduleMutation()
  const navigate = useNavigate()

  const handleToggleShift = (workerId: string, shiftTime: string) => {
    const worker = workers?.find((w) => w._id === workerId)
    if (!worker) return
    if (worker.shiftTime === shiftTime) shiftTime = ''
    setTimeShift({ workerId, shiftTime })
  }

  const handleTimeShiftReset = (e: React.MouseEvent) => {
    resetShiftTimes()
  }

  const handleNewSchedule = async () => {
    if (!machines || !workers) return //TODO: add toast to try again
    const table: BaseTableRow[] = []
    machines.forEach((machine) => {
      table.push({
        machine: machine._id,
        data: {
          morning: new Array(machine.amountOfWorkers).fill(null),
          evening: new Array(machine.amountOfWorkers).fill(null),
          night: new Array(machine.amountOfWorkers).fill(null),
        },
        locked: {
          morning: new Array(machine.amountOfWorkers).fill(false),
          evening: new Array(machine.amountOfWorkers).fill(false),
          night: new Array(machine.amountOfWorkers).fill(false),
        },
      })
    })
    const addedSchedule = await addSchedule({
      date: {
        from: +moment().day(6),
        to: +moment().day(5 + 7),
      },
      table,
      workers: {
        used: [],
        unused: workers,
      },
    })
    if (!('data' in addedSchedule)) return //TODO: toast...
    const scheduleId = addedSchedule.data._id as string
    navigate(`/edit/${scheduleId}`)
  }

  const assignedWorkers =
    workers?.reduce((a, b) => a + (b.shiftTime === '' ? 0 : 1), 0) || 0

  return (
    <section className="workers-shift-setup-view">
      <section className="first-step">
        <header className="worker-shift-header">
          <h2 className="title">זמן משמרת</h2>
          <div className="btns">
            <button className="pill-btn danger" onClick={handleTimeShiftReset}>
              אתחול
            </button>
            <button
              className="pill-btn continue-btn"
              onClick={handleNewSchedule}>
              המשך
            </button>
          </div>
        </header>
        {workers ? (
          <Suspense>
            <ShiftTimesSettingsList
              handleToggleShift={handleToggleShift}
              workers={workers}
            />
          </Suspense>
        ) : null}
      </section>
      <section className="next-step">
        {workers ? (
          assignedWorkers < workers.length ? (
            <p>{`שייכת זמני משמרת ל${assignedWorkers} עובדים מתוך ${workers.length}, עוד קצת ומסיימים!`}</p>
          ) : (
            <p>{`כולם משויכים, אפשר להתקדם!`}</p>
          )
        ) : null}
        <button
          className="btn outlined continue-btn"
          onClick={handleNewSchedule}>
          המשך
        </button>
      </section>
    </section>
  )
}
export default ScheduleSettings
