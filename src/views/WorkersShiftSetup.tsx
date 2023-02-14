import moment from 'moment'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGetMachinesQuery } from '../features/machines/machinesSlice'
import { useAddScheduleMutation } from '../features/schedules/schedulesSlice'
import {
  resetTimeShifts,
  selectWorkers,
  setTimeShift,
  useGetWorkersQuery,
  useResetShiftTimesMutation,
  useSetShiftTimeMutation,
} from '../features/workers/workersSlice'
import { useAppDispatch, useAppSelector } from '../hooks'
import { BaseTableRow } from '../types'

interface WorkersShiftSetupProps {
  //   workers: Worker[]
  //   setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>
}

//render a list of workers with their assigned shift
//add a reset button that removes all assigned shifts
//TODO: if a worker is assigned a shift he will be shown as a round grayed out item with the selected icon for his shift
//TODO: to change a selected shift after being grayed out hover on the icon

export const WorkersShiftSetup: React.FC<WorkersShiftSetupProps> = ({}) => {
  const { data: workers } = useGetWorkersQuery()
  const { data: machines } = useGetMachinesQuery()
  const [setTimeShift] = useSetShiftTimeMutation()
  const [resetShiftTimes] = useResetShiftTimesMutation()
  const [addSchedule] = useAddScheduleMutation()
  const navigate = useNavigate()

  const handleToggleShift = (workerId: string, shiftTime: string) => {
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

  return (
    <section className="workers-shift-setup-view">
      <header className="worker-shift-header">
        <h2 className="title">זמן משמרת</h2>
        <button className="reset-btn" onClick={handleTimeShiftReset}>
          אתחול נתונים
        </button>
      </header>
      <section className="list-workers-shifts">
        {workers ? (
          <>
            {workers?.map((worker) => (
              <article
                className={`worker-shift-item ${
                  worker.shiftTime ? 'selected' : ''
                }`}
                key={worker.name}>
                {worker.name}
                <div className="icons">
                  <span
                    className={`material-symbols-outlined ${
                      worker.shiftTime === 'morning' ? 'selected' : ''
                    }`}
                    onClick={(e) => handleToggleShift(worker._id, 'morning')}>
                    light_mode
                  </span>
                  <span
                    className={`material-symbols-outlined ${
                      worker.shiftTime === 'evening' ? 'selected' : ''
                    }`}
                    onClick={(e) => handleToggleShift(worker._id, 'evening')}>
                    nights_stay
                  </span>
                  <span
                    className={`material-symbols-outlined ${
                      worker.shiftTime === 'night' ? 'selected' : ''
                    }`}
                    onClick={(e) => handleToggleShift(worker._id, 'night')}>
                    dark_mode
                  </span>
                </div>
              </article>
            ))}
          </>
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
