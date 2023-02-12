import React from 'react'
import {
  resetTimeShifts,
  selectWorkers,
  setTimeShift,
} from '../features/workers/workersSlice'
import { useAppDispatch, useAppSelector } from '../hooks'

interface WorkersShiftSetupProps {
  //   workers: Worker[]
  //   setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>
}

//render a list of workers with their assigned shift
//add a reset button that removes all assigned shifts
//TODO: if a worker is assigned a shift he will be shown as a round grayed out item with the selected icon for his shift
//TODO: to change a selected shift after being grayed out hover on the icon

export const WorkersShiftSetup: React.FC<WorkersShiftSetupProps> = ({}) => {
  const { workers } = useAppSelector(selectWorkers)
  const dispatch = useAppDispatch()

  const handleToggleShift = (_id: string, timeShift: string) => {
    dispatch(setTimeShift({ _id, timeShift }))
  }

  const handleTimeShiftReset = (e: React.MouseEvent) => {
    dispatch(resetTimeShifts())
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
        {workers?.map((worker) => (
          <article
            className={`worker-shift-item ${
              worker.currTimeShift ? 'selected' : ''
            }`}
            key={worker.name}>
            {worker.name}
            <div className="icons">
              <span
                className={`material-symbols-outlined ${
                  worker.currTimeShift === 'morning' ? 'selected' : ''
                }`}
                onClick={(e) => handleToggleShift(worker._id, 'morning')}>
                light_mode
              </span>
              <span
                className={`material-symbols-outlined ${
                  worker.currTimeShift === 'evening' ? 'selected' : ''
                }`}
                onClick={(e) => handleToggleShift(worker._id, 'evening')}>
                nights_stay
              </span>
              <span
                className={`material-symbols-outlined ${
                  worker.currTimeShift === 'night' ? 'selected' : ''
                }`}
                onClick={(e) => handleToggleShift(worker._id, 'night')}>
                dark_mode
              </span>
            </div>
          </article>
        ))}
      </section>
    </section>
  )
}
